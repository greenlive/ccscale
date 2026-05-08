import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { GeoService } from './geo.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, GeoService],
  exports: [AnalyticsService, GeoService],
})
export class AnalyticsModule {}
