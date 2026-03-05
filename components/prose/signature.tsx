"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

const paths = [
  {
    d: "M4.14248 270.654C-7.31325 305.021 86.3204 265.872 93.785 221.087C101.475 174.947 30.3049 -9.24557 117.514 3.83597C214.997 18.4581 97.4757 153.064 25.2346 153.064C24.3429 153.064 21.1366 152.989 21.5433 150.955C31.9104 99.1211 189.003 206.509 202.41 216.341C290.222 280.736 452.203 340.546 539.888 235.324",
    duration: 2.4,
    delay: 0,
  },
  {
    d: "M181.318 152.009C175.181 139.736 157.937 165.639 156.007 170.465C151.246 182.368 159.959 191.863 171.826 183.648C207.163 159.184 158.18 139.083 195.028 173.629C202.112 180.27 211.452 182.183 220.339 178.375",
    duration: 0.9,
    delay: 1.6,
  },
  {
    d: "M216.648 149.373C216.648 169.866 221.393 190.768 221.393 211.595",
    duration: 0.3,
    delay: 2.4,
  },
  {
    d: "M216.911 176.002C214.021 166.456 215.203 136.737 234.576 148.846C250.796 158.984 220.731 188.618 216.911 176.002Z",
    duration: 0.55,
    delay: 2.65,
  },
  {
    d: "M247.232 101.388C247.232 72.2076 246.177 188.921 246.177 188.921C246.177 188.921 240.385 148.515 254.614 146.736C273.178 144.416 276.772 175.767 280.979 186.285",
    duration: 0.85,
    delay: 3.1,
  },
  {
    d: "M301.017 161.501C312.449 144.354 291.168 164.511 287.834 177.848C275.788 226.029 333.675 140.69 312.091 151.482C303.041 156.006 328.119 193.773 345.838 187.866",
    duration: 0.75,
    delay: 3.85,
  },
  {
    d: "M350.056 163.083C358.438 163.083 369.747 161.373 373.258 152.009C384.791 121.255 310.658 179.429 364.294 179.429C372.864 179.429 391.887 175.919 396.46 166.774",
    duration: 0.7,
    delay: 4.5,
  },
  {
    d: "M400.081 165.242L397.082 165.671",
    duration: 0.1,
    delay: 5.1,
  },
  {
    d: "M397.684 187.263C400.477 180.344 406.978 164.366 408.071 154.579C410.861 129.606 405.216 118.542 401.486 112.067C400.849 110.961 398.87 111.496 397.638 112.313C388.311 118.5 394.746 141.236 398.391 152.779C410.367 174.73 425.974 194.047 442.412 206.04C445.621 207.853 447.119 208.242 451.18 208.642",
    duration: 1.0,
    delay: 5.1,
  },
];

const penEase = [0.25, 0.1, 0.25, 1] as const;

export const Signature = ({ className = "", replay = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: !replay, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (replay) {
      controls.start("hidden");
    }
  }, [isInView, controls, replay]);

  return (
    <div ref={ref} className={className}>
      <svg
        className="aspect-[1.8378378378]"
        viewBox="0 0 544 296"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Animated signature"
      >
        {/* Ink bleed / depth filter */}
        <defs>
          <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g filter="url(#ink)">
          {paths.map((path, i) => (
            <motion.path
              key={i}
              d={path.d}
              stroke="currentColor"
              strokeWidth={i === 7 ? "6.34615" : i === 8 ? "6" : "6.34615"}
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    pathLength: {
                      delay: path.delay,
                      duration: path.duration,
                      ease: penEase,
                    },
                    opacity: {
                      delay: path.delay,
                      duration: 0.01,
                    },
                  },
                },
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
