"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";

export type HoverEffectProps = PropsWithChildren;

export const HoverEffect = ({ children }: HoverEffectProps) => {
  const elemRef = useRef<HTMLDivElement>(null);
  const [elemSize, setElemSize] = useState<DOMRect>();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"],
  );

  const posX = useTransform(x, [-0.5, 0.5], ["-10px", "10px"]);
  const posY = useTransform(y, [-0.5, 0.5], ["-10px", "10px"]);

  const posXSpring = useSpring(posX, {
    stiffness: 125,
    damping: 25,
    mass: 1,
  });
  const posYSpring = useSpring(posY, {
    stiffness: 125,
    damping: 25,
    mass: 1,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / rect.width - 0.5;
      const yPct = mouseY / rect.height - 0.5;

      x.set(xPct);
      y.set(yPct);
    },
    [x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={elemRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        scale: 0.9,
        rotateX,
        rotateY,
        x: posXSpring,
        y: posYSpring,
        transformStyle: "preserve-3d",
        transformPerspective: 400,
        zIndex: 1,
        padding: "2em",
        margin: "-2em",
      }}
      whileHover={{ scale: 1 }}
    >
      {children}
    </motion.div>
  );
};
