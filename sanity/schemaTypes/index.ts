import { type SchemaTypeDefinition } from "sanity";
import { externalLinkType } from "./externalLinkType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [externalLinkType],
};
