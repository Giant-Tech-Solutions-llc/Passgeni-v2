// =============================================================
// PASSGENI — AUTH HELPERS
// =============================================================
// Used in API routes to require authentication.
// =============================================================

import { getServerSession } from "next-auth/next";

// Lazy import authOptions to avoid circular deps
async function getAuthOptions() {
  const mod = await import("../pages/api/auth/[...nextauth].js");
  return mod.authOptions;
}

export async function getSession(req, res) {
  const authOptions = await getAuthOptions();
  return getServerSession(req, res, authOptions);
}

export async function requireAuth(req, res) {
  const session = await getSession(req, res);
  if (!session) {
    res.status(401).json({ error: "Unauthorized. Sign in at passgeni.ai/auth/signin" });
    return null;
  }
  return session;
}

export async function requireTeam(req, res) {
  const session = await requireAuth(req, res);
  if (!session) return null;

  if (!session.user.customerId) {
    res.status(403).json({
      error:   "Team plan required",
      upgrade: "https://passgeni.ai/api#pricing",
    });
    return null;
  }

  const validStatuses = ["active", "trialing"];
  if (!validStatuses.includes(session.user.planStatus)) {
    res.status(403).json({
      error:  "Subscription inactive",
      status: session.user.planStatus,
    });
    return null;
  }

  return { session, customerId: session.user.customerId };
}

export async function requireAuthority(req, res) {
  const session = await requireAuth(req, res);
  if (!session) return null;

  if (session.user.plan !== "authority") {
    res.status(403).json({ error: "Authority plan required", upgrade: "https://passgeni.ai/pricing" });
    return null;
  }

  const validStatuses = ["active", "trialing"];
  if (!validStatuses.includes(session.user.planStatus)) {
    res.status(403).json({ error: "Subscription inactive", status: session.user.planStatus });
    return null;
  }

  return { session, customerId: session.user.customerId };
}
