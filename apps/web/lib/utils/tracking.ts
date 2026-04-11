// 客户端流量来源追踪工具

export interface TrackingData {
  trafficSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
}

// 从 URL 和 referrer 解析流量来源
export function getTrackingData(): TrackingData {
  if (typeof window === 'undefined') return {};

  const data: TrackingData = {
    landingPage: window.location.href,
    referrer: document.referrer || undefined,
  };

  const params = new URLSearchParams(window.location.search);

  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  const utmContent = params.get('utm_content');
  const utmTerm = params.get('utm_term');

  if (utmSource) data.utmSource = utmSource;
  if (utmMedium) data.utmMedium = utmMedium;
  if (utmCampaign) data.utmCampaign = utmCampaign;
  if (utmContent) data.utmContent = utmContent;
  if (utmTerm) data.utmTerm = utmTerm;

  // 如果有 UTM 参数，确定 trafficSource
  if (utmSource || utmMedium) {
    data.trafficSource = categorizeUtm(utmSource, utmMedium, utmCampaign);
  } else if (document.referrer) {
    // 从 referrer 判断来源
    data.trafficSource = categorizeReferrer(document.referrer);
  } else {
    data.trafficSource = 'DIRECT';
  }

  return data;
}

// UTM 参数归类
function categorizeUtm(source: string | null, medium: string | null, campaign: string | null): string {
  const s = (source || '').toLowerCase();
  const m = (medium || '').toLowerCase();
  const c = (campaign || '').toLowerCase();

  // 付费搜索/广告
  if (m.includes('cpc') || m.includes('paid') || m.includes('ppc') ||
      s.includes('google ads') || s.includes('bing ads')) {
    return 'PAID_SEARCH';
  }

  // 邮件营销
  if (m.includes('email') || m.includes('mail')) {
    return 'EMAIL';
  }

  // 展示广告
  if (m.includes('display') || m.includes('banner') || m.includes('cpm')) {
    return 'DISPLAY';
  }

  // 视频平台
  if (s.includes('youtube') || s.includes('tiktok') || s.includes('video')) {
    return 'VIDEO';
  }

  // 社交媒体
  if (m.includes('social')) {
    return m.includes('paid') ? 'SOCIAL_PAID' : 'SOCIAL_ORGANIC';
  }

  // 搜索引擎自然流量
  if (m.includes('organic') || m.includes('search')) {
    return 'ORGANIC_SEARCH';
  }

  // AI 搜索
  if (s.includes('chatgpt') || s.includes('perplexity') || s.includes('claude') ||
      s.includes('gemini') || s.includes('ai search')) {
    return 'AI_SEARCH';
  }

  return 'OTHER';
}

// Referrer 来源归类
function categorizeReferrer(referrer: string): string {
  const ref = referrer.toLowerCase();

  // AI 搜索引擎
  if (ref.includes('chatgpt') || ref.includes('perplexity') || ref.includes('claude') ||
      ref.includes('gemini') || ref.includes('copilot') || ref.includes('you.com') ||
      ref.includes('phind')) {
    return 'AI_SEARCH';
  }

  // 搜索引擎
  if (ref.includes('google.') || ref.includes('bing.') || ref.includes('yahoo.') ||
      ref.includes('baidu.') || ref.includes('yandex.') || ref.includes('duckduckgo')) {
    return 'ORGANIC_SEARCH';
  }

  // 社交媒体
  if (ref.includes('linkedin.') || ref.includes('facebook.') || ref.includes('instagram.') ||
      ref.includes('twitter.') || ref.includes('x.com') || ref.includes('pinterest.') ||
      ref.includes('reddit.') || ref.includes('quora.') || ref.includes('weibo.') ||
      ref.includes('whatsapp.') || ref.includes('telegram.')) {
    return 'SOCIAL_ORGANIC';
  }

  // 视频平台
  if (ref.includes('youtube.') || ref.includes('tiktok.') || ref.includes('youtu.be')) {
    return 'VIDEO';
  }

  // 引荐链接
  return 'REFERRAL';
}

// 保存追踪数据到 localStorage（用于跨页面传递）
const TRACKING_KEY = 'cc-scale-tracking';

export function saveTrackingData(): void {
  if (typeof window === 'undefined') return;
  const data = getTrackingData();
  if (Object.keys(data).length > 0) {
    localStorage.setItem(TRACKING_KEY, JSON.stringify(data));
  }
}

export function getStoredTrackingData(): TrackingData {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(TRACKING_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return getTrackingData();
}

export function clearTrackingData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRACKING_KEY);
}

// 生成会话 ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('cc-session-id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('cc-session-id', sessionId);
  }
  return sessionId;
}
