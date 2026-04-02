// =============================================================
// PASSGENI — PADDLE BILLING CONFIGURATION
// =============================================================
// Environment variables required (Vercel dashboard):
//   PADDLE_API_KEY                 — from Paddle dashboard → Developer Tools → Authentication
//   PADDLE_WEBHOOK_SECRET          — from Paddle dashboard → Notifications → Webhook secret
//   PADDLE_PRICE_ID_TEAM_MONTHLY   — from Products → Prices
// =============================================================

export const PADDLE_API = "https://api.paddle.com";

export const PADDLE_PRICE_IDS = {
  team_monthly: process.env.PADDLE_PRICE_ID_TEAM_MONTHLY || "",
};

export const PLANS = {
  free: {
    id:         "free",
    name:       "Free",
    price:      0,
    apiCalls:   50,
    maxBulk:    10,
    seats:      1,
    compliance: false,
    api:        true,
  },
  team: {
    id:           "team",
    name:         "Team",
    price:        29,
    apiCalls:     5000,
    maxBulk:      500,
    seats:        5,
    compliance:   true,
    api:          true,
    paddlePriceId: PADDLE_PRICE_IDS.team_monthly,
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
