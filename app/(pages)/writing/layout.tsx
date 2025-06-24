import "@/app/globals.css";

import { BackButton } from "@/app/(pages)/writing/components";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | raphtlw.com",
  description: "Raphael's blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="dark">
      <BackButton />
      <section className="px-8 md:max-w-3xl mx-auto prose prose-neutral dark:prose-invert my-10">
        {children}
      </section>
    </main>
  );
}
