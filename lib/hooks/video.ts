"use client";

import { cdnLink } from "@/lib/cdn";
import { useEffect, useRef, useState } from "react";

export const useLazyVideo = (src: string, alwaysPlay = false) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = video.defaultMuted;
      video.play().catch(() => {
        video.muted = true;
        video.play();
      });
    };

    const load = () => {
      if (!video.src) {
        setLoading(true);
        video.src = cdnLink(src);
        video.load();
      }
    };

    const unload = () => {
      video.pause();
      if (video.src) {
        video.removeAttribute("src");
        video.load();
      }
      setLoading(false);
    };

    const onCanPlay = () => setLoading(false);

    video.addEventListener("canplay", onCanPlay);

    if (alwaysPlay) {
      video.src = cdnLink(src);
      tryPlay();

      return () => {
        video.removeEventListener("canplay", onCanPlay);
        unload();
      };
    }

    const bufferObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? load() : unload()),
      {
        rootMargin: `${window.innerHeight}px 0px ${window.innerHeight * 3}px 0px`,
        threshold: 0,
      },
    );

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && video.src) {
          video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
            ? tryPlay()
            : video.addEventListener("canplay", tryPlay, { once: true });
        } else {
          video.removeEventListener("canplay", tryPlay);
          video.pause();
        }
      },
      { threshold: 0.8 },
    );

    bufferObserver.observe(video);
    playObserver.observe(video);

    return () => {
      bufferObserver.disconnect();
      playObserver.disconnect();
      video.removeEventListener("canplay", onCanPlay);
      unload();
    };
  }, [src, alwaysPlay]);

  return [ref, loading] as const;
};
