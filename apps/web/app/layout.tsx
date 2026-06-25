import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import HreflangTags from "@/components/HreflangTags";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ccscale.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CC Scale - Professional Weighing Scale Manufacturer & Exporter",
    template: "%s | CC Scale",
  },
  description:
    "Professional weighing scale manufacturer and OEM/ODM exporter from China. Body scales, hanging scales, kitchen scales, baby scales. 20+ years, 100+ countries, CE/FCC/ROHS certified.",
  keywords: [
    "weighing scale",
    "body scale",
    "hanging scale",
    "kitchen scale",
    "baby scale",
    "crane scale",
    "OEM scale",
    "ODM scale",
    "China scale manufacturer",
  ],
  authors: [{ name: "CC Scale Co., Ltd." }],
  creator: "CC Scale Co., Ltd.",
  publisher: "CC Scale Co., Ltd.",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    url: SITE_URL,
    siteName: "CC Scale",
    title: "CC Scale - Professional Weighing Scale Manufacturer",
    description:
      "Professional weighing scale manufacturer and OEM/ODM exporter from China. 20+ years, 100+ countries.",
    // Per-page opengraph-image.tsx generates dynamic OG images
    // (see app/[locale]/opengraph-image.tsx and app/[locale]/products/[slug]/opengraph-image.tsx).
    images: [{ width: 1200, height: 630, alt: "CC Scale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CC Scale - Professional Weighing Scale Manufacturer",
    description: "Professional weighing scale manufacturer and OEM/ODM exporter from China.",
    // Per-page opengraph-image.tsx generates dynamic images
    images: [{ width: 1200, height: 630, alt: 'CC Scale' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The middleware sets x-nonce on the response AND on the rewritten request,
  // so headers() returns it here. Each request gets a unique nonce.
  const nonce = headers().get("x-nonce") ?? undefined;

  return (
    <html lang="en">
      <body>
        {/* Cloudflare Web Analytics (if configured) */}
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN ? (
          <Script
            id="cf-beacon"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            nonce={nonce}
            data-cf-beacon={JSON.stringify({ token: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN })}
          />
        ) : null}
        <HreflangTags path="/" locale="en" />
        {children}
      </body>
    </html>
  );
}