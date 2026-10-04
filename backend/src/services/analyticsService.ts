import { prisma } from '../config/database';
import { calculateRealityScore } from '../utils/realityScore';
import {
  AnalyticsOverviewDTO,
  AreaAnalyticsDTO,
  AreaComparisonItemDTO,
  StatusBreakdownDTO,
  TimelineDataPointDTO,
  TypeBreakdownDTO,
} from '../types/analytics';

export class AnalyticsService {
  /**
   * High-level executive overview metrics
   */
  async getOverview(): Promise<AnalyticsOverviewDTO> {
    const [
      totalInfrastructure,
      working,
      broken,
      warning,
      unknown,
      critical,
      totalReports,
      verifiedReports,
      resolvedReports,
    ] = await Promise.all([
      prisma.infrastructure.count(),
      prisma.infrastructure.count({ where: { status: 'WORKING' } }),
      prisma.infrastructure.count({ where: { status: 'BROKEN' } }),
      prisma.infrastructure.count({ where: { status: 'WARNING' } }),
      prisma.infrastructure.count({ where: { status: 'UNKNOWN' } }),
      prisma.infrastructure.count({ where: { severity: 'CRITICAL', status: { not: 'WORKING' } } }),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'VERIFIED' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
    ]);

    const resolutionRate = totalReports > 0 ? Number(((resolvedReports / totalReports) * 100).toFixed(1)) : 0;

    return {
      totalInfrastructure,
      working,
      broken,
      warning,
      unknown,
      critical,
      totalReports,
      verifiedReports,
      resolvedReports,
      resolutionRate,
    };
  }

  /**
   * Infrastructure counts and percentages by status
   */
  async getStatusBreakdown(): Promise<StatusBreakdownDTO[]> {
    const total = await prisma.infrastructure.count();
    const grouped = await prisma.infrastructure.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return grouped.map((g) => ({
      status: g.status,
      count: g._count.status,
      percentage: total > 0 ? Number(((g._count.status / total) * 100).toFixed(1)) : 0,
    }));
  }

  /**
   * Infrastructure breakdown by asset type
   */
  async getTypesBreakdown(): Promise<TypeBreakdownDTO[]> {
    const items = await prisma.infrastructure.findMany({
      select: { type: true, status: true },
    });

    const typeMap: Record<string, { total: number; working: number; broken: number; warning: number }> = {};

    for (const item of items) {
      if (!typeMap[item.type]) {
        typeMap[item.type] = { total: 0, working: 0, broken: 0, warning: 0 };
      }
      typeMap[item.type].total++;
      if (item.status === 'WORKING') typeMap[item.type].working++;
      if (item.status === 'BROKEN' || item.status === 'MISSING') typeMap[item.type].broken++;
      if (item.status === 'WARNING' || item.status === 'INACCESSIBLE') typeMap[item.type].warning++;
    }

    return Object.entries(typeMap).map(([type, stats]) => ({
      type,
      ...stats,
    }));
  }

  /**
   * Reports timeline (last 14 days)
   */
  async getTimeline(days = 14): Promise<TimelineDataPointDTO[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const reports = await prisma.report.findMany({
      where: {
        createdAt: { gte: sinceDate },
      },
      select: {
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const timelineMap: Record<string, { reportsSubmitted: number; reportsResolved: number }> = {};

    // Initialize days
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      timelineMap[key] = { reportsSubmitted: 0, reportsResolved: 0 };
    }

    for (const rep of reports) {
      const key = rep.createdAt.toISOString().split('T')[0];
      if (timelineMap[key]) {
        timelineMap[key].reportsSubmitted++;
        if (rep.status === 'RESOLVED') {
          timelineMap[key].reportsResolved++;
        }
      }
    }

    return Object.entries(timelineMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  }

  /**
   * Reality score and statistics for all areas
   */
  async getAreasAnalytics(): Promise<AreaAnalyticsDTO[]> {
    const areas = await prisma.area.findMany({
      include: {
        infrastructures: {
          select: {
            id: true,
            status: true,
            severity: true,
            verificationStatus: true,
            reportCount: true,
          },
        },
        reports: {
          select: {
            id: true,
            status: true,
            severity: true,
          },
        },
      },
    });

    return areas.map((area) => {
      const breakdown = calculateRealityScore(area.infrastructures, area.reports);
      const brokenAssets = area.infrastructures.filter((i) => i.status === 'BROKEN' || i.status === 'MISSING').length;
      const resolvedReports = area.reports.filter((r) => r.status === 'RESOLVED').length;

      return {
        id: area.id,
        name: area.name,
        latitude: area.latitude,
        longitude: area.longitude,
        radius: area.radius,
        totalAssets: area.infrastructures.length,
        brokenAssets,
        totalReports: area.reports.length,
        resolvedReports,
        realityScore: breakdown.realityScore,
        breakdown,
      };
    });
  }

  /**
   * Reality score calculation breakdown for a specific area
   */
  async getAreaRealityScore(areaId: string) {
    const area = await prisma.area.findUnique({
      where: { id: areaId },
      include: {
        infrastructures: {
          select: {
            id: true,
            status: true,
            severity: true,
            verificationStatus: true,
            reportCount: true,
          },
        },
        reports: {
          select: {
            id: true,
            status: true,
            severity: true,
          },
        },
      },
    });

    if (!area) return null;

    const breakdown = calculateRealityScore(area.infrastructures, area.reports);

    return {
      areaId: area.id,
      areaName: area.name,
      ...breakdown,
    };
  }

  /**
   * Compare areas sorted by Reality Score
   */
  async compareAreas(): Promise<AreaComparisonItemDTO[]> {
    const areas = await this.getAreasAnalytics();
    return areas
      .map((a) => ({
        areaId: a.id,
        area: a.name,
        realityScore: a.realityScore,
        rating: a.breakdown.rating,
        totalAssets: a.totalAssets,
        brokenAssets: a.brokenAssets,
      }))
      .sort((a, b) => b.realityScore - a.realityScore);
  }
}

export const analyticsService = new AnalyticsService();
