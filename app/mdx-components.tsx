import { ExternalLink } from "@/components/spatial/link";
import type { MDXComponents } from "mdx/types";

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  a: ({ href, children }) => (
    <ExternalLink href={href} icon>
      {children as string}
    </ExternalLink>
  ),
  ...components,
});
