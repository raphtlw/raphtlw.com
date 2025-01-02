"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "motion/react";
import { PropsWithChildren } from "react";

export type TextButtonProps = HTMLMotionProps<"button"> & PropsWithChildren<{}>;

export const TextButton = ({
  children,
  className,
  ...props
}: TextButtonProps) => {
  return (
    <motion.span
      whileTap={{
        opacity: 0.37,
        transition: {
          type: "spring",
          duration: 0.1,
        },
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 50,
      }}
      className={cn("inline-flex items-center touch-manipulation", className)}
      {...props}
    >
      {children}
    </motion.span>
  );
};
