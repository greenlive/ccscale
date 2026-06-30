import { Injectable, Logger } from '@nestjs/common';

export interface GeoData {
  country: string | null;
  region: string | null;
  city: string | null;
}

/**
 * Geolocate visitor IPs by calling the ip-api.com public service.
 *
 * Notes:
 *  - Endpoint is the public free tier (45 req/min per source IP, no
 *    commercial SLA). For production load, switch to a paid plan or a
 *    self-hosted MaxMind GeoLite2 database; this service is the only
 *    integration point that would need to change.
 *  - All errors are logged but never thrown; geo lookup is a
 *    best-effort enrichment on analytics events and must not break
 *    request handling.
 *  - Responses are cached in-process forever; this is safe for a
 *    typical site where the same visitor IP returns a few times a
 *    day, and removes the 45 req/min pressure entirely.
 */
@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private readonly cache = new Map<string, GeoData>();

  // The ip-api.com hostname is HTTPS by default; we pin the version
  // and request only the fields we use.
  private readonly endpoint = 'https://ip-api.com/json/';

  async getGeoFromIP(ipAddress: string): Promise<GeoData> {
    if (this.isPrivateIP(ipAddress)) {
      return { country: null, region: null, city: null };
    }

    const cached = this.cache.get(ipAddress);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.endpoint}${ipAddress}?fields=status,country,regionName,city`, {
        headers: {
          'User-Agent': 'ZZScale-API/1.0 (+https://www.zzscale.com)',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(`geo lookup non-2xx for ${ipAddress}: ${response.status}`);
        return { country: null, region: null, city: null };
      }

      const data = (await response.json()) as {
        status: string;
        country: string;
        regionName: string;
        city: string;
      };

      if (data.status !== 'success') {
        this.logger.warn(`geo lookup unsuccessful for ${ipAddress}: ${data.status}`);
        return { country: null, region: null, city: null };
      }

      const geoData: GeoData = {
        country: data.country ?? null,
        region: data.regionName ?? null,
        city: data.city ?? null,
      };
      this.cache.set(ipAddress, geoData);
      return geoData;
    } catch (error) {
      this.logger.warn(`geo lookup error for ${ipAddress}: ${(error as Error).message}`);
      return { country: null, region: null, city: null };
    }
  }

  /**
   * Check if an IP is in a private/reserved range and therefore not
   * worth geolocating.
   */
  private isPrivateIP(ip: string): boolean {
    if (!ip) return true;

    const privateRanges = [
      /^127./,           // Loopback
      /^10./,            // Class A
      /^172.(1[6-9]|2d|3[01])./,  // Class B
      /^192.168./,      // Class C
      /^169.254./,      // Link-local
      /^::1$/,            // IPv6 loopback
      /^fe80:/i,          // IPv6 link-local
      /^fc00:/i,          // IPv6 unique local
      /^fd/i,             // IPv6 ULA prefix
    ];

    return privateRanges.some((range) => range.test(ip));
  }
}
