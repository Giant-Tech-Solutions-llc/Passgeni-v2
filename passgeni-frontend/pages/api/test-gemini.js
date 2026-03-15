// Temporary Gemini API key test endpoint — DELETE after testing
export default async function handler(req, res) {
  const key = process.env.PassGeni_Gemini_APIKEY;
  if (!key) return res.status(500).json({ ok: false, error: 'Key not found in env' });

  const results = {};

  // 1. List available models to confirm key validity
  try {
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    const listData = await listRes.json();
    if (listRes.ok) {
      results.keyValid = true;
      results.modelCount = listData.models?.length || 0;
      results.availableModels = listData.models?.map(m => m.name).slice(0, 6) || [];
    } else {
      results.keyValid = false;
      results.listError = listData?.error?.message;
    }
  } catch(e) {
    results.listError = e.message;
  }

  // 2. Try generating with gemini-1.5-flash (has better free quota)
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
  for (const model of modelsToTry) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Say GEMINI_OK' }] }] })
        }
      );
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      results[model] = { status: r.status, ok: r.ok, reply: text || data?.error?.message };
      if (r.ok) break; // stop on first success
    } catch(e) {
      results[model] = { error: e.message };
    }
  }

  return res.status(200).json({
    keyPrefix: key.slice(0, 10) + '...',
    keyLength: key.length,
    ...results
  });
    }
