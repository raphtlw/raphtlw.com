import { StaggeredText } from "@/components/spatial/staggered-text";
import { QUERY_ALL_POSTSResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { format } from "date-fns";
import { defineQuery } from "next-sanity";
import Link from "next/link";

const QUERY_ALL_POSTS = defineQuery(`*[_type == "post"] {
  "id": _id,
  "slug": slug.current,
  title,
  categories,
  publishedAt
}`);

export default async function Page() {
  const posts = await client.fetch<QUERY_ALL_POSTSResult>(QUERY_ALL_POSTS);

  return (
    <main className="py-16">
      <div className="max-w-3xl mx-auto">
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
                  <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                    <StaggeredText reactToMouse>{post.title}</StaggeredText>
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
