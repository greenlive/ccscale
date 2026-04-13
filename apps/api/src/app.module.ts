import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configuration from './config/configuration';
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

@Module({
  imports: [
    // Serve uploaded files statically
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    // Rate limiting configuration
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10) * 1000, // Convert to ms
        limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      },
      {
        name: 'long',
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10) * 1000 * 60, // 1 hour in ms
        limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10) * 10,
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
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
