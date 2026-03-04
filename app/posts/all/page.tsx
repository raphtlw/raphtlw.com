import { findPosts } from "@/app/posts/all/find";
import Image from "@/components/image";
import { format, parseISO } from "date-fns";
import Link from "next/link";

export default async function AllPage() {
  const posts = await findPosts();

  return (
    <main className="not-prose grid grid-cols-1 font-sans">
      {posts.map((p, index) => (
        <div key={index} className="flex flex-col">
          <Link
            href={`/posts/${p.slug}`}
            className="grid grid-cols-3 p-3 active:bg-accent"
          >
            <div className="flex flex-col col-span-2 gap-1">
              <p className="text-lg font-medium leading-tight">
                {p.frontmatter.title}
              </p>
              <p className="text-sm font-light leading-tight">
                {format(parseISO(p.frontmatter.pubdate), "dd MMM yyy")}
              </p>
              <div className="flex-1"></div>
              <p className="text-sm text-stone-500 font-medium">
                {p.frontmatter.readingTime} min read
              </p>
            </div>
            {p.frontmatter.image && p.frontmatter.imagealt && (
              <Image
                src={p.frontmatter.image}
                alt={p.frontmatter.imagealt}
                className="col-span-1"
              />
            )}
          </Link>

          {index < posts.length - 1 && (
            <div className="h-[0.9px] bg-neutral-400 col-span-3" />
          )}
        </div>
      ))}
    </main>
  );
}
