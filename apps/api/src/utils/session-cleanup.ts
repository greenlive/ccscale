import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Periodic cleanup of stale UserSession records.
 * Sessions older than 90 days are pruned to prevent unbounded DB growth.
 * Runs every 6 hours via setInterval; also callable externally from a cron.
 */
@Injectable()
export class SessionCleanupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SessionCleanupService.name);
  private readonly RETENTION_DAYS = 90;
  private readonly INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
  private timer: NodeJS.Timeout | null = null;

  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    this.logger.log('Session cleanup service started (interval: 6h)');
    this.timer = setInterval(async () => {
      try {
        await this.pruneOldSessions();
      } catch (err) {
        this.logger.error(`Session cleanup interval failed: ${(err as Error).message}`);
      }
    }, this.INTERVAL_MS);
  }

  /**
   * Delete UserSession and related SessionEvent records older than RETENTION_DAYS.
   * Returns the number of deleted sessions.
   */
  async pruneOldSessions(): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.RETENTION_DAYS);

    try {
      // Delete related events first (foreign key constraint)
      const eventsDeleted = await this.prisma.sessionEvent.deleteMany({
        where: {
          session: {
            firstVisit: { lt: cutoff },
          },
        },
      });

      // Delete old sessions
      const sessionsDeleted = await this.prisma.userSession.deleteMany({
        where: {
          firstVisit: { lt: cutoff },
        },
      });

      if (sessionsDeleted.count > 0) {
        this.logger.log(
          `Pruned ${sessionsDeleted.count} old sessions (${eventsDeleted.count} related events)`,
        );
      }
      return sessionsDeleted.count;
    } catch (error) {
      this.logger.error(
        `Session cleanup failed: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return 0;
    }
  }
}
