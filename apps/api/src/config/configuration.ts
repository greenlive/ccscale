/**
 * Centralized config loader with environment variable validation.
 *
 * Use `getEnv(name)` to read env vars; it throws in production if a
 * required variable is missing instead of falling back to insecure defaults.
 */

export const CONFIGURATION_KEY = "cc-scale-config";

function getEnv(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (fallback !== undefined) return fallback;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return "";
}

function getEnvNumber(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) {
    throw new Error(`Environment variable ${name} must be a number, got: ${v}`);
  }
  return n;
}

// In production, JWT_SECRET must be set AND at least 32 chars (HS256 best practice).
const isProd = process.env.NODE_ENV === "production";
const jwtSecret = getEnv("JWT_SECRET", isProd ? undefined : "dev-only-jwt-secret-not-for-production-use-32chars");
if (isProd && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

const configuration = () => ({
  port: getEnvNumber("PORT", 8000),
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    // No dev fallback. Set DATABASE_URL in apps/api/.env or your shell
    // (the docker-compose.yml service exposes postgres on 5432 with the
    // creds configured there). Hard-coding credentials here would leak
    // them into the source tree.
    url: getEnv("DATABASE_URL", undefined),
  },
  redis: {
    url: getEnv("REDIS_URL", isProd ? undefined : "redis://localhost:6379"),
  },
  cors: {
    origin: getEnv("CORS_ORIGIN", isProd ? "https://www.zzscale.com,https://admin.zzscale.com" : "http://localhost:3000,http://localhost:3001"),
  },
  jwt: {
    secret: jwtSecret,
    accessTtl: getEnv("JWT_ACCESS_TTL", "15m"),
    refreshTtl: getEnv("JWT_REFRESH_TTL", "7d"),
  },
  rateLimit: {
    ttlMs: getEnvNumber("RATE_LIMIT_TTL", 60) * 1000,
    max: getEnvNumber("RATE_LIMIT_MAX", 100),
    strict: process.env.RATE_LIMIT_STRICT === "true",
  },
  upload: {
    maxImageBytes: getEnvNumber("UPLOAD_MAX_IMAGE_BYTES", 10 * 1024 * 1024),
    maxVideoBytes: getEnvNumber("UPLOAD_MAX_VIDEO_BYTES", 200 * 1024 * 1024),
    maxDocumentBytes: getEnvNumber("UPLOAD_MAX_DOCUMENT_BYTES", 50 * 1024 * 1024),
  },
  cookie: {
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    domain: getEnv("COOKIE_DOMAIN", isProd ? ".zzscale.com" : undefined),
  },
  turnstile: {
    siteKey: getEnv("TURNSTILE_SITE_KEY", ""),
    secretKey: getEnv("TURNSTILE_SECRET_KEY", ""),
  },
});

export default configuration;
// Backwards compat: some guards/services referenced `configuration.KEY` (the
// @nestjs/config namespace token). We export the same constant so both styles
// work without changing every call site.
export const KEY = CONFIGURATION_KEY;

export { getEnv, getEnvNumber };