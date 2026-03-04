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
type UploadResponse = z.infer<typeof UploadResponseSchema>;
type Manifest = Record<string, MediaMeta>;

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
  return dot > p.lastIndexOf("/") ? p.slice(dot).toLowerCase() : "";
}

function basename(p: string): string {
  return p.slice(p.lastIndexOf("/") + 1);
}

function mimeType(e: string): string {
  return (MIME_MAP as Record<string, string>)[e] ?? "application/octet-stream";
}

function fileKind(e: string): "image" | "video" | "unknown" {
  if (IMAGE_EXTS.has(e)) return "image";
  if (VIDEO_EXTS.has(e)) return "video";
  return "unknown";
}

function posterFileName(b2VideoName: string, useAvif: boolean): string {
  const dot = b2VideoName.lastIndexOf(".");
  const stem = dot !== -1 ? b2VideoName.slice(0, dot) : b2VideoName;
  return `${stem}_poster.${useAvif ? "avif" : "jpg"}`;
}

async function sha1(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function spawnCapture(
  cmd: string[],
): Promise<{ stdout: Buffer; stderr: Buffer; ok: boolean }> {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
  const [stdoutBuf, stderrBuf, exitCode] = await Promise.all([
    new Response(proc.stdout).arrayBuffer().then(Buffer.from),
    new Response(proc.stderr).arrayBuffer().then(Buffer.from),
    proc.exited,
  ]);
  return { stdout: stdoutBuf, stderr: stderrBuf, ok: exitCode === 0 };
}

async function detectAv1Encoder(): Promise<string | null> {
  const { stdout } = await spawnCapture(["ffmpeg", "-encoders", "-v", "quiet"]);
  const out = stdout.toString();
  if (out.includes("libsvtav1")) return "libsvtav1";
  if (out.includes("libaom-av1")) return "libaom-av1";
  return null;
}

let _apiUrl: string | null = null;
let _authToken: string | null = null;

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

async function getUploadUrl(): Promise<{
  uploadUrl: string;
  uploadToken: string;
}> {
  if (!_apiUrl || !_authToken) throw new Error("Not authorized");
  const res = await fetch(`${_apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: "POST",
    headers: { Authorization: _authToken, "Content-Type": "application/json" },
    body: JSON.stringify({ bucketId: B2_BUCKET_ID }),
  });
  if (!res.ok) throw new Error(`Get upload URL failed: ${await res.text()}`);
  const { uploadUrl, authorizationToken: uploadToken } = UploadUrlSchema.parse(
    await res.json(),
  );
  return { uploadUrl, uploadToken };
}

async function fileExists(b2FileName: string): Promise<boolean> {
  if (!_apiUrl || !_authToken) throw new Error("Not authorized");
  const res = await fetch(`${_apiUrl}/b2api/v3/b2_list_file_names`, {
    method: "POST",
    headers: { Authorization: _authToken, "Content-Type": "application/json" },
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
  filePath: string,
  b2FileName: string,
): Promise<UploadResponse> {
  const { uploadUrl, uploadToken } = await getUploadUrl();
  const fileBuffer = await Bun.file(filePath).arrayBuffer();
  const hash = await sha1(fileBuffer);
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadToken,
      "X-Bz-File-Name": encodeURIComponent(b2FileName),
      "Content-Type": mimeType(extname(b2FileName)),
      "Content-Length": String(fileBuffer.byteLength),
      "X-Bz-Content-Sha1": hash,
    },
    body: fileBuffer,
  });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  return UploadResponseSchema.parse(await res.json());
}

async function uploadBuffer(
  buf: Buffer,
  b2FileName: string,
): Promise<UploadResponse> {
  const { uploadUrl, uploadToken } = await getUploadUrl();
  const ab = buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength,
  ) as ArrayBuffer;
  const hash = await sha1(ab);
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadToken,
      "X-Bz-File-Name": encodeURIComponent(b2FileName),
      "Content-Type": mimeType(extname(b2FileName)),
      "Content-Length": String(buf.byteLength),
      "X-Bz-Content-Sha1": hash,
    },
    body: ab,
  });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  return UploadResponseSchema.parse(await res.json());
}

async function computeImageMeta(filePath: string): Promise<ImageMeta> {
  const identify = await spawnCapture([
    "magick",
    "identify",
    "-format",
    "%wx%h",
    `${filePath}[0]`,
  ]);
  if (!identify.ok)
    throw new Error(`magick identify failed: ${identify.stderr.toString()}`);

  const [w, h] = identify.stdout.toString().trim().split("x").map(Number);
  if (!w || !h) throw new Error(`Could not read dimensions: ${filePath}`);

  const tmpPath = `${import.meta.dir}/.blur_${crypto.randomUUID()}.png`;
  const convert = await spawnCapture([
    "magick",
    `${filePath}[0]`,
    "-resize",
    "10x",
    "-strip",
    tmpPath,
  ]);
  if (!convert.ok)
    throw new Error(`magick convert failed: ${convert.stderr.toString()}`);

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

async function computeVideoMeta(
  filePath: string,
  b2FileName: string,
  av1Encoder: string | null,
): Promise<VideoMeta> {
  const probe = await spawnCapture([
    "ffprobe",
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_streams",
    filePath,
  ]);
  if (!probe.ok) throw new Error(`ffprobe failed: ${probe.stderr.toString()}`);

  const { streams } = JSON.parse(probe.stdout.toString()) as {
    streams: { codec_type: string; width?: number; height?: number }[];
  };
  const vs = streams.find((s) => s.codec_type === "video");
  if (!vs?.width || !vs?.height)
    throw new Error(`No video stream found in: ${filePath}`);

  const useAvif = av1Encoder !== null;
  const posterB2Name = posterFileName(b2FileName, useAvif);
  const tmpPoster = `${import.meta.dir}/.poster_${crypto.randomUUID()}.${useAvif ? "avif" : "jpg"}`;
  let poster: string | undefined;

  const ffmpegArgs = useAvif
    ? [
        "ffmpeg",
        "-y",
        "-i",
        filePath,
        "-ss",
        "00:00:00",
        "-vframes",
        "1",
        "-vf",
        "scale=640:-2",
        "-pix_fmt",
        "yuv420p10le",
        "-c:v",
        av1Encoder!,
        ...(av1Encoder === "libaom-av1" ? ["-still-picture", "1"] : []),
        "-crf",
        av1Encoder === "libsvtav1" ? "38" : "35",
        "-b:v",
        "0",
        tmpPoster,
      ]
    : [
        "ffmpeg",
        "-y",
        "-i",
        filePath,
        "-ss",
        "00:00:00",
        "-vframes",
        "1",
        "-vf",
        "scale=640:-2",
        "-q:v",
        "6",
        tmpPoster,
      ];

  const ffmpeg = await spawnCapture(ffmpegArgs);

  if (!ffmpeg.ok) {
    console.warn(`  ⚠️   ffmpeg failed for ${basename(filePath)}`);
    if (ffmpeg.stdout.length)
      console.warn(`  stdout: ${ffmpeg.stdout.toString()}`);
    if (ffmpeg.stderr.length)
      console.warn(`  stderr: ${ffmpeg.stderr.toString()}`);
  } else {
    try {
      const posterBuf = Buffer.from(await Bun.file(tmpPoster).arrayBuffer());
      console.log(`  🖼️   Uploading poster → ${posterB2Name}`);
      await uploadBuffer(posterBuf, posterB2Name);
      poster = posterB2Name;
      console.log(`  ✅  Poster uploaded`);
    } catch (err) {
      console.warn(`  ⚠️   Poster upload failed: ${(err as Error).message}`);
    } finally {
      await Bun.file(tmpPoster)
        .delete()
        .catch(() => {});
    }
  }

  return {
    kind: "video",
    width: vs.width,
    height: vs.height,
    ...(poster ? { poster } : {}),
  };
}

async function loadManifest(): Promise<Manifest> {
  const f = Bun.file(MANIFEST_PATH);
  if (!(await f.exists())) return {};
  try {
    return (await f.json()) as Manifest;
  } catch {
    return {};
  }
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

const av1Encoder = await detectAv1Encoder();
if (!av1Encoder) {
  console.warn(
    "⚠️   No AV1 encoder found (libaom-av1 / libsvtav1) — posters will be JPEG.\n",
  );
}

console.log("🔑  Authorizing with Backblaze B2…");
const auth = await authorize();
_apiUrl = auth.apiInfo.storageApi.apiUrl;
_authToken = auth.authorizationToken;
console.log("✅  Authorized\n");

const manifest = await loadManifest();

type Result = { id: string; url: string; meta: MediaMeta | null; tag: string };
const results: Result[] = [];

for (const filePath of files) {
  const e = extname(filePath);
  const kind = fileKind(e);
  const fileBuffer = await Bun.file(filePath).arrayBuffer();
  const hash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-1", fileBuffer)),
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const b2FileName = `${prefix}${hash}${e}`;
  const originalName = basename(filePath);

  let meta: MediaMeta | null = manifest[b2FileName] ?? null;
  const missingPoster = meta?.kind === "video" && !meta.poster;

  if (!meta || missingPoster) {
    try {
      if (kind === "image") {
        console.log(`📐  Computing image metrics for ${originalName}…`);
        meta = await computeImageMeta(filePath);
      } else if (kind === "video") {
        console.log(`📐  Computing video metrics for ${originalName}…`);
        meta = await computeVideoMeta(filePath, b2FileName, av1Encoder);
      }
    } catch (err) {
      console.warn(
        `⚠️   Metrics failed for ${originalName}: ${(err as Error).message}`,
      );
    }
  } else {
    console.log(`📋  Using cached metrics for ${originalName}`);
  }

  const exists = await fileExists(b2FileName);

  if (exists) {
    console.log(
      `⏭️   ${originalName} already uploaded (hash=${hash}), skipping.`,
    );
  } else {
    console.log(`⬆️   Uploading ${originalName} → ${b2FileName}`);
    await uploadFile(filePath, b2FileName);
    console.log(`✅  Done  hash=${hash}`);
  }

  if (meta) manifest[b2FileName] = meta;

  const publicUrl = `${cdnUrl}/${b2FileName}`;
  const tag = mdxTag(b2FileName, "This is an example alt.", meta);
  results.push({ id: hash, url: publicUrl, meta, tag });

  console.log(`    URL         : ${publicUrl}`);
  if (meta?.kind === "image") {
    console.log(`    Dimensions  : ${meta.width}×${meta.height}`);
    console.log(`    blurDataURL : ${meta.blurDataURL.slice(0, 60)}…`);
  }
  if (meta?.kind === "video") {
    console.log(`    Dimensions  : ${meta.width}×${meta.height}`);
    if (meta.poster) console.log(`    Poster      : ${cdnUrl}/${meta.poster}`);
  }
  console.log(`    Tag         : ${tag}\n`);
}

await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`💾  Manifest saved → ${MANIFEST_PATH}\n`);

const divider = "─".repeat(60);
console.log(divider);
console.log("\n📋  Copy-paste these into your .mdx file:\n");
console.log(results.map((r) => r.tag).join("\n"));
console.log(`\n${divider}\n`);
console.log("🗂️   Summary JSON:\n");
console.log(JSON.stringify(results, null, 2));
