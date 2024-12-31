import { defineQuery } from "next-sanity";

export const LINKS_QUERY = defineQuery(`*[_type == "externalLink"] {
  "id": _id,
  title,
  cta,
  description,
  "videoUrl": video.asset->url,
  url
}`);

export const QUERY_ALL_POSTS = defineQuery(`*[_type == "post"] {
  "id": _id,
  "slug": slug.current,
  title,
  categories,
  publishedAt
}`);

export const QUERY_ALL_POST_SLUGS = defineQuery(`*[_type == "post"] {
  "slug": slug.current
}`);

export const QUERY_SINGLE_POST =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
    title,
    content,
    publishedAt,
    "author": {
      "name": author->name,
      "slug": author->slug,
      "image": author->image,
    }
  }`);
