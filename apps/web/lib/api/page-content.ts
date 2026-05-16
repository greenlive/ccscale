/**
 * Server-side page content fetching
 */
import { getApiUrl } from '@/lib/config/api';

export interface PageContent {
  id: number;
  pageKey: string;
  titleEn: string;
  titleZh: string;
  contentEn?: string;
  contentZh?: string;
  metaEn?: string;
  metaZh?: string;
  updatedAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getPageContent(pageKey: string): Promise<PageContent | null> {
  try {
    const response = await fetch(`${API_BASE}/page-content/${pageKey}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (response.ok) {
      return response.json();
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch page content for ${pageKey}:`, error);
    return null;
  }
}

export async function getPageContents(pageKeys: string[]): Promise<PageContent[]> {
  try {
    const response = await fetch(`${API_BASE}/page-content?keys=${pageKeys.join(',')}`, {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      return response.json();
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch page contents:`, error);
    return [];
  }
}