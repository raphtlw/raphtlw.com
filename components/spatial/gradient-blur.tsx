import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren, useCallback, useMemo } from "react";

const commonTw = "absolute inset-0";

export type GradientBlurProps = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    count?: number;
    size?: string;
    where?: "top" | "bottom" | "left" | "right";
    asChild?: boolean;
    z?: number;
  }>;

export const GradientBlur = ({
  z = 5,
  count = 8,
  size = "65%",
  where = "bottom",
  children,
  asChild,
  ...props
}: GradientBlurProps) => {
  const getBlurStyle = useCallback((index: number) => {
    const blurValue = 0.5 * Math.pow(2, index);
    const startPercentage = index * 12.5;
    const midPercentage = startPercentage + 12.5;
    const endPercentage = midPercentage + 12.5;

    const maskGradient = `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) ${startPercentage}%,
      black ${midPercentage}%,
      black ${endPercentage}%,
      rgba(0, 0, 0, 0) ${endPercentage + 12.5}%
    )`;

    return {
      zIndex: index + 1,
      WebkitBackdropFilter: `blur(${blurValue}px)`,
      backdropFilter: `blur(${blurValue}px)`,
      WebkitMask: maskGradient,
      mask: maskGradient,
    };
  }, []);

  const gradientBlurMaterial = useMemo(() => {
    return (
      <div
        {...(asChild && props)}
        className={cn(
          `absolute z-[${z}] inset-0 pointer-events-none`,
          where === "top" && `bottom-auto h-[${size}]`,
          where === "bottom" && `top-auto h-[${size}]`,
          where === "left" && `right-auto w-[${size}]`,
          where === "right" && `left-auto w-[${size}]`,
          asChild && props.className,
        )}
      >
        {[...Array(count)].map((_, i) => (
          <div
            className={cn(
              commonTw,
              `backdrop-blur backdrop-blur-[${0.25 * Math.pow(2, i)}px]`,
            )}
            key={i}
            style={getBlurStyle(z + i + 1)}
          ></div>
        ))}
      </div>
    );
  }, [count, getBlurStyle, size, where, asChild, z, props]);

  return asChild ? (
    gradientBlurMaterial
  ) : (
    <div {...props} className={cn("relative", props.className)}>
      {children}

      {gradientBlurMaterial}
    </div>
  );
};
