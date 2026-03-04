#!/usr/bin/env bun

import { ImageMeta, MediaMeta, VideoMeta } from "@/app/media";
import { cdnUrl } from "@/lib/cdn";
import * as z from "zod";

const B2_KEY_ID = process.env.B2_KEY_ID ?? "";
const B2_APP_KEY = process.env.B2_APP_KEY ?? "";
const B2_BUCKET_ID = process.env.B2_BUCKET_ID ?? "";
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME ?? "";

if (!B2_KEY_ID || !B2_APP_KEY || !B2_BUCKET_ID || !B2_BUCKET_NAME) {
  console.error(
    "❌  Missing required env vars. Set B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID, B2_BUCKET_NAME.",
  );
  process.exit(1);
}

const MANIFEST_PATH = new URL("../app/media.json", import.meta.url).pathname;

const StorageApiSchema = z.object({
  absoluteMinimumPartSize: z.number(),
  apiUrl: z.url(),
  bucketId: z.string().nullable(),
  bucketName: z.string().nullable(),
  capabilities: z.array(z.string()),
  downloadUrl: z.url(),
  infoType: z.literal("storageApi"),
  namePrefix: z.string().nullable(),
  recommendedPartSize: z.number(),
  s3ApiUrl: z.url(),
});

const AuthorizeAccountSchema = z.object({
  accountId: z.string(),
  apiInfo: z.object({ storageApi: StorageApiSchema }),
  applicationKeyExpirationTimestamp: z.number().nullable(),
  authorizationToken: z.string(),
});

const UploadUrlSchema = z.object({
  bucketId: z.string(),
  uploadUrl: z.url(),
  authorizationToken: z.string(),
});

const UploadResponseSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  accountId: z.string(),
  bucketId: z.string(),
  contentLength: z.number(),
  contentSha1: z.string(),
  contentMd5: z.string().nullable(),
  contentType: z.string(),
  fileInfo: z.record(z.string(), z.string()),
  uploadTimestamp: z.number(),
  serverSideEncryption: z.object({
    algorithm: z.string().nullable(),
    mode: z.string().nullable(),
  }),
});

type AuthorizeAccount = z.infer<typeof AuthorizeAccountSchema>;
type UploadUrlResponse = z.infer<typeof UploadUrlSchema>;
type UploadResponse = z.infer<typeof UploadResponseSchema>;

const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".ogg", ".mkv"]);

const MIME_MAP = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogg": "video/ogg",
  ".mkv": "video/x-matroska",
} as const satisfies Record<string, string>;

function extname(p: string): string {
  const dot = p.lastIndexOf(".");
  const slash = p.lastIndexOf("/");
  return dot > slash ? p.slice(dot).toLowerCase() : "";
}

function basename(p: string): string {
  return p.slice(p.lastIndexOf("/") + 1);
}

function mimeType(ext: string): string {
  return (
    (MIME_MAP as Record<string, string>)[ext] ?? "application/octet-stream"
  );
}

function fileKind(ext: string): "image" | "video" | "unknown" {
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  return "unknown";
}

async function computeImageMeta(filePath: string): Promise<ImageMeta> {
  const identify = Bun.spawnSync(
    ["magick", "identify", "-format", "%wx%h", `${filePath}[0]`],
    { stdout: "pipe", stderr: "pipe" },
  );
  if (identify.exitCode !== 0)
    throw new Error(
      `magick identify failed: ${Buffer.from(identify.stderr).toString()}`,
    );

  const [w, h] = Buffer.from(identify.stdout)
    .toString()
    .trim()
    .split("x")
    .map(Number);
  if (!w || !h) throw new Error(`Could not read dimensions: ${filePath}`);

  const tmpPath = `${import.meta.dir}/.blur_${crypto.randomUUID()}.png`;
  const convert = Bun.spawnSync(
    ["magick", `${filePath}[0]`, "-resize", "10x", "-strip", tmpPath],
    { stdout: "pipe", stderr: "pipe" },
  );
  if (convert.exitCode !== 0)
    throw new Error(
      `magick convert failed: ${Buffer.from(convert.stderr).toString()}`,
    );

  const tmpFile = Bun.file(tmpPath);
  const blurBuf = await tmpFile.arrayBuffer();
  await tmpFile.delete();

  return {
    kind: "image",
    width: w,
    height: h,
    blurDataURL: `data:image/png;base64,${Buffer.from(blurBuf).toString("base64")}`,
  };
}

