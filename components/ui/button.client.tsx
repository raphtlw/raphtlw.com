"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import { motion } from "motion/react";
import NextLink from "next/link";
import { ComponentProps } from "react";

const Link = motion.create(NextLink);

export type LinkButtonProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
};

export const LinkButton = ({
  children,
  external,
  className,
  href = "#",
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1"
      whileHover="hovered"
      whileTap="hovered"
      initial="rest"
    >
      <motion.span
        className={cn("inline-flex items-center", className)}
        initial={{
          opacity: 1,
          filter: "brightness(1)",
          transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        whileTap={{
          opacity: 0.4,
          filter: "brightness(1.2)",
          transition: { duration: 0.02, ease: "linear" },
        }}
      >
        {children}
      </motion.span>

      {external && (
        <motion.span
          variants={{
            rest: { x: 2, y: -2 },
            hovered: { x: 4, y: -4 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ArrowUpRightIcon size={14} />
        </motion.span>
      )}
    </Link>
  );
};
