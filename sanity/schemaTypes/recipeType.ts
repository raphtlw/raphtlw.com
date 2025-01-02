import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const recipeType = defineType({
  name: "recipe",
  title: "Recipes",
  type: "document",
  icon: DocumentsIcon as any,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      validation: (rule) => rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "preview",
      type: "file",
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "content",
      type: "markdown",
      validation: (rule) => rule.required(),
      options: {
        imageUrl: (imageAsset) => `${imageAsset.url}?w=600`,
      },
    }),
  ],
});
