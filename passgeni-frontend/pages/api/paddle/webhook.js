// =============================================================
// PASSGENI — PADDLE WEBHOOK HANDLER
// POST /api/paddle/webhook
// =============================================================
// Paddle sends webhook events for subscription lifecycle changes.
// Signature header: Paddle-Signature: ts=xxx;h1=xxx
//
// Events handled:
//   subscription.created        — provision Team access + welcome email
//   subscription.updated        — sync status changes
//   subscription.canceled       — deprovision + cancellation email
//   transaction.payment_failed  — mark past_due + payment failure email
// =============================================================

import crypto            from "crypto";
import { generateApiKey } from "../../../lib/apiKeys.js";
import { mapPaddleStatus, isActiveSubscription, PADDLE_API } from "../../../lib/paddle.js";
import {
  upsertCustomerByEmail,
  updateCustomerByPaddleId,
  findCustomerByPaddleId,
  createApiKey,
  deactivateCustomerKeys,
} from "../../../lib/db/client.js";
import { sendEmail } from "../../../lib/email/send.js";
import { teamWelcome, teamPaymentFailed, teamCancellation } from "../../../lib/email/templates.js";

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data",  c => chunks.push(c));
    req.on("end",   ()  => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Paddle signature: "ts=1234567890;h1=abcdef..."
function verifySignature(rawBody, signatureHeader, secret) {
  const tsPart = (signatureHeader.match(/ts=([^;]+)/)   || [])[1];
  const h1Part = (signatureHeader.match(/h1=([^;]+)/)   || [])[1];
  if (!tsPart || !h1Part) return false;

  const payload  = `${tsPart}:${rawBody.toString("utf8")}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(h1Part, "utf8"));
  } catch {
    return false;
  }
}

// Fetch customer email from Paddle API
async function fetchPaddleCustomerEmail(paddleCustomerId) {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) return null;
  try {
    const r    = await fetch(`${PADDLE_API}/customers/${paddleCustomerId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });
    const body = await r.json();
    return body.data?.email || null;
  } catch {
    return null;
  }
}

// ─── PROVISION ────────────────────────────────────────────────
async function provisionTeamAccess({ paddleCustomerId, paddleSubscriptionId, customerEmail, trialEndsAt, nextBilledAt }) {
  if (!customerEmail) {
    customerEmail = await fetchPaddleCustomerEmail(paddleCustomerId);
  }
  if (!customerEmail) {
    console.error(`[paddle] Cannot provision: no email for customer ${paddleCustomerId}`);
    return;
  }

  const planStatus = trialEndsAt && new Date(trialEndsAt) > new Date() ? "trialing" : "active";

  const customer = await upsertCustomerByEmail({
    paddle_customer_id:     String(paddleCustomerId),
    paddle_subscription_id: String(paddleSubscriptionId),
    email:                  customerEmail.toLowerCase(),
    plan:                   "team",
    plan_status:            planStatus,
    trial_end:              trialEndsAt || null,
    current_period_end:     nextBilledAt || null,
  });

  const { raw, hash, prefix } = generateApiKey("live");
  await createApiKey({ customerId: customer.id, keyHash: hash, keyPrefix: prefix, label: "Default" });

  await sendEmail({ to: customerEmail, ...teamWelcome(customerEmail, raw) });
  console.log(`✓ Provisioned Team for ${customerEmail}, key: ${prefix}`);
}

// ─── DEPROVISION ──────────────────────────────────────────────
async function deprovisionTeamAccess(paddleCustomerId) {
  const customer = await findCustomerByPaddleId(String(paddleCustomerId));
  if (!customer) return;

  await deactivateCustomerKeys(customer.id);
  await updateCustomerByPaddleId(String(paddleCustomerId), { plan: "free", plan_status: "canceled" });

  await sendEmail({ to: customer.email, ...teamCancellation(customer.email) });
  console.log(`✓ Deprovisioned Team for ${customer.email}`);
}

// ─── MAIN HANDLER ─────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ error: "Webhook secret not configured" });

  const rawBody  = await getRawBody(req);
  const sigHeader = req.headers["paddle-signature"] || "";

  if (!verifySignature(rawBody, sigHeader, secret)) {
    console.error("[paddle] Webhook signature mismatch");
    return res.status(400).json({ error: "Invalid signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const eventType = payload?.event_type;
  const data      = payload?.data;

  try {
    switch (eventType) {

      case "subscription.created": {
        if (!data) break;
        await provisionTeamAccess({
          paddleCustomerId:     data.customer_id,
          paddleSubscriptionId: data.id,
          customerEmail:        data.customer?.email || null,
          trialEndsAt:          data.trial_dates?.ends_at || null,
          nextBilledAt:         data.next_billed_at || null,
        });
        break;
      }

      case "subscription.updated": {
        if (!data) break;
        await updateCustomerByPaddleId(String(data.customer_id), {
          paddle_subscription_id: String(data.id),
          plan:                   isActiveSubscription(data.status) ? "team" : "free",
          plan_status:            mapPaddleStatus(data.status),
          trial_end:              data.trial_dates?.ends_at || null,
          current_period_end:     data.next_billed_at || null,
        });
        break;
      }

      case "subscription.canceled": {
        if (!data) break;
        await deprovisionTeamAccess(data.customer_id);
        break;
      }

      case "transaction.payment_failed": {
        if (!data) break;
        await updateCustomerByPaddleId(String(data.customer_id), { plan_status: "past_due" });
        const customer = await findCustomerByPaddleId(String(data.customer_id));
        if (customer?.email) {
          await sendEmail({ to: customer.email, ...teamPaymentFailed(customer.email) });
        }
        break;
      }

      default: break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("[paddle] Webhook handler error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
