"use client";

import { getVideoMeta } from "@/app/media";
import { cdnLink } from "@/lib/cdn";
import { cn } from "@/lib/utils";
import { VideoIcon, VolumeIcon, VolumeOffIcon } from "lucide-react";
import { ComponentProps, useEffect, useRef } from "react";
import { BlurMaterial } from "./ui/blur-material";

export type VideoProps = ComponentProps<"video"> & {
  src: string;
  alt: string;
  alwaysPlay?: boolean;
};

export default function Video({
  src,
  alt,
  alwaysPlay,
  style,
  width,
  height,
  ...props
}: VideoProps) {
  const meta = getVideoMeta(src);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            video.muted = true;
            video.play();
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.8 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (!meta)
    return (
      <div
        style={{ width, height }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border bg-red-50 text-red-400 p-4",
          "dark:bg-red-900 dark:text-red-50",
        )}
      >
        <VideoIcon />
        <span className="text-xs font-medium">Failed to load video</span>
      </div>
    );

  return (
    <video
      ref={ref}
      src={cdnLink(src)}
      width={width ?? meta.width}
      height={height ?? meta.height}
      style={{ aspectRatio: meta.aspectRatio, ...style }}
      aria-label={alt}
      suppressHydrationWarning
      {...props}
    />
  );
}

export type ControlsProps = ComponentProps<"div"> & {
  onMuted: (muted: boolean) => void;
  muted: boolean;
};

export const Controls = ({ onMuted, muted, ...props }: ControlsProps) => {
  return (
    <div {...props}>
      <BlurMaterial
        onClick={() => onMuted(!muted)}
        className="w-min h-min p-3 rounded-full"
      >
        {muted ? <VolumeOffIcon size={20} /> : <VolumeIcon />}
      </BlurMaterial>
    </div>
  );
};
