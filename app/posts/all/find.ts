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
});

export const Post = z.object({
  slug: z.string(),
  readingTime: z.number(),
  frontmatter: PostFrontmatter,
});

export const processPost = async (slugPath: string) => {
  const file = await read(`./app/posts/${slugPath}`);
  matter(file);

  const wordsPerMinute = 200;
  const content = String(file.value);
  const words = content.trim().split(/\s+/).length;

  return {
    slug: slugPath.replace(/(\/page)?\.mdx$/, ""),
    readingTime: Math.ceil(words / wordsPerMinute),
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
