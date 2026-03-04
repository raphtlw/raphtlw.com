#!/usr/bin/env bun

import { ImageMeta, MediaMeta, VideoMeta } from "@/app/media";
import { cdnUrl } from "@/lib/cdn";
import * as z from "zod";

const B2_KEY_ID = process.env.B2_KEY_ID ?? "";
const B2_APP_KEY = process.env.B2_APP_KEY ?? "";
const B2_BUCKET_ID = process.env.B2_BUCKET_ID ?? "";
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME ?? "";

const MANIFEST_PATH = new URL("../app/media.json", import.meta.url).pathname;
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 4;

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".turbo",
  "dist",
  "build",
  "out",
  ".cache",
  "coverage",
]);

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

const MIME: Record<string, string> = {
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
};

const StorageApiSchema = z.object({
  apiUrl: z.url(),
  downloadUrl: z.url(),
  s3ApiUrl: z.url(),
  recommendedPartSize: z.number(),
  absoluteMinimumPartSize: z.number(),
  bucketId: z.string().nullable(),
  bucketName: z.string().nullable(),
  capabilities: z.array(z.string()),
  infoType: z.literal("storageApi"),
  namePrefix: z.string().nullable(),
});
const AuthSchema = z.object({
  accountId: z.string(),
  authorizationToken: z.string(),
  apiInfo: z.object({ storageApi: StorageApiSchema }),
  applicationKeyExpirationTimestamp: z.number().nullable(),
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

type Auth = z.infer<typeof AuthSchema>;
type Manifest = Record<string, MediaMeta>;

function ext(p: string): string {
  const dot = p.lastIndexOf(".");
  return dot > p.lastIndexOf("/") ? p.slice(dot).toLowerCase() : "";
}

function kind(filename: string): "image" | "video" | "unknown" {
  const e = ext(filename);
  if (IMAGE_EXTS.has(e)) return "image";
  if (VIDEO_EXTS.has(e)) return "video";
  return "unknown";
}

function posterName(b2Name: string): string {
  const dot = b2Name.lastIndexOf(".");
  const stem = dot !== -1 ? b2Name.slice(0, dot) : b2Name;
  return `${stem}_poster`;
}

async function sha1(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function spawnOrThrow(cmd: string[]): Promise<Buffer> {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
  const [stdout, , exitCode] = await Promise.all([
    new Response(proc.stdout).arrayBuffer(),
    new Response(proc.stderr).arrayBuffer(),
    proc.exited,
  ]);
  if (exitCode !== 0) {
    const stderr = Buffer.from(
      await new Response(proc.stderr).arrayBuffer(),
    ).toString();
    throw new Error(`${cmd[0]} exited ${exitCode}: ${stderr.slice(0, 300)}`);
  }
  return Buffer.from(stdout);
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

let _auth: { apiUrl: string; authToken: string } | null = null;

async function b2Auth(): Promise<{ apiUrl: string; authToken: string }> {
  if (_auth) return _auth;
  if (!B2_KEY_ID || !B2_APP_KEY || !B2_BUCKET_ID || !B2_BUCKET_NAME)
    throw new Error(
      "Missing B2 env vars: B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID, B2_BUCKET_NAME",
    );

  console.log("🔑  Authorizing B2…");
  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      headers: { Authorization: `Basic ${btoa(`${B2_KEY_ID}:${B2_APP_KEY}`)}` },
    },
  );
  if (!res.ok) throw new Error(`B2 auth failed: ${await res.text()}`);
  const auth = AuthSchema.parse(await res.json());
  _auth = {
    apiUrl: auth.apiInfo.storageApi.apiUrl,
    authToken: auth.authorizationToken,
  };
  console.log("✅  B2 authorized\n");
  return _auth;
}

async function b2UploadUrl(): Promise<{
  uploadUrl: string;
  uploadToken: string;
}> {
  const { apiUrl, authToken } = await b2Auth();
  const res = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: "POST",
    headers: { Authorization: authToken, "Content-Type": "application/json" },
    body: JSON.stringify({ bucketId: B2_BUCKET_ID }),
  });
  if (!res.ok) throw new Error(`B2 get_upload_url failed: ${await res.text()}`);
  const { uploadUrl, authorizationToken: uploadToken } = UploadUrlSchema.parse(
    await res.json(),
  );
  return { uploadUrl, uploadToken };
}

