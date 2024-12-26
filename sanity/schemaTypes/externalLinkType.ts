import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const externalLinkType = defineType({
  name: "externalLink",
  title: "External Link",
  type: "document",
  icon: LinkIcon as any,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "video",
      type: "file",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
  ],
});
