import {
  InfrastructureType,
  InfrastructureStatus,
  SeverityLevel,
} from '../types/infrastructure';
import {
  Lightbulb,
  Footprints,
  Accessibility,
  Bath,
  Droplet,
  Bus,
  Activity,
  Layers,
} from 'lucide-react';

export const INFRA_TYPE_LABELS: Record<InfrastructureType, string> = {
  streetlight: 'Streetlight',
  footpath: 'Footpath / Sidewalk',
  wheelchair_ramp: 'Wheelchair Ramp',
  public_toilet: 'Public Restroom',
  drinking_water: 'Drinking Water',
  bus_stop: 'Bus Shelter',
  traffic_signal: 'Traffic Signal',
  other: 'Public Facility',
};

export const INFRA_TYPE_ICONS: Record<InfrastructureType, React.ElementType> = {
  streetlight: Lightbulb,
  footpath: Footprints,
  wheelchair_ramp: Accessibility,
  public_toilet: Bath,
  drinking_water: Droplet,
  bus_stop: Bus,
  traffic_signal: Activity,
  other: Layers,
};

export function getStatusColor(status: InfrastructureStatus): {
  color: string;
  hex: string;
  badgeBg: string;
  border: string;
} {
  switch (status) {
    case 'working':
      return {
        color: 'text-emerald-600 dark:text-emerald-400',
        hex: '#059669',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-300 dark:border-emerald-800',
      };
    case 'warning':
      return {
        color: 'text-amber-600 dark:text-amber-400',
        hex: '#d97706',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-300 dark:border-amber-800',
      };
    case 'broken':
      return {
        color: 'text-rose-600 dark:text-rose-400',
        hex: '#e11d48',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
        border: 'border-rose-300 dark:border-rose-800',
      };
    case 'unknown':
    default:
      return {
        color: 'text-slate-600 dark:text-slate-400',
        hex: '#64748b',
        badgeBg: 'bg-slate-50 dark:bg-slate-900',
        border: 'border-slate-300 dark:border-slate-700',
      };
  }
}

export function formatDate(isoString?: string): string {
  if (!isoString) return 'Not yet verified';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) return formatDate(isoString);
    if (diffDays > 1) return `${diffDays} days ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffHours > 1) return `${diffHours} hours ago`;
    return 'Just now';
  } catch {
    return isoString;
  }
}
