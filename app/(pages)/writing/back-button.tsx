"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import { ChevronLeftIcon } from "lucide-react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [shown, setShown] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setShown(true);
    } else {
      setShown(false);
    }
  });

  useEffect(() => {
    setShown(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {shown && (
        <SpatialMaterial
          initial={{ opacity: 0, y: 10, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, y: 0, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, y: 10, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
          className="top-4 left-4 p-2 fixed rounded-full bg-neutral-900/10"
          enableTap
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          <ChevronLeftIcon />
        </SpatialMaterial>
      )}
    </AnimatePresence>
  );
};
