"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import { VideoStream } from "@/components/ui/video";
import { Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type PreviewLinkProps = {
  link: string;
  title: string;
  video: string;
};

export const PreviewLink = ({ link, title, video }: PreviewLinkProps) => {
  const [loaded, setLoaded] = useState(false);

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
    },
  };

  return (
    <Link href={link}>
      <SpatialMaterial
        className="rounded-2xl px-4 pt-2 pb-4 flex flex-col gap-2"
        enableTap
        reactToMouse
        variants={materialVariants}
        initial="hidden"
        animate={loaded ? "show" : "hidden"}
        transition={{
          type: "spring",
          stiffness: 130,
          damping: 25,
          mass: 1,
        }}
      >
        <p className="font-bold">{title}</p>
        <VideoStream
          src={video}
          autoplay
          loop
          muted
          preload="auto"
          className="rounded-lg overflow-hidden pointer-events-none"
          onLoadedData={() => setLoaded(true)}
        />
      </SpatialMaterial>
    </Link>
  );
};
