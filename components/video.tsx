import { getVideoMeta } from "@/app/media";
import { cdnLink } from "@/lib/cdn";
import { cn } from "@/lib/utils";
import { VideoIcon } from "lucide-react";
import { ComponentProps } from "react";

export type VideoProps = ComponentProps<"video"> & {
  src: string;
  alt: string;
};

export default function Video({
  src,
  alt,
  width,
  height,
  poster,
  ...props
}: VideoProps) {
  const meta = getVideoMeta(src);

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
      src={cdnLink(src)}
      width={width ?? meta.width}
      height={height ?? meta.height}
      poster={poster ?? (meta.poster ? cdnLink(meta.poster) : undefined)}
      aria-label={alt}
      // FIXME: Workaround for https://github.com/muxinc/media-chrome/discussions/698
      suppressHydrationWarning
      {...props}
    />
  );
}