async function computeVideoMeta(filePath: string): Promise<VideoMeta> {
  const proc = Bun.spawnSync(
    [
      "ffprobe",
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_streams",
      filePath,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );

  if (proc.exitCode !== 0) {
    throw new Error(
      `ffprobe failed (exit ${proc.exitCode}): ${Buffer.from(proc.stderr).toString()}`,
    );
  }

  const json = JSON.parse(Buffer.from(proc.stdout).toString()) as {
    streams: { codec_type: string; width?: number; height?: number }[];
  };
  const vs = json.streams.find((s) => s.codec_type === "video");
  if (!vs?.width || !vs?.height)
    throw new Error(`No video stream found in: ${filePath}`);

  return {
    kind: "video",
    width: vs.width,
    height: vs.height,
    aspectRatio: `${vs.width}/${vs.height}`,
  };
}

type Manifest = Record<string, MediaMeta>;

async function loadManifest(): Promise<Manifest> {
  const f = Bun.file(MANIFEST_PATH);
  if (!(await f.exists())) return {};
  try {
    return (await f.json()) as Manifest;
  } catch {
    return {};
  }
}

async function saveManifest(manifest: Manifest): Promise<void> {
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

async function sha1(filePath: string): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-1",
    await Bun.file(filePath).arrayBuffer(),
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function authorize(): Promise<AuthorizeAccount> {
  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      headers: { Authorization: `Basic ${btoa(`${B2_KEY_ID}:${B2_APP_KEY}`)}` },
    },
  );
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  return AuthorizeAccountSchema.parse(await res.json());
}

async function getUploadUrl(
  apiUrl: string,
  authToken: string,
): Promise<UploadUrlResponse> {
  const res = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: "POST",
    headers: { Authorization: authToken, "Content-Type": "application/json" },
    body: JSON.stringify({ bucketId: B2_BUCKET_ID }),
  });
  if (!res.ok) throw new Error(`Get upload URL failed: ${await res.text()}`);
  return UploadUrlSchema.parse(await res.json());
}

async function fileExists(
  apiUrl: string,
  authToken: string,
  b2FileName: string,
): Promise<boolean> {
  const res = await fetch(`${apiUrl}/b2api/v3/b2_list_file_names`, {
    method: "POST",
    headers: { Authorization: authToken, "Content-Type": "application/json" },
    body: JSON.stringify({
      bucketId: B2_BUCKET_ID,
      prefix: b2FileName,
      maxFileCount: 1,
    }),
  });
  if (!res.ok) throw new Error(`List files failed: ${await res.text()}`);
  const { files } = (await res.json()) as { files: { fileName: string }[] };
  return files.some((f) => f.fileName === b2FileName);
}

async function uploadFile(
  uploadUrl: string,
  uploadAuthToken: string,
  filePath: string,
  b2FileName: string,
): Promise<UploadResponse> {
  const bunFile = Bun.file(filePath);
  const [fileBuffer, hash] = await Promise.all([
    bunFile.arrayBuffer(),
    sha1(filePath),
  ]);

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadAuthToken,
      "X-Bz-File-Name": encodeURIComponent(b2FileName),
      "Content-Type": mimeType(extname(filePath)),
      "Content-Length": String(bunFile.size),
      "X-Bz-Content-Sha1": hash,
    },
    body: fileBuffer,
  });

  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  return UploadResponseSchema.parse(await res.json());
}

function mdxTag(
  b2FileName: string,
  alt: string,
  meta: MediaMeta | null,
): string {
  if (meta?.kind === "video")
    return `<VideoMedia src="${b2FileName}" alt="${alt}" />`;
  return `<ImageMedia src="${b2FileName}" alt="${alt}" />`;
}

