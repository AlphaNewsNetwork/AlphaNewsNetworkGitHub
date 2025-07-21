import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const contentfulPayload = req.body;

  if (!contentfulPayload?.fields) {
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  const title = contentfulPayload.fields.title?.['en-US'];
  const summary = contentfulPayload.fields.summary?.['en-US'];

  if (!title || !summary) {
    return res.status(400).json({ error: 'Missing required title or summary fields' });
  }

  const prompt = `Create a concise, engaging 30-second video script based on this story:\nTitle: ${title}\nSummary: ${summary}\nScript:`;

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
