#!/usr/bin/env bun

import { ImageMeta, MediaMeta, VideoMeta } from "@/app/media";
import { cdnUrl } from "@/lib/cdn";

const MANIFEST_PATH = new URL("../app/media.json", import.meta.url).pathname;

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

const SCAN_GLOB = "**/*.{ts,tsx,js,jsx,mdx,md}";
const DRY_RUN = process.argv.includes("--dry-run");

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

function extname(p: string): string {
  const dot = p.lastIndexOf(".");
  const slash = p.lastIndexOf("/");
  return dot > slash ? p.slice(dot).toLowerCase() : "";
}

function fileKind(filename: string): "image" | "video" | "unknown" {
  const ext = extname(filename);
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  return "unknown";
}

async function collectMediaRefs(cwd: string): Promise<Set<string>> {
  const sourceFiles = Array.from(
    new Bun.Glob(SCAN_GLOB).scanSync({ cwd, absolute: true, onlyFiles: true }),
  ).filter(
    (p) =>
      !p.split("/").some((seg) => IGNORED_DIRS.has(seg)) && p !== MANIFEST_PATH,
  );

  const extList = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif",
    "svg",
    "mp4",
    "webm",
    "mov",
    "ogg",
    "mkv",
  ].join("|");
  const tokenPattern = new RegExp(
    `\\S+\\.(?:${extList})(?=[\\s"'\`)\]>,]|$)`,
    "gi",
  );

  const refs = new Set<string>();

  await Promise.all(
    sourceFiles.map(async (file) => {
      const text = await Bun.file(file)
        .text()
        .catch(() => "");
      for (const match of text.matchAll(tokenPattern)) {
        const token = match[0].replace(/^[^a-zA-Z0-9./\\-]+/, "");
        if (token) refs.add(token);
      }
    }),
  );

  return refs;
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

async function saveManifest(manifest: Manifest): Promise<void> {
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

async function computeImageMeta(
  buf: Buffer,
  filename: string,
): Promise<ImageMeta> {
  const tmpIn = `${import.meta.dir}/.imgmeta_in_${crypto.randomUUID()}${extname(filename)}`;
  const tmpOut = `${import.meta.dir}/.imgmeta_out_${crypto.randomUUID()}.png`;

  await Bun.write(tmpIn, buf);

  try {
    const identify = Bun.spawnSync(
      ["magick", "identify", "-format", "%wx%h", `${tmpIn}[0]`],
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
    if (!w || !h) throw new Error("Could not read image dimensions");

    const convert = Bun.spawnSync(
      ["magick", `${tmpIn}[0]`, "-resize", "10x", "-strip", tmpOut],
      { stdout: "pipe", stderr: "pipe" },
    );
    if (convert.exitCode !== 0)
      throw new Error(
        `magick convert failed: ${Buffer.from(convert.stderr).toString()}`,
      );

    const blurFile = Bun.file(tmpOut);
    const blurBuf = await blurFile.arrayBuffer();
    await blurFile.delete();

    return {
      kind: "image",
      width: w,
      height: h,
      blurDataURL: `data:image/png;base64,${Buffer.from(blurBuf).toString("base64")}`,
    };
  } finally {
    await Bun.file(tmpIn).delete();
  }
}

async function computeVideoMeta(
  buf: Buffer,
  filename: string,
): Promise<VideoMeta> {
  const tmpPath = `${import.meta.dir}/.videometa_${crypto.randomUUID()}${extname(filename)}`;
  await Bun.write(tmpPath, buf);

  try {
    const proc = Bun.spawnSync(
      [
        "ffprobe",
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_streams",
        tmpPath,
      ],
      { stdout: "pipe", stderr: "pipe" },
    );

    if (proc.exitCode !== 0)
      throw new Error(
        `ffprobe failed (exit ${proc.exitCode}): ${Buffer.from(proc.stderr).toString()}`,
      );

    const json = JSON.parse(Buffer.from(proc.stdout).toString()) as {
      streams: { codec_type: string; width?: number; height?: number }[];
    };
    const vs = json.streams.find((s) => s.codec_type === "video");
    if (!vs?.width || !vs?.height) throw new Error("No video stream found");

    return {
      kind: "video",
      width: vs.width,
      height: vs.height,
      aspectRatio: `${vs.width}/${vs.height}`,
    };
  } finally {
    await Bun.file(tmpPath).delete();
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

console.log("╔══════════════════════════════════════════════════╗");
console.log("║         Media Metadata Backfill Script           ║");
console.log("╚══════════════════════════════════════════════════╝\n");

if (DRY_RUN) console.log("🔍  DRY RUN — manifest will not be written.\n");

console.log("📄  Scanning source files for media references…");
const refs = await collectMediaRefs(".");
console.log(`    Found ${refs.size} unique media reference(s).\n`);

if (refs.size === 0) {
  console.log("Nothing to do.");
  process.exit(0);
}

const manifest = await loadManifest();
const existing = new Set(Object.keys(manifest));
const todo = [...refs].filter((r) => !existing.has(r));
const cached = refs.size - todo.length;

console.log(`📋  Already in manifest : ${cached}`);
console.log(`📥  Need to compute     : ${todo.length}\n`);

if (todo.length === 0) {
  console.log("✨  All references already have metadata. Nothing to backfill.");
  process.exit(0);
}

let succeeded = 0;
let failed = 0;
let totalBytes = 0;

for (const filename of todo) {
  const kind = fileKind(filename);
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
    process.stdout.write(`\n`);
    console.error(`  ❌  Fetch failed: ${(err as Error).message}`);
    failed++;
    continue;
  }

  try {
    let meta: MediaMeta;
    if (kind === "image") {
      process.stdout.write(`  📐  Computing image metrics…\n`);
      meta = await computeImageMeta(buf, filename);
    } else if (kind === "video") {
      process.stdout.write(`  📐  Computing video metrics…\n`);
      meta = await computeVideoMeta(buf, filename);
    } else {
      console.warn(`  ⚠️   Unknown file kind for: ${filename} — skipping`);
      failed++;
      continue;
    }

    manifest[filename] = meta;

    if (meta.kind === "image") {
      console.log(
        `  ✅  ${meta.width}×${meta.height}  blurDataURL: ${meta.blurDataURL.slice(0, 48)}…`,
      );
    } else {
      console.log(
        `  ✅  ${meta.width}×${meta.height}  aspectRatio: ${meta.aspectRatio}`,
      );
    }

    succeeded++;
  } catch (err) {
    console.error(`  ❌  Metrics failed: ${(err as Error).message}`);
    failed++;
  }

  console.log();
}

const divider = "─".repeat(52);
console.log(divider);
console.log(`  Succeeded     : ${succeeded}`);
console.log(`  Failed        : ${failed}`);
console.log(`  Data fetched  : ${formatBytes(totalBytes)}`);
console.log(divider + "\n");

if (DRY_RUN) {
  console.log("🔍  Dry run — manifest not written.");
} else if (succeeded > 0) {
  await saveManifest(manifest);
  console.log(`💾  Manifest saved → ${MANIFEST_PATH}`);
} else {
  console.log("Nothing new to save.");
}

if (failed > 0) process.exit(1);
