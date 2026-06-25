import { Controller, Get } from "@nestjs/common";
import { TurnstileService } from "../common/turnstile.service";

@Controller("health")
export class HealthController {
  constructor(private readonly turnstile: TurnstileService) {}

  @Get()
  check() {
    const turnstileReady = this.turnstile.isConfigured();
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        turnstile: turnstileReady ? "configured" : "bypassed",
      },
    };
  }
}