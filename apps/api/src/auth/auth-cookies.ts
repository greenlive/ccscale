import { Response } from 'express';
import { ConfigType } from '@nestjs/config';
import configuration from '../config/configuration';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './auth.controller';

/**
 * Issue access + refresh tokens as httpOnly cookies.
 * - In production: Secure + SameSite=None (so cross-site admin works behind different subdomain)
 * - In development: Secure=false + SameSite=Lax (HTTP localhost)
 */
export function setAuthCookies(
  res: Response,
  config: ConfigType<typeof configuration>,
  accessToken: string,
  refreshToken?: string,
): void {
  const { secure, sameSite, domain } = config.cookie;
  const baseOpts = {
    httpOnly: true,
    secure,
    sameSite: sameSite as 'lax' | 'none' | 'strict',
    path: '/',
    ...(domain ? { domain } : {}),
  };
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseOpts,
    maxAge: 15 * 60 * 1000, // 15 minutes (matches JWT_ACCESS_TTL)
  });
  if (refreshToken) {
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...baseOpts,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}

export function clearAuthCookies(
  res: Response,
  config: ConfigType<typeof configuration>,
): void {
  const { domain } = config.cookie;
  const baseOpts = {
    httpOnly: true,
    path: '/',
    ...(domain ? { domain } : {}),
  };
  res.clearCookie(ACCESS_COOKIE, baseOpts);
  res.clearCookie(REFRESH_COOKIE, baseOpts);
}
