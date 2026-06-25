import { Module } from '@nestjs/common';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { TurnstileService } from '../common/turnstile.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NotificationsModule, AuthModule],
  controllers: [InquiriesController],
  providers: [InquiriesService, TurnstileService],
  exports: [InquiriesService],
})
export class InquiriesModule {}
