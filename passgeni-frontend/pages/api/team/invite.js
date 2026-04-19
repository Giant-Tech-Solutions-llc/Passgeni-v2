/**
 * POST /api/team/invite
 * Send a team invite to an email address (Authority plan only).
 * Body: { email, name? }
 */

import { requireAuthority } from "../../../lib/auth.js";
import { getTeamMembers, addTeamMember } from "../../../lib/db/client.js";
import { Resend } from "resend";
import { SignJWT } from "jose";

const SEAT_LIMIT   = 10;
const TOKEN_EXPIRY = "7d";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const auth = await requireAuthority(req, res);
  if (!auth) return;
  const { session, customerId } = auth;

  const { email, name } = req.body ?? {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "email is required" });
  }
  const normalEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalEmail)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Seat limit check
  const members    = await getTeamMembers(customerId);
  const activeSeats = members.filter((m) => m.status !== "removed").length;
  if (activeSeats >= SEAT_LIMIT) {
    return res.status(403).json({ error: `Seat limit reached (${SEAT_LIMIT})` });
  }

  // Upsert team member row
  await addTeamMember(customerId, normalEmail, name?.trim() || null);

  // Sign 7-day invite JWT
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  const token  = await new SignJWT({ email: normalEmail, customerId, type: "team_invite" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);

  const inviteUrl = `${process.env.NEXTAUTH_URL}/accept-invite?token=${token}`;

  // Send email via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    "PassGeni <hello@passgeni.ai>",
      to:      [normalEmail],
      subject: `You've been invited to join ${session.user.email}'s team on PassGeni`,
      html: `<!DOCTYPE html>
<html>
<body style="background:#060608;color:#e0e0e0;font-family:'DM Sans',Arial,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:480px;margin:0 auto;">
    <div style="margin-bottom:28px;">
      <span style="font-size:22px;font-weight:800;color:#C8FF00;">PassGeni</span>
    </div>
    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 16px;line-height:1.2;">
      You've been invited to a compliance team.
    </h1>
    <p style="font-size:14px;color:#aaa;line-height:1.8;margin:0 0 8px;">
      <strong style="color:#fff;">${session.user.email}</strong> has invited you to their PassGeni Authority workspace.
    </p>
    <p style="font-size:14px;color:#aaa;line-height:1.8;margin:0 0 28px;">
      As a team member you'll share a certificate pool and stay aligned on org-level compliance standards.
      This invite expires in 7 days.
    </p>
    <a href="${inviteUrl}" style="display:inline-block;background:#C8FF00;color:#000;font-weight:800;font-size:15px;padding:16px 32px;border-radius:8px;text-decoration:none;">
      Accept Invitation &#8594;
    </a>
    <p style="font-size:12px;color:#555;margin-top:28px;line-height:1.6;">
      If you weren&apos;t expecting this, you can safely ignore it.<br>
      Invite sent to ${normalEmail}
    </p>
  </div>
</body>
</html>`,
    });
  } catch (emailErr) {
    console.error("[team/invite] Resend error (non-fatal):", emailErr?.message);
    // Don't fail the request — invite row is already created
  }

  return res.status(200).json({ success: true, email: normalEmail });
}