async function uploadToB2(buf: Buffer, b2FileName: string): Promise<void> {
  const { uploadUrl, uploadToken } = await b2UploadUrl();
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
      "Content-Type": MIME[ext(b2FileName)] ?? "application/octet-stream",
      "Content-Length": String(buf.byteLength),
      "X-Bz-Content-Sha1": hash,
    },
    body: ab,
  });
  if (!res.ok) throw new Error(`B2 upload failed: ${await res.text()}`);
  UploadResponseSchema.parse(await res.json());
}

async function imageMeta(buf: Buffer, filename: string): Promise<ImageMeta> {
  const id = crypto.randomUUID();
  const tmpIn = `${import.meta.dir}/.regen_in_${id}${ext(filename)}`;
  const tmpOut = `${import.meta.dir}/.regen_out_${id}.png`;
  await Bun.write(tmpIn, buf);

  try {
    const dims = await spawnOrThrow([
      "magick",
      "identify",
      "-format",
      "%wx%h",
      `${tmpIn}[0]`,
    ]);
    const [w, h] = dims.toString().trim().split("x").map(Number);
    if (!w || !h) throw new Error("Could not read image dimensions");

    await spawnOrThrow([
      "magick",
      `${tmpIn}[0]`,
      "-resize",
      "10x",
      "-strip",
      tmpOut,
    ]);
    const blurBuf = await Bun.file(tmpOut).arrayBuffer();
    await Bun.file(tmpOut).delete();

    return {
      kind: "image",
      width: w,
      height: h,
      blurDataURL: `data:image/png;base64,${Buffer.from(blurBuf).toString("base64")}`,
    };
  } finally {
    await Bun.file(tmpIn)
      .delete()
      .catch(() => {});
  }
}

async function detectAv1Encoder(): Promise<string | null> {
  const { stdout } = await spawnCapture(["ffmpeg", "-encoders", "-v", "quiet"]);
  const out = stdout.toString();
  if (out.includes("libsvtav1")) return "libsvtav1";
  if (out.includes("libaom-av1")) return "libaom-av1";
  return null;
}

const av1Encoder = await detectAv1Encoder();
if (!av1Encoder) {
  console.warn(
    "⚠️   No AV1 encoder found (libaom-av1 / libsvtav1) — posters will be JPEG.\n",
  );
}

async function videoMeta(buf: Buffer, filename: string): Promise<VideoMeta> {
  const id = crypto.randomUUID();
  const tmpVideo = `${import.meta.dir}/.regen_vid_${id}${ext(filename)}`;
  await Bun.write(tmpVideo, buf);

  try {
    const probe = await spawnOrThrow([
      "ffprobe",
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_streams",
      tmpVideo,
    ]);
    const { streams } = JSON.parse(probe.toString()) as {
      streams: { codec_type: string; width?: number; height?: number }[];
    };
    const vs = streams.find((s) => s.codec_type === "video");
    if (!vs?.width || !vs?.height) throw new Error("No video stream found");

    const useAvif = av1Encoder !== null;
    const pName = `${posterName(filename)}.${useAvif ? "avif" : "jpg"}`;
    const tmpPoster = `${import.meta.dir}/.regen_poster_${id}.${useAvif ? "avif" : "jpg"}`;
    let poster: string | undefined;

    const ffmpegArgs = (ss: string) =>
      useAvif
        ? [
            "ffmpeg",
            "-y",
            "-i",
            tmpVideo,
            "-ss",
            ss,
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
            tmpVideo,
            "-ss",
            ss,
            "-vframes",
            "1",
            "-vf",
            "scale=640:-2",
            "-q:v",
            "6",
            tmpPoster,
          ];

    let ffmpeg = await spawnCapture(ffmpegArgs("00:00:00"));

    if (!ffmpeg.ok) {
      console.warn(`  ⚠️   ffmpeg failed for ${filename}`);
      if (ffmpeg.stdout.length)
        console.warn(`  stdout: ${ffmpeg.stdout.toString()}`);
      if (ffmpeg.stderr.length)
        console.warn(`  stderr: ${ffmpeg.stderr.toString()}`);
    } else {
      try {
        const pBuf = Buffer.from(await Bun.file(tmpPoster).arrayBuffer());
        if (DRY_RUN) {
          process.stdout.write(`  🖼️   [dry-run] poster → ${pName}\n`);
          poster = pName;
        } else {
          process.stdout.write(`  🖼️   Uploading poster → ${pName}… `);
          await uploadToB2(pBuf, pName);
          process.stdout.write("✅\n");
          poster = pName;
        }
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
  } finally {
    await Bun.file(tmpVideo)
      .delete()
      .catch(() => {});
  }
}

async function collectRefs(): Promise<Set<string>> {
  const extList = [...IMAGE_EXTS, ...VIDEO_EXTS]
    .map((e) => e.slice(1))
    .join("|");
  const pattern = new RegExp(
    `(?<=[=\\s"'\`(\\[,>]|^)[\\w./\\\\-]+\\.(?:${extList})(?=[\\s"'\`\\)\\]>,]|$)`,
    "gi",
  );

  const files = Array.from(
    new Bun.Glob("**/*.{ts,tsx,js,jsx,mdx,md}").scanSync({
      cwd: ".",
      absolute: true,
      onlyFiles: true,
    }),
  ).filter(
    (p) =>
      !p.split("/").some((seg) => IGNORED_DIRS.has(seg)) && p !== MANIFEST_PATH,
  );

  const refs = new Set<string>();
  await Promise.all(
    files.map(async (f) => {
      const text = await Bun.file(f)
        .text()
        .catch(() => "");
      for (const m of text.matchAll(pattern)) {
        if (m[0]) refs.add(m[0]);
      }
    }),
  );
  return refs;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

async function withConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  const queue = [...items];
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (queue.length) {
        const item = queue.shift()!;
        await fn(item);
      }
    },
  );
  await Promise.all(workers);
}

