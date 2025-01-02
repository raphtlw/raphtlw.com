import { getMDXComponents } from "@/app/mdx-components";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import { QUERY_ALL_RECIPE_SLUGSResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  QUERY_ALL_RECIPE_SLUGS,
  QUERY_SINGLE_RECIPE,
} from "@/sanity/lib/queries";
import { format } from "date-fns";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const generateStaticParams = async () => {
  const recipes = await client.fetch<QUERY_ALL_RECIPE_SLUGSResult>(
    QUERY_ALL_RECIPE_SLUGS,
  );

  return recipes.map((recipe) => ({
    params: { slug: recipe.slug.split("/") },
  }));
};

type Params = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: Params) {
  const { data: recipe } = await sanityFetch({
    query: QUERY_SINGLE_RECIPE,
    params: {
      slug: (await params).slug.join("/"),
    },
  });

  if (!recipe) {
    return notFound();
  }

  const components = getMDXComponents({});

  const { content } = await compileMDX({
    source: recipe.content,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeSlug, rehypePrettyCode],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });

  // Render the page
  return (
    <main className="py-10 md:py-40">
      <div className="flex px-6">
        <BackButton className="md:fixed md:top-[10vh] md:left-[5vw]" />
      </div>

      <div className="px-6 pt-6 md:pt-0 md:max-w-3xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-slate-400">
            {format(new Date(recipe.publishedAt), "EEEE, MMMM d, yyyy")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>

          {recipe.previewUrl && (
            <video
              src={recipe.previewUrl}
              autoPlay
              playsInline
              loop
              muted
              preload="auto"
              className="rounded-lg overflow-hidden pointer-events-none"
            ></video>
          )}

          <p className="text-lg text-gray-700 dark:text-gray-300">
            {recipe.description}
          </p>
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
