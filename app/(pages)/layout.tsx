import "@/app/globals.css";

import type { Metadata } from "next";

import { Header } from "@/app/(pages)/header";
import { DisableDraftMode, LaunchAdminButton } from "@/components/misc/sanity";
import { GradientBlur } from "@/components/spatial/gradient-blur";
import { isDev } from "@/lib/env";
import { cn } from "@/lib/utils";
import { SanityLive } from "@/sanity/lib/live";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VisualEditing } from "next-sanity";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { draftMode } from "next/headers";

const hankenSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "raphtlw.com",
  description: "Raphael's home page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: draftModeEnabled } = await draftMode();

  return (
    <html
      lang="en"
      className={cn(
        hankenSans.variable,
        jetbrainsMono.variable,
        "antialiased",
        "scroll-smooth focus:scroll-auto",
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <body
        className={cn(
          "bg-[url(/pattern.svg)] bg-[center_top] bg-no-repeat dark",
        )}
      >
        <Header />

        <div className="fixed flex flex-row top-4 right-4">
          {isDev && (
            <LaunchAdminButton
              className={cn(!draftModeEnabled && "rounded-r-full")}
            />
          )}
          {draftModeEnabled && (
            <DisableDraftMode className={cn(!isDev && "rounded-l-full")} />
          )}
        </div>

        {children}

        <SanityLive />

        {draftModeEnabled && <VisualEditing />}

        <footer className="flex flex-col px-10 py-6 border-t border-slate-600 border-opacity-70">
          <p>
            Designed by <a href="https://bento.me/raphtlw">@raphtlw</a> &copy;
            2024.
          </p>
        </footer>

        <GradientBlur
          z={100}
          style={{ position: "fixed" }}
          count={6}
          size="16vh"
        />

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
