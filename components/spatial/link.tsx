"use client";

import { StaggeredText } from "@/components/spatial/staggered-text";
import { ClientOnly } from "@/components/utils/client-only";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { useMediaQuery } from "usehooks-ts";

export type ExternalLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: string;
  icon?: boolean;
  iconSize?: number;
};

export const ExternalLink = (props: ExternalLinkProps) => {
  return (
    <ClientOnly>
      <Inner {...props} />
    </ClientOnly>
  );
};

const Inner = ({
  children,
  icon,
  iconSize = 12,
  className,
  ...props
}: ExternalLinkProps) => {
  const isDesktop = useMediaQuery("(min-device-width: 768px)");

  return (
    <Link {...props}>
      {isDesktop ? (
        <motion.span
          initial="initial"
          whileHover="hover"
          className={cn("inline-flex items-center", className)}
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
          className={cn(
            "inline-flex items-center touch-manipulation",
            className,
          )}
        >
          {children}
          {icon && <ArrowUpRight size={iconSize} />}
        </motion.span>
      )}
    </Link>
  );
};
