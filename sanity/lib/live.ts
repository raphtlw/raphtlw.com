// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.

import { defineLive } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("Missing SANITY_API_READ_TOKEN");
}

export const { sanityFetch, SanityLive } = defineLive({
  // @ts-ignore (temporary fix for differences in APIs)
  client,
  serverToken: token,
  browserToken: token,
});

// TODO: remove that @ts-ignore once next-sanity and @sanity/client are using the same versions
