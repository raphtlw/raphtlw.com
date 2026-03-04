import { processPost } from "@/app/posts/all/find";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { ComponentProps, Suspense } from "react";

export type ArticleMetaProps = ComponentProps<"div"> & {
  slug: string;
};

export const ArticleMetaFromPost = async ({
  slug,
  className,
  ...props
}: ArticleMetaProps) => {
  const post = await processPost(slug);

  return (
    <div
      className={cn("not-prose text-base flex flex-col gap-1", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "inline-flex flex-row gap-1",
          "text-stone-600 active:brightness-150",
          "dark:text-stone-400 dark:active:text-stone-100",
        )}
      >
        <p>{format(parseISO(post.frontmatter.pubdate), "MMMM yyy")}</p>
        {`–`}
        <p>Raphael Tang</p>
      </Link>

      <p className="text-sm text-stone-600 dark:text-stone-400">
        {post.readingTime} min. read
      </p>
    </div>
  );
};

export const ArticleMeta = (props: ArticleMetaProps) => {
  return (
    <Suspense fallback={<>Loading</>}>
      <ArticleMetaFromPost {...props} />
    </Suspense>
  );
};
