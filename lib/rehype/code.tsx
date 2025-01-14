"use client";

import {
  MATERIAL_BORDER,
  SpatialMaterial,
} from "@/components/spatial/material";
import { ClientOnly } from "@/components/utils/client-only";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const [isCodeBlock, setIsCodeBlock] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current.querySelector<HTMLElement>(
        "figcaption[data-rehype-pretty-code-title]",
      );
      if (element) {
        setIsCodeBlock(true);

        element.style.margin = "0";
        element.style.display = "flex";
        element.style.position = "absolute";
        element.style.top = "0";
        element.style.left = "0";
        element.style.width = "100%";
        element.style.height = "100%";
        element.style.alignItems = "center";
        element.style.justifyContent = "center";
        ref.current
          .querySelector("div[data-rehype-pretty-code-header]")
          .prepend(element);
      }
    }
  }, []);

  if (!isCodeBlock) {
    return (
      <figure ref={ref} {...props}>
        {children}
      </figure>
    );
  }

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
      <div
        className="flex flex-row px-2 py-2 relative"
        data-rehype-pretty-code-header
      >
        <SpatialMaterial
          className={cn(
            "flex flex-row gap-2 rounded-md px-4 py-2",
            "items-center justify-center",
            "text-xs select-none",
          )}
          style={{
            boxShadow: "none",
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
            setCopied(true);
            setTimeout(() => setCopied(false), 1 * 1000);
          }}
        >
          {copied ? <CopyCheckIcon size={14} /> : <CopyIcon size={14} />}
          <span>Copy</span>
        </SpatialMaterial>
      </div>
      {children}
    </figure>
  );
};
