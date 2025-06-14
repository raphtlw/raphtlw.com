import "@/app/globals.css";

import type { Metadata } from "next";

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
    <main className="dark">
      <section className="px-8 md:max-w-3xl mx-auto prose prose-neutral dark:prose-invert my-10">
        {children}
      </section>
    </main>
  );
}
