"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { StaggeredText } from "./staggered-text";

export type ExternalLinkProps = ComponentProps<typeof Link> & {
  children: string;
  icon?: boolean;
  iconSize?: number;
};

export const ExternalLink = ({
  children,
  icon,
  iconSize = 12,
  ...props
}: ExternalLinkProps) => {
  const isDesktop = useMediaQuery("(min-device-width: 768px)");

  return (
    <Link {...props}>
      {isDesktop ? (
        <motion.div
          initial="initial"
          whileHover="hover"
          className="inline-flex items-center"
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
        </motion.div>
      ) : (
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
          className="inline-flex items-center touch-manipulation"
        >
          {children}
          {icon && <ArrowUpRight size={iconSize} />}
        </motion.span>
      )}
    </Link>
  );
};
