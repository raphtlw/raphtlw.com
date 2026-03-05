import { ArticleMeta } from "@/components/prose/head";
import Layout from "@/components/prose/layout";
import { ImageMedia, VideoMedia } from "@/components/prose/media";
import { Signature } from "@/components/prose/signature";
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  ImageMedia,
  VideoMedia,
  Layout,
  Signature,
  ArticleMeta,
};

export const useMDXComponents = (): MDXComponents => {
  return components;
};
