import { Controller, Get, Post, Body, Query, Req, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { parseTrafficSource } from '../utils/source-parser';
import { TrafficSource } from '@prisma/client';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

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
  @ApiOperation({ summary: 'Track a user session with auto source detection' })
  @ApiResponse({ status: 201, description: 'Session tracked' })
  trackSession(
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
  ) {
    // Parse UTM parameters from landing page URL
    const url = sessionData.landingPage ? new URL(sessionData.landingPage) : null;
    const parsed = parseTrafficSource(url, referer || null);

    return this.analyticsService.trackSession({
      ...sessionData,
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
