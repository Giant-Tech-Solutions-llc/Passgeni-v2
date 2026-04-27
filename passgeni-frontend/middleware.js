import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Don't leak URL to third parties
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Disable browser features PassGeni doesn't use
  response.headers.set(
    "Permissions-Policy",
    'camera=(), microphone=(), geolocation=(), payment=(self "https://sandbox-buy.paddle.com" "https://buy.paddle.com")'
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