console.log("╔══════════════════════════════════════════════════╗");
console.log("║          Media Regenerate Script                 ║");
console.log("╚══════════════════════════════════════════════════╝\n");

if (DRY_RUN) console.log("🔍  DRY RUN — manifest will not be written.\n");

console.log("📄  Scanning source files for media references…");
const refs = await collectRefs();
console.log(`    Found ${refs.size} unique reference(s).\n`);

if (refs.size === 0) {
  console.log("Nothing to do.");
  process.exit(0);
}

const manifest: Manifest = {};
let succeeded = 0;
let failed = 0;
let totalBytes = 0;

await withConcurrency([...refs], CONCURRENCY, async (filename) => {
  const fileKind = kind(filename);
  const url = `${cdnUrl}/${filename}`;

  process.stdout.write(`  ⬇️   Fetching ${filename}… `);

  let buf: Buffer;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
    totalBytes += buf.byteLength;
    process.stdout.write(`${formatBytes(buf.byteLength)}\n`);
  } catch (err) {
    process.stdout.write("\n");
    console.error(`  ❌  Fetch failed: ${(err as Error).message}`);
    failed++;
    return;
  }

  try {
    let meta: MediaMeta;

    if (fileKind === "image") {
      process.stdout.write(`  📐  Computing image metrics…\n`);
      meta = await imageMeta(buf, filename);
      console.log(
        `  ✅  ${meta.width}×${meta.height}  blur: ${meta.blurDataURL.slice(0, 48)}…`,
      );
    } else if (fileKind === "video") {
      process.stdout.write(`  📐  Computing video metrics…\n`);
      meta = await videoMeta(buf, filename);
      console.log(
        `  ✅  ${meta.width}×${meta.height}${meta.poster ? `  poster: ${meta.poster}` : ""}`,
      );
    } else {
      console.warn(`  ⚠️   Unknown file kind: ${filename} — skipping`);
      failed++;
      return;
    }

    manifest[filename] = meta;
    succeeded++;
  } catch (err) {
    console.error(`  ❌  Failed: ${(err as Error).message}`);
    failed++;
  }

  console.log();
});

const divider = "─".repeat(52);
console.log(divider);
console.log(`  Succeeded   : ${succeeded}`);
console.log(`  Failed      : ${failed}`);
console.log(`  Downloaded  : ${formatBytes(totalBytes)}`);
console.log(divider + "\n");

if (DRY_RUN) {
  console.log("🔍  Dry run complete — manifest not written.");
} else if (succeeded > 0) {
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`💾  Manifest saved → ${MANIFEST_PATH}`);
} else {
  console.log("Nothing to save.");
}

if (failed > 0) process.exit(1);
