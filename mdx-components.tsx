import Layout from "@/components/prose/layout";
import { ImageMedia, VideoMedia } from "@/components/prose/media";
import type { MDXComponents } from "mdx/types";
import { ArticleMeta } from "./components/prose/head";

const components: MDXComponents = {
  ImageMedia,
  VideoMedia,
  Layout,
  ArticleMeta,
};

export const useMDXComponents = (): MDXComponents => {
  return components;
};
