import { rehypePrettyCodeOptions } from "@/lib/rehype/pretty-code";
import { useMDXComponents } from "@/mdx-components";
import fs from "fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const CONTENT_PATH = "content";

export const getAllPosts = async (folder: string) => {
  // Recursively list all files in the content directory
  const targets = await fs.readdir(
    path.join(process.cwd(), CONTENT_PATH, folder),
    {
      recursive: true,
    },
  );

  // Exclude all directories and typescript files
  const files = targets.filter((target) => target.endsWith(".mdx"));

  // Return the files array with the slug (filename without extension)
  return files.map((file) => ({
    slug: file.toString().replace(".mdx", "").split("/"),
  }));
};

export const getPost = async <Frontmatter>(folder: string, slug: string[]) => {
  // Read the MDX file from the content source directory
  const filePath =
    path.join(process.cwd(), CONTENT_PATH, folder, ...slug) + ".mdx";
  const source = await fs.readFile(filePath, "utf-8");

  // Get the file metadata
  const metadata = await fs.stat(filePath);

  // MDX accepts a list of React components
  const components = useMDXComponents({});

  // We compile the MDX content with the frontmatter, components, and plugins
  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, rehypePrettyCodeOptions],
        ],
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: true,
    },
    components,
  });

  return { metadata, content, frontmatter, slug: slug.join("/") } as const;
};
