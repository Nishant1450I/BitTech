export type InfrastructureType =
  | 'STREETLIGHT'
  | 'FOOTPATH'
  | 'WHEELCHAIR_RAMP'
  | 'PUBLIC_TOILET'
  | 'DRINKING_WATER'
  | 'BUS_STOP'
  | 'TRAFFIC_SIGNAL'
  | 'OTHER';

export type InfrastructureStatus =
  | 'WORKING'
  | 'WARNING'
  | 'BROKEN'
  | 'MISSING'
  | 'INACCESSIBLE'
  | 'UNKNOWN';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'COMMUNITY_VERIFIED'
  | 'OFFICIALLY_VERIFIED';

export interface InfrastructureMapMarkerDTO {
  id: string;
  type: InfrastructureType;
  name: string;
  status: InfrastructureStatus;
  severity: SeverityLevel;
  latitude: Float;
  longitude: Float;
  address: string | null;
  reportCount: number;
  verificationStatus: VerificationStatus;
  imageUrl?: string | null;
}

export type Float = number;
