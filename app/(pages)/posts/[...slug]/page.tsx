import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import { QUERY_ALL_POST_SLUGSResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_ALL_POST_SLUGS, QUERY_SINGLE_POST } from "@/sanity/lib/queries";
import { format } from "date-fns";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

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
  const { data: post } = await sanityFetch({
    query: QUERY_SINGLE_POST,
    params: {
      slug: slug.join("/"),
    },
  });

  if (!post) {
    return notFound();
  }

  // Render the page
  return (
    <main className="py-10 md:py-40">
      <div className="flex px-6">
        <BackButton className="md:fixed md:top-[10vh] md:left-[5vw]" />
      </div>

      <div className="px-6 pt-6 md:pt-0 md:max-w-3xl mx-auto flex flex-col gap-12">
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
              <p className="text-sm text-accent">@{post.author.slug.current}</p>
            </div>
          </div>
        </div>

        <article
          className={cn(
            "prose lg:prose-lg prose-stone dark:prose-invert prose-img:rounded-xl",
          )}
        >
          <PortableText value={post.content} />
        </article>
      </div>
    </main>
  );
}
