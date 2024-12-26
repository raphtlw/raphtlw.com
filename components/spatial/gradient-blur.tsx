"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { HTMLAttributes, PropsWithChildren } from "react";

const HIDE_THRESHOLD = 0.8;

export type GradientBlurProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    count?: number;
    size?: string;
    where?: "top" | "bottom" | "left" | "right";
    z?: number;
  }>;

export const GradientBlur = ({
  z = 5,
  count = 8,
  size = "65%",
  where = "bottom",
  children,
  ...props
}: GradientBlurProps) => {
  const { scrollYProgress } = useScroll();
  const blurMultiplier = useTransform(
    scrollYProgress,
    [HIDE_THRESHOLD, 1],
    [1, 0],
  );

  const GradientBlurSegment = ({ index }: { index: number }) => {
    const originalBlurValue = useMotionValue(0.5 * Math.pow(2, index));
    const blurValue = useTransform<number, number>(
      [blurMultiplier, originalBlurValue],
      ([multiplier, value]) => multiplier * value,
    );

    const gradientStopDelta = 100 / count;
    const startPercentage = index * gradientStopDelta;
    const midPercentage = startPercentage + gradientStopDelta;
    const endPercentage = midPercentage + gradientStopDelta;

    const backdropFilter = useMotionTemplate`blur(${blurValue}px)`;
    const maskGradient = `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) ${startPercentage}%,
      black ${midPercentage}%,
      black ${endPercentage}%,
      rgba(0, 0, 0, 0) ${endPercentage + 12.5}%
    )`;

    return (
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: index + 1,
          WebkitBackdropFilter: backdropFilter,
          backdropFilter,
          WebkitMask: maskGradient,
          mask: maskGradient,
        }}
      />
    );
  };

  const gradientBlurMaterial = (
    <div
      {...(!children && props)}
      style={{
        position: "absolute",
        zIndex: z,
        inset: `${where === "bottom" ? "auto" : "0"} ${where === "left" ? "auto" : "0"} ${where === "top" ? "auto" : "0"} ${where === "right" ? "auto" : "0"}`,
        ...(where === "top" || where === "bottom"
          ? { height: size }
          : { width: size }),
        pointerEvents: "none",

        ...(!children && props.style),
      }}
    >
      {[...Array(count)].map((_, i) => (
        <GradientBlurSegment key={i} index={i} />
      ))}
    </div>
  );

  return children ? (
    <div {...props} className={cn("relative", props.className)}>
      {children}

      {gradientBlurMaterial}
    </div>
  ) : (
    gradientBlurMaterial
  );
};
