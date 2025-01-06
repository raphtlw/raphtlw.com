import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { rehypePrettyCodeOptions } from "@/lib/rehype/pretty-code";
import { cn } from "@/lib/utils";
import { useMDXComponents } from "@/mdx-components";
import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_RAPHGPT_PAGE } from "@/sanity/lib/queries";
import { format } from "date-fns";
import { TriangleAlertIcon } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Params) {
  const { id } = await params;
  const { data: page } = await sanityFetch({
    query: QUERY_RAPHGPT_PAGE,
    params: {
      id,
    },
  });

  if (!page) {
    return notFound();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const components = useMDXComponents({});

  const { content } = await compileMDX({
    source: page.content,
    options: {
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, rehypePrettyCodeOptions],
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });

  // Render the page
  return (
    <main className="py-10 md:py-20">
      <div className="px-6 md:pt-0 md:max-w-3xl mx-auto flex flex-col gap-12">
        <Alert>
          <TriangleAlertIcon className="h-5 w-5" />
          <AlertTitle>The content on this page is AI generated.</AlertTitle>
          <AlertDescription>
            Please be aware of any mistakes the AI might make.
          </AlertDescription>
        </Alert>
      </div>

      <div className="px-6 pt-6 md:pt-10 md:max-w-3xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-slate-400">
            {format(new Date(page.publishedAt), "EEEE, MMMM d, yyyy")}
          </p>

          <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
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
