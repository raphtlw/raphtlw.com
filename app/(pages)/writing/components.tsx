"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionProps,
  useMotionValueEvent,
  useScroll,
  Variants,
} from "motion/react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [shown, setShown] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      if (history.length > 1) {
        setShown(true);
      }
    } else {
      setShown(false);
    }
  });

  useEffect(() => {
    setShown(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {shown && (
        <SpatialMaterial
          initial={{ opacity: 0, y: 10, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, y: 0, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, y: 10, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
          className="top-4 left-4 p-2 fixed rounded-full bg-neutral-900/10"
          enableTap
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          <ChevronLeftIcon />
        </SpatialMaterial>
      )}
    </AnimatePresence>
  );
};

export type VideoPlayerProps = MotionProps &
  ComponentProps<"video"> & {
    containerProps?: MotionProps & ComponentProps<"div">;
    onlyWhenVisible?: boolean;
  };

export const VideoPlayer = ({
  containerProps,
  onlyWhenVisible,
  ...props
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    if (!videoRef.current) return;
    if (onlyWhenVisible) {
      if (isIntersecting) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isIntersecting, videoRef.current]);

  const materialVariants: Variants = {
    hidden: {
      y: 40,
      filter: "blur(16px)",
      opacity: 0,
      scale: 0.9,
    },
    show: {
      y: 0,
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 130,
        damping: 25,
        mass: 1,
      },
    },
  };

  return (
    <div
      ref={ref}
      {...containerProps}
      className={cn(
        "overflow-hidden rounded-2xl",
        containerProps && containerProps.className,
      )}
    >
      {!(loaded || playing) && (
        <Skeleton className="rounded-2xl w-full h-[400px]" />
      )}
      <motion.video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        variants={materialVariants}
        initial="hidden"
        animate={loaded || playing ? "show" : "hidden"}
        onLoadedData={() => setLoaded(true)}
        onPlaying={() => setPlaying(true)}
        {...props}
        className={cn(
          "rounded-lg pointer-events-none",
          !(loaded || playing) && "h-0 overflow-clip",
          props.className,
        )}
      />
    </div>
  );
};

export type ImageProps = ComponentProps<"img">;

export const Image = ({ src, alt, width, height, className }: ImageProps) => {
  // Try optimizing image
  const nextImage = useMemo<NextImageProps | undefined>(() => {
    // Parse out the source. If we can get the dimensions from the URL,
    // it will be easier to use this component in the future.
    if (typeof src === "string") {
      const url = new URL(src);
      if (url.host === "cdn.sanity.io") {
        const segments = url.pathname.split("/");
        const lastSegment = segments[segments.length - 1];
        const filenameParts = lastSegment.split("-");
        const lastFilenamePart = filenameParts[filenameParts.length - 1];
        const extParts = lastFilenamePart.split(".");
        const [width, height] = extParts[0].split("x");
        return {
          src,
          alt,
          width: parseInt(width),
          height: parseInt(height),
        } as NextImageProps;
      }
    }
  }, [src, alt]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="inline-flex h-full">
          {nextImage ? (
            <NextImage
              style={{ transform: "translate3d(0, 0, 0)" }}
              className={className}
              {...nextImage}
            />
          ) : (
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={className}
            />
          )}
        </span>
      </DialogTrigger>
      <DialogContent
        className={cn("p-0 h-fit w-full md:max-h-[calc(100vh-216px)]")}
      >
        <DialogTitle className="sr-only">
          raphtlw.com blog post image
        </DialogTitle>
        <DialogDescription className="sr-only">{alt}</DialogDescription>
        <div className="overflow-clip rounded-md bg-transparent shadow-md">
          {nextImage ? (
            <NextImage
              src={nextImage.src}
              alt={nextImage.alt}
              width={nextImage.width}
              height={nextImage.height}
              className={cn("h-full w-full object-contain", className)}
            />
          ) : (
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={className}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
