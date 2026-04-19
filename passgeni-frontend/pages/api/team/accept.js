/**
 * POST /api/team/accept
 * Accept a team invite. The invite JWT is the auth — no session required.
 * Body: { token }
 */

import { activateTeamMember } from "../../../lib/db/client.js";
import { jwtVerify } from "jose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body ?? {};
  if (!token) return res.status(400).json({ error: "token is required" });

  let payload;
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    ({ payload } = await jwtVerify(token, secret));
  } catch {
    return res.status(400).json({ error: "Invalid or expired invite token" });
  }

  if (payload.type !== "team_invite") {
    return res.status(400).json({ error: "Invalid token type" });
  }

  const { email, customerId } = payload;
  if (!email || !customerId) {
    return res.status(400).json({ error: "Malformed invite token" });
  }

  const member = await activateTeamMember(customerId, email);
  if (!member) {
    return res.status(404).json({ error: "Invite not found or already removed" });
  }

  return res.status(200).json({ success: true, email, customerId });
}
