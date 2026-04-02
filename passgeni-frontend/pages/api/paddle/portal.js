// =============================================================
// PASSGENI — PADDLE CUSTOMER PORTAL
// POST /api/paddle/portal
// =============================================================
// Returns a Paddle customer portal URL for subscription management.
//
// Request body:
//   { customerId: string }  — Paddle customer ID (ctm_xxx)
//
// Response:
//   { url: string }
// =============================================================

import { PADDLE_API } from "../../../lib/paddle.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customerId } = req.body || {};
  if (!customerId) return res.status(400).json({ error: "customerId required" });

  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Paddle not configured" });

  try {
    const response = await fetch(`${PADDLE_API}/customers/${customerId}/auth-token`, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.detail || `Paddle API error ${response.status}`);

    const token = data.data?.customer_auth_token;
    if (!token) throw new Error("No auth token returned");

    const portalUrl = `https://customer.paddle.com/subscriptions?cpt=${token}&paddlev2=true`;
    return res.status(200).json({ url: portalUrl });

  } catch (err) {
    console.error("[paddle] Portal error:", err.message);
    return res.status(500).json({ error: "Could not retrieve billing portal URL" });
  }
}
