import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export type LayoutProps = PropsWithChildren;

export function Layout({ children }: LayoutProps) {
  return (
    <main className="px-4 py-10 md:px-0 md:py-16">
      <article
        className={cn(
          "prose lg:prose-lg prose-stone dark:prose-invert prose-img:rounded-xl mx-auto",
        )}
      >
        {children}
      </article>
    </main>
  );
}
