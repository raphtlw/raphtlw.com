import "@/app/globals.css";

import type { Metadata } from "next";

import { Footer } from "@/app/(pages)/footer";
import { Header } from "@/app/(pages)/header";
import { GradientBlur } from "@/components/spatial/gradient-blur";
import { cn } from "@/lib/utils";
import { SanityLive } from "@/sanity/lib/live";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

const hankenSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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

        {children}

        <SanityLive />

        <Footer />

        <GradientBlur
          z={100}
          style={{ position: "fixed" }}
          count={6}
          size="16vh"
        />
      </body>
    </html>
  );
}
