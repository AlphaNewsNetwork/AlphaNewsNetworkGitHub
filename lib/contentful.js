import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
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

// New function to fetch videos
export async function getVideos() {
  const entries = await client.getEntries({
    content_type: "video",
    order: "-sys.createdAt",
  });
  return entries.items;
}
