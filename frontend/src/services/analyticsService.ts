import { AnalyticsStats, AreaRealityScore } from '../types/infrastructure';
import { ANALYTICS_DATA, AREA_REALITY_SCORES } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Get comprehensive analytics statistics
 */
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, returning local analytics dataset', err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 80));
  return ANALYTICS_DATA;
}

/**
 * Get Reality Scores for all tracked city areas
 */
export async function getRealityScores(): Promise<AreaRealityScore[]> {
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/reality-scores`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, returning local reality scores', err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 60));
  return AREA_REALITY_SCORES;
}

/**
 * Get Reality Score for a specific area by areaId
 */
export async function getAreaRealityScore(areaId: string): Promise<AreaRealityScore | null> {
  const scores = await getRealityScores();
  return scores.find((s) => s.areaId.toLowerCase() === areaId.toLowerCase()) || null;
}
