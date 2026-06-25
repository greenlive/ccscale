import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import configuration, { CONFIGURATION_KEY } from '../config/configuration';
import { ConfigType } from '@nestjs/config';


interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify a Cloudflare Turnstile token server-side.
 * - If TURNSTILE_SECRET_KEY is not configured, the service allows the request
 *   (development convenience) but logs a warning.
 * - On verification failure, throws BadRequestException.
 */
@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  constructor(
    @Inject(CONFIGURATION_KEY)
    private readonly config: ConfigType<typeof configuration>,
  ) {}


  /**
   * Whether Turnstile is fully configured (secret key present).
   * Use this for /api/health, admin dashboard, and boot-time checks.
   */
  isConfigured(): boolean {
    return !!this.config.turnstile.secretKey;
  }

  /**
   * Whether the service is running in bypass mode (no secret in dev).
   * Production should always return false.
   */
  isBypassed(): boolean {
    return !this.config.turnstile.secretKey && this.config.nodeEnv !== "production";
  }

  /**
   * Assert the service is ready for production traffic.
   * Throws in production if TURNSTILE_SECRET_KEY is missing.
   * Call this from a bootstrap hook (e.g. main.ts after NestFactory.create).
   */
  assertProductionReady(): void {
    if (this.config.nodeEnv === "production" && !this.config.turnstile.secretKey) {
      throw new Error(
        "TURNSTILE_SECRET_KEY is required in production. " +
        "Set it in Railway/Vercel env vars, or disable Turnstile by removing " +
        "the TurnstileService injection from InquiriesController."
      );
    }
  }
  async verify(token: string | undefined, remoteIp?: string): Promise<void> {
    const secret = this.config.turnstile.secretKey;
    if (!secret) {
      if (this.config.nodeEnv === 'production') {
        throw new BadRequestException('Turnstile is required but not configured');
      }
      this.logger.warn('TURNSTILE_SECRET_KEY not set; skipping verification in non-production');
      return;
    }
    if (!token) {
      throw new BadRequestException('Turnstile token is required');
    }
    try {
      const body = new URLSearchParams();
      body.set('secret', secret);
      body.set('response', token);
      if (remoteIp) body.set('remoteip', remoteIp);
      const resp = await fetch(this.VERIFY_URL, { method: 'POST', body });
      const data = (await resp.json()) as TurnstileResponse;
      if (!data.success) {
        this.logger.warn(`Turnstile failed: ${(data['error-codes'] || []).join(',')}`);
        throw new BadRequestException('Turnstile verification failed');
      }
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      this.logger.error('Turnstile service error', (e as Error).message);
      throw new BadRequestException('Turnstile verification error');
    }
  }
}
