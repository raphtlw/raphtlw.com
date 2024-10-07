"use client";

import { HTMLMotionProps, motion } from "framer-motion";

const STAGGER = 0.115;
const FADE_BLUR = 10;

export type StaggeredTextProps = HTMLMotionProps<"div"> & {
  children: string | string[];
  reactToMouse?: boolean;
};

export const StaggeredText = ({
  children,
  reactToMouse,
  ...props
}: StaggeredTextProps) => {
  const textArray = Array.isArray(children) ? children : [children];

  return (
    <>
      <span className="sr-only">{children}</span>
      <motion.div
        initial="initial"
        whileHover={reactToMouse ? "hovered" : undefined}
        aria-hidden
        {...props}
      >
        {textArray.map((line, index) => (
          <div key={`${line}_${index}`}>
            {line.split(" ").map((word, index) => (
              <div
                className="relative block whitespace-nowrap"
                style={{
                  lineHeight: 0.75,
                }}
                key={`${word}_${index}`}
              >
                <div key={`${word}_above`}>
                  {word.split("").map((char, index) => (
                    <motion.span
                      className="inline-block"
                      style={{
                        transformStyle: "preserve-3d",
                        transformPerspective: 400,
                      }}
                      variants={{
                        initial: {
                          y: 0,
                          rotateX: 0,
                          opacity: 1,
                          filter: "none",
                        },
                        hovered: {
                          y: "-100%",
                          rotateX: 90,
                          opacity: 0,
                          filter: `blur(${FADE_BLUR}px)`,
                        },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 50,
                        delay: STAGGER * index,
                      }}
                      key={`${char}_${index}_above`}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="absolute inset-0" key={`${word}_below`}>
                  {word.split("").map((char, index) => (
                    <motion.span
                      className="inline-block"
                      style={{
                        transformStyle: "preserve-3d",
                        transformPerspective: 400,
                      }}
                      variants={{
                        initial: {
                          y: "100%",
                          rotateX: -90,
                          opacity: 0,
                          filter: `blur(${FADE_BLUR}px)`,
                        },
                        hovered: {
                          y: 0,
                          rotateX: 0,
                          opacity: 1,
                          filter: "none",
                        },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 50,
                        delay: STAGGER * index,
                      }}
                      key={`${char}_${index}_below`}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </>
  );
};
