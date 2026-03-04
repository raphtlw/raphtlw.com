import { LinkButton } from "@/components/prose/link";
import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className={cn(
        "overflow-x-scroll snap-x snap-mandatory",
        "flex flex-row min-w-screen min-h-screen",
        "lg:grid lg:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "flex flex-col font-serif px-6 py-20 gap-5",
          "snap-start snap-always",
          "min-h-screen min-w-screen",
          "md:px-10",
          "lg:min-w-auto lg:min-h-auto",
          "lg:p-20 lg:border-white lg:border-2",
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
            Hello, I&apos;m a digital native, previously working for The Straits
            Times&rsquo; graphics team, helping produce multimedia content and
            data-driven stories.
          </p>

          <p>
            My time was meaningfully spent working on 9 projects,{" "}
            <Link className="underline" href="/portfolio">
              4 of which have been published so far.
            </Link>
          </p>

          <p>
            I&apos;ve been in software for 10 years now, ever since I learned
            Python very early on in my secondary school days.
            {/*I also love
          interaction&emdash;design, playing the guitar, and rock climbing.*/}
          </p>
        </main>

        <LinkButton href="/cv">Copy of my CV</LinkButton>

        <div className="flex flex-row justify-between lg:hidden">
          <p>Swipe left to see my posts</p>
          <motion.div
            animate={{
              x: [-10, -20, -10],
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
          "min-h-screen min-w-screen",
          "md:px-10",
          "lg:min-w-auto lg:min-h-auto",
          "lg:p-20",
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
              this post (fansipan)
            </LinkButton>
          </p>
        </main>
      </div>
    </div>
  );
}
