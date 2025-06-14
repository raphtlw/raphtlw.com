import { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import { addSourceCode } from "./data";

export const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "vesper",
  transformers: [addSourceCode()],
};
