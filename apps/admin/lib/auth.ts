// Use relative URLs so requests go through Next.js rewrites, avoiding CORS issues
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
}

// Token refresh helper
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string } | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
     credentials: 'include'});

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
   credentials: 'include'});

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<AdminUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
   credentials: 'include'});

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return response.json();
}

export async function getAllUsers(token: string): Promise<AdminUser[]> {
  const response = await fetch(`${API_URL}/api/auth/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
   credentials: 'include'});

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function updateUserRole(token: string, userId: number, role: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
   credentials: 'include'});

  if (!response.ok) {
    throw new Error('Failed to update user role');
  }
}

export async function deleteUser(token: string, userId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/users/${userId}/delete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
   credentials: 'include'});

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

export async function registerUser(
  token: string,
  email: string,
  password: string,
  name: string,
  role: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password, name, role }),
   credentials: 'include'});

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  return response.json();
}

// Token management
const TOKEN_KEY = 'cc-scale-admin-token';
const USER_KEY = 'cc-scale-admin-user';
const REFRESH_TOKEN_KEY = 'cc-scale-admin-refresh-token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredAuth(
  token: string,
  user: AdminUser,
  refreshToken?: string
): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Auto-refresh token before expiry
export async function ensureValidToken(): Promise<string | null> {
  const token = getStoredToken();
  const refreshToken = getStoredRefreshToken();

  if (!token || !refreshToken) {
    return null;
  }

  // Try to refresh if token is about to expire (check JWT expiry)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();

    // Refresh if token expires in less than 5 minutes
    if (exp - now < 5 * 60 * 1000) {
      const newToken = await refreshAccessToken(refreshToken);
      if (newToken) {
        const user = getStoredUser();
        if (user) {
          setStoredAuth(newToken.accessToken, user, refreshToken);
          return newToken.accessToken;
        }
      }
      // Refresh failed, clear auth
      clearStoredAuth();
      return null;
    }
  } catch {
    // Invalid token format, try refresh
    const newToken = await refreshAccessToken(refreshToken);
    if (newToken) {
      const user = getStoredUser();
      if (user) {
        setStoredAuth(newToken.accessToken, user, refreshToken);
        return newToken.accessToken;
      }
    }
    // Refresh also failed — clear auth so the caller redirects to login
    clearStoredAuth();
    return null;
  }

  return token;
}
