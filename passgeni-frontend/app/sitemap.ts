import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://passgeni.ai";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/generator`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/compliance`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
