import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_AUTHOR } from "@/sanity/lib/queries";
import { ComponentProps, PropsWithChildren } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

export type BlogHeaderProps = ComponentProps<"header"> & {
  title: string;
  authorSlug: string;
};

export async function BlogHeader({
  title,
  authorSlug,
  ...props
}: BlogHeaderProps) {
  const { data: author } = await sanityFetch({
    query: QUERY_AUTHOR,
    params: {
      slug: authorSlug,
    },
  });

  return (
    <header
      {...props}
      className="mt-10 flex flex-col gap-4 md:max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <div className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.imageUrl} />
          <AvatarFallback>
            {authorSlug.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm text-slate-200 font-medium">{author.name}</p>
          <p className="text-sm text-accent">@{authorSlug}</p>
        </div>
      </div>
    </header>
  );
}
