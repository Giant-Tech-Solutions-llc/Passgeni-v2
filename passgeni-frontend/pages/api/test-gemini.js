// Gemini API key test — tries models confirmed available on this account
export default async function handler(req, res) {
  const key = process.env.PassGeni_Gemini_APIKEY;
  if (!key) return res.status(500).json({ ok: false, error: 'Key not found in env' });

  // Models confirmed available via ListModels for this account
  const MODELS = [
    'gemini-2.5-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite-preview',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
  ];

  const tries = {};
  let workingModel = null;
  let workingReply = null;

  for (const model of MODELS) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Reply with exactly one word: WORKING' }] }],
            generationConfig: { maxOutputTokens: 10, temperature: 0 }
          })
        }
      );
      const data = await r.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      tries[model] = {
        status: r.status,
        ok: r.ok,
        reply: r.ok ? reply : (data?.error?.message || '').slice(0, 80),
        usageMetadata: r.ok ? data?.usageMetadata : undefined,
      };
      if (r.ok && !workingModel) {
        workingModel = model;
        workingReply = reply;
      }
    } catch (e) {
      tries[model] = { ok: false, error: e.message };
    }
  }

  return res.status(200).json({
    keyPrefix: key.slice(0, 10) + '...',
    keyLength: key.length,
    workingModel,
    workingReply,
    VERDICT: workingModel ? 'KEY_WORKS - use ' + workingModel : 'ALL_FAILED - check billing',
    tries,
  });
  }
