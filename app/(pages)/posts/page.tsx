import { TextScramble } from "@/components/ui/text-scramble";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_ALL_POSTS } from "@/sanity/lib/queries";
import { format } from "date-fns";
import Link from "next/link";

export default async function Page() {
  const { data: posts } = await sanityFetch({
    query: QUERY_ALL_POSTS,
  });

  return (
    <main className="py-16">
      <div className="px-10 md:max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">
          blog <Link href="/posts">/ posts</Link>
        </h1>

        <div className="my-10">
          {posts
            .sort((a, b) => {
              if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
                return -1;
              }
              return 1;
            })
            .map((post) => (
              <Link
                key={post.slug}
                className="flex flex-col gap-y-1 mb-4 mx-auto"
                href={`/posts/${post.slug}`}
              >
                <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                  <p className="text-neutral-600 dark:text-neutral-400 tabular-nums">
                    {format(new Date(post.publishedAt), "MMMM dd, yyyy")}
                  </p>
                  <TextScramble
                    className={cn(
                      "text-neutral-900 dark:text-neutral-100 tracking-tight",
                    )}
                    duration={1.2}
                  >
                    {post.title}
                  </TextScramble>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
