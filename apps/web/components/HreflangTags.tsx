/**
 * Hreflang Tags Component
 * Generates comprehensive hreflang tags for international SEO
 * 
 * Features:
 * - Multi-regional variants (en-AU, en-GB, etc.)
 * - x-default for language fallback
 * - Region-specific targeting
 * - Geolocation hints
 */
import { locales } from '@/i18n/routing';

const baseUrl = 'https://www.ccscale.com';

export interface HreflangConfig {
  locale: string;
  href: string;
  region?: string;
  lang?: string;
}

/**
 * Complete hreflang configuration for global SEO
 * Covers major English-speaking markets and Chinese variants
 */
export const hreflangConfigs: HreflangConfig[] = [
  // x-default: English as fallback
  { locale: 'x-default', href: `${baseUrl}/en`, lang: 'en' },
  
  // English variants for different markets
  { locale: 'en-US', href: `${baseUrl}/en`, lang: 'en', region: 'US' },
  { locale: 'en-GB', href: `${baseUrl}/en`, lang: 'en', region: 'GB' },
  { locale: 'en-AU', href: `${baseUrl}/en`, lang: 'en', region: 'AU' },
  { locale: 'en-CA', href: `${baseUrl}/en`, lang: 'en', region: 'CA' },
  { locale: 'en', href: `${baseUrl}/en`, lang: 'en' },
  
  // Chinese variants
  { locale: 'zh-CN', href: `${baseUrl}/zh`, lang: 'zh', region: 'CN' },
  { locale: 'zh-TW', href: `${baseUrl}/zh`, lang: 'zh', region: 'TW' },
  { locale: 'zh-HK', href: `${baseUrl}/zh`, lang: 'zh', region: 'HK' },
  { locale: 'zh', href: `${baseUrl}/zh`, lang: 'zh' },
];

/**
 * Generate hreflang tags for a specific page
 */
export function generatePageHreflangs(path: string): HreflangConfig[] {
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return hreflangConfigs.map(config => ({
    ...config,
    href: `${config.href}${cleanPath}`,
  }));
}

/**
 * HreflangTags component - renders hreflang meta tags
 */
export function HreflangTags({ 
  path = '', 
  currentLocale = 'en' 
}: { 
  path?: string;
  currentLocale?: string;
}) {
  const hreflangs = generatePageHreflangs(path);
  
  return (
    <>
      {hreflangs.map((config) => (
        <link
          key={config.locale}
          rel="alternate"
          hrefLang={config.locale}
          href={config.href}
        />
      ))}
      {/* Self-referencing canonical */}
      <link
        rel="alternate"
        hrefLang={currentLocale === 'en' ? 'en-US' : 'zh-CN'}
        href={`${baseUrl}${path.startsWith('/') ? path : '/' + path}`}
      />
    </>
  );
}

export default HreflangTags;
