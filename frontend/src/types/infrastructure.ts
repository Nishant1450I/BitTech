export type InfrastructureType =
  | 'streetlight'
  | 'footpath'
  | 'wheelchair_ramp'
  | 'public_toilet'
  | 'drinking_water'
  | 'bus_stop'
  | 'traffic_signal'
  | 'other';

export type InfrastructureStatus = 'working' | 'warning' | 'broken' | 'unknown';

export type IssueCondition =
  | 'broken'
  | 'missing'
  | 'blocked'
  | 'inaccessible'
  | 'unsafe'
  | 'not_working'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type VerificationStatus =
  | 'community_verified'
  | 'officially_verified'
  | 'unverified';

export type LifecycleStage =
  | 'reported'
  | 'under_review'
  | 'verified'
  | 'resolved';

export interface InfrastructureHistoryItem {
  id: string;
  timestamp: string;
  action: string;
  author: string;
  details?: string;
  stage: LifecycleStage;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  type: InfrastructureType;
  status: InfrastructureStatus;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  description: string;
  imageUrl?: string;
  reportedAt: string;
  verifiedAt?: string;
  reportCount: number;
  verificationStatus: VerificationStatus;
  lifecycleStage: LifecycleStage;
  officialRecordStatus: 'officially_operational' | 'scheduled_maintenance' | 'unrecorded';
  history: InfrastructureHistoryItem[];
  upvotes?: number;
}

export interface CitizenReport {
  id: string;
  infrastructureId?: string;
  type: InfrastructureType;
  issueCondition: IssueCondition;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  severity: SeverityLevel;
  status: InfrastructureStatus;
  imageUrl?: string;
  createdAt: string;
  reporterName?: string;
  verificationStatus: VerificationStatus;
  upvotes: number;
}

export interface NewReportPayload {
  infrastructureId?: string;
  type: InfrastructureType;
  issueCondition: IssueCondition;
  severity: SeverityLevel;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  reporterName?: string;
  reporterContact?: string;
}

export interface CitizenReportResponse {
  success: boolean;
  referenceNumber: string;
  report: CitizenReport;
  message: string;
}

export interface AreaRealityScore {
  areaId: string;
  areaName: string;
  score: number; // 0 - 100
  totalFacilities: number;
  workingCount: number;
  brokenCount: number;
  warningCount: number;
  unknownCount: number;
  breakdown: {
    workingPercent: number;
    brokenPercent: number;
    inaccessiblePercent: number;
    unknownPercent: number;
  };
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: string;
}

export interface AnalyticsStats {
  totalInfrastructure: number;
  working: number;
  broken: number;
  underReview: number;
  critical: number;
  officialFacilitiesCount: number;
  realityVerifiedCount: number;
  deadUnusableCount: number;
  resolutionRatePercent: number;
  avgResolutionDays: number;
  issuesByType: {
    type: InfrastructureType;
    label: string;
    count: number;
    brokenCount: number;
  }[];
  issuesOverTime: {
    month: string;
    reported: number;
    resolved: number;
  }[];
  problematicAreas: {
    area: string;
    realityScore: number;
    brokenCount: number;
    criticalCount: number;
  }[];
}

export interface FilterOptions {
  query?: string;
  type?: InfrastructureType | 'all';
  status?: InfrastructureStatus | 'all';
  severity?: SeverityLevel | 'all';
  verificationStatus?: VerificationStatus | 'all';
  area?: string | 'all';
}
