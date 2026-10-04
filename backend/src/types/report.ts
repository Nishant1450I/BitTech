import { SeverityLevel } from './infrastructure';

export type IssueType =
  | 'BROKEN'
  | 'MISSING'
  | 'BLOCKED'
  | 'INACCESSIBLE'
  | 'UNSAFE'
  | 'NOT_WORKING'
  | 'OTHER';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'RESOLVED'
  | 'REJECTED';

export type VerificationType = 'COMMUNITY' | 'OFFICIAL';

export interface ReportDTO {
  id: string;
  infrastructureId: string | null;
  areaId: string | null;
  issueType: IssueType;
  description: string;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  status: ReportStatus;
  reporterName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
