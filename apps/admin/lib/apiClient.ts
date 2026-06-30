/**
 * Authenticated API Client for Admin App
 * Automatically attaches Bearer tokens and handles 401 responses with retry logic
 */

import { ensureValidToken, clearStoredAuth } from './auth';

// Use relative URLs so requests go through Next.js rewrites, avoiding CORS issues
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const MAX_RETRIES = 1; // Retry once on 401

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Make authenticated API request with automatic token handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  // Endpoints we must not retry on 401 (would loop or conflict with
  // the cookie-based refresh we do just below).
  const isLogin = endpoint.includes('/auth/login');
  const isRefresh = endpoint.includes('/auth/refresh');

  // Ensure we have a valid token
  const token = await ensureValidToken();

  if (!token && !endpoint.includes('/auth/login')) {
    // Not authenticated, redirect to login
    if (typeof window !== 'undefined') {
      clearStoredAuth();
      window.location.href = '/login';
    }
    return {
      success: false,
      error: { message: 'Not authenticated', status: 401 },
    };
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth header if we have a token
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle 401 Unauthorized
    if (response.status === 401 && retryCount < MAX_RETRIES && !isLogin && !isRefresh) {
      // The backend reads the cc_refresh httpOnly cookie; we just POST
      // with credentials: 'include' and let the browser attach it.
      const refreshed = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (refreshed.ok) {
        return apiRequest<T>(endpoint, options, retryCount + 1);
      }
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        clearStoredAuth();
        window.location.href = '/login';
      }
      return {
        success: false,
        error: { message: 'Session expired', status: 401 },
      };
    }

    // Parse response
    let data: any;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle NestJS validation error format where message can be an array
      let errorMessage = data?.message || data?.error || 'Request failed';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      return {
        success: false,
        error: {
          message: errorMessage,
          status: response.status,
          errors: data?.errors,
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    // Network error
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      },
    };
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),

  /**
   * Upload file with multipart form data
   */
  upload: async <T>(
    endpoint: string,
    file: File,
    uploadType: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> => {
    const token = await ensureValidToken();

    if (!token) {
      if (typeof window !== 'undefined') {
        clearStoredAuth();
        window.location.href = '/login';
      }
      return {
        success: false,
        error: { message: 'Not authenticated', status: 401 },
      };
    }

    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 401) {
          if (typeof window !== 'undefined') {
            clearStoredAuth();
            window.location.href = '/login';
          }
          resolve({
            success: false,
            error: { message: 'Session expired', status: 401 },
          });
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({ success: true, data });
          } catch {
            resolve({ success: true, data: xhr.responseText as any });
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              success: false,
              error: {
                message: data?.message || 'Upload failed',
                status: xhr.status,
              },
            });
          } catch {
            resolve({
              success: false,
              error: { message: 'Upload failed', status: xhr.status },
            });
          }
        }
      };

      xhr.onerror = () => {
        resolve({
          success: false,
          error: { message: 'Network error', status: 0 },
        });
      };

      xhr.open('POST', `${API_URL}/api/upload/${uploadType}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  /**
   * Upload multiple files
   */
  uploadMultiple: async <T>(
    endpoint: string,
    files: File[],
    uploadType: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> => {
    const token = await ensureValidToken();

    if (!token) {
      if (typeof window !== 'undefined') {
        clearStoredAuth();
        window.location.href = '/login';
      }
      return {
        success: false,
        error: { message: 'Not authenticated', status: 401 },
      };
    }

    return new Promise((resolve) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 401) {
          if (typeof window !== 'undefined') {
            clearStoredAuth();
            window.location.href = '/login';
          }
          resolve({
            success: false,
            error: { message: 'Session expired', status: 401 },
          });
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({ success: true, data });
          } catch {
            resolve({ success: true, data: xhr.responseText as any });
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              success: false,
              error: {
                message: data?.message || 'Upload failed',
                status: xhr.status,
              },
            });
          } catch {
            resolve({
              success: false,
              error: { message: 'Upload failed', status: xhr.status },
            });
          }
        }
      };

      xhr.onerror = () => {
        resolve({
          success: false,
          error: { message: 'Network error', status: 0 },
        });
      };

      xhr.open('POST', `${API_URL}/api/upload/${uploadType}/multiple`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },
};

export default api;
