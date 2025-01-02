import { type SchemaTypeDefinition } from "sanity";

import { authorType } from "./authorType";
import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { externalLinkType } from "./externalLinkType";
import { postType } from "./postType";
import { recipeType } from "./recipeType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    externalLinkType,
    recipeType,
  ],
};
