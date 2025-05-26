import { defineQuery } from "next-sanity";

export const LINKS_QUERY = defineQuery(`*[_type == "externalLink"]{
  ...,
  video {
    asset -> {
      _id,
      url,
      mimeType
    }
  }
}`);

export const RAPHGPT_PAGE_QUERY = defineQuery(
  `*[_type == "raphgptPage" && _id == $id][0]`,
);
