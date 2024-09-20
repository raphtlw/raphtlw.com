import { PropsWithChildren } from "react";

export type GradientBlurProps = PropsWithChildren;

export const GradientBlur = ({ children }: GradientBlurProps) => {
  return (
    <div>
      {children}{" "}
      <div
        style={{
          position: "fixed",
          inset: "auto 0 0 0",
          height: "65%",
          pointerEvents: "none",
        }}
        className="before:absolute before:inset-0 after:absolute after:inset-0"
      >
        <div style={{ position: "absolute", inset: 0 }}></div>
      </div>
    </div>
  );
};
