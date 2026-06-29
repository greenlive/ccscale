'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, getStoredToken, getStoredUser, setStoredAuth, clearStoredAuth, ensureValidToken } from '@/lib/auth';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth on mount
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  // Auto-refresh token periodically
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      const newToken = await ensureValidToken();
      if (newToken) {
        setToken(newToken);
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [token]);

  const login = async (email: string, password: string, redirectTo?: string) => {
    const { login: apiLogin } = await import('@/lib/auth');
    const response = await apiLogin(email, password);

    const userData: AdminUser = {
      id: response.id,
      email: response.email,
      name: response.name,
      role: response.role as AdminUser['role'],
    };

    setStoredAuth(response.accessToken, userData, response.refreshToken);
    setToken(response.accessToken);
    setUser(userData);
    // Only honour internal paths (defence in depth; login page also sanitises).
    const safeRedirect = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/dashboard';
    router.push(safeRedirect);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const refreshToken = async () => {
    const newToken = await ensureValidToken();
    if (newToken) {
      setToken(newToken);
    } else {
      // Token refresh failed, logout
      logout();
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
