/**
 * API Configuration
 * Centralized API URL configuration for the frontend
 */

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
} as const;

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint path (without leading slash)
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `${baseUrl}/api/${cleanEndpoint}`;
}

export default API_CONFIG;
