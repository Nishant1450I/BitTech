import React from 'react';
import { SeverityLevel } from '../types/infrastructure';
import { AlertCircle, Flame, ShieldAlert, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  className = '',
}) => {
  const configs = {
    critical: {
      label: 'Critical Severity',
      icon: Flame,
      style: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800',
    },
    high: {
      label: 'High Severity',
      icon: ShieldAlert,
      style: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800',
    },
    medium: {
      label: 'Medium Severity',
      icon: AlertCircle,
      style: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    },
    low: {
      label: 'Low Severity',
      icon: Info,
      style: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
    },
  };

  const config = configs[severity] || configs.low;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.style} ${sizeClasses[size]} ${className}`}
      aria-label={`Severity: ${config.label}`}
    >
      <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
