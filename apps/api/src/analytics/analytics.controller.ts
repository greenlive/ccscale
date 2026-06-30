import { Controller, Get, Post, Body, Query, Req, Headers, Ip } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { GeoService } from './geo.service';
import { parseTrafficSource, TrafficSource } from '../utils/source-parser';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly geoService: GeoService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return dashboard stats' })
  getDashboardStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getDashboardStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('session')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 sessions per minute per IP
  @ApiOperation({ summary: 'Track a user session with auto source detection' })
  @ApiResponse({ status: 201, description: 'Session tracked' })
  async trackSession(
    @Body()
    sessionData: {
      sessionId: string;
      ipAddress?: string;
      userAgent?: string;
      landingPage?: string;
      country?: string;
      deviceType?: string;
      browser?: string;
      os?: string;
    },
    @Req() req: Request,
    @Headers('referer') referer?: string,
    @Ip() clientIp?: string,
  ) {
    // Parse UTM parameters from landing page URL
    const url = sessionData.landingPage ? new URL(sessionData.landingPage) : null;
    const parsed = parseTrafficSource(url, referer || null);

    // Get IP from various sources (prefer passed ipAddress, then NestJS @Ip, then x-forwarded-for)
    let ip = sessionData.ipAddress || clientIp || '';
    // Handle x-forwarded-for header (may contain multiple IPs)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor && typeof forwardedFor === 'string') {
      ip = forwardedFor.split(',')[0].trim();
    }

    // Get geo location from IP
    let geoData = { country: sessionData.country || null, region: null, city: null };
    if (ip) {
      geoData = await this.geoService.getGeoFromIP(ip);
    }

    return this.analyticsService.trackSession({
      ...sessionData,
      ipAddress: ip || undefined,
      country: geoData.country || sessionData.country,
      region: geoData.region,
      city: geoData.city,
      utmSource: parsed.utmSource,
      utmMedium: parsed.utmMedium,
      utmCampaign: parsed.utmCampaign,
      utmContent: parsed.utmContent,
      utmTerm: parsed.utmTerm,
      trafficSource: parsed.trafficSource as TrafficSource,
      referrer: parsed.referrer,
    });
  }

  @Post('event')
  @Throttle({ short: { limit: 60, ttl: 60000 } }) // 60 events per minute per IP
  @ApiOperation({ summary: 'Track a user event' })
  @ApiResponse({ status: 201, description: 'Event tracked' })
  trackEvent(
    @Body()
    eventData: {
      sessionId: string;
      eventType: string;
      pageUrl?: string;
      productId?: number;
      data?: string;
    },
  ) {
    return this.analyticsService.trackEvent(eventData);
  }
}
