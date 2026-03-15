// Gemini API key test — DELETE after testing
export default async function handler(req, res) {
  const key = process.env.PassGeni_Gemini_APIKEY;
  if (!key) return res.status(500).json({ ok: false, error: 'Key not found in env' });

  // Step 1: List all available models for this key
  const listRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  );
  const listData = await listRes.json();
  const allModels = listData.models?.map(m => m.name) || [];
  const flash2Models = allModels.filter(m => m.includes('2.0') || m.includes('flash'));

  // Step 2: Try gemini-2.0 variants in order
  const candidates = [
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-001',
    'gemini-2.0-flash-exp',
    'gemini-2.0-pro-exp',
    'gemini-1.5-flash',
  ];

  const tries = {};
  let workingModel = null;
  let workingReply = null;

  for (const model of candidates) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say only: WORKING' }] }],
          generationConfig: { maxOutputTokens: 5, temperature: 0 }
        })
      }
    );
    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    tries[model] = { status: r.status, ok: r.ok, reply: reply || data?.error?.message };
    if (r.ok) { workingModel = model; workingReply = reply; break; }
  }

  return res.status(200).json({
    keyPrefix: key.slice(0, 10) + '...',
    keyLength: key.length,
    availableFlashModels: flash2Models,
    totalModels: allModels.length,
    workingModel,
    workingReply,
    tries,
  });
      }