async function expandArg(arg: string): Promise<string[]> {
  if (await Bun.file(arg).exists())
    return [Bun.resolveSync(arg, process.cwd())];

  try {
    const stat = await (
      Bun as unknown as { stat(p: string): Promise<{ isDirectory(): boolean }> }
    ).stat(arg);
    if (stat.isDirectory()) {
      return Array.from(
        new Bun.Glob("**/*").scanSync({
          cwd: arg,
          absolute: true,
          onlyFiles: true,
        }),
      );
    }
  } catch {}

  return Array.from(
    new Bun.Glob(arg).scanSync({
      cwd: process.cwd(),
      absolute: true,
      onlyFiles: true,
    }),
  );
}

const prefixIndex = process.argv.indexOf("--prefix");
const prefix = prefixIndex !== -1 ? `${process.argv[prefixIndex + 1]}/` : "";
const rawArgs = process.argv
  .slice(2)
  .filter((_, i) => i !== prefixIndex - 2 && i !== prefixIndex - 1);

const files = (await Promise.all(rawArgs.map(expandArg))).flat();

if (files.length === 0) {
  console.error(
    `Usage: bun ${basename(Bun.main)} [--prefix <folder>] <file1> [file2] ...`,
  );
  process.exit(1);
}

console.log("🔑  Authorizing with Backblaze B2…");
const auth = await authorize();
console.log("✅  Authorized\n");

const { uploadUrl, authorizationToken: uploadToken } = await getUploadUrl(
  auth.apiInfo.storageApi.apiUrl,
  auth.authorizationToken,
);

const manifest = await loadManifest();

type Result = { id: string; url: string; meta: MediaMeta | null; tag: string };
const results: Result[] = [];

for (const filePath of files) {
  const ext = extname(filePath);
  const kind = fileKind(ext);
  const hash = await sha1(filePath);
  const b2FileName = `${prefix}${hash}${ext}`;
  const originalName = basename(filePath);

  let meta: MediaMeta | null = manifest[b2FileName] ?? null;

  if (!meta) {
    try {
      if (kind === "image") {
        console.log(`📐  Computing image metrics for ${originalName}…`);
        meta = await computeImageMeta(filePath);
      } else if (kind === "video") {
        console.log(`📐  Computing video metrics for ${originalName}…`);
        meta = await computeVideoMeta(filePath);
      }
    } catch (err) {
      console.warn(
        `⚠️   Metrics failed for ${originalName}: ${(err as Error).message}`,
      );
    }
  } else {
    console.log(`📋  Using cached metrics for ${originalName}`);
  }

  const exists = await fileExists(
    auth.apiInfo.storageApi.apiUrl,
    auth.authorizationToken,
    b2FileName,
  );

  if (exists) {
    console.log(
      `⏭️   ${originalName} already uploaded (hash=${hash}), skipping.`,
    );
  } else {
    console.log(`⬆️   Uploading ${originalName} → ${b2FileName}`);
    await uploadFile(uploadUrl, uploadToken, filePath, b2FileName);
    console.log(`✅  Done  hash=${hash}`);
  }

  if (meta) manifest[b2FileName] = meta;

  const publicUrl = `${cdnUrl}/${b2FileName}`;
  const tag = mdxTag(b2FileName, "This is an example alt.", meta);

  results.push({ id: hash, url: publicUrl, meta, tag } satisfies Result);

  console.log(`    URL         : ${publicUrl}`);
  if (meta?.kind === "image") {
    console.log(`    Dimensions  : ${meta.width}×${meta.height}`);
    console.log(`    blurDataURL : ${meta.blurDataURL.slice(0, 60)}…`);
  }
  if (meta?.kind === "video") {
    console.log(
      `    Dimensions  : ${meta.width}×${meta.height}  (${meta.aspectRatio})`,
    );
  }
  console.log(`    Tag         : ${tag}\n`);
}

await saveManifest(manifest);
console.log(`💾  Manifest saved → ${MANIFEST_PATH}\n`);

const divider = "─".repeat(60);
console.log(divider);
console.log("\n📋  Copy-paste these into your .mdx file:\n");
console.log(results.map((r) => r.tag).join("\n"));
console.log(`\n${divider}\n`);
console.log("🗂️   Summary JSON:\n");
console.log(JSON.stringify(results, null, 2));
