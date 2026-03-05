import type { TenantConfig } from '../types';
import apiClient from './client';

export async function getTenantConfig(): Promise<TenantConfig> {
  const { data } = await apiClient.get<TenantConfig>('/api/tenant/config');
  return data;
}

export async function updateTenantConfig(
  payload: Partial<TenantConfig>,
): Promise<TenantConfig> {
  const { data } = await apiClient.put<TenantConfig>('/api/tenant/config', payload);
  return data;
}
