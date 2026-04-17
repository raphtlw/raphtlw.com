import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import {
  Barlow,
  Bricolage_Grotesque,
  DotGothic16,
  Fraunces,
  Instrument_Serif,
  Newsreader,
  Zen_Old_Mincho,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["200", "400", "500", "700"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const dotGothic = DotGothic16({
  variable: "--font-dot-gothic",
  weight: "400",
});

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  weight: ["400", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "raphael's space",
  description: "Raphael Tang",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          bricolage.variable,
          barlow.variable,
          instrument.variable,
          dotGothic.variable,
          zenOldMincho.variable,
          fraunces.variable,
          newsreader.variable,
          "antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
