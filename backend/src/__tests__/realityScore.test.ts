import { calculateRealityScore, RealityScoreInputItem, RealityScoreInputReport } from '../utils/realityScore';

describe('Reality Score Calculation Engine', () => {
  it('should return 100 with EXCELLENT rating when all infrastructure is working and verified', () => {
    const items: RealityScoreInputItem[] = [
      { id: '1', status: 'WORKING', severity: 'LOW', verificationStatus: 'OFFICIALLY_VERIFIED' },
      { id: '2', status: 'WORKING', severity: 'LOW', verificationStatus: 'OFFICIALLY_VERIFIED' },
      { id: '3', status: 'WORKING', severity: 'LOW', verificationStatus: 'COMMUNITY_VERIFIED' },
      { id: '4', status: 'WORKING', severity: 'LOW', verificationStatus: 'OFFICIALLY_VERIFIED' },
    ];

    const result = calculateRealityScore(items, []);
    expect(result.realityScore).toBe(100);
    expect(result.rating).toBe('EXCELLENT');
    expect(result.workingAssets).toBe(4);
    expect(result.brokenAssets).toBe(0);
  });

  it('should significantly penalize areas with critical broken assets and active citizen reports', () => {
    const items: RealityScoreInputItem[] = [
      { id: '1', status: 'BROKEN', severity: 'CRITICAL', verificationStatus: 'OFFICIALLY_VERIFIED' },
      { id: '2', status: 'BROKEN', severity: 'HIGH', verificationStatus: 'OFFICIALLY_VERIFIED' },
      { id: '3', status: 'MISSING', severity: 'HIGH', verificationStatus: 'COMMUNITY_VERIFIED' },
      { id: '4', status: 'WORKING', severity: 'LOW', verificationStatus: 'OFFICIALLY_VERIFIED' },
    ];

    const reports: RealityScoreInputReport[] = [
      { id: 'r1', status: 'SUBMITTED', severity: 'CRITICAL' },
      { id: 'r2', status: 'UNDER_REVIEW', severity: 'HIGH' },
      { id: 'r3', status: 'VERIFIED', severity: 'HIGH' },
    ];

    const result = calculateRealityScore(items, reports);
    expect(result.realityScore).toBeLessThan(40);
    expect(['DEGRADED', 'POOR', 'CRITICAL']).toContain(result.rating);
    expect(result.criticalIssuesCount).toBe(1);
    expect(result.unresolvedReportsPenalty).toBeGreaterThan(0);
  });

  it('should return default 100 for an empty asset list', () => {
    const result = calculateRealityScore([], []);
    expect(result.realityScore).toBe(100);
    expect(result.rating).toBe('EXCELLENT');
    expect(result.totalAssets).toBe(0);
  });
});
