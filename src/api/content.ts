import type { Page, Section } from '../types';
import apiClient from './client';

export async function getPages(): Promise<Page[]> {
  const { data } = await apiClient.get<Page[]>('/api/content/pages');
  return data;
}

export async function getPage(id: string): Promise<Page> {
  const { data } = await apiClient.get<Page>(`/api/content/pages/${id}`);
  return data;
}

export async function saveSections(
  pageId: string,
  sections: Section[],
): Promise<Page> {
  const { data } = await apiClient.post<Page>(
    `/api/content/pages/${pageId}/sections`,
    { sections },
  );
  return data;
}

export async function publishPage(pageId: string): Promise<void> {
  await apiClient.post(`/api/content/pages/${pageId}/publish`);
}

export async function getPreview(pageId: string): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(
    `/api/content/pages/${pageId}/preview`,
  );
  return data.url;
}
