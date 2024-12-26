import { getMDXComponents } from "@/app/mdx-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import {
  QUERY_ALL_POST_SLUGSResult,
  QUERY_SINGLE_POSTResult,
} from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { format } from "date-fns";
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
    content,
    publishedAt,
    "author": {
      "name": author->name,
      "slug": author->slug,
      "image": author->image,
    }
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
    <main className="py-20 md:py-40">
      <BackButton className="fixed top-[10vh] left-[5vw]" />

      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-slate-400">
            {format(new Date(post.publishedAt), "EEEE, MMMM d, yyyy")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

          <div className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={urlFor(post.author.image).url()} />
              <AvatarFallback>
                {post.author.slug.current.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-slate-200 font-medium">
                {post.author.name}
              </p>
              <p className="text-sm text-[#00FFB2]">
                @{post.author.slug.current}
              </p>
            </div>
          </div>
        </div>

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
