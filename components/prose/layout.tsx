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
    <div className={cn("grid grid-cols-1 md:place-items-center", className)}>
      <article
        className={cn(
          "prose font-serif prose-lg dark:prose-invert prose-stone",
          "prose-headings:font-headline prose-headings:font-extralight",
          "prose-a:in-prose-headings:font-bold",
          "prose-h1:mt-6 prose-headings:scroll-mt-6",
          "prose-figure:font-sans",
          "*:px-4 prose-ol:ml-4",
          scrollSnap &&
            "h-screen overflow-y-scroll snap-y snap-mandatory overscroll-none",
          scrollSnap && "prose-headings:snap-always prose-headings:snap-start",
        )}
      >
        {children}
      </article>
    </div>
  );
}
