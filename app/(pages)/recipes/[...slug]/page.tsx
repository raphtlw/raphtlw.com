import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { getAllPosts, getPost } from "@/content";
import { CONTENT_FOLDER, Frontmatter } from "@/content/recipes";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_AUTHOR } from "@/sanity/lib/queries";
import { format } from "date-fns";

export const generateStaticParams = async () => {
  return getAllPosts(CONTENT_FOLDER);
};

type Params = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const { metadata, content, frontmatter } = await getPost<Frontmatter>(
    CONTENT_FOLDER,
    slug,
  );
  const { data: author } = await sanityFetch({
    query: QUERY_AUTHOR,
    params: {
      slug: frontmatter.author,
    },
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
            {format(metadata.birthtime, "EEEE, MMMM d, yyyy")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            {frontmatter.title}
          </h1>

          {frontmatter.previewUrl && (
            <video
              src={frontmatter.previewUrl}
              autoPlay
              playsInline
              loop
              muted
              preload="auto"
              className="rounded-lg overflow-hidden pointer-events-none"
            ></video>
          )}

          <p className="text-lg text-gray-700 dark:text-gray-300">
            {frontmatter.description}
          </p>

          <div className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={urlFor(author.image).url()} />
              <AvatarFallback>
                {author.slug.current.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-slate-200 font-medium">
                {author.name}
              </p>
              <p className="text-sm text-accent">@{author.slug.current}</p>
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
