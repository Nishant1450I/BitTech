import { z } from 'zod';
import { SeverityLevelEnum } from './infrastructureSchema';

export const IssueTypeEnum = z.enum([
  'BROKEN',
  'MISSING',
  'BLOCKED',
  'INACCESSIBLE',
  'UNSAFE',
  'NOT_WORKING',
  'OTHER',
]);

export const ReportStatusEnum = z.enum([
  'SUBMITTED',
  'UNDER_REVIEW',
  'VERIFIED',
  'RESOLVED',
  'REJECTED',
]);

export const VerificationTypeEnum = z.enum(['COMMUNITY', 'OFFICIAL']);

export const createReportSchema = z.object({
  infrastructureId: z.string().uuid().optional().nullable(),
  areaId: z.string().uuid().optional().nullable(),
  issueType: IssueTypeEnum,
  description: z.string().min(5, 'Description must be at least 5 characters').max(2000),
  severity: SeverityLevelEnum.optional().default('MEDIUM'),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  imageUrl: z.string().url('Must be a valid image URL').or(z.string().regex(/^https?:\/\//)).optional().nullable(),
  reporterName: z.string().max(100).optional().nullable(),
  reporterContact: z.string().max(100).optional().nullable(),
});

export const updateReportSchema = z.object({
  status: ReportStatusEnum.optional(),
  severity: SeverityLevelEnum.optional(),
  description: z.string().min(5).max(2000).optional(),
  imageUrl: z.string().url().or(z.string().regex(/^https?:\/\//)).optional().nullable(),
});

export const createVerificationSchema = z.object({
  verificationType: VerificationTypeEnum,
  verifiedBy: z.string().min(2, 'Verifier name or identity is required').max(100),
  notes: z.string().max(500).optional().nullable(),
});

export const queryReportSchema = z.object({
  infrastructureId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  issueType: IssueTypeEnum.optional(),
  status: ReportStatusEnum.optional(),
  severity: SeverityLevelEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export type CreateVerificationInput = z.infer<typeof createVerificationSchema>;
export type QueryReportInput = z.infer<typeof queryReportSchema>;
