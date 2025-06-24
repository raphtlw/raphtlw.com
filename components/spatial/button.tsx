"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "motion/react";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren, ReactElement } from "react";

export type TextButtonProps = HTMLMotionProps<"button"> & PropsWithChildren;

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

export type TappableLinkProps = LinkProps &
  PropsWithChildren<{
    icon: ReactElement;
  }>;

export const TappableLink = ({ children, ...props }: TappableLinkProps) => {
  return (
    <Link {...props}>
      <motion.li
        className="flex flex-row justify-between items-center py-2.5 px-4 -mx-4 rounded-lg"
        initial={{
          scale: 1,
          backgroundColor: "oklch(0.708 0 0 / 0%)",
        }}
        whileTap={{
          scale: 0.98,
          opacity: 0.6,
          backgroundColor: "oklch(0.708 0 0 / 20%)",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 16,
          mass: 0.4,
        }}
      >
        {children}
        {props.icon}
      </motion.li>
    </Link>
  );
};
