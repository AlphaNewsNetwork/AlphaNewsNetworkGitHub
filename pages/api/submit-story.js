import getRawBody from 'raw-body';
import fetch from 'node-fetch';
import { createClient } from 'contentful-management';

export const config = {
  api: {
    bodyParser: false, // We manually parse raw body
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    console.error('Error reading raw body:', e);
    return res.status(400).json({ error: 'Could not read body' });
  }

  let contentfulPayload;
  try {
    contentfulPayload = JSON.parse(rawBody.toString());
  } catch (e) {
    console.error('Invalid JSON:', e);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!contentfulPayload?.fields) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  const title = contentfulPayload.fields.title?.['en-US'] || '';
  const summary = contentfulPayload.fields.excerpt?.['en-US'] || '';

  if (!title || !summary) {
    return res.status(400).json({ error: 'Missing title or excerpt' });
  }

  const prompt = `Create a concise, engaging 30-second video script based on this story:\nTitle: ${title}\nExcerpt: ${summary}\nScript:`;

  // Call OpenAI
  let script;
  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return res.status(500).json({ error: 'OpenAI API error', details: errorText });
    }

    const openaiData = await openaiResponse.json();
    script = openaiData.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI request failed:', error);
    return res.status(500).json({ error: 'OpenAI request failed' });
  }

  // Update Contentful entry with generated script
  try {
    const contentfulClient = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
    });

    const space = await contentfulClient.getSpace(contentfulPayload.sys.space.sys.id);
    const environment = await space.getEnvironment(contentfulPayload.sys.environment.sys.id);
    const entry = await environment.getEntry(contentfulPayload.sys.id);

    entry.fields.videoscript = {
      'en-US': script,
    };

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    console.log('Contentful entry updated and published with script');
  } catch (error) {
    console.error('Failed to update Contentful entry:', error);
    return res.status(500).json({ error: 'Failed to update Contentful entry' });
  }

  return res.status(200).json({ script });
}
