"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import { StaggeredText } from "@/components/spatial/staggered-text";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LINKS_QUERYResult } from "@/sanity/types";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export type BookingSchedulerProps = {};

export const BookingScheduler = ({}: BookingSchedulerProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "15min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          🌱 &nbsp; book a call{" "}
          <StaggeredText reactToMouse>with me</StaggeredText>
        </div>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col max-h-[calc(100vh-216px)] bg-none border-none shadow-none md:max-w-2xl lg:max-w-4xl",
        )}
      >
        <DialogTitle className="sr-only">Hi</DialogTitle>
        <Cal
          namespace="15min"
          calLink="raphw/15min"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: "month_view" }}
        />
      </DialogContent>
    </Dialog>
  );
};
