#!/usr/bin/env bun

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

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--delete");
const prefixFlag = args.indexOf("--prefix");
const BUCKET_PREFIX =
  prefixFlag !== -1 && args[prefixFlag + 1] ? args[prefixFlag + 1] : "";

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

const FileVersionSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  action: z.string(),
  contentLength: z.number(),
  uploadTimestamp: z.number(),
});

const ListFilesResponseSchema = z.object({
  files: z.array(FileVersionSchema),
  nextFileName: z.string().nullable(),
});

type Auth = z.infer<typeof AuthSchema>;
type FileVersion = z.infer<typeof FileVersionSchema>;
type ManifestEntry = {
  kind: "image" | "video";
  poster?: string;
  [key: string]: unknown;
};

async function authorize(): Promise<Auth> {
  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    {
      headers: { Authorization: `Basic ${btoa(`${B2_KEY_ID}:${B2_APP_KEY}`)}` },
    },
  );
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  return AuthSchema.parse(await res.json());
}

async function listAllFiles(
  apiUrl: string,
  authToken: string,
  prefix = "",
): Promise<FileVersion[]> {
  const all: FileVersion[] = [];
  let nextFileName: string | null = null;

  do {
    const body: Record<string, unknown> = {
      bucketId: B2_BUCKET_ID,
      maxFileCount: 1000,
    };
    if (prefix) body.prefix = prefix;
    if (nextFileName) body.startFileName = nextFileName;

    const res = await fetch(`${apiUrl}/b2api/v3/b2_list_file_names`, {
      method: "POST",
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`List files failed: ${await res.text()}`);

    const data = ListFilesResponseSchema.parse(await res.json());
    all.push(...data.files.filter((f) => f.action === "upload"));
    nextFileName = data.nextFileName;
  } while (nextFileName !== null);

  return all;
}

async function deleteFileVersion(
  apiUrl: string,
  authToken: string,
  fileId: string,
  fileName: string,
): Promise<void> {
  const res = await fetch(`${apiUrl}/b2api/v3/b2_delete_file_version`, {
    method: "POST",
    headers: { Authorization: authToken, "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, fileName }),
  });
  if (!res.ok)
    throw new Error(
      `Delete failed for ${fileName} (${fileId}): ${await res.text()}`,
    );
}

async function collectSourceFiles(dir: string): Promise<string[]> {
  return Array.from(
    new Bun.Glob("**/*.{ts,tsx,js,jsx,mdx,md,json}").scanSync({
      cwd: dir,
      absolute: true,
      onlyFiles: true,
    }),
  ).filter(
    (p) =>
      !p.split("/").some((seg) => IGNORED_DIRS.has(seg)) && p !== MANIFEST_PATH,
  );
}

function isReferenced(corpus: string, fileName: string): boolean {
  if (corpus.includes(fileName)) return true;
  const bare = fileName.includes("/")
    ? fileName.slice(fileName.lastIndexOf("/") + 1)
    : null;
  return bare ? corpus.includes(bare) : false;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

console.log("╔══════════════════════════════════════════════════╗");
console.log("║        Unused Media Cleanup — B2 Bucket          ║");
console.log("╚══════════════════════════════════════════════════╝\n");

if (DRY_RUN) {
  console.log("🔍  DRY RUN — no files will be deleted, manifest unchanged.");
  console.log("    Pass --delete to actually remove unused files.\n");
} else {
  console.log("🗑️   DELETE MODE — unused files WILL be permanently deleted.\n");
}

console.log("🔑  Authorizing with Backblaze B2…");
const auth = await authorize();
const { apiUrl } = auth.apiInfo.storageApi;
const { authorizationToken } = auth;
console.log("✅  Authorized\n");

const prefixLabel = BUCKET_PREFIX
  ? `with prefix "${BUCKET_PREFIX}"`
  : "(no prefix filter)";
console.log(`📦  Listing files in bucket ${prefixLabel}…`);
const bucketFiles = await listAllFiles(
  apiUrl,
  authorizationToken,
  BUCKET_PREFIX,
);
console.log(`    Found ${bucketFiles.length} file(s) in bucket.\n`);

if (bucketFiles.length === 0) {
  console.log("🎉  No files found in bucket. Nothing to clean up.");
  process.exit(0);
}

console.log("📄  Scanning project source files…");
const sourceFiles = await collectSourceFiles(".");
console.log(`    Found ${sourceFiles.length} source file(s) to scan.\n`);

const corpus = (
  await Promise.all(
    sourceFiles.map((f) =>
      Bun.file(f)
        .text()
        .catch(() => ""),
    ),
  )
).join("\n");

const manifest = (
  (await Bun.file(MANIFEST_PATH).exists())
    ? await Bun.file(MANIFEST_PATH)
        .json()
        .catch(() => ({}))
    : {}
) as Record<string, ManifestEntry>;

const posterFileNames = new Set<string>();
for (const [key, entry] of Object.entries(manifest)) {
  if (entry.kind === "video" && entry.poster && isReferenced(corpus, key)) {
    posterFileNames.add(entry.poster);
  }
}

if (posterFileNames.size > 0) {
  console.log(
    `🖼️   Found ${posterFileNames.size} poster(s) linked to referenced videos (auto-protected).\n`,
  );
}

const unused: FileVersion[] = [];
const used: FileVersion[] = [];

for (const f of bucketFiles) {
  (isReferenced(corpus, f.fileName) || posterFileNames.has(f.fileName)
    ? used
    : unused
  ).push(f);
}

const unusedBytes = unused.reduce((sum, f) => sum + f.contentLength, 0);
const totalBytes = bucketFiles.reduce((sum, f) => sum + f.contentLength, 0);

console.log("─".repeat(52));
console.log(`  Total files in bucket : ${bucketFiles.length}`);
console.log(`  Referenced in source  : ${used.length}`);
console.log(`  Unused (orphaned)     : ${unused.length}`);
console.log(
  `  Reclaimable storage   : ${formatBytes(unusedBytes)} / ${formatBytes(totalBytes)}`,
);
console.log("─".repeat(52) + "\n");

const manifestKeys = Object.keys(manifest);
const unusedFileNames = new Set(unused.map((f) => f.fileName));
const manifestOrphans = manifestKeys.filter((key) => unusedFileNames.has(key));
const manifestGhosts = manifestKeys.filter(
  (key) => !bucketFiles.some((f) => f.fileName === key),
);
const allManifestPrune = [...new Set([...manifestOrphans, ...manifestGhosts])];

if (unused.length === 0 && allManifestPrune.length === 0) {
  console.log(
    "✨  No unused media files and no stale manifest entries. All clean!",
  );
  process.exit(0);
}

if (unused.length > 0) {
  console.log("🗂️   Unused B2 files:\n");
  for (const f of unused) {
    console.log(
      `  • ${f.fileName}  (${formatBytes(f.contentLength)})  id=${f.fileId}`,
    );
  }
  console.log();
}

if (allManifestPrune.length > 0) {
  console.log(
    `📋  Stale manifest entries to prune (${allManifestPrune.length}):\n`,
  );
  for (const key of allManifestPrune) {
    const reason =
      manifestGhosts.includes(key) && !unusedFileNames.has(key)
        ? "ghost — no B2 file exists"
        : "orphan — B2 file will be deleted";
    console.log(`  • ${key}  (${reason})`);
  }
  console.log();
}

if (DRY_RUN) {
  console.log(
    "ℹ️   Dry run complete. Re-run with --delete to apply the changes above.",
  );
  process.exit(0);
}

let deleted = 0;
let failed = 0;
const actuallyDeleted = new Set<string>();

if (unused.length > 0) {
  console.log("🗑️   Deleting unused B2 files…\n");
  for (const f of unused) {
    try {
      await deleteFileVersion(apiUrl, authorizationToken, f.fileId, f.fileName);
      console.log(`  ✅  Deleted: ${f.fileName}`);
      actuallyDeleted.add(f.fileName);
      deleted++;
    } catch (err) {
      console.error(`  ❌  Failed:  ${f.fileName} — ${(err as Error).message}`);
      failed++;
    }
  }
  console.log();
}

const keysToRemove = new Set([
  ...manifestGhosts,
  ...manifestOrphans.filter((k) => actuallyDeleted.has(k)),
]);

for (const key of [...keysToRemove]) {
  const entry = manifest[key];
  if (entry?.kind === "video" && entry.poster) keysToRemove.add(entry.poster);
}

if (keysToRemove.size > 0) {
  console.log(
    `📋  Pruning ${keysToRemove.size} stale entry/entries from manifest…`,
  );
  for (const key of keysToRemove) {
    delete manifest[key];
    console.log(`  ✅  Removed: ${key}`);
  }
  await Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\n💾  Manifest saved → ${MANIFEST_PATH}\n`);
}

console.log("─".repeat(52));
console.log(`  B2 deleted      : ${deleted}`);
console.log(`  B2 failed       : ${failed}`);
console.log(`  Manifest pruned : ${keysToRemove.size}`);
console.log(`  Freed           : ${formatBytes(unusedBytes)}`);
console.log("─".repeat(52));

if (failed > 0) process.exit(1);
