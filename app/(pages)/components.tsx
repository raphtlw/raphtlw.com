"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import { LINKS_QUERYResult } from "@/sanity/types";
import { Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export type PreviewLinkProps = {
  externalLink: LINKS_QUERYResult[0];
};

export const PreviewLink = ({ externalLink }: PreviewLinkProps) => {
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
    <Link href={externalLink.url!}>
      <SpatialMaterial
        className="rounded-2xl px-4 pt-2 pb-4 flex flex-col gap-2"
        enableTap
        variants={materialVariants}
        initial="hidden"
        animate={loaded ? "show" : "hidden"}
        whileHover={{
          scale: 1.05,
          transition: {
            type: "spring",
            stiffness: 150,
            velocity: 2,
            damping: 25,
          },
        }}
      >
        <p className="font-bold">{externalLink.cta}</p>
        <video
          src={externalLink.video?.asset?.url!}
          autoPlay
          playsInline
          loop
          muted
          preload="auto"
          className="rounded-lg overflow-hidden pointer-events-none"
          onLoadedData={() => setLoaded(true)}
        ></video>
      </SpatialMaterial>
    </Link>
  );
};
