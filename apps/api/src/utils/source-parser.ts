import { TrafficSource } from '@prisma/client';

export interface ParsedSource {
  trafficSource: TrafficSource;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
}

// AI搜索引擎列表
const AI_SEARCH_ENGINES = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'you.com',
  'phind.com',
  'phind',
  'komo.ai',
  ' Andes',
  'iask.ai',
  '商量',
  '文心一言',
  '通义千问',
  'Kimi',
  'Moonshot',
];

// 传统搜索引擎
const SEARCH_ENGINES = [
  { domain: 'google', name: 'Google' },
  { domain: 'bing', name: 'Bing' },
  { domain: 'yahoo', name: 'Yahoo' },
  { domain: 'baidu', name: 'Baidu' },
  { domain: 'yandex', name: 'Yandex' },
  { domain: 'duckduckgo', name: 'DuckDuckGo' },
  { domain: 'sogou', name: 'Sogou' },
  { domain: 'so.com', name: '360 Search' },
];

// 社交媒体平台
const SOCIAL_PLATFORMS = [
  { domain: 'linkedin', name: 'LinkedIn', type: 'social' as const },
  { domain: 'facebook', name: 'Facebook', type: 'social' as const },
  { domain: 'instagram', name: 'Instagram', type: 'social' as const },
  { domain: 'twitter', name: 'Twitter/X', type: 'social' as const },
  { domain: 'x.com', name: 'Twitter/X', type: 'social' as const },
  { domain: 'tiktok', name: 'TikTok', type: 'video' as const },
  { domain: 'youtube', name: 'YouTube', type: 'video' as const },
  { domain: 'pinterest', name: 'Pinterest', type: 'social' as const },
  { domain: 'reddit', name: 'Reddit', type: 'social' as const },
  { domain: 'quora', name: 'Quora', type: 'social' as const },
  { domain: 'weibo', name: 'Weibo', type: 'social' as const },
  { domain: 'whatsapp', name: 'WhatsApp', type: 'social' as const },
  { domain: 'telegram', name: 'Telegram', type: 'social' as const },
];

// 付费广告来源
const PAID_SOURCES = [
  'google ads',
  'google-adwords',
  'google_ads',
  'adwords',
  'bing ads',
  'facebook ads',
  'facebook-ad',
  'meta ads',
  'meta-ad',
  'linkedin ads',
  'linkedin-sponsored',
  'instagram ads',
  'tiktok ads',
  'tiktok-sponsored',
  'youtube ads',
];

export function parseTrafficSource(
  url: URL | null,
  referer: string | null
): ParsedSource {
  const result: ParsedSource = {
    trafficSource: TrafficSource.DIRECT,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    referrer: referer,
  };

  if (!url && !referer) {
    return result;
  }

  // 优先解析 UTM 参数
  if (url) {
    const params = url.searchParams;

    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmContent = params.get('utm_content');
    const utmTerm = params.get('utm_term');

    if (utmSource) result.utmSource = utmSource;
    if (utmMedium) result.utmMedium = utmMedium;
    if (utmCampaign) result.utmCampaign = utmCampaign;
    if (utmContent) result.utmContent = utmContent;
    if (utmTerm) result.utmTerm = utmTerm;

    // 根据 UTM 参数判断来源类型
    if (utmSource || utmMedium || utmCampaign) {
      result.trafficSource = categorizeByUtm(utmSource, utmMedium, utmCampaign);
      return result;
    }
  }

  // 解析 Referer 头
  const refererHost = referer ? new URL(referer).hostname.toLowerCase() : null;

  // 检测 AI 搜索引擎
  if (refererHost) {
    for (const ai of AI_SEARCH_ENGINES) {
      if (refererHost.includes(ai.toLowerCase())) {
        result.trafficSource = TrafficSource.AI_SEARCH;
        if (!result.utmSource) result.utmSource = refererHost;
        return result;
      }
    }

    // 检测传统搜索引擎
    for (const engine of SEARCH_ENGINES) {
      if (refererHost.includes(engine.domain)) {
        // 检测是否为付费搜索
        if (refererHost.includes('google') && url?.searchParams.get('ved')?.includes('gclid')) {
          result.trafficSource = TrafficSource.PAID_SEARCH;
          if (!result.utmSource) result.utmSource = 'Google';
          return result;
        }
        if (refererHost.includes('baidu') && (url?.searchParams.has('wd') || url?.searchParams.has('word'))) {
          result.trafficSource = TrafficSource.PAID_SEARCH;
          if (!result.utmSource) result.utmSource = 'Baidu';
          return result;
        }
        result.trafficSource = TrafficSource.ORGANIC_SEARCH;
        if (!result.utmSource) result.utmSource = engine.name;
        return result;
      }
    }

    // 检测社交媒体平台
    for (const social of SOCIAL_PLATFORMS) {
      if (refererHost.includes(social.domain)) {
        if (social.type === 'video') {
          result.trafficSource = TrafficSource.VIDEO;
        } else {
          result.trafficSource = TrafficSource.SOCIAL_ORGANIC;
        }
        if (!result.utmSource) result.utmSource = social.name;
        return result;
      }
    }

    // 检测是否为引荐链接
    result.trafficSource = TrafficSource.REFERRAL;
    if (!result.utmSource) result.utmSource = refererHost;
  }

  return result;
}

