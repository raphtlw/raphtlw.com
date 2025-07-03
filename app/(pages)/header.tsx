"use client";

import icon from "@/app/icon.png";

import { navigationLinks } from "@/app/navigation";
import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="w-full md:max-w-screen-md px-6 pt-10 sticky top-0 z-30 mx-auto hidden md:block">
      <SpatialMaterial
        className={cn(
          "flex flex-row items-center rounded-full px-4 py-4",
          "bg-slate-400 bg-opacity-10 backdrop-filter backdrop-blur-2xl",
          "border-t border-b border-t-slate-500 border-b-black border-opacity-50",
        )}
        initial={{ y: -160 }}
        animate={{ y: 0 }}
      >
        <Link href="/" className="rounded-full overflow-hidden">
          <Image src={icon} alt="Icon" width={36} height={36} />
        </Link>

        <div className="flex-1"></div>

        <nav className="flex gap-4 px-4">
          {navigationLinks.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </nav>
      </SpatialMaterial>
    </header>
  );
};
