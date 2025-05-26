import { type SchemaTypeDefinition } from "sanity";
import { externalLinkType } from "./externalLinkType";
import { raphgptPageType } from "./raphgptPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [externalLinkType, raphgptPageType],
};
