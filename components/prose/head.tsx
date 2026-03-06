import { PostFrontmatter } from "@/app/posts/all/find";
import { LinkButton } from "@/components/ui/button.client";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ComponentProps } from "react";
import * as z from "zod";

export type ArticleMetaProps = ComponentProps<"div"> & {
  frontmatter: z.infer<typeof PostFrontmatter>;
};

export const ArticleMeta = ({
  frontmatter,
  className,
  ...props
}: ArticleMetaProps) => (
  <div
    className={cn("not-prose text-base flex flex-col gap-1", className)}
    {...props}
  >
    <LinkButton
      href="/"
      className={cn(
        "inline-flex flex-row gap-1 underline",
        "text-stone-600",
        "dark:text-stone-400",
      )}
    >
      <p>{format(parseISO(frontmatter.pubdate), "MMMM yyy")}</p>
      {`–`}
      <p>Raphael Tang</p>
    </LinkButton>

    <p className="text-sm text-stone-600 dark:text-stone-400">
      {frontmatter.readingTime ?? 0} min. read
    </p>
  </div>
);
