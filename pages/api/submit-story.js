import OpenAI from "openai";
import axios from "axios";
import cheerio from 'cheerio';
import { createClient } from "contentful-management";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Contentful Management client
const contentfulClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
});

// Helper to extract article text from a URL
async function extractArticleText(url) {
  try {
    const { data: html } = await axios.get(url);
    if (!html) throw new Error("No HTML data received");
    const $ = cheerio.load(html);

    // Try to find main article content
    let articleText = $("article").text() || $("body").text();
    articleText = articleText.replace(/\s+/g, " ").trim();

    return articleText;
  } catch (err) {
    console.error("Error fetching article HTML:", err.message);
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { url } = req.body;
  if (!url) {
    res.status(400).json({ message: "Missing URL in request body" });
    return;
  }

  try {
    // Step 1: Extract article text from the URL
    const articleText = await extractArticleText(url);

    // Step 2: Use OpenAI to rewrite the article in Gen Alpha style
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You rewrite news stories for Generation Alpha: simple, fun, emoji-filled, and engaging.",
        },
        {
          role: "user",
          content: `Rewrite this story:\n\n${articleText}`,
        },
      ],
    });
    const rewrittenStory = completion.choices[0].message.content;

    // Step 3: Generate an AI image prompt and create image
    const promptCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You generate creative AI image prompts for news stories.",
        },
        {
          role: "user",
          content: `Create a short AI art prompt for this story:\n\n${rewrittenStory}`,
        },
      ],
    });
    const imagePrompt = promptCompletion.choices[0].message.content;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
    });
    const imageUrl = imageResponse.data[0].url;

    // Step 4: Create entry in Contentful
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment("master");
    const entry = await environment.createEntry("story", {
      fields: {
        title: {
          "en-US": rewrittenStory.split("\n")[0] || "Gen Alpha News Story",
        },
        slug: {
          "en-US": `gen-alpha-story-${Date.now()}`,
        },
        excerpt: {
          "en-US": rewrittenStory.slice(0, 150) + "...",
        },
        body: {
          "en-US": rewrittenStory,
        },
        image: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Asset",
              // Normally you'd upload the image to Contentful here, but for simplicity:
              // You can store the image URL or use a separate upload process.
              // This requires more setup — let me know if you want help with that.
              // For now, we leave this blank or handle externally.
            },
          },
        },
      },
    });
    await entry.publish();

    res.status(200).json({ message: "Story created successfully", entryId: entry.sys.id, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing story", error: error.message });
  }
}
