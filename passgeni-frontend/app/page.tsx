import {
  Hero,
  HowItWorks,
  AuditorTable,
  PassphraseShowcase,
  ZeroKnowledge,
  ToolsGrid,
  DashboardPreview,
  Testimonials,
  FinalCTA,
} from "@/components/home/sections";

/* JSON-LD: Organization, WebSite, SoftwareApplication, HowTo, FAQPage (V3 spec §9) */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://passgeni.ai/#org",
      name: "PassGeni",
      url: "https://passgeni.ai",
      description: "Credential compliance infrastructure.",
    },
    {
      "@type": "WebSite",
      "@id": "https://passgeni.ai/#site",
      url: "https://passgeni.ai",
      name: "PassGeni",
      publisher: { "@id": "https://passgeni.ai/#org" },
    },
    {
      "@type": "SoftwareApplication",
      name: "PassGeni",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web browser",
      url: "https://passgeni.ai",
      description:
        "Generates passwords and passphrases locally in the browser, validates them against NIST SP 800-63B, SOC 2, HIPAA, and PCI DSS, and issues verifiable compliance certificates.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "19", priceCurrency: "USD" },
      ],
    },
    {
      "@type": "HowTo",
      name: "How to produce credential compliance evidence with PassGeni",
      step: [
        {
          "@type": "HowToStep",
          name: "Generate",
          text: "Generate a credential locally in the browser with the Web Crypto API. Nothing is transmitted.",
        },
        {
          "@type": "HowToStep",
          name: "Validate",
          text: "The credential is checked live against NIST SP 800-63B, SOC 2, HIPAA, and PCI DSS controls.",
        },
        {
          "@type": "HowToStep",
          name: "Certify",
          text: "PassGeni signs an evidence record containing a salted hash commitment and the validation results, verifiable at a public certificate URL.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is PassGeni?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PassGeni is credential compliance infrastructure. It generates passwords and passphrases locally in your browser, validates them against compliance standards, and produces cryptographic audit evidence.",
          },
        },
        {
          "@type": "Question",
          name: "Is PassGeni a password manager?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. PassGeni never stores, transmits, or sees a password. It generates credentials locally and issues compliance evidence about them; storage stays in whatever vault you already use.",
          },
        },
        {
          "@type": "Question",
          name: "Does my password ever leave my browser?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Generation and validation run as local JavaScript using the Web Crypto API. Certification transmits only a salted SHA-256 hash commitment and the validation verdicts, never the credential.",
          },
        },
        {
          "@type": "Question",
          name: "What standards does PassGeni validate against?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "NIST SP 800-63B on the free plan, with SOC 2, HIPAA, and PCI DSS v4.0 evidence detail on paid plans. Verdicts for all four are computed locally on every generation.",
          },
        },
        {
          "@type": "Question",
          name: "What do auditors check in a password?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Effective entropy, minimum and maximum length handling, dictionary and breach-corpus resistance, pattern resistance, absence of forced-complexity rules, and a verifiable evidence trail. PassGeni evaluates each control live with the relevant citation.",
          },
        },
        {
          "@type": "Question",
          name: "What is a compliance certificate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A signed evidence record containing a salted hash commitment of the credential, the entropy measurement, and per-standard validation results. Anyone can verify it at its public certificate URL without learning the credential.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <HowItWorks />
      <AuditorTable />
      <PassphraseShowcase />
      <ZeroKnowledge />
      <ToolsGrid />
      <DashboardPreview />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
