// =============================================================
// PASSGENI — PADDLE BILLING CONFIGURATION
// =============================================================
// Environment variables required (Railway / Vercel dashboard):
//   PADDLE_API_KEY                       — Developer Tools → Authentication
//   PADDLE_WEBHOOK_SECRET                — Notifications → Webhook secret
//   PADDLE_PRICE_ID_ASSURANCE_MONTHLY    — Assurance plan monthly price
//   PADDLE_PRICE_ID_ASSURANCE_ANNUAL     — Assurance plan annual price
//   PADDLE_PRICE_ID_AUTHORITY_MONTHLY    — Authority plan monthly price
//   PADDLE_PRICE_ID_AUTHORITY_ANNUAL     — Authority plan annual price
// =============================================================

export const PADDLE_API = "https://api.paddle.com";

export const PADDLE_PRICE_IDS = {
  assurance_monthly: process.env.PADDLE_PRICE_ID_ASSURANCE_MONTHLY || "",
  assurance_annual:  process.env.PADDLE_PRICE_ID_ASSURANCE_ANNUAL  || "",
  authority_monthly: process.env.PADDLE_PRICE_ID_AUTHORITY_MONTHLY || "",
  authority_annual:  process.env.PADDLE_PRICE_ID_AUTHORITY_ANNUAL  || "",
  // Legacy keys — kept so old webhooks in flight don't silently fail
  pro_monthly:  process.env.PADDLE_PRICE_ID_PRO_MONTHLY  || "",
  pro_annual:   process.env.PADDLE_PRICE_ID_PRO_ANNUAL   || "",
  team_monthly: process.env.PADDLE_PRICE_ID_TEAM_MONTHLY || "",
  team_annual:  process.env.PADDLE_PRICE_ID_TEAM_ANNUAL  || "",
};

/**
 * Reverse-lookup: given a Paddle price ID, return our internal plan name.
 * Falls back to "assurance" for unknown price IDs.
 */
export function planFromPriceId(priceId) {
  if (!priceId) return "assurance";
  const entries = Object.entries(PADDLE_PRICE_IDS);
  const match = entries.find(([, pid]) => pid && pid === priceId);
  if (!match) return "assurance";
  const key = match[0];
  if (key.startsWith("authority") || key.startsWith("team")) return "authority";
  return "assurance";
}

export const PLANS = {
  free: {
    id:         "free",
    name:       "Free",
    price:      0,
    apiCalls:   0,
    maxBulk:    0,
    seats:      1,
    compliance: false,
    certLimit:  3,
  },
  assurance: {
    id:         "assurance",
    name:       "Assurance",
    price:      19,
    apiCalls:   1000,
    maxBulk:    50,
    seats:      1,
    compliance: true,
    certLimit:  null,
    paddlePriceId: process.env.PADDLE_PRICE_ID_ASSURANCE_MONTHLY,
  },
  authority: {
    id:         "authority",
    name:       "Authority",
    price:      59,
    apiCalls:   10000,
    maxBulk:    500,
    seats:      10,
    compliance: true,
    certLimit:  null,
    paddlePriceId: process.env.PADDLE_PRICE_ID_AUTHORITY_MONTHLY,
  },
};

/**
 * Maps a Paddle subscription status to our internal plan_status value.
 * Paddle statuses: active, trialing, past_due, paused, canceled
 */
export function mapPaddleStatus(status) {
  const map = {
    active:   "active",
    trialing: "trialing",
    past_due: "past_due",
    paused:   "canceled",
    canceled: "canceled",
  };
  return map[status] || status;
}

/**
 * Returns whether the subscription should grant Team plan access.
 */
export function isActiveSubscription(status) {
  return status === "active" || status === "trialing";
}
