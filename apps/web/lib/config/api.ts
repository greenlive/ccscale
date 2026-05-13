/**
 * API Configuration
 * Centralized API URL configuration for the frontend
 */

/**
 * Get the full API URL for a given endpoint
 * Uses relative API paths that Next.js rewrites will proxy to the backend server.
 * @param endpoint - The API endpoint path (without leading slash)
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `/api/${cleanEndpoint}`;
}
