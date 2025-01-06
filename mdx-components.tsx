import { ExternalLink } from "@/components/spatial/link";
import { CodeBlock } from "@/lib/rehype/code";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children }) => (
      <ExternalLink href={href} icon>
        {children as string}
      </ExternalLink>
    ),
    figure: CodeBlock,
    ...components,
  };
}
