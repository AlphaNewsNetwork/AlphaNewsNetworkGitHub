export const config = {
  api: {
    bodyParser: false, // disable Next.js default body parser
  },
};

import getRawBody from 'raw-body';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (e) {
    return res.status(400).json({ error: 'Error reading request body' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString());
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  console.log('Payload:', JSON.stringify(payload, null, 2));

  if (!payload?.fields) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  const title = payload.fields.title?.['en-US'];
  const excerpt = payload.fields.excerpt?.['en-US'];

  if (!title || !excerpt) {
    return res.status(400).json({ error: 'Missing title or excerpt fields' });
  }

  const prompt = `Create a concise, engaging 30-second video script based on this story:\nTitle: ${title}\nSummary: ${excerpt}\nScript:`;

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
    const script = openaiData.choices[0].message.content.trim();

    return res.status(200).json({ script });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
