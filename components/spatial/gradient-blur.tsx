import { cn } from "@/lib/utils";
import {
  CSSProperties,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";

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
  const getBlurStyle = useCallback(
    (index: number): CSSProperties => {
      const blurValue = 0.5 * Math.pow(2, index);
      const gradientStopDelta = 100 / count;
      const startPercentage = index * gradientStopDelta;
      const midPercentage = startPercentage + gradientStopDelta;
      const endPercentage = midPercentage + gradientStopDelta;

      const maskGradient = `linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) ${startPercentage}%,
        black ${midPercentage}%,
        black ${endPercentage}%,
        rgba(0, 0, 0, 0) ${endPercentage + 12.5}%
      )`;

      return {
        position: "absolute",
        inset: 0,
        zIndex: index + 1,
        WebkitBackdropFilter: `blur(${blurValue}px)`,
        backdropFilter: `blur(${blurValue}px)`,
        WebkitMask: maskGradient,
        mask: maskGradient,
      } as const;
    },
    [count],
  );

  const gradientBlurMaterial = useMemo(() => {
    return (
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
          <div key={i} style={getBlurStyle(i)}></div>
        ))}
      </div>
    );
  }, [count, getBlurStyle, size, where, children, z, props]);

  return children ? (
    <div {...props} className={cn("relative", props.className)}>
      {children}

      {gradientBlurMaterial}
    </div>
  ) : (
    gradientBlurMaterial
  );
};
