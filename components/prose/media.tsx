import Image from "@/components/image";
import Video from "@/components/video";
import MediaThemeInstaplay from "player.style/instaplay/react";

type ImageMediaProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

export const ImageMedia = ({ src, alt, ...props }: ImageMediaProps) => {
  return (
    <figure className="not-prose flex flex-col gap-4 mt-4 font-sans -mx-4 md:mx-0">
      <Image src={src} alt={alt ?? ""} className="w-full" {...props} />
      {alt && (
        <figcaption className="px-4 text-sm text-stone-500 dark:text-stone-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

type VideoMediaProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  alwaysPlay?: boolean;
};

export const VideoMedia = ({ src, alt, ...props }: VideoMediaProps) => {
  return (
    <figure className="not-prose flex flex-col gap-4 mt-4 font-sans -mx-4 md:mx-0">
      <MediaThemeInstaplay style={{ width: "100%" }}>
        <Video
          src={src}
          alt={alt}
          slot="media"
          loop
          autoPlay
          playsInline
          muted={false}
          preload="metadata"
          crossOrigin="anonymous"
          {...props}
        />
      </MediaThemeInstaplay>
      {alt && (
        <figcaption className="px-4 text-sm text-stone-500 dark:text-stone-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};
