import type { Module } from '../types';
import apiClient from './client';

export async function getModules(): Promise<Module[]> {
  const { data } = await apiClient.get<Module[]>('/api/modules');
  return data;
}

export async function toggleModule(moduleId: string): Promise<Module> {
  const { data } = await apiClient.post<Module>(`/api/modules/${moduleId}/toggle`);
  return data;
}
