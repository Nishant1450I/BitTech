import { z } from 'zod';

export const InfrastructureTypeEnum = z.enum([
  'STREETLIGHT',
  'FOOTPATH',
  'WHEELCHAIR_RAMP',
  'PUBLIC_TOILET',
  'DRINKING_WATER',
  'BUS_STOP',
  'TRAFFIC_SIGNAL',
  'OTHER',
]);

export const InfrastructureStatusEnum = z.enum([
  'WORKING',
  'WARNING',
  'BROKEN',
  'MISSING',
  'INACCESSIBLE',
  'UNKNOWN',
]);

export const SeverityLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const VerificationStatusEnum = z.enum([
  'UNVERIFIED',
  'COMMUNITY_VERIFIED',
  'OFFICIALLY_VERIFIED',
]);

export const createInfrastructureSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  type: InfrastructureTypeEnum,
  status: InfrastructureStatusEnum.optional().default('WORKING'),
  severity: SeverityLevelEnum.optional().default('LOW'),
  description: z.string().max(1000).optional(),
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  address: z.string().max(300).optional(),
  imageUrl: z.string().url('Must be a valid URL').or(z.string().regex(/^https?:\/\//)).optional(),
  areaId: z.string().uuid().optional(),
});

export const updateInfrastructureSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  type: InfrastructureTypeEnum.optional(),
  status: InfrastructureStatusEnum.optional(),
  severity: SeverityLevelEnum.optional(),
  description: z.string().max(1000).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().max(300).optional().nullable(),
  imageUrl: z.string().url().or(z.string().regex(/^https?:\/\//)).optional().nullable(),
  verificationStatus: VerificationStatusEnum.optional(),
  areaId: z.string().uuid().optional().nullable(),
  statusChangeReason: z.string().max(500).optional(),
});

export const queryInfrastructureSchema = z.object({
  type: InfrastructureTypeEnum.optional(),
  status: InfrastructureStatusEnum.optional(),
  severity: SeverityLevelEnum.optional(),
  verificationStatus: VerificationStatusEnum.optional(),
  areaId: z.string().uuid().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().max(100).optional().default(10),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  format: z.enum(['full', 'markers']).optional().default('full'),
});

export type CreateInfrastructureInput = z.infer<typeof createInfrastructureSchema>;
export type UpdateInfrastructureInput = z.infer<typeof updateInfrastructureSchema>;
export type QueryInfrastructureInput = z.infer<typeof queryInfrastructureSchema>;
