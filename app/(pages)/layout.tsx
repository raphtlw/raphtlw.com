import "@/app/globals.css";

import type { Metadata } from "next";

import { Header } from "@/app/(pages)/header";
import { DraftModeComponents, ToolbarActions } from "@/components/misc/dev";
import { GradientBlur } from "@/components/spatial/gradient-blur";
import { cn } from "@/lib/utils";
import { SanityLive } from "@/sanity/lib/live";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <ToolbarActions />

        {children}

        <SanityLive />
        <DraftModeComponents />

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
