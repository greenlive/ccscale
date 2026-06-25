import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TurnstileService } from '../common/turnstile.service';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [HealthController],
  providers: [TurnstileService],
})
export class HealthModule {}