import { defineQuery } from "next-sanity";

export const LINKS_QUERY = defineQuery(`*[_type == "externalLink"] {
  "id": _id,
  title,
  cta,
  description,
  "videoUrl": video.asset->url,
  url
}`);

export const QUERY_ALL_POSTS =
  defineQuery(`*[_type == "post"] | order(publishedAt desc) {
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
    author->
  }`);

export const QUERY_ALL_RECIPES =
  defineQuery(`*[_type == "recipe"] | order(publishedAt desc) {
    "id": _id,
    "slug": slug.current,
    title,
    description,
    publishedAt,
    "previewUrl": preview.asset->url
  }`);

export const QUERY_ALL_RECIPE_SLUGS = defineQuery(`*[_type == "recipe"] {
  "slug": slug.current
}`);

export const QUERY_SINGLE_RECIPE =
  defineQuery(`*[_type == "recipe" && slug.current == $slug][0]{
    title,
    description,
    publishedAt,
    "previewUrl": preview.asset->url,
    content
  }`);