function categorizeByUtm(source: string | null, medium: string | null, campaign: string | null): TrafficSource {
  const s = (source || '').toLowerCase();
  const m = (medium || '').toLowerCase();
  const c = (campaign || '').toLowerCase();

  // 检测付费广告
  if (PAID_SOURCES.some(ps => s.includes(ps.toLowerCase()) || m.includes(ps.toLowerCase()))) {
    return TrafficSource.PAID_SEARCH;
  }

  // 检测邮件营销
  if (m.includes('email') || m.includes('mail') || s.includes('newsletter')) {
    return TrafficSource.EMAIL;
  }

  // 检测展示广告
  if (m.includes('display') || m.includes('banner') || m.includes('cpm')) {
    return TrafficSource.DISPLAY;
  }

  // 检测视频平台
  if (s.includes('youtube') || s.includes('tiktok') || s.includes('video')) {
    return TrafficSource.VIDEO;
  }

  // 检测社交媒体
  if (m.includes('social') || m.includes('social-media')) {
    return m.includes('paid') ? TrafficSource.SOCIAL_PAID : TrafficSource.SOCIAL_ORGANIC;
  }

  // 检测搜索引擎
  if (m.includes('organic') || m.includes('search')) {
    return TrafficSource.ORGANIC_SEARCH;
  }

  // 引荐链接
  if (m.includes('referral') || m.includes('banner') || m.includes('cpc')) {
    return TrafficSource.REFERRAL;
  }

  // AI 搜索
  if (AI_SEARCH_ENGINES.some(ai => s.includes(ai.toLowerCase()))) {
    return TrafficSource.AI_SEARCH;
  }

  return TrafficSource.OTHER;
}

export function getTrafficSourceLabel(source: TrafficSource, locale: 'en' | 'zh'): string {
  const labels: Record<TrafficSource, { en: string; zh: string }> = {
    DIRECT: { en: 'Direct', zh: '直接访问' },
    ORGANIC_SEARCH: { en: 'Organic Search', zh: '搜索引擎' },
    PAID_SEARCH: { en: 'Paid Search', zh: '付费搜索' },
    SOCIAL_ORGANIC: { en: 'Social Media', zh: '社交媒体' },
    SOCIAL_PAID: { en: 'Social Ads', zh: '社交广告' },
    REFERRAL: { en: 'Referral', zh: '引荐链接' },
    EMAIL: { en: 'Email', zh: '邮件营销' },
    AI_SEARCH: { en: 'AI Search', zh: 'AI搜索' },
    DISPLAY: { en: 'Display Ads', zh: '展示广告' },
    VIDEO: { en: 'Video', zh: '视频平台' },
    OTHER: { en: 'Other', zh: '其他' },
  };
  return labels[source]?.[locale] || labels.OTHER[locale];
}

export function getSourceColor(source: TrafficSource): string {
  const colors: Record<TrafficSource, string> = {
    DIRECT: '#64748b',
    ORGANIC_SEARCH: '#22c55e',
    PAID_SEARCH: '#f97316',
    SOCIAL_ORGANIC: '#3b82f6',
    SOCIAL_PAID: '#8b5cf6',
    REFERRAL: '#06b6d4',
    EMAIL: '#ec4899',
    AI_SEARCH: '#f59e0b',
    DISPLAY: '#ef4444',
    VIDEO: '#ef4444',
    OTHER: '#94a3b8',
  };
  return colors[source];
}
