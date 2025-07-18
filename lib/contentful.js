import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || ogxk8qok8mgr,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || oPJAOjdTeWZk3o7pTVRAYldqZZfRR__8Tr2T8Lj8CEY,
});

export async function getStories() {
  const entries = await client.getEntries({
    content_type: "story",
    order: "-fields.publishedAt",
  });
  return entries.items;
}

export async function getStoryBySlug(slug) {
  const entries = await client.getEntries({
    content_type: "story",
    "fields.slug": slug,
    limit: 1,
  });
  return entries.items[0];
}
