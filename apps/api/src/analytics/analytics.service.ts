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

    const [
      sessions,
      inquiries,
      inquiryItems,
      trafficSourceGroups,
      utmSourceGroups,
      countryGroups,
      statusGroups,
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
      prisma.userSession.groupBy({
        by: ['country'],
        where: {
          ...(rangeFilter && { firstVisit: rangeFilter }),
        },
        _count: true,
      }),
      prisma.inquiry.groupBy({
        by: ['status'],
        where: {
          ...(rangeFilter && { createdAt: rangeFilter }),
        },
        _count: true,
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

    const statusDistribution = statusGroups.map((g) => ({
      status: g.status,
      count: g._count,
    }));

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

    return {
      summary: {
        totalSessions: sessions.length,
        uniqueVisitors: sessions.length,
        totalPageViews,
        inquiriesCount: inquiries.length,
      },
      trend,
      trafficSourceDistribution,
      utmSourceDistribution,
      inquirySourceDistribution,
      regionDistribution,
      statusDistribution,
      productInterest,
    };
  }
}
