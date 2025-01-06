"use client";

import {
  MATERIAL_BORDER,
  SpatialMaterial,
} from "@/components/spatial/material";
import { ClientOnly } from "@/components/utils/client-only";
import { CopyIcon } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { cn } from "../utils";

export type CodeBlockProps = ComponentPropsWithoutRef<"div">;

export const CodeBlock = (props: CodeBlockProps) => {
  return (
    <ClientOnly>
      <Inner {...props} />
    </ClientOnly>
  );
};

const Inner = ({ children, ...props }: CodeBlockProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current.querySelector<HTMLElement>(
        "figcaption[data-rehype-pretty-code-title]",
      );
      element.style.margin = "0";
      element.style.flex = "1";
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";
      ref.current
        .querySelector("div[data-rehype-pretty-code-header]")
        .prepend(element);
    }
  }, []);

  return (
    <figure
      ref={ref}
      {...props}
      className={cn(
        "rounded-xl overflow-hidden bg-black border border-opacity-50",
      )}
      style={{
        borderColor: "#343434",
      }}
    >
      <div className="flex flex-row px-2 py-2" data-rehype-pretty-code-header>
        <SpatialMaterial
          className="flex flex-row gap-2 text-xs items-center justify-center rounded-md select-none"
          style={{
            boxShadow: "none",
            padding: 8,
          }}
          whileHover={{
            boxShadow: MATERIAL_BORDER,
          }}
          enableTap
          onClick={() => {
            const sourceCode = ref.current
              .querySelector("div[data-shiki]")
              .getAttribute("data");
            navigator.clipboard.writeText(sourceCode);
          }}
        >
          <CopyIcon size={16} />
          <span>Copy</span>
        </SpatialMaterial>
      </div>
      {children}
    </figure>
  );
};
