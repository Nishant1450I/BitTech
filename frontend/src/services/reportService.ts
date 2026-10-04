import {
  CitizenReport,
  NewReportPayload,
  CitizenReportResponse,
  InfrastructureItem,
} from '../types/infrastructure';
import { INITIAL_REPORTS, INITIAL_INFRASTRUCTURE } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

let memoryReports: CitizenReport[] = [...INITIAL_REPORTS];
const isBrowser = typeof window !== 'undefined';

function getStoredReports(): CitizenReport[] {
  if (!isBrowser) return memoryReports;
  try {
    const stored = localStorage.getItem('dim_reports');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // fallback
  }
  return memoryReports;
}

function saveStoredReports(reports: CitizenReport[]): void {
  memoryReports = reports;
  if (isBrowser) {
    try {
      localStorage.setItem('dim_reports', JSON.stringify(reports));
    } catch {
      // ignore
    }
  }
}

/**
 * Submit a new citizen report
 */
export async function submitReport(payload: NewReportPayload): Promise<CitizenReportResponse> {
  // If backend endpoint is configured:
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const formData = new FormData();
      formData.append('type', payload.type);
      formData.append('issueCondition', payload.issueCondition);
      formData.append('severity', payload.severity);
      formData.append('description', payload.description);
      formData.append('address', payload.address);
      formData.append('latitude', payload.latitude.toString());
      formData.append('longitude', payload.longitude.toString());
      if (payload.reporterName) formData.append('reporterName', payload.reporterName);
      if (payload.imageUrl) formData.append('imageUrl', payload.imageUrl);

      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, falling back to local storage', err);
    }
  }

  // Simulated latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  const randomSeq = Math.floor(10000 + Math.random() * 90000);
  const referenceNumber = `DIM-2026-${randomSeq}`;

  const newReport: CitizenReport = {
    id: referenceNumber,
    infrastructureId: payload.infrastructureId,
    type: payload.type,
    issueCondition: payload.issueCondition,
    description: payload.description,
    latitude: payload.latitude,
    longitude: payload.longitude,
    address: payload.address,
    severity: payload.severity,
    status: payload.issueCondition === 'broken' || payload.issueCondition === 'not_working' ? 'broken' : 'warning',
    imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString(),
    reporterName: payload.reporterName || 'Anonymous Citizen',
    verificationStatus: 'unverified',
    upvotes: 1,
  };

  const currentReports = getStoredReports();
  saveStoredReports([newReport, ...currentReports]);

  // Also reflect in infrastructure list so it appears immediately on map!
  if (isBrowser) {
    try {
      const raw = localStorage.getItem('dim_infrastructure');
      const items: InfrastructureItem[] = raw ? JSON.parse(raw) : [...INITIAL_INFRASTRUCTURE];

      const newInfraItem: InfrastructureItem = {
        id: `INF-${randomSeq}`,
        name: `${payload.type.replace('_', ' ').toUpperCase()} #${randomSeq}`,
        type: payload.type,
        status: newReport.status,
        severity: payload.severity,
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        area: payload.address.includes('Gangapur')
          ? 'Gangapur Road'
          : payload.address.includes('Nashik Road')
          ? 'Nashik Road'
          : payload.address.includes('Mahatma')
          ? 'Mahatma Nagar'
          : payload.address.includes('Panchavati')
          ? 'Panchavati'
          : 'College Road',
        description: payload.description,
        imageUrl: newReport.imageUrl,
        reportedAt: newReport.createdAt,
        reportCount: 1,
        verificationStatus: 'unverified',
        lifecycleStage: 'reported',
        officialRecordStatus: 'officially_operational',
        upvotes: 1,
        history: [
          {
            id: `H-${Date.now()}`,
            timestamp: newReport.createdAt,
            action: 'Report Submitted',
            author: newReport.reporterName || 'Citizen',
            stage: 'reported',
            details: payload.description,
          },
        ],
      };

      localStorage.setItem('dim_infrastructure', JSON.stringify([newInfraItem, ...items]));
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    referenceNumber,
    report: newReport,
    message: 'Report submitted successfully. Community verification is now active.',
  };
}

/**
 * Get all submitted citizen reports
 */
export async function getReports(infrastructureId?: string): Promise<CitizenReport[]> {
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const url = infrastructureId
        ? `${API_BASE_URL}/reports?infrastructureId=${infrastructureId}`
        : `${API_BASE_URL}/reports`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, falling back to local dataset', err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 60));
  const reports = getStoredReports();
  if (infrastructureId) {
    return reports.filter((r) => r.infrastructureId === infrastructureId);
  }
  return reports;
}

/**
 * Get report details by reference ID
 */
export async function getReportById(id: string): Promise<CitizenReport | null> {
  const reports = getStoredReports();
  return reports.find((r) => r.id.toLowerCase() === id.toLowerCase()) || null;
}
