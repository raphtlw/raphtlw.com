import { getMediaMeta } from "@/app/media";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";

export type ImageProps = {
  src: string;
} & Omit<NextImageProps, "src">;

export default function Image({ src, ...props }: ImageProps) {
  const meta = getMediaMeta(src);

  if (!meta)
    return (
      <div
        style={{ width: props.width, height: props.height }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border bg-red-50 text-red-400 p-4",
          "dark:bg-red-900 dark:text-red-50",
        )}
      >
        <ImageIcon />
        <span className="text-xs font-medium">Failed to load image</span>
      </div>
    );

  return <NextImage src={src} placeholder="blur" {...meta} {...props} />;
}
