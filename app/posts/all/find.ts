import { Glob } from "bun";
import { compareAsc, parseISO } from "date-fns";
import { cacheTag } from "next/cache";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import * as z from "zod";

export const PostFrontmatter = z.object({
  title: z.string(),
  image: z.string().optional(),
  imagealt: z.string().optional(),
  pubdate: z.string(),
  readingTime: z.number(),
});

export const Post = z.object({
  slug: z.string(),
  frontmatter: PostFrontmatter,
});

export const processPost = async (slugPath: string) => {
  const file = await read(`./app/posts/${slugPath}`);
  matter(file);

  return {
    slug: slugPath.replace(/(\/page)?\.mdx$/, ""),
    frontmatter: PostFrontmatter.parse(file.data.matter),
  };
};

export const findPosts = async () => {
  "use cache";
  cacheTag("posts");

  const pageGlobber = new Glob("**/page.mdx");
  const pages = pageGlobber.scan("./app/posts");
  const posts: z.infer<typeof Post>[] = [];

  for await (const slugPath of pages) {
    posts.push(await processPost(slugPath));
  }

  posts.sort((a, b) =>
    compareAsc(
      parseISO(a.frontmatter.pubdate),
      parseISO(b.frontmatter.pubdate),
    ),
  );

  return posts;
};
