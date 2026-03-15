// Temporary Gemini API key test endpoint — DELETE after testing
export default async function handler(req, res) {
  const key = process.env.PassGeni_Gemini_APIKEY;
  if (!key) return res.status(500).json({ ok: false, error: 'Key not found in env' });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with exactly: GEMINI_OK' }] }]
        })
      }
    );
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    if (r.ok) {
      return res.status(200).json({ ok: true, status: r.status, reply: text, keyPrefix: key.slice(0, 8) + '...' });
    } else {
      return res.status(200).json({ ok: false, status: r.status, error: data?.error?.message, keyPrefix: key.slice(0, 8) + '...' });
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
        }
