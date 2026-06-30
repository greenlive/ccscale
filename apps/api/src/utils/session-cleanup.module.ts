import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionCleanupService } from './session-cleanup';

@Module({
  imports: [PrismaModule],
  providers: [SessionCleanupService],
  exports: [SessionCleanupService],
})
export class SessionCleanupModule {}
