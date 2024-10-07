import profile from "@/app/images/profile.jpeg";
import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PreviewLink } from "./preview-link";

export default function Home() {
  return (
    <main className="flex flex-col px-10">
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

      <ul className="flex flex-col gap-4">
        <li className="mt-8 relative">
          looking to help in AI research as a self taught freelancer from
          singapore.
        </li>
        <li>
          experienced in multi-disciplinary productive applications with
          language models.
        </li>
        <li className="mt-10">📍 &nbsp; status: currently looking for work.</li>
        <li>
          💭 &nbsp; text me on{" "}
          <ExternalLink href="https://t.me/raphtlw" icon>
            Telegram
          </ExternalLink>{" "}
          if you&apos;d like to work together.
        </li>
      </ul>

      <div className="flex flex-col gap-8 mt-16">
        <div className="flex flex-row items-center justify-between">
          <ArrowUpRight size={20} />
          <h2 className="font-medium">links</h2>
        </div>

        <PreviewLink
          link="https://t.me/raphgptbot"
          title="try raphGPT"
          video="38219bcf592a29900b22df3c1e8d3070"
        />

        <PreviewLink
          link="https://read.cv/raphtlw"
          title="read my cv"
          video="e830ce8b35dbdb88e93f8a946512e755"
        />

        <PreviewLink
          link="https://bento.me/raphtlw"
          title="see my bento"
          video="243c1781f605abf0b9607cd754d1b108"
        />
      </div>
    </main>
  );
}
