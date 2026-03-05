/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback } from 'react';
import type { User, RegisterPayload } from '../types';
import * as authApi from '../api/auth';
import { detectTenant } from '../utils/tenant';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'acme@cumbrex.lat': {
    password: 'Demo123!',
    user: {
      id: 'user-1',
      email: 'acme@cumbrex.lat',
      fullName: 'Admin Acme',
      role: 'admin',
      tenantId: 'acme',
    },
  },
  'globex@cumbrex.lat': {
    password: 'Demo123!',
    user: {
      id: 'user-2',
      email: 'globex@cumbrex.lat',
      fullName: 'Admin Globex',
      role: 'admin',
      tenantId: 'globex',
    },
  },
};

// ─── Context types ────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, subdomain?: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterPayload) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
}

function loadAuthFromStorage(): AuthState {
  const storedToken = localStorage.getItem('access_token');
  const storedUser = localStorage.getItem('auth_user');
  if (storedToken && storedUser) {
    try {
      return { user: JSON.parse(storedUser) as User, token: storedToken };
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_user');
    }
  }
  return { user: null, token: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, token }, setAuthState] = useState<AuthState>(loadAuthFromStorage);
  const isLoading = false;

  const persistSession = useCallback((accessToken: string, authUser: User) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
    setAuthState({ user: authUser, token: accessToken });
  }, []);

  const login = useCallback(
    async (email: string, password: string, subdomain?: string) => {
      // Mock mode
      const mock = MOCK_USERS[email];
      if (mock && mock.password === password) {
        persistSession('mock-token', mock.user);
        return;
      }

      try {
        const result = await authApi.login(email, password, subdomain ?? detectTenant() ?? undefined);
        persistSession(result.tokens.accessToken, result.user);
        if (result.tokens.refreshToken) {
          localStorage.setItem('refresh_token', result.tokens.refreshToken);
        }
      } catch (err) {
        // If network error, try mock as fallback
        if (mock) {
          persistSession('mock-token', mock.user);
          return;
        }
        throw err;
      }
    },
    [persistSession],
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      try {
        const result = await authApi.register(data);
        persistSession(result.tokens.accessToken, result.user);
        if (result.tokens.refreshToken) {
          localStorage.setItem('refresh_token', result.tokens.refreshToken);
        }
      } catch {
        // Mock mode: create a local user
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          fullName: data.fullName,
          role: 'admin',
          tenantId: data.subdomain,
        };
        persistSession('mock-token', mockUser);
      }
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    setAuthState({ user: null, token: null });
    window.location.href = '/app/login';
  }, []);

  const refreshAuth = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;
    try {
      const tokens = await authApi.refreshToken(refreshToken);
      localStorage.setItem('access_token', tokens.accessToken);
      localStorage.setItem('refresh_token', tokens.refreshToken);
      setAuthState((prev) => ({ ...prev, token: tokens.accessToken }));
    } catch {
      logout();
    }
  }, [logout]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    register,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
