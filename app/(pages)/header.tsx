"use client";

import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import icon from "@/app/icon.png";
import { navigationLinks } from "@/app/navigation";
import { TextButton } from "@/components/spatial/button";
import { Separator } from "@/components/ui/separator";
import { ClientOnly } from "@/components/utils/client-only";
import { useMediaQuery, useWindowSize } from "@uidotdev/usehooks";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const Header = () => (
  <ClientOnly>
    <Inner />
  </ClientOnly>
);

const Inner = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { scrollY, scrollYProgress } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  useMotionValueEvent(scrollY, "change", (current) => {
    const diff = current - scrollY.getPrevious();
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  const router = useRouter();

  if (isDesktop) {
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

          <nav className="flex gap-4">
            {navigationLinks.map((link) => (
              <ExternalLink key={link.href} href={link.href}>
                {link.label}
              </ExternalLink>
            ))}
          </nav>
        </SpatialMaterial>
      </header>
    );
  } else {
    const pathname = usePathname();
    const windowSize = useWindowSize();
    const [hide, setHide] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
      if (document.querySelector("main").clientHeight >= windowSize.height) {
        setHide(current === 1);
      }
    });

    return (
      <motion.div
        className="w-full px-6 pt-10 fixed left-0 z-[200]"
        initial={{ bottom: "1.5rem" }}
        animate={
          scrollDirection === "up" && {
            bottom: "1rem",
          }
        }
        layout
      >
        <SpatialMaterial
          layout
          className={cn(
            "flex flex-row items-center gap-4 rounded-full px-4 py-2",
          )}
          animate={
            hide
              ? {
                  y: 60,
                }
              : { y: 0 }
          }
        >
          <AnimatePresence>
            {scrollDirection === "up" ? (
              <>
                <TextButton
                  onTap={() => router.push("/")}
                  className="rounded-full overflow-hidden"
                  style={
                    scrollDirection === "up" ? { opacity: 1 } : { opacity: 0 }
                  }
                  layout
                >
                  <Image src={icon} alt="Icon" width={32} height={32} />
                </TextButton>

                <Separator
                  orientation="vertical"
                  className="h-4 bg-slate-600 opacity-50"
                />

                <nav className="flex flex-row gap-4 flex-1 justify-around">
                  {navigationLinks.map((link) => (
                    <TextButton
                      key={link.href}
                      onTap={() => router.push(link.href)}
                      className="flex flex-col items-center"
                      style={
                        scrollDirection === "up"
                          ? { opacity: 1 }
                          : { opacity: 0 }
                      }
                      layout
                    >
                      <AnimatePresence>
                        {pathname === link.href ? (
                          <motion.div
                            className={cn(
                              "flex rounded-full py-1 px-4 -mx-4 bg-slate-600 bg-opacity-20 backdrop-filter backdrop-blur-lg",
                            )}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            layout
                          >
                            {link.icon}
                          </motion.div>
                        ) : (
                          <div className={cn("flex rounded-full py-1")}>
                            {link.icon}
                          </div>
                        )}
                      </AnimatePresence>
                      <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-16">
                        {link.label}
                      </span>
                    </TextButton>
                  ))}
                </nav>
              </>
            ) : (
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  className={cn(
                    "h-1 rounded-full bg-slate-400 opacity-30",
                    "inline-flex items-center touch-manipulation",
                  )}
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
                    damping: 30,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: 50 }}
                  onTap={() => setScrollDirection("up")}
                />
              </div>
            )}
          </AnimatePresence>
        </SpatialMaterial>
      </motion.div>
    );
  }
};
