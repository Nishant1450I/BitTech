import {
  InfrastructureItem,
  InfrastructureStatus,
  FilterOptions,
} from '../types/infrastructure';
import { INITIAL_INFRASTRUCTURE } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// In-memory / browser-persistent store so citizen reports and status updates reflect immediately
let memoryInfrastructure: InfrastructureItem[] = [...INITIAL_INFRASTRUCTURE];

const isBrowser = typeof window !== 'undefined';

function getStoredInfrastructure(): InfrastructureItem[] {
  if (!isBrowser) return memoryInfrastructure;
  try {
    const stored = localStorage.getItem('dim_infrastructure');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // fallback
  }
  return memoryInfrastructure;
}

function saveStoredInfrastructure(items: InfrastructureItem[]): void {
  memoryInfrastructure = items;
  if (isBrowser) {
    try {
      localStorage.setItem('dim_infrastructure', JSON.stringify(items));
    } catch {
      // ignore
    }
  }
}

/**
 * Fetch all infrastructure records with optional filtering
 */
export async function getInfrastructure(filters?: FilterOptions): Promise<InfrastructureItem[]> {
  // If backend endpoint is active, we can call it:
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.type && filters.type !== 'all') queryParams.set('type', filters.type);
      if (filters?.status && filters.status !== 'all') queryParams.set('status', filters.status);
      if (filters?.severity && filters.severity !== 'all') queryParams.set('severity', filters.severity);
      if (filters?.query) queryParams.set('q', filters.query);

      const res = await fetch(`${API_BASE_URL}/infrastructure?${queryParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, falling back to local dataset', err);
    }
  }

  // Simulated latency for realistic UX with loading states
  await new Promise((resolve) => setTimeout(resolve, 80));

  let items = getStoredInfrastructure();

  if (!filters) return items;

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }

  if (filters.type && filters.type !== 'all') {
    items = items.filter((item) => item.type === filters.type);
  }

  if (filters.status && filters.status !== 'all') {
    items = items.filter((item) => item.status === filters.status);
  }

  if (filters.severity && filters.severity !== 'all') {
    items = items.filter((item) => item.severity === filters.severity);
  }

  if (filters.verificationStatus && filters.verificationStatus !== 'all') {
    items = items.filter((item) => item.verificationStatus === filters.verificationStatus);
  }

  if (filters.area && filters.area !== 'all') {
    items = items.filter((item) => item.area.toLowerCase() === filters.area?.toLowerCase());
  }

  return items;
}

/**
 * Fetch a single infrastructure record by ID
 */
export async function getInfrastructureById(id: string): Promise<InfrastructureItem | null> {
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const res = await fetch(`${API_BASE_URL}/infrastructure/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, falling back to local dataset', err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 60));
  const items = getStoredInfrastructure();
  const found = items.find((item) => item.id.toLowerCase() === id.toLowerCase());
  return found || null;
}

/**
 * Update the status of an infrastructure item (e.g. mark as resolved, report again)
 */
export async function updateInfrastructureStatus(
  id: string,
  newStatus: InfrastructureStatus,
  actionNotes?: string
): Promise<InfrastructureItem> {
  if (process.env.NEXT_PUBLIC_ENABLE_REAL_API === 'true') {
    try {
      const res = await fetch(`${API_BASE_URL}/infrastructure/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: actionNotes }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API unavailable, updating local cache', err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  const items = getStoredInfrastructure();
  const index = items.findIndex((item) => item.id.toLowerCase() === id.toLowerCase());

  if (index === -1) {
    throw new Error(`Infrastructure item with id ${id} not found.`);
  }

  const current = items[index];
  const updated: InfrastructureItem = {
    ...current,
    status: newStatus,
    lifecycleStage: newStatus === 'working' ? 'resolved' : 'verified',
    verifiedAt: new Date().toISOString(),
    history: [
      {
        id: `H-${id}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: newStatus === 'working' ? 'Marked as Resolved' : `Status updated to ${newStatus}`,
        author: 'Community Verification Audit',
        stage: newStatus === 'working' ? 'resolved' : 'verified',
        details: actionNotes || 'Updated status based on citizen inspection report.',
      },
      ...current.history,
    ],
  };

  items[index] = updated;
  saveStoredInfrastructure(items);
  return updated;
}

/**
 * Upvote / endorse an infrastructure problem to raise community priority
 */
export async function upvoteInfrastructure(id: string): Promise<InfrastructureItem> {
  const items = getStoredInfrastructure();
  const index = items.findIndex((item) => item.id.toLowerCase() === id.toLowerCase());
  if (index === -1) throw new Error('Item not found');

  const current = items[index];
  const updated = {
    ...current,
    reportCount: current.reportCount + 1,
    upvotes: (current.upvotes || 0) + 1,
  };

  items[index] = updated;
  saveStoredInfrastructure(items);
  return updated;
}
