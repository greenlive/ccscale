import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configuration from './config/configuration';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ClientsModule } from './clients/clients.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CategoriesModule } from './categories/categories.module';
import { DownloadsModule } from './downloads/downloads.module';
import { UploadModule } from './upload/upload.module';
import { BlogModule } from './blog/blog.module';
import { CasesModule } from './cases/cases.module';
import { PageContentModule } from './page-content/page-content.module';
import { HealthModule } from './health/health.module';
import { SessionCleanupModule } from './utils/session-cleanup.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    AppConfigModule,
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
        limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      },
    ]),
    ProductsModule,
    InquiriesModule,
    AnalyticsModule,
    TestimonialsModule,
    ClientsModule,
    SiteSettingsModule,
    AuthModule,
    NotificationsModule,
    CategoriesModule,
    DownloadsModule,
    UploadModule,
    BlogModule,
    CasesModule,
    PageContentModule,
    HealthModule,
    SessionCleanupModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
