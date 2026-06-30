import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Periodic cleanup of stale UserSession records.
 * Sessions older than 90 days are pruned to prevent unbounded DB growth.
 * 
 * Usage: call pruneOldSessions() from a cron job or scheduled task.
 * For Railway: use a simple cron (e.g. every 6 hours).
 * For Vercel: use Vercel Cron Jobs or a GitHub Actions workflow.
 */
@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);
  private readonly RETENTION_DAYS = 90;

  constructor(private prisma: PrismaService) {}

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
