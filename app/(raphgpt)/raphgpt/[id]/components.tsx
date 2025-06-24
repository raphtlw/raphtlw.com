"use client";

import { SpatialMaterial } from "@/components/spatial/material";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export type CopyToClipboardProps = {
  text: string;
};

export const CopyToClipboard = ({ text }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <SpatialMaterial
      reactToMouse
      enableTap
      className="px-4 py-3 rounded-sm gap-4 text-sm"
      onClick={async () => {
        setCopied(true);

        await navigator.clipboard.writeText(text);

        setTimeout(() => {
          setCopied(false);
        }, 1000);
      }}
    >
      {copied ? <CopyCheckIcon size="20px" /> : <CopyIcon size="20px" />} Copy
      as Markdown
    </SpatialMaterial>
  );
};
