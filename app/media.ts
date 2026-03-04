export type ImageMeta = {
  kind: "image";
  width: number;
  height: number;
  blurDataURL: string;
};

export type VideoMeta = {
  kind: "video";
  width: number;
  height: number;
  aspectRatio: string;
};

export type MediaMeta = ImageMeta | VideoMeta;

import manifest from "./media.json" assert { type: "json" };

const db = manifest as Record<string, MediaMeta>;

export function getMediaMeta(b2FileName: string): MediaMeta | undefined {
  return db[b2FileName];
}

export function getImageMeta(b2FileName: string): ImageMeta | undefined {
  const m = db[b2FileName];
  return m?.kind === "image" ? m : undefined;
}

export function getVideoMeta(b2FileName: string): VideoMeta | undefined {
  const m = db[b2FileName];
  return m?.kind === "video" ? m : undefined;
}
