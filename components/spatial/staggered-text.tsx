"use client";

import { motion, Variants } from "framer-motion";

export type StaggeredTextProps = {
  text: string | string[];
};

const defaultAnimations: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 20,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    rotateX: 0,
  },
};

export const StaggeredText = ({ text }: StaggeredTextProps) => {
  const textArray = Array.isArray(text) ? text : [text];

  return (
    <div>
      <span className="sr-only">{text}</span>
      <motion.span
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        aria-hidden
      >
        {textArray.map((line, index) => (
          <span className="block" key={index}>
            {line.split(" ").map((word, index) => (
              <span className="inline-block" key={index}>
                {word.split("").map((char, index) => (
                  <motion.span
                    className="inline-block text-3xl font-bold"
                    style={{ transformStyle: "preserve-3d" }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 40,
                    }}
                    variants={defaultAnimations}
                    key={index}
                  >
                    {char}
                  </motion.span>
                ))}
                <span className="inline-block">&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </div>
  );
};
