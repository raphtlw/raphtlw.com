"use client";

import { HTMLMotionProps, motion } from "framer-motion";

export type GracefulEntryProps = HTMLMotionProps<HTMLDivElement>;

export const GracefulEntry = ({ ...props }: GracefulEntryProps) => {
  return (
    <motion.div
      layout
      {...props}
      initial={{
        y: 60,
        opacity: 0,
        filter: "blur(16px)",
      }}
      animate={{
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
      }}
      transition={{
        type: "spring",
        stiffness: 125,
        damping: 25,
        mass: 1,
        delay: 1,
      }}
    />
  );
};
