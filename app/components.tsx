"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMemo } from "react";

export const StickyFooter = () => {
  const { scrollY } = useScroll();

  const windowHeight = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.innerHeight;
    }
  }, []);

  const opacity = useTransform(scrollY, [0, windowHeight ?? 800], [1, 0]);

  return (
    <motion.div
      className="flex flex-col font-sans fixed bottom-0 px-6 py-20 gap-4"
      style={{ opacity }}
    >
      <p className="text-sm dark:text-neutral-600 text-stone-400 font-light">
        This site does not contain AI generated content.
      </p>
    </motion.div>
  );
};
