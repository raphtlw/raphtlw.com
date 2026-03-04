import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export type LayoutProps = ComponentProps<"div"> & {
  scrollSnap?: boolean;
};

export default function Layout({
  className,
  children,
  scrollSnap,
}: LayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:items-center",
        scrollSnap && "h-screen overflow-y-scroll snap-y snap-mandatory",
        className,
      )}
    >
      <article
        className={cn(
          "prose font-serif prose-lg dark:prose-invert prose-stone",
          "prose-headings:font-headline prose-headings:font-extralight",
          "prose-a:in-prose-headings:font-bold",
          "prose-headings:scroll-mt-6",
          "prose-figure:font-sans",
          "p-4",
        )}
      >
        {children}
      </article>
    </div>
  );
}
