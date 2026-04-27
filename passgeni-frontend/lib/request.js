// =============================================================
// PASSGENI — HTTP REQUEST UTILITIES  (lib/request.js)
// =============================================================

/**
 * Extract the real client IP from a Next.js API request.
 * Respects the x-forwarded-for header set by Railway/Vercel proxies.
 * Returns "unknown" when the IP cannot be determined.
 */
export function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ??
    req.socket?.remoteAddress ??
    "unknown"
  );
}
