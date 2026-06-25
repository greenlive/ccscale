/**
 * Edge Runtime API Example
 * 
 * This API route runs on Vercel Edge Network:
 * - Ultra-low latency (sub-50ms globally)
 * - No cold starts
 * - Limited to Edge-compatible APIs
 * 
 * Use cases:
 * - Geolocation-based redirects
 * - A/B testing
 * - Authentication checks
 * - Rate limiting (lightweight)
 * 
 * Limitations (cannot use):
 * - Node.js-specific APIs (fs, crypto, etc.)
 * - Database connections (use API routes instead)
 * - Large computations
 */

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Access edge-specific headers
  const geo = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');
  const region = request.headers.get('x-vercel-ip-country-region');
  
  // Get client's language preference
  const acceptLanguage = request.headers.get('accept-language');
  const preferredLang = acceptLanguage?.split(',')[0].split('-')[0] || 'en';

  return new Response(
    JSON.stringify({
      message: 'Hello from Edge!',
      edge: true,
      timestamp: new Date().toISOString(),
      geo: {
        country: geo || 'unknown',
        city: city || 'unknown',
        region: region || 'unknown',
      },
      client: {
        language: preferredLang,
        userAgent: request.headers.get('user-agent'),
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // CORS headers for cross-origin requests
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        // Cache on Edge for 60 seconds
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    }
  );
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}