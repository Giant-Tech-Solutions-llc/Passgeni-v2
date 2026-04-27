/**
 * GET /api/dashboard/certs
 * Returns the authenticated user's certificate list.
 */

import { getToken } from "next-auth/jwt";
import { getCertificatesByUser, getMonthlyCount } from "../../../lib/db/certs.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const userId = token.sub;
  const page = Math.max(0, parseInt(req.query.page ?? "0", 10));
  const limit = 50;

  const [{ certs, total }, monthlyCount] = await Promise.all([
    getCertificatesByUser(userId, { limit, offset: page * limit }),
    getMonthlyCount(userId),
  ]);

  return res.status(200).json({ certs, total, monthly_count: monthlyCount, page, limit });
}
