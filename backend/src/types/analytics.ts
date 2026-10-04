import { RealityScoreBreakdown } from '../utils/realityScore';

export interface AnalyticsOverviewDTO {
  totalInfrastructure: number;
  working: number;
  broken: number;
  warning: number;
  unknown: number;
  critical: number;
  totalReports: number;
  verifiedReports: number;
  resolvedReports: number;
  resolutionRate: number; // percentage, e.g. 74.5
}

export interface StatusBreakdownDTO {
  status: string;
  count: number;
  percentage: number;
}

export interface TypeBreakdownDTO {
  type: string;
  total: number;
  working: number;
  broken: number;
  warning: number;
}

export interface TimelineDataPointDTO {
  date: string;
  reportsSubmitted: number;
  reportsResolved: number;
}

export interface AreaAnalyticsDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  totalAssets: number;
  brokenAssets: number;
  totalReports: number;
  resolvedReports: number;
  realityScore: number;
  breakdown: RealityScoreBreakdown;
}

export interface AreaComparisonItemDTO {
  areaId: string;
  area: string;
  realityScore: number;
  rating: string;
  totalAssets: number;
  brokenAssets: number;
}
