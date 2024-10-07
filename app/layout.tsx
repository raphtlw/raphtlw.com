import { ThemeProvider } from "@/components/provider/theme";
import { GradientBlur } from "@/components/spatial/gradient-blur";
import { ExternalLink } from "@/components/spatial/link";
import { SpatialMaterial } from "@/components/spatial/material";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import icon from "./icon.png";

const hankenSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
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
        syne.variable,
        "antialiased",
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <body
        className={cn(
          "flex flex-col md:items-center",
          "bg-[url(/pattern.svg)] bg-[center_top] bg-no-repeat dark",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="w-full md:max-w-screen-md px-6 pt-10 sticky top-0 z-30">
            <SpatialMaterial
              className={cn(
                "flex flex-row items-center rounded-full px-6 py-4",
                "bg-slate-400 bg-opacity-10 backdrop-filter backdrop-blur-2xl",
                "border-t border-b border-t-slate-500 border-b-black border-opacity-50",
              )}
              initial={{ y: -160 }}
              animate={{ y: 0 }}
            >
              <Link href="/" className="rounded-full overflow-hidden">
                <Image src={icon} alt="Icon" width={32} height={32} />
              </Link>
              <div className="flex-1"></div>
              <nav className="flex gap-4">
                <ExternalLink href="/posts/freelancing">work</ExternalLink>
                <ExternalLink href="/posts">writing</ExternalLink>
                <ExternalLink href="/posts/photography">
                  photography
                </ExternalLink>
              </nav>
            </SpatialMaterial>
          </header>
          <div className="py-10 md:max-w-screen-md">{children}</div>
          <footer className="flex flex-col px-10 py-6 border-t border-slate-600 border-opacity-70">
            <p>
              Designed by <a href="https://bento.me/raphtlw">@raphtlw</a> &copy;
              2024.
            </p>
          </footer>
        </ThemeProvider>

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
