/**
 * Server-side site settings fetcher for generateMetadata
 * Uses ISR (Incremental Static Regeneration) with 1-hour revalidation
 * to avoid hammering the backend on every request.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ServerSiteSettings {
  companyNameEn?: string;
  companyNameZh?: string;
  seoTitleEn?: string;
  seoTitleZh?: string;
  seoDescriptionEn?: string;
  seoDescriptionZh?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactAddressEn?: string;
  contactAddressZh?: string;
  socialFacebook?: string;
  socialLinkedIn?: string;
  socialYouTube?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  [key: string]: string | undefined;
}

// Cache across requests in a single Node.js process
let cachedSettings: { data: ServerSiteSettings; expires: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min in-memory cache

export async function getSiteSettings(): Promise<ServerSiteSettings> {
  // Layer 1: in-memory cache (fastest)
  const now = Date.now();
  if (cachedSettings && cachedSettings.expires > now) {
    return cachedSettings.data;
  }

  try {
    // Layer 2: Next.js fetch cache with 1h ISR (cross-process)
    const res = await fetch(`${API_URL}/api/site-settings`, {
      next: { revalidate: 3600, tags: ['site-settings'] },
    });
    const data: ServerSiteSettings = res.ok ? await res.json() : {};
    cachedSettings = { data, expires: now + CACHE_TTL_MS };
    return data;
  } catch {
    return cachedSettings?.data || {};
  }
}

export async function getSiteSetting(key: string): Promise<string | undefined> {
  const settings = await getSiteSettings();
  return settings[key];
}
