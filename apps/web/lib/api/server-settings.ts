/**
 * Server-side site settings fetcher for generateMetadata
 * Fetches directly from the backend API
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

export async function getSiteSettings(): Promise<ServerSiteSettings> {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, {
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
    return {};
  } catch {
    return {};
  }
}

export async function getSiteSetting(key: string): Promise<string | undefined> {
  const settings = await getSiteSettings();
  return settings[key];
}
