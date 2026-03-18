// =============================================================
// PASSGENI — CREATE PADDLE CHECKOUT
// POST /api/paddle/checkout
// =============================================================
// Creates a Paddle transaction and returns the hosted checkout URL.
//
// Request body:
//   { email?: string }
//
// Response:
//   { url: string }
// =============================================================

import { PADDLE_API, PADDLE_PRICE_IDS } from "../../../lib/paddle.js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://passgeni.ai";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.redirect(302, "/checkout");
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  const priceId = PADDLE_PRICE_IDS.team_monthly;
  const apiKey  = process.env.PADDLE_API_KEY;

  if (!priceId || !apiKey) {
    console.error("Paddle checkout: missing PADDLE_API_KEY or PADDLE_PRICE_ID_TEAM_MONTHLY");
    return res.status(500).json({ error: "Checkout not configured. Contact hello@passgeni.ai" });
  }

  try {
    const body = {
      items:    [{ price_id: priceId, quantity: 1 }],
      checkout: { url: `${SITE_URL}/dashboard?status=success` },
    };

    if (email) body.customer = { email };

    const response = await fetch(`${PADDLE_API}/transactions`, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.detail || `Paddle API error ${response.status}`);
    }

    const checkoutUrl = data.data?.checkout?.url;
    if (!checkoutUrl) throw new Error("No checkout URL in Paddle response");

    return res.status(200).json({ url: checkoutUrl });

  } catch (err) {
    console.error("Paddle checkout error:", err.message);
    return res.status(500).json({
      error: "Could not create checkout session. Please try again or contact hello@passgeni.ai",
    });
  }
}
