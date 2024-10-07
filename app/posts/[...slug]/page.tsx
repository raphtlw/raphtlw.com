import { useMDXComponents } from "@/app/mdx-components";
import { cn } from "@/lib/utils";
import { promises as fs } from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const CONTENT_PATH = "app/posts/content";

export const generateStaticParams = async () => {
  // Recursively list all files in the content directory
  const targets = await fs.readdir(path.join(process.cwd(), CONTENT_PATH), {
    recursive: true,
  });

  // Declare an empty array to store the files
  const files = [];

  for (const target of targets) {
    // If the target is a directory, skip it, otherwise add it to the files array
    if (
      (
        await fs.lstat(
          path.join(process.cwd(), CONTENT_PATH, target.toString()),
        )
      ).isDirectory()
    ) {
      continue;
    }
    files.push(target);
  }

  // Return the files array with the slug (filename without extension)
  return files.map((file) => ({
    slug: file.toString().replace(".mdx", "").split("/"),
  }));
};

type Params = {
  params: {
    slug: string[];
  };
};

export default async function Page({ params }: Params) {
  // Read the MDX file from the content source direectory
  const source = await fs.readFile(
    path.join(process.cwd(), CONTENT_PATH, params.slug.join("/")) + ".mdx",
    "utf-8",
  );

  // MDX accepts a list of React components
  const components = useMDXComponents({});

  // We compile the MDX content with the frontmatter, components, and plugins
  const { content, frontmatter } = await compileMDX<{
    title: string;
    description: string;
  }>({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight, rehypeSlug],
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: true,
    },
    components,
  });

  // Render the page
  return (
    <main className="flex flex-col px-10 gap-4">
      <h1 className="font-mono text-sm text-stone-400">{frontmatter.title}</h1>
      <p className="font-mono text-sm">{frontmatter.description}</p>

      <article
        className={cn(
          "prose lg:prose-xl prose-stone dark:prose-invert prose-img:rounded-xl",
        )}
      >
        {content}
      </article>
    </main>
  );
}
