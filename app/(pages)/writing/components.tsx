"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import {
  Dialog,
  DialogContent,
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
import { ComponentProps, useEffect, useMemo, useState } from "react";

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [shown, setShown] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setShown(true);
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

export type VideoPlayerProps = ComponentProps<"video"> & {
  containerProps?: MotionProps & ComponentProps<"div">;
};

export const VideoPlayer = ({ containerProps, ...props }: VideoPlayerProps) => {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const materialVariants: Variants = {
    hidden: {
      y: 40,
      filter: "blur(16px)",
      opacity: 0,
    },
    show: {
      y: 0,
      filter: "none",
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
    <motion.div
      {...containerProps}
      className={cn(
        "overflow-hidden rounded-2xl relative",
        containerProps && containerProps.className,
      )}
      variants={materialVariants}
      initial="hidden"
      animate={loaded && playing ? "show" : "hidden"}
    >
      {!loaded && <Skeleton className="absolute inset-0 rounded-2xl" />}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setLoaded(true)}
        onPlaying={() => setPlaying(true)}
        {...props}
        className={cn("rounded-lg pointer-events-none", props.className)}
      />
    </motion.div>
  );
};

export type ImageProps = NextImageProps;

export const Image = ({ ...props }: ImageProps) => {
  const [width, height] = useMemo(() => {
    // Parse out the source. If we can get the dimensions from the URL,
    // it will be easier to use this component in the future.
    if (typeof props.src === "string") {
      const url = new URL(props.src);
      if (url.host === "cdn.sanity.io") {
        const segments = url.pathname.split("/");
        const lastSegment = segments[segments.length - 1];
        const filenameParts = lastSegment.split("-");
        const lastFilenamePart = filenameParts[filenameParts.length - 1];
        const extParts = lastFilenamePart.split(".");
        const [width, height] = extParts[0].split("x");
        return [parseInt(width), parseInt(height)] as const;
      }
    }

    return [props.width, props.height] as const;
  }, [props.src]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <NextImage {...props} width={width} height={height} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{props.alt}</DialogTitle>
        <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
          <NextImage
            src={props.src}
            alt={props.alt}
            fill
            className={cn("h-full w-full object-contain", props.className)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
