export interface RealityScoreInputItem {
  id: string;
  status: 'WORKING' | 'WARNING' | 'BROKEN' | 'MISSING' | 'INACCESSIBLE' | 'UNKNOWN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verificationStatus: 'UNVERIFIED' | 'COMMUNITY_VERIFIED' | 'OFFICIALLY_VERIFIED';
  reportCount?: number;
}

export interface RealityScoreInputReport {
  id: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'RESOLVED' | 'REJECTED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface RealityScoreBreakdown {
  totalAssets: number;
  workingAssets: number;
  warningAssets: number;
  brokenAssets: number;
  missingAssets: number;
  inaccessibleAssets: number;
  criticalIssuesCount: number;
  highIssuesCount: number;
  workingUsabilityScore: number;
  defectPenalty: number;
  severityPenalty: number;
  unresolvedReportsPenalty: number;
  verificationConfidenceFactor: number;
  realityScore: number;
  rating: 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'POOR' | 'CRITICAL';
  formulaExplanation: string;
}

/**
 * Calculates the Reality Score (0 - 100) for a geographic area or group of infrastructure assets.
 * 
 * Formula Concept:
 * - Base usability = (workingAssets / totalAssets) * 100
 * - Defect penalties weighted by verification confidence (Official = 1.0, Community = 0.85, Unverified = 0.5)
 * - Severity multiplier applied for Critical (-15) and High (-8) severity issues
 * - Active unresolved citizen reports impose an additional friction deduction
 * - Output is strictly normalized between 0 and 100
 */
export function calculateRealityScore(
  items: RealityScoreInputItem[],
  reports: RealityScoreInputReport[] = []
): RealityScoreBreakdown {
  const totalAssets = items.length;

  if (totalAssets === 0) {
    return {
      totalAssets: 0,
      workingAssets: 0,
      warningAssets: 0,
      brokenAssets: 0,
      missingAssets: 0,
      inaccessibleAssets: 0,
      criticalIssuesCount: 0,
      highIssuesCount: 0,
      workingUsabilityScore: 100,
      defectPenalty: 0,
      severityPenalty: 0,
      unresolvedReportsPenalty: 0,
      verificationConfidenceFactor: 1.0,
      realityScore: 100,
      rating: 'EXCELLENT',
      formulaExplanation: 'No infrastructure assets registered in this area. Default pristine score: 100.',
    };
  }

  let workingCount = 0;
  let warningCount = 0;
  let brokenCount = 0;
  let missingCount = 0;
  let inaccessibleCount = 0;
  let criticalCount = 0;
  let highCount = 0;

  let totalDefectWeightedPenalty = 0;
  let totalSeverityPenalty = 0;

  for (const item of items) {
    // Determine verification confidence weight
    let confidenceMultiplier = 0.5; // UNVERIFIED
    if (item.verificationStatus === 'OFFICIALLY_VERIFIED') {
      confidenceMultiplier = 1.0;
    } else if (item.verificationStatus === 'COMMUNITY_VERIFIED') {
      confidenceMultiplier = 0.85;
    }

    switch (item.status) {
      case 'WORKING':
        workingCount++;
        break;
      case 'WARNING':
        warningCount++;
        totalDefectWeightedPenalty += 4 * confidenceMultiplier;
        break;
      case 'BROKEN':
        brokenCount++;
        totalDefectWeightedPenalty += 10 * confidenceMultiplier;
        break;
      case 'MISSING':
        missingCount++;
        totalDefectWeightedPenalty += 12 * confidenceMultiplier;
        break;
      case 'INACCESSIBLE':
        inaccessibleCount++;
        totalDefectWeightedPenalty += 8 * confidenceMultiplier;
        break;
      case 'UNKNOWN':
      default:
        totalDefectWeightedPenalty += 2 * confidenceMultiplier;
        break;
    }

    if (item.status !== 'WORKING') {
      if (item.severity === 'CRITICAL') {
        criticalCount++;
        totalSeverityPenalty += 8 * confidenceMultiplier;
      } else if (item.severity === 'HIGH') {
        highCount++;
        totalSeverityPenalty += 4 * confidenceMultiplier;
      } else if (item.severity === 'MEDIUM') {
        totalSeverityPenalty += 2 * confidenceMultiplier;
      }
    }
  }

  // Calculate base usability ratio
  const workingUsabilityScore = Number(((workingCount / totalAssets) * 100).toFixed(1));

  // Scale defect and severity penalties relative to sample size
  const normalizedDefectPenalty = Math.min(60, Number(((totalDefectWeightedPenalty / totalAssets) * 5).toFixed(1)));
  const normalizedSeverityPenalty = Math.min(30, Number(((totalSeverityPenalty / totalAssets) * 4).toFixed(1)));

  // Active open reports penalty (unresolved citizen friction)
  const activeUnresolvedReports = reports.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW' || r.status === 'VERIFIED'
  );
  const unresolvedReportsPenalty = Math.min(15, Number((activeUnresolvedReports.length * 1.5).toFixed(1)));

  // Raw calculation: Base Usability - Defect Penalty - Severity Penalty - Open Reports Friction
  let rawScore = workingUsabilityScore - (normalizedDefectPenalty * 0.4) - normalizedSeverityPenalty - unresolvedReportsPenalty;

  // Bonus for high official verification rate
  const verifiedAssets = items.filter((i) => i.verificationStatus === 'OFFICIALLY_VERIFIED').length;
  const verifiedRatio = verifiedAssets / totalAssets;
  if (verifiedRatio > 0.5 && workingCount > brokenCount) {
    rawScore += 5 * verifiedRatio;
  }

  // Clamp strictly between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let rating: 'EXCELLENT' | 'GOOD' | 'DEGRADED' | 'POOR' | 'CRITICAL' = 'CRITICAL';
  if (finalScore >= 80) rating = 'EXCELLENT';
  else if (finalScore >= 60) rating = 'GOOD';
  else if (finalScore >= 40) rating = 'DEGRADED';
  else if (finalScore >= 20) rating = 'POOR';

  return {
    totalAssets,
    workingAssets: workingCount,
    warningAssets: warningCount,
    brokenAssets: brokenCount,
    missingAssets: missingCount,
    inaccessibleAssets: inaccessibleCount,
    criticalIssuesCount: criticalCount,
    highIssuesCount: highCount,
    workingUsabilityScore,
    defectPenalty: normalizedDefectPenalty,
    severityPenalty: normalizedSeverityPenalty,
    unresolvedReportsPenalty,
    verificationConfidenceFactor: Number(((verifiedAssets / totalAssets) || 0.5).toFixed(2)),
    realityScore: finalScore,
    rating,
    formulaExplanation:
      'Reality Score = Usability Ratio - Weighted Defect Penalty - Critical/High Severity Deduction - Unresolved Reports Friction + Verification Confidence Adjustment',
  };
}
