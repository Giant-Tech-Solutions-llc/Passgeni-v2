"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/primitives";
import { BrandMark } from "@/components/brand";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "border-b border-line bg-canvas/85 shadow-s1 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-[20px] font-bold tracking-[-0.02em] text-ink"
        >
          <span className="text-primary">
            <BrandMark size={20} />
          </span>
          PassGeni
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-medium text-sub md:flex">
          <Link href="/generator" className="transition-colors hover:text-ink">
            Generator
          </Link>
          <Link href="/compliance" className="transition-colors hover:text-ink">
            Standards
          </Link>
          <Link href="/tools" className="transition-colors hover:text-ink">
            Tools
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-ink">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* PLACEHOLDER: auth ports from V2 — sign-in points at the live product */}
          <a
            href="https://passgeni.ai/login"
            className="hidden h-10 items-center rounded-[6px] px-4 text-[15px] font-medium text-sub transition-colors hover:bg-surface-2 hover:text-ink sm:inline-flex"
          >
            Sign in
          </a>
          <Button href="/generator" size="md">
            Generate Password
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-1">
      <div className="mx-auto max-w-[1120px] px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 text-[18px] font-bold text-ink">
              <span className="text-primary">
                <BrandMark size={18} />
              </span>
              PassGeni
            </p>
            <p className="microlabel mt-1 text-muted">Credential compliance infrastructure</p>
            <p className="mt-4 max-w-[340px] text-[15px] leading-[1.6] text-sub">
              PassGeni generates credentials locally in your browser, validates them
              against compliance standards, and issues verifiable evidence. No
              credential is ever stored or transmitted.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["Generator", "/generator"],
              ["Passphrases", "/generator?mode=passphrase"],
              ["Standards", "/compliance"],
              ["Pricing", "/pricing"],
            ]}
          />
          <FooterCol
            title="Tools"
            links={[
              ["Breach Checker", "/tools"],
              ["Strength Checker", "/tools"],
              ["Password Audit", "/tools"],
              ["Certificate Verifier", "/tools"],
            ]}
          />
          <FooterCol
            title="Trust"
            links={[
              ["Security model", "/compliance"],
              ["NIST SP 800-63B", "/compliance"],
              ["Certificates", "/compliance"],
            ]}
          />
        </div>
        <p className="mt-12 border-t border-line pt-6 font-mono text-[12px] text-muted">
          © {new Date().getFullYear()} PassGeni · Credentials never leave your browser
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title}>
      <p className="microlabel text-muted">{title}</p>
      <ul className="mt-3 space-y-2 text-[15px]">
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("http") ? (
              <a href={href} className="text-sub transition-colors hover:text-ink">
                {label}
              </a>
            ) : (
              <Link href={href} className="text-sub transition-colors hover:text-ink">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
