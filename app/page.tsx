import bento from "@/app/images/bento.gif";
import cv from "@/app/images/cv.gif";
import profile from "@/app/images/profile.jpeg";
import raphgptDemo from "@/app/images/raphgpt-demo.gif";
import { SpatialMaterial } from "@/components/spatial/material";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        <li className="mt-10">📍 status: currently looking for work.</li>
        <li>
          text me on{" "}
          <Link
            href="https://t.me/raphtlw"
            className="gap-2 items-center justify-center w-min underline"
          >
            Telegram
            <ArrowUpRight size={18} className="inline-block" />
          </Link>
          if you&apos;d like to work together.
        </li>
      </ul>

      <div className="flex flex-col gap-10 mt-16">
        <div className="flex flex-row items-center justify-between">
          <ArrowUpRight size={20} />
          <h2 className="font-medium">links</h2>
        </div>

        <Link href="https://t.me/raphgptbot">
          <SpatialMaterial
            className="rounded-xl px-4 py-2 flex flex-col gap-2"
            enableTap
            reactToMouse
          >
            <p className="font-bold">try raphGPT</p>
            <Image
              src={raphgptDemo}
              alt="raphGPT Preview"
              className="rounded-lg"
              unoptimized
            />
          </SpatialMaterial>
        </Link>

        <Link href="https://read.cv/raphtlw">
          <SpatialMaterial
            className="rounded-xl px-4 py-2 flex flex-col gap-2"
            enableTap
            reactToMouse
          >
            <p className="font-bold">read my cv</p>
            <Image
              src={cv}
              alt="CV Preview"
              className="rounded-lg"
              unoptimized
            />
          </SpatialMaterial>
        </Link>

        <Link href="https://bento.me/raphtlw">
          <SpatialMaterial
            className="rounded-xl px-4 py-2 flex flex-col gap-2"
            enableTap
            reactToMouse
          >
            <p className="font-bold">see my bento</p>
            <Image
              src={bento}
              alt="Bento Preview"
              className="rounded-lg"
              unoptimized
            />
          </SpatialMaterial>
        </Link>
      </div>
    </main>
  );
}
