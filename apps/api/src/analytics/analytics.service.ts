import { Injectable } from '@nestjs/common';
import { PrismaClient, TrafficSource } from '@prisma/client';
import { getTrafficSourceLabel, getSourceColor } from '../utils/source-parser';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

@Injectable()
export class AnalyticsService {
  async trackSession(sessionData: {
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    trafficSource?: TrafficSource;
    referrer?: string;
    landingPage?: string;
    country?: string;
    region?: string;
    city?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
  }) {
    const { sessionId, ...data } = sessionData;

    return prisma.userSession.upsert({
      where: { sessionId },
      update: {
        lastVisit: new Date(),
        pageViews: { increment: 1 },
        ...data,
      },
      create: {
        sessionId,
        ...data,
        pageViews: 1,
      },
    });
  }

  async trackEvent(eventData: {
    sessionId: string;
    eventType: string;
    pageUrl?: string;
    productId?: number;
    data?: string;
  }) {
    // First ensure session exists
    await this.trackSession({ sessionId: eventData.sessionId });

    return prisma.sessionEvent.create({
      data: eventData,
    });
  }

  async getDashboardStats(startDate?: Date, endDate?: Date) {
    const rangeFilter =
      startDate || endDate
        ? {
            gte: startDate,
            lte: endDate,
          }
        : undefined;

    // 获取今日开始时间
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      sessions,
      inquiries,
      inquiryItems,
      trafficSourceGroups,
      utmSourceGroups,
      referrerGroups,
      countryGroups,
      replyMethodGroups,
      newInquiryCount,
      // 今日询盘统计
      todayNewInquiries,
      todayRepliedInquiries,
      // 询盘转化漏斗 - 需要获取所有状态的询盘
      allInquiriesWithStatus,
      // 响应时效数据
      repliedInquiriesWithTime,
    ] = await Promise.all([
      prisma.userSession.findMany({
        where: {
          ...(rangeFilter && { firstVisit: rangeFilter }),
        },
        select: {
          sessionId: true,
          firstVisit: true,
          pageViews: true,
          trafficSource: true,
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
          referrer: true,
          country: true,
        },
      }),
      prisma.inquiry.findMany({
        where: {
          ...(rangeFilter && { createdAt: rangeFilter }),
        },
        select: {
          id: true,
          createdAt: true,
          trafficSource: true,
          utmSource: true,
        },
      }),
      prisma.inquiryItem.findMany({
        where: {
          inquiry: {
            ...(rangeFilter && { createdAt: rangeFilter }),
          },
        },
        select: {
          productNameZh: true,
          productNameEn: true,
        },
      }),
      // 按流量来源分组
      prisma.userSession.groupBy({
        by: ['trafficSource'],
        where: {
          ...(rangeFilter && { firstVisit: rangeFilter }),
        },
        _count: true,
      }),
      // 按 UTM source 分组
      prisma.userSession.groupBy({
        by: ['utmSource'],
        where: {
          ...(rangeFilter && { firstVisit: rangeFilter }),
          utmSource: { not: null },
        },
        _count: true,
        orderBy: { _count: { utmSource: 'desc' } },
        take: 10,
      }),
      // 按 Referrer 域名分组
      prisma.userSession.groupBy({
        by: ['referrer'],
        where: {
          ...(rangeFilter && { firstVisit: rangeFilter }),
          referrer: { not: null },
        },
        _count: true,
        orderBy: { _count: { referrer: 'desc' } },
        take: 10,
      }),
      prisma.userSession.groupBy({
        by: ['country'],
        where: {
          ...(rangeFilter && { firstVisit: rangeFilter }),
        },
        _count: true,
      }),
      // 按回复方式分组（只统计已回复的）
      prisma.inquiry.groupBy({
        by: ['replyMethod'],
        where: {
          ...(rangeFilter && { createdAt: rangeFilter }),
          replyMethod: { not: null },
        },
        _count: true,
        orderBy: { _count: { replyMethod: 'desc' } },
      }),
      // 统计新询盘（未回复）数量
      prisma.inquiry.count({
        where: {
          ...(rangeFilter && { createdAt: rangeFilter }),
          replyMethod: null,
        },
      }),
      // 今日新询盘数量
      prisma.inquiry.count({
        where: {
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      // 今日已回复询盘数量
      prisma.inquiry.count({
        where: {
          createdAt: { gte: todayStart, lte: todayEnd },
          replyMethod: { not: null },
        },
      }),
      // 询盘转化漏斗 - 获取所有询盘状态
      prisma.inquiry.groupBy({
        by: ['status'],
        _count: true,
      }),
      // 响应时效 - 获取已回复询盘的创建时间和回复时间
      prisma.inquiry.findMany({
        where: {
          ...(rangeFilter && { createdAt: rangeFilter }),
          repliedAt: { not: null },
        },
        select: {
          createdAt: true,
          repliedAt: true,
        },
      }),
    ]);

    const trendMap = new Map<string, { date: string; visitors: number; pageViews: number; inquiries: number }>();
    const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

    sessions.forEach((session) => {
      const key = toDateKey(session.firstVisit);
      const row = trendMap.get(key) || { date: key, visitors: 0, pageViews: 0, inquiries: 0 };
      row.visitors += 1;
      row.pageViews += session.pageViews || 0;
      trendMap.set(key, row);
    });

    inquiries.forEach((inq) => {
      const key = toDateKey(inq.createdAt);
      const row = trendMap.get(key) || { date: key, visitors: 0, pageViews: 0, inquiries: 0 };
      row.inquiries += 1;
      trendMap.set(key, row);
    });

    const trend = Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // 流量来源分布（按 TrafficSource 枚举）
    const trafficSourceDistribution = trafficSourceGroups
      .filter(g => g.trafficSource !== null)
      .map((g) => ({
        name: getTrafficSourceLabel(g.trafficSource!, 'en'),
        nameZh: getTrafficSourceLabel(g.trafficSource!, 'zh'),
        value: g._count,
        color: getSourceColor(g.trafficSource!),
      }))
      .sort((a, b) => b.value - a.value);

    // UTM 来源分布（详细渠道）
    const utmSourceDistribution = utmSourceGroups
      .map((g) => ({
        source: g.utmSource || 'Unknown',
        sessions: g._count,
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // 询盘来源分析
    const inquirySourceGroups = await prisma.inquiry.groupBy({
      by: ['trafficSource'],
      where: {
        ...(rangeFilter && { createdAt: rangeFilter }),
      },
      _count: true,
    });

    const inquirySourceDistribution = inquirySourceGroups
      .filter(g => g.trafficSource !== null)
      .map((g) => ({
        name: getTrafficSourceLabel(g.trafficSource!, 'en'),
        nameZh: getTrafficSourceLabel(g.trafficSource!, 'zh'),
        value: g._count,
        color: getSourceColor(g.trafficSource!),
      }))
      .sort((a, b) => b.value - a.value);

    const regionDistribution = countryGroups
      .filter(g => g.country !== null)
      .map((g) => ({
        name: g.country || '未知',
        visitors: g._count,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 8);

    // 回复方式分布（整合到询盘状态中）
    const replyMethodMeta: Record<string, { label: string; color: string }> = {
      EMAIL: { label: '邮件回复', color: '#3b82f6' },
      WHATSAPP: { label: 'WhatsApp回复', color: '#25D366' },
      PHONE: { label: '电话回复', color: '#f59e0b' },
      ALIBABA: { label: '阿里巴巴回复', color: '#ff6a00' },
      LINKEDIN: { label: 'LinkedIn回复', color: '#0A66C2' },
      OTHER: { label: '其他方式', color: '#94a3b8' },
    };
    const repliedCount = replyMethodGroups.reduce((sum, g) => sum + g._count, 0);
    const replyMethodDistribution = replyMethodGroups.map((g) => {
      const methodMeta = replyMethodMeta[g.replyMethod || 'OTHER'] || replyMethodMeta.OTHER;
      return {
        method: g.replyMethod || 'OTHER',
        label: methodMeta.label,
        count: g._count,
        color: methodMeta.color,
      };
    });
    const inquiryStatusSummary = {
      total: inquiries.length,
      new: newInquiryCount,
      replied: repliedCount,
    };

    // 今日统计
    const todayStats = {
      newInquiries: todayNewInquiries,
      repliedInquiries: todayRepliedInquiries,
      pendingInquiries: todayNewInquiries - todayRepliedInquiries,
    };

    // 询盘转化漏斗
    const funnelMeta: Record<string, { label: string; color: string }> = {
      NEW: { label: '新询盘', color: '#eab308' },
      READ: { label: '已读', color: '#3b82f6' },
      IN_PROGRESS: { label: '处理中', color: '#a855f7' },
      REPLIED: { label: '已回复', color: '#22c55e' },
      CLOSED: { label: '已关闭', color: '#6b7280' },
      SPAM: { label: '垃圾', color: '#ef4444' },
    };
    const inquiryFunnel = allInquiriesWithStatus.map(g => {
      const meta = funnelMeta[g.status] || { label: g.status, color: '#94a3b8' };
      return {
        status: g.status,
        label: meta.label,
        count: g._count,
        color: meta.color,
      };
    });

    // 响应时效分析
    let totalResponseTime = 0;
    let responseWithin4Hours = 0;
    repliedInquiriesWithTime.forEach(inq => {
      if (inq.repliedAt) {
        const responseMs = new Date(inq.repliedAt).getTime() - new Date(inq.createdAt).getTime();
        const responseHours = responseMs / (1000 * 60 * 60);
        totalResponseTime += responseHours;
        if (responseHours <= 4) responseWithin4Hours++;
      }
    });
    const avgResponseTime = repliedInquiriesWithTime.length > 0 ? totalResponseTime / repliedInquiriesWithTime.length : 0;
    const responseRate4h = repliedInquiriesWithTime.length > 0 ? (responseWithin4Hours / repliedInquiriesWithTime.length) * 100 : 0;
    const responseTimeStats = {
      avgHours: parseFloat(avgResponseTime.toFixed(1)),
      within4hCount: responseWithin4Hours,
      within4hPercent: parseFloat(responseRate4h.toFixed(1)),
      totalReplied: repliedInquiriesWithTime.length,
    };

    const productCounter = new Map<string, number>();
    inquiryItems.forEach((item) => {
      const key = item.productNameZh || item.productNameEn || '未命名产品';
      productCounter.set(key, (productCounter.get(key) || 0) + 1);
    });
    const productInterest = Array.from(productCounter.entries())
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    const totalPageViews = sessions.reduce((sum, s) => sum + (s.pageViews || 0), 0);

    // 社媒渠道细分（基于 utmSource）
    const socialMediaBreakdown = utmSourceGroups
      .filter(g => ['youtube', 'linkedin', 'tiktok', 'facebook', 'instagram', 'twitter', 'whatsapp', 'pinterest'].includes(g.utmSource?.toLowerCase() || ''))
      .map((g) => ({
        source: capitalizeFirst(g.utmSource || 'Unknown'),
        sourceKey: g.utmSource?.toLowerCase() || 'unknown',
        sessions: g._count,
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // 按 medium 分组
    const utmMediumGroups = await prisma.userSession.groupBy({
      by: ['utmMedium'],
      where: {
        ...(rangeFilter && { firstVisit: rangeFilter }),
        utmMedium: { not: null },
      },
      _count: true,
      orderBy: { _count: { utmMedium: 'desc' } },
      take: 10,
    });

    const utmMediumDistribution = utmMediumGroups
      .map((g) => ({
        medium: capitalizeFirst(g.utmMedium || 'Unknown'),
        sessions: g._count,
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // 询盘来源的UTM分析
    const inquiryUtmGroups = await prisma.inquiry.groupBy({
      by: ['utmSource'],
      where: {
        ...(rangeFilter && { createdAt: rangeFilter }),
        utmSource: { not: null },
      },
      _count: true,
      orderBy: { _count: { utmSource: 'desc' } },
    });

    const inquiryUtmDistribution = inquiryUtmGroups
      .map((g) => ({
        source: capitalizeFirst(g.utmSource || 'Unknown'),
        inquiries: g._count,
      }))
      .sort((a, b) => b.inquiries - a.inquiries);

    // 完整渠道分布（合并 TrafficSource + UTM + Referrer）
    const allChannels = buildChannelList(sessions, utmSourceGroups, referrerGroups);

    // 流量来源饼图：基于 allChannels，取 Top 10，剩余归为"其他"
    const TOP_N = 10;
    const sortedChannels = [...allChannels].sort((a, b) => b.sessions - a.sessions);
    const topChannels = sortedChannels.slice(0, TOP_N);
    const otherChannels = sortedChannels.slice(TOP_N);
    const otherSessions = otherChannels.reduce((sum, c) => sum + c.sessions, 0);
    const pieData = topChannels.map(c => ({
      name: c.channel,
      nameZh: c.channel,
      value: c.sessions,
      color: getChannelColor(c.source, c.medium),
    }));
    if (otherSessions > 0) {
      pieData.push({ name: '其他', nameZh: '其他', value: otherSessions, color: '#94a3b8' });
    }

    // Referrer域名分析
    const referrerDistribution = buildReferrerDistribution(sessions);

    return {
      summary: {
        totalSessions: sessions.length,
        uniqueVisitors: sessions.length,
        totalPageViews,
        inquiriesCount: inquiries.length,
      },
      todayStats,
      inquiryStatusSummary,
      inquiryFunnel,
      responseTimeStats,
      replyMethodDistribution,
      trend,
      trafficSourceDistribution: pieData,
      utmSourceDistribution,
      utmMediumDistribution,
      socialMediaBreakdown,
      allChannels,
      referrerDistribution,
      inquirySourceDistribution,
      inquiryUtmDistribution,
      regionDistribution,
      productInterest,
    };
  }
}

function getChannelColor(source: string, medium: string): string {
  const s = (source || '').toLowerCase();
  const SOCIAL_COLORS: Record<string, string> = {
    youtube: '#FF0000',
    linkedin: '#0A66C2',
    tiktok: '#000000',
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    whatsapp: '#25D366',
    pinterest: '#E60023',
    google: '#4285F4',
    bing: '#008373',
    baidu: '#2932e1',
    direct: '#64748b',
    localhost: '#94a3b8',
  };
  if (SOCIAL_COLORS[s]) return SOCIAL_COLORS[s];
  if (medium === 'referral') return '#06b6d4';
  if (medium === 'utm') return '#8b5cf6';
  return '#64748b';
}

// 构建完整渠道列表
function buildChannelList(
  sessions: Array<{
    trafficSource?: TrafficSource | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    referrer?: string | null;
  }>,
  utmGroups: Array<{ utmSource: string | null; _count: number }>,
  referrerGroups: Array<{ referrer: string | null; _count: number }>,
) {
  const channelMap = new Map<string, { channel: string; source: string; medium: string; sessions: number; inquiries: number }>();

  // 先按 utmSource 统计
  utmGroups.forEach(g => {
    if (g.utmSource) {
      const source = capitalizeFirst(g.utmSource);
      channelMap.set(g.utmSource, {
        channel: source,
        source: g.utmSource,
        medium: 'utm',
        sessions: g._count,
        inquiries: 0,
      });
    }
  });

  // 按 trafficSource 统计非UTM流量
  sessions.forEach(s => {
    if (!s.utmSource && s.trafficSource) {
      const key = s.trafficSource;
      const existing = channelMap.get(key);
      if (existing) {
        existing.sessions += 1;
      } else {
        channelMap.set(key, {
          channel: getTrafficSourceLabel(key, 'en'),
          source: key,
          medium: 'organic',
          sessions: 1,
          inquiries: 0,
        });
      }
    }
  });

  // 按 referrer 域名统计
  referrerGroups.forEach(g => {
    if (g.referrer) {
      try {
        const domain = new URL(g.referrer).hostname.replace('www.', '');
        const existing = channelMap.get('ref_' + domain);
        if (existing) {
          existing.sessions += g._count;
        } else {
          channelMap.set('ref_' + domain, {
            channel: domain,
            source: domain,
            medium: 'referral',
            sessions: g._count,
            inquiries: 0,
          });
        }
      } catch {
        // ignore invalid URLs
      }
    }
  });

  return Array.from(channelMap.values())
    .sort((a, b) => b.sessions - a.sessions);
}

// 构建Referrer域名分布
function buildReferrerDistribution(sessions: Array<{ referrer?: string | null }>) {
  const referrerMap = new Map<string, number>();

  sessions.forEach(s => {
    if (s.referrer) {
      try {
        const url = new URL(s.referrer);
        const domain = url.hostname.replace('www.', '');
        referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
      } catch {
        // ignore
      }
    }
  });

  return Array.from(referrerMap.entries())
    .map(([domain, count]) => ({ domain, visits: count }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);
}

// Helper function
function capitalizeFirst(str: string): string {
  if (!str) return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
