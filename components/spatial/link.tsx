"use client";

import { StaggeredText } from "@/components/spatial/staggered-text";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export type ExternalLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: string;
  icon?: boolean;
  iconSize?: number;
};

export const ExternalLink = ({
  children,
  icon,
  iconSize = 12,
  className,
  ...props
}: ExternalLinkProps) => {
  return (
    <Link {...props}>
      <motion.span
        initial="initial"
        whileHover="hover"
        className={cn("md:inline-flex sm:hidden items-center", className)}
      >
        <StaggeredText reactToMouse>{children}</StaggeredText>
        {icon && (
          <motion.span
            variants={{
              initial: {
                x: 0,
                y: 0,
              },
              hover: {
                x: 2,
                y: -2,
              },
            }}
          >
            <ArrowUpRight size={iconSize} />
          </motion.span>
        )}
      </motion.span>

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
        className={cn(
          "sm:inline-flex md:hidden items-center touch-manipulation",
          className,
        )}
      >
        {children}
        {icon && <ArrowUpRight size={iconSize} />}
      </motion.span>
    </Link>
  );
};
