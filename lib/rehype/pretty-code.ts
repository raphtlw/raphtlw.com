import { addSourceCode } from "@/lib/rehype/data";
import { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code";

export const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "vesper",
  transformers: [addSourceCode()],
};
