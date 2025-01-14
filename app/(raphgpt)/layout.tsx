import "@/app/globals.css";

import type { Metadata } from "next";

import { Footer } from "@/app/(pages)/footer";
import { GradientBlur } from "@/components/spatial/gradient-blur";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";

const interSans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "variable",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "raphGPT",
  description: "raphGPT landing",
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
        interSans.variable,
        jetbrainsMono.variable,
        "antialiased",
        "scroll-smooth focus:scroll-auto",
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <body className={cn("dark")}>
        {children}

        <Footer />

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
