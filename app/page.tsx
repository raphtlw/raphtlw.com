import bento from "@/app/images/bento.gif";
import cv from "@/app/images/cv.gif";
import profile from "@/app/images/profile.jpeg";
import raphgptDemo from "@/app/images/raphgpt-demo.gif";
import { SpatialMaterial } from "@/components/spatial/material";
import { ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col px-10">
      <div className="overflow-hidden w-32 h-32 flex items-center justify-center rounded-full">
        <Image src={profile} alt="Profile Photo" />
      </div>

      <div className="flex flex-row justify-between mt-6">
        <Link
          href="/"
          className="text-3xl lg:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
        >
          <h1>Raphael</h1>
        </Link>

        <Link
          href="mailto:hey@raphtlw.com"
          className="flex flex-row items-center gap-4"
        >
          <SpatialMaterial
            className="px-3 py-2 rounded-lg"
            reactToMouse
            enableTap
          >
            <div className="flex flex-row gap-4">
              <Mail opacity={0.9} />
              <span className="text-sm">Email Me</span>
            </div>
          </SpatialMaterial>
        </Link>
      </div>
      <p className="mt-8">
        started coding when i was 15. did freelance, liked the money but
        didn&apos;t enjoy the stress that came with it. did some working
        full-time staff in a local office. now i&apos;m sort of just wandering
        around.
      </p>
      <p>
        aside from school, i like to play the guitar and let myself loose in
        fred again&apos;s music.
      </p>

      <p className="mt-10">📍 status: currently looking for work.</p>

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
            <Image src={cv} alt="CV Preview" className="rounded-lg" />
          </SpatialMaterial>
        </Link>

        <Link href="https://bento.me/raphtlw">
          <SpatialMaterial
            className="rounded-xl px-4 py-2 flex flex-col gap-2"
            enableTap
            reactToMouse
          >
            <p className="font-bold">see my bento</p>
            <Image src={bento} alt="Bento Preview" className="rounded-lg" />
          </SpatialMaterial>
        </Link>
      </div>
    </main>
  );
}
