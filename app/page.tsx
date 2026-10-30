import { LinkButton } from "@/components/ui/button.client";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const description = "designer"

export const metadata: Metadata = {
  title: "raphael's space",
  description,
  metadataBase: new URL("https://raphtlw.com"),
  openGraph: {
    type: "website",
    url: "https://raphtlw.com",
    siteName: "raphael's space",
    title: "raphael's space",
    description,
    locale: "en_SG",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 627,
        type: "image/png",
        alt: "Raphael Tang",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@raphtlw",
    creator: "@raphtlw",
    title: "raphael's space",
    description,
    images: ["/opengraph-image.png"],
  },

  appleWebApp: {
    title: "raphael's space",
  },
};

export default function Home() {
  return (
    <div
      className={cn(
        "flex flex-col h-lvh w-lvw overscroll-none",
        "lg:items-center",
      )}
    >
      <div
        className={cn(
          "flex flex-col font-serif px-8 py-16 gap-5 h-svh",
          "lg:max-w-2xl lg:py-32",
        )}
      >
        <div
          className={cn(
            "flex flex-col font-serif gap-5",
            "snap-start snap-always",
          )}
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-thin font-headline">Raphael Tang</h1>
            <span
              lang="zh"
              className="tracking-widest text-stone-500 dark:text-stone-400"
            >
              陳樂宇
            </span>
          </div>
          <main className="flex flex-col gap-4">
            <p>
              I&apos;m currently serving my National Service in Singapore Civil Defence Force (SCDF). Previously, I
              interned at{" "}
              <LinkButton href="https://straitstimes.com" className="underline">
                The Straits Times
              </LinkButton>
              , producing content and data-driven stories. I&apos;ve been coding
              for 8 years.
            </p>

            {/*<p className="dark:text-stone-400">
              I am currently interested in:{" "}
              <span className="dark:text-stone-100 font-light">
                Interaction Design
              </span>
            </p>*/}

            <p>My time was meaningfully spent contributing to 7 projects,&nbsp;
              <LinkButton className="underline" href="/portfolio">
                which have been published.
              </LinkButton>
            </p>

            {/*<p>
              I also love interaction design, playing the guitar, and rock
              climbing.
            </p>*/}
          </main>

          {/*<div className="flex justify-between lg:hidden">
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
          </div>*/}
        </div>

        {/*<div
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
        </div>*/}

        <div className="flex-1"></div>

        <div className="flex flex-col gap-4 font-serif">
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
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex flex-col px-6 py-4 border-t w-full">
        <p className="font-sans text-sm dark:text-neutral-600 text-stone-400 font-light">
          This site does not contain AI generated content.
        </p>
      </div>
    </div>
  );
}
