"use client";

import { animate } from "framer-motion/dom";
import { useEffect } from "react";

export const GracefulEntry = () => {
  useEffect(() => {
    animate(
      "* > div",
      {
        y: [40, 0],
        opacity: [0, 1],
        filter: ["blur(16px)", "blur(0px)"],
        scale: [0.95, 1],
      },
      {
        type: "spring",
        stiffness: 125,
        damping: 25,
        mass: 1,
      },
    );
  }, []);

  return <></>;
};
