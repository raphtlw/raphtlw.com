"use client";

import { HoverEffect } from "@/components/spatial/hover";
import { ClientOnly } from "@/components/utils/client-only";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  HTMLMotionProps,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export type SpatialMaterialProps = HTMLMotionProps<"div"> &
  PropsWithChildren<{
    reactToMouse?: boolean;
    enableTap?: boolean;
  }>;

export const SpatialMaterial = (props: SpatialMaterialProps) => {
  return (
    <ClientOnly>
      <Inner {...props} />
    </ClientOnly>
  );
};

const Inner = ({
  children,
  reactToMouse,
  enableTap,
  ...props
}: SpatialMaterialProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-device-width: 768px)");

  const [isTap, setTap] = useState(false);
  const [isHover, setHover] = useState(false);

  const backlightOpacity = useMotionValue(0);
  const backlightOpacitySpring = useSpring(backlightOpacity);
  const background = useMotionTemplate`radial-gradient(circle at center, rgba(255, 255, 255, ${backlightOpacitySpring}), rgba(255, 255, 255, 0))`;

  const scale = useMotionValue(1);
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
      backlightOpacity.set(0.15);
      scale.set(0.95);
      posY.set(5);
    } else {
      backlightOpacity.set(0);
      scale.set(1);
      posY.set(0);
    }
  }, [isTap, enableTap, backlightOpacity, posY, props.onClick, scale]);

  useEffect(() => {
    if (isHover) {
      backlightOpacity.set(0.15);
    } else {
      backlightOpacity.set(0);
    }
  }, [isHover, backlightOpacity]);

  useEffect(() => {
    if (ref.current) {
      if (isDesktop && reactToMouse) {
        ref.current.addEventListener("mouseenter", () => setHover(true));
        ref.current.addEventListener("mouseover", () => setHover(true));
        ref.current.addEventListener("mouseleave", () => setHover(false));
        ref.current.addEventListener("mouseout", () => setHover(false));
      }
      ref.current.addEventListener("mousedown", () => setTap(true));
      ref.current.addEventListener("touchstart", () => setTap(true));
      ref.current.addEventListener("mouseup", () => setTap(false));
      ref.current.addEventListener("touchend", () => setTap(false));
      ref.current.addEventListener("mouseleave", () => setTap(false));
      ref.current.addEventListener("mouseout", () => setTap(false));
      ref.current.addEventListener("touchcancel", () => setTap(false));
      ref.current.addEventListener("contextmenu", () => setTap(false));
    }
  }, [ref, setHover, isDesktop, reactToMouse]);

  const component = (
    <motion.div
      ref={ref}
      {...props}
      style={{
        backdropFilter: "blur(20px)",
        boxShadow:
          "inset 1.2px 0 0 0 rgba(255, 255, 255, 0.04), inset -1.2px 0 0 0 rgba(255, 255, 255, 0.04), inset 0 1.2px 0 0 rgba(255, 255, 255, 0.1), inset 0 0.6px 0 0 rgba(255, 255, 255, 0.1)",
        scale: scaleSpring,
        y: posYSpring,
        cursor: props.onClick || enableTap ? "pointer" : "default",
        ...props.style,
      }}
      className={cn(
        "bg-opacity-40 bg-neutral-900 flex relative z-10 overflow-hidden",
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
