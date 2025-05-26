import { RobotIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const raphgptPageType = defineType({
  name: "raphgptPage",
  title: "raphGPT Page",
  type: "document",
  icon: RobotIcon as any,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "content",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
});
