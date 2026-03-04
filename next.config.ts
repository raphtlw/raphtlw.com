import createMDX from "@next/mdx";
import withPlaiceholder from "@plaiceholder/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  cacheComponents: true,
  cacheMaxMemorySize: 0,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      "remark-smartypants",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
    ],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(withPlaiceholder(nextConfig));
