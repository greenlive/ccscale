import { Injectable } from '@nestjs/common';

export interface GeoData {
  country: string | null;
  region: string | null;
  city: string | null;
}

@Injectable()
export class GeoService {
  private cache = new Map<string, GeoData>();

  /**
   * Get geolocation data from IP address using ip-api.com
   * Free tier: 45 requests per minute
   */
  async getGeoFromIP(ipAddress: string): Promise<GeoData> {
    // Skip private/local IPs
    if (this.isPrivateIP(ipAddress)) {
      return { country: null, region: null, city: null };
    }

    // Check cache first
    const cached = this.cache.get(ipAddress);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city`, {
        headers: {
          'User-Agent': 'CCScale-API/1.0',
        },
      });

      if (!response.ok) {
        return { country: null, region: null, city: null };
      }

      const data = await response.json() as {
        status: string;
        country: string;
        regionName: string;
        city: string;
      };

      if (data.status === 'success') {
        const geoData: GeoData = {
          country: data.country,
          region: data.regionName,
          city: data.city,
        };
        this.cache.set(ipAddress, geoData);
        return geoData;
      }

      return { country: null, region: null, city: null };
    } catch {
      return { country: null, region: null, city: null };
    }
  }

  /**
   * Check if IP is private/local
   */
  private isPrivateIP(ip: string): boolean {
    if (!ip) return true;

    // IPv4 private ranges
    const privateRanges = [
      /^127\./,           // Loopback
      /^10\./,            // Class A
      /^172\.(1[6-9]|2\d|3[01])\./,  // Class B
      /^192\.168\./,      // Class C
      /^169\.254\./,      // Link-local
      /^::1$/,            // IPv6 loopback
      /^fe80:/i,          // IPv6 link-local
    ];

    return privateRanges.some((range) => range.test(ip));
  }
}
