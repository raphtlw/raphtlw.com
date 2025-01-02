import profile from "@/app/images/profile.jpeg";

import { PreviewLink } from "@/app/(pages)/components";
import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { LINKS_QUERYResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { LINKS_QUERY } from "@/sanity/lib/queries";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

            <h2 className="text-sm font-mono">Software Developer</h2>

            <div className="flex mt-4">
              <Link
                href="mailto:hey@raphtlw.com"
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
          <li className="mt-8 relative">
            currently building experience working in a fast-paced
            robotics/coding teaching school.
          </li>
          <li>
            experienced in delivering productive applications with large
            language models.
          </li>
          <SpatialMaterial className="grid grid-cols-2 rounded-lg">
            <div className="flex flex-col py-2 px-4 border-r">
              <p>status</p>
            </div>
            <div className="flex flex-col py-2 px-4">
              <p>working 👨🏻‍💻</p>
            </div>
          </SpatialMaterial>
          <li>
            💭 &nbsp; text me on{" "}
            <ExternalLink href="https://t.me/raphtlw" icon>
              Telegram
            </ExternalLink>
          </li>
        </ul>
      </section>

      <section className="px-8 md:max-w-3xl mx-auto mt-8">
        <div className="flex flex-col gap-8 mt-16">
          <div className="flex flex-row items-center justify-between">
            <ArrowUpRight size={20} />
            <h2 className="font-medium">links</h2>
          </div>

          {links.map((link) => (
            <PreviewLink externalLink={link} key={link.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
