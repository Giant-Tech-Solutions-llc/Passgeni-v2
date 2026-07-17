import type { Metadata, Viewport } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/500-italic.css";
import "./globals.css";
import { Header, Footer } from "@/components/shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://passgeni.ai"),
  title: {
    default: "PassGeni — Passwords your auditor won't question",
    template: "%s · PassGeni",
  },
  description:
    "PassGeni is credential compliance infrastructure: generate passwords and passphrases locally in your browser, validate them against NIST SP 800-63B, SOC 2, HIPAA, and PCI DSS, and produce verifiable audit evidence. No credential is ever stored or transmitted.",
  keywords: [
    "credential compliance",
    "password compliance",
    "NIST SP 800-63B password generator",
    "SOC 2 password policy",
    "compliance certificate",
    "zero-knowledge password generator",
  ],
  openGraph: {
    type: "website",
    siteName: "PassGeni",
    title: "PassGeni — Credential Compliance Infrastructure",
    description:
      "Generate credentials locally. Validate them instantly. Never store a single secret.",
    url: "https://passgeni.ai",
  },
  twitter: {
    card: "summary",
    title: "PassGeni — Passwords your auditor won't question",
    description:
      "Generate credentials locally. Validate against NIST, SOC 2, HIPAA, PCI DSS. Produce verifiable audit evidence.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f8fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[6px] focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
