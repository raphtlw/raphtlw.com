import profile from "@/app/images/profile.jpeg";

import { BookingScheduler, PreviewLink } from "@/app/(pages)/components";
import { SpotifyNowPlaying } from "@/components/misc/spotify";
import { TappableLink } from "@/components/spatial/button";
import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileOnly } from "@/components/utils/mobile-only";
import { client } from "@/sanity/lib/client";
import { LINKS_QUERY } from "@/sanity/lib/queries";
import { LINKS_QUERYResult } from "@/sanity/types";
import { ArrowUpRight, LinkIcon, NotebookPenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  const links = await client.fetch<LINKS_QUERYResult>(LINKS_QUERY);

  return (
    <main className="py-10 md:py-20">
      <section className="px-8 md:max-w-3xl mx-auto">
        <div className="flex gap-8">
          <div className="overflow-hidden w-28 h-28 flex items-center justify-center rounded-full">
            <Image src={profile} alt="Profile Photo" />
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="mt-8 text-xl lg:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
            >
              <h1>Raphael Tang</h1>
            </Link>

            <h2 className="text-sm font-mono">Fullstack Developer</h2>

            <div className="flex mt-4">
              <Link
                href="mailto:hi@raphtlw.com"
                className="flex flex-row items-center gap-4"
              >
                <SpatialMaterial
                  className="px-3 py-2 rounded-lg"
                  reactToMouse
                  enableTap
                >
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <span>email me</span>
                    <ArrowUpRight opacity={0.8} size={20} />
                  </div>
                </SpatialMaterial>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 md:max-w-3xl mx-auto">
        <ul className="flex flex-col gap-4">
          <li className="mt-8 relative">hi everyone</li>
          <li>
            💭 &nbsp; text me on{" "}
            <ExternalLink href="https://t.me/raphtlw" icon>
              Telegram
            </ExternalLink>
          </li>
          <li>
            <BookingScheduler />
          </li>
        </ul>
      </section>

      <MobileOnly>
        <section className="px-8 md:max-w-3xl mx-auto mt-8">
          <ul className="flex flex-col gap-2">
            <TappableLink href="/writing" icon={<NotebookPenIcon size={16} />}>
              <span>Read about my thoughts</span>
            </TappableLink>

            <TappableLink
              href="https://instagram.com/raphtlw"
              icon={<LinkIcon size={16} />}
            >
              <span>Photos I've taken over the years</span>
            </TappableLink>
          </ul>
        </section>
      </MobileOnly>

      <section className="px-8 md:max-w-3xl mx-auto mt-8">
        <div className="flex flex-col gap-8 mt-16">
          <div className="flex flex-row items-center justify-between">
            <ArrowUpRight size={20} />
            <h2 className="font-medium">links</h2>
          </div>

          {links.map((link) => (
            <PreviewLink externalLink={link} key={link._id} />
          ))}
        </div>
      </section>

      <section className="px-8 md:max-w-3xl mx-auto mt-20">
        <Suspense
          fallback={<Skeleton className="h-[1.2em] w-[200px] rounded-full" />}
        >
          <SpotifyNowPlaying />
        </Suspense>
      </section>
    </main>
  );
}
