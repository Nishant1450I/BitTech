import React from 'react';
import { VerificationStatus } from '../types/infrastructure';
import { CheckCheck, BadgeCheck, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const configs = {
    community_verified: {
      label: 'Community Verified',
      icon: CheckCheck,
      style: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    officially_verified: {
      label: 'Officially Verified',
      icon: BadgeCheck,
      style: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    },
    unverified: {
      label: 'Unverified Citizen Report',
      icon: AlertCircle,
      style: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    },
  };

  const config = configs[status] || configs.unverified;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.style} ${sizeClasses[size]} ${className}`}
      aria-label={`Verification: ${config.label}`}
    >
      <Icon size={size === 'sm' ? 12 : 14} className="shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
