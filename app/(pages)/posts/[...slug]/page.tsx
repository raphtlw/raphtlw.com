import { getMDXComponents } from "@/app/mdx-components";
import { cn } from "@/lib/utils";
import {
  QUERY_ALL_POST_SLUGSResult,
  QUERY_SINGLE_POSTResult,
} from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { compileMDX } from "next-mdx-remote/rsc";
import { defineQuery } from "next-sanity";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const QUERY_ALL_POST_SLUGS = defineQuery(`*[_type == "post"] {
  "slug": slug.current
}`);

const QUERY_SINGLE_POST =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
    title,
    author,
    content
  }`);

export const generateStaticParams = async () => {
  const posts =
    await client.fetch<QUERY_ALL_POST_SLUGSResult>(QUERY_ALL_POST_SLUGS);

  return posts.map((post) => ({ params: { slug: post.slug.split("/") } }));
};

type Params = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: Params) {
  const { slug } = await params;

  const post: QUERY_SINGLE_POSTResult = await client.fetch(QUERY_SINGLE_POST, {
    slug: slug.join("/"),
  });

  const components = getMDXComponents({});

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight, rehypeSlug],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });

  // Render the page
  return (
    <main className="py-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>

        <article
          className={cn(
            "prose lg:prose-lg prose-stone dark:prose-invert prose-img:rounded-xl",
          )}
        >
          {content}
        </article>
      </div>
    </main>
  );
}
