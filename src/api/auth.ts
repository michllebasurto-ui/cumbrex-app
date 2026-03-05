import type { LoginPayload, RegisterPayload, AuthTokens, User } from '../types';
import apiClient from './client';

export async function login(
  email: string,
  password: string,
  subdomain?: string,
): Promise<{ tokens: AuthTokens; user: User }> {
  const payload: LoginPayload = { email, password, subdomain };
  const { data } = await apiClient.post<{ tokens: AuthTokens; user: User }>(
    '/api/auth/login',
    payload,
  );
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<{ tokens: AuthTokens; user: User }> {
  const { data } = await apiClient.post<{ tokens: AuthTokens; user: User }>(
    '/api/auth/register',
    payload,
  );
  return data;
}

export async function refreshToken(
  token: string,
): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/api/auth/refresh', {
    refreshToken: token,
  });
  return data;
}
