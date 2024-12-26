"use client";

import { HTMLMotionProps, motion } from "motion/react";

const STAGGER_CHAR = 0.115;
const STAGGER_WORD = 0.25;
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
  const text = children as string;

  return (
    <>
      <span className="sr-only">{children}</span>
      <motion.span
        initial="initial"
        whileHover={reactToMouse ? "hovered" : undefined}
        aria-hidden
        {...props}
      >
        {text.split(" ").map((word, wordIndex) => (
          <span className="inline-block" key={`${word}_${wordIndex}`}>
            <span
              className="relative inline-block whitespace-nowrap"
              style={{
                lineHeight: 0.75,
              }}
              key={`${word}_${wordIndex}`}
            >
              <span key={`${word}_${wordIndex}_above`}>
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
                      delay: STAGGER_CHAR * index + STAGGER_WORD * wordIndex,
                    }}
                    key={`${char}_${index}_above`}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span
                className="absolute inset-0"
                key={`${word}_${wordIndex}_below`}
              >
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
                      delay: STAGGER_CHAR * index + STAGGER_WORD * wordIndex,
                    }}
                    key={`${char}_${index}_below`}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </span>

            {text.length - 1 !== wordIndex && (
              <span
                className="inline-block"
                style={{
                  width: "0.25em",
                }}
                key={`${word}_${wordIndex}_spacer`}
              />
            )}
          </span>
        ))}
      </motion.span>
    </>
  );
};
