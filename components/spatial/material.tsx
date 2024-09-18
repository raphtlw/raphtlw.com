"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  HTMLMotionProps,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { PropsWithChildren, useEffect, useState } from "react";
import { HoverEffect } from "./hover";

export type SpatialMaterialProps = HTMLMotionProps<"div"> &
  PropsWithChildren<{
    backgroundIntensity?: number;
    reactToMouse?: boolean;
    enableTap?: boolean;
  }>;

export const SpatialMaterial = ({
  children,
  backgroundIntensity,
  reactToMouse,
  enableTap,
  ...props
}: SpatialMaterialProps) => {
  const isDesktop = useMediaQuery("(min-device-width: 768px)");

  const [isTap, setTap] = useState(false);

  const opacity = useMotionValue(0);
  const opacitySpring = useSpring(opacity);
  const background = useMotionTemplate`radial-gradient(circle at center, rgba(255, 255, 255, ${opacitySpring}), rgba(255, 255, 255, 0))`;

  const scale = useMotionValue(0);
  const scaleSpring = useSpring(scale, {
    stiffness: 300,
    damping: 20,
  });

  const posY = useMotionValue(0);
  const posYSpring = useSpring(posY, {
    stiffness: 300,
    damping: 40,
  });

  useEffect(() => {
    if ((props.onClick || enableTap) && isTap) {
      opacity.set(0.15);
      scale.set(0.9);
      posY.set(5);
    } else {
      opacity.set(0);
      scale.set(1);
      posY.set(0);
    }
  }, [isTap]);

  const component = (
    <motion.div
      {...props}
      style={{
        backdropFilter: "blur(20px)",
        boxShadow:
          "inset 1.2px 0 0 0 rgba(255, 255, 255, 0.04), inset -1.2px 0 0 0 rgba(255, 255, 255, 0.04), inset 0 1.2px 0 0 rgba(255, 255, 255, 0.1), inset 0 0.6px 0 0 rgba(255, 255, 255, 0.1)",
        scale: scaleSpring,
        y: posYSpring,
        ...props.style,
      }}
      onMouseDown={(e) => {
        setTap(true);
        if (props.onMouseDown) props.onMouseDown(e);
      }}
      onTouchStart={(e) => {
        setTap(true);
        if (props.onTouchStart) props.onTouchStart(e);
      }}
      onMouseUp={(e) => {
        setTap(false);
        if (props.onMouseUp) props.onMouseUp(e);
      }}
      onTouchEnd={(e) => {
        setTap(false);
        if (props.onTouchEnd) props.onTouchEnd(e);
      }}
      onTouchCancel={(e) => {
        setTap(false);
        if (props.onTouchCancel) props.onTouchCancel(e);
      }}
      onContextMenu={(e) => {
        setTap(false);
        if (props.onContextMenu) props.onContextMenu(e);
      }}
      className={cn(
        "bg-opacity-40 bg-neutral-900 flex flex-1 relative z-10 overflow-hidden",
        props.className,
      )}
    >
      {children}
      <motion.div
        style={{ background }}
        className={cn(
          "absolute -z-10 top-0 bottom-0 left-0 right-0 w-full h-full",
        )}
      ></motion.div>
    </motion.div>
  );

  return isDesktop && reactToMouse ? (
    <HoverEffect>{component}</HoverEffect>
  ) : (
    component
  );
};
