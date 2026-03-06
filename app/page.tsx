import { LinkButton } from "@/components/ui/button.client";
import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react";
import * as motion from "motion/react-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "raphael's space",
  description: "Bridging the gap between design and engineering",
  metadataBase: new URL("https://www.raphtlw.com"),
  openGraph: {
    type: "website",
    title: "raphael's space",
    description: "Bridging the gap between design and engineering",
    url: "https://www.raphtlw.com",
    siteName: "raphael's space",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "raphael's space",
    description: "Bridging the gap between design and engineering",
  },
};

export default function Home() {
  return (
    <div
      className={cn(
        "overflow-x-scroll snap-x snap-mandatory no-scrollbar",
        "flex flex-row min-w-screen min-h-dvh",
        "lg:grid lg:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "flex flex-col font-serif px-6 py-20 gap-5",
          "snap-start snap-always",
          "min-h-dvh min-w-screen",
          "md:px-10",
          "lg:min-w-auto lg:min-h-auto",
          "lg:p-20 lg:border-neutral-100 lg:border-2",
        )}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-light font-headline">Raphael Tang</h1>
          <span
            lang="zh"
            className="tracking-widest text-stone-500 dark:text-stone-400"
          >
            陳樂宇
          </span>
        </div>
        <main className="flex flex-col gap-3">
          <p>
            Bridging the gap between design and engineering. I previously worked
            for The Straits Times&rsquo; graphics team, helping produce
            multimedia content and data-driven stories.
          </p>

          {/*<p className="dark:text-stone-400">
            I am currently interested in:{" "}
            <span className="dark:text-stone-100 font-light">
              Interaction Design
            </span>
          </p>*/}

          <p>
            My time was meaningfully spent working on 9 projects,{" "}
            <LinkButton className="underline" href="/portfolio">
              4 of which have been published so far.
            </LinkButton>
          </p>

          <p>
            I&apos;ve been in software for 10 years now, ever since I learned
            Python very early on in my secondary school days.
            {/*I also love
          interaction&emdash;design, playing the guitar, and rock climbing.*/}
          </p>
        </main>
        <LinkButton href="/cv" external className="underline">
          Copy of my CV
        </LinkButton>
        <p>
          You can email me at{" "}
          <LinkButton
            href="mailto:hi@raphtlw.com?subject=Hi"
            className="underline"
          >
            hi@raphtlw.com
          </LinkButton>
          .
        </p>
        <div className="flex justify-between lg:hidden">
          <p>Swipe left to see my posts</p>
          <motion.div
            animate={{
              x: [-50, -80, -50],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          >
            <CircleIcon />
          </motion.div>
        </div>
        <div className="flex-1"></div>
        <p className="font-sans text-sm dark:text-neutral-600 text-stone-400 font-light">
          This site does not contain AI generated content.
        </p>
      </div>

      <div
        className={cn(
          "flex flex-col font-serif px-6 py-20 gap-5",
          "snap-start snap-always",
          "min-h-dvh min-w-screen",
          "md:px-10",
          "lg:min-w-auto lg:min-h-auto",
          "lg:p-20 lg:border-neutral-400 lg:border-y-2 lg:border-r-2",
        )}
        id="posts"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-light font-headline">Writing</h1>
        </div>

        <main className="flex flex-col gap-3">
          <p>
            Though not to be taken at face value, I believe everyone should own
            a space on the internet of their own.
          </p>

          <p>
            This space is special to me. I believe writing gives everyone an
            opportunity to be introspective of their own thinking.
          </p>

          <p>
            All of my posts will end up in searchable places anyway, so I
            don&apos;t need to list them all.
          </p>

          <p>
            For starters, I recommend checking out{" "}
            <LinkButton href="/posts/mount-fansipan-in-videos">
              this post
            </LinkButton>
          </p>
        </main>
      </div>
    </div>
  );
}
