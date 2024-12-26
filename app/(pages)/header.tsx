"use client";

import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import icon from "@/app/icon.png";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ClientOnly } from "@/components/utils/client-only";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@uidotdev/usehooks";
import { motion } from "motion/react";

export const Header = () => (
  <ClientOnly>
    <Inner />
  </ClientOnly>
);

const Inner = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className="w-full md:max-w-screen-md px-6 pt-10 sticky top-0 z-30 mx-auto">
      <SpatialMaterial
        className={cn(
          "flex flex-row items-center rounded-full px-6 py-4",
          "bg-slate-400 bg-opacity-10 backdrop-filter backdrop-blur-2xl",
          "border-t border-b border-t-slate-500 border-b-black border-opacity-50",
        )}
        initial={{ y: -160 }}
        animate={{ y: 0 }}
      >
        <Link href="/" className="rounded-full overflow-hidden">
          <Image src={icon} alt="Icon" width={32} height={32} />
        </Link>

        <div className="flex-1"></div>

        {!isDesktop && (
          <Sheet>
            <SheetTrigger>
              <motion.div
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
                className="flex items-center touch-manipulation"
              >
                <HamburgerMenuIcon className="w-6 h-6 mr-2" />
              </motion.div>
            </SheetTrigger>
            <SheetContent className="bg-background">
              <SheetHeader>
                <SheetTitle>raphtlw.com</SheetTitle>
                <SheetDescription>
                  Check out my writing, photography, and more.
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-4 mt-16">
                <ExternalLink href="/posts/freelancing">
                  Need a website?
                </ExternalLink>
                <ExternalLink href="/posts">writing</ExternalLink>
                <ExternalLink href="/posts/photography">
                  photography
                </ExternalLink>
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {isDesktop && (
          <nav className="flex gap-4">
            <ExternalLink href="/posts/freelancing">
              Need a website?
            </ExternalLink>
            <ExternalLink href="/posts">writing</ExternalLink>
            <ExternalLink href="/posts/photography">photography</ExternalLink>
          </nav>
        )}
      </SpatialMaterial>
    </header>
  );
};
