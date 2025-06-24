import { rehypePrettyCodeOptions } from "@/lib/rehype/pretty-code";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Allow images to be loaded from Sanity CMS
  images: {
    remotePatterns: [new URL("https://cdn.sanity.io/**")],
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});

export default withMDX(nextConfig);
