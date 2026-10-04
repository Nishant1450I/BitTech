import React from 'react';
import { InfrastructureStatus } from '../types/infrastructure';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: InfrastructureStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = false,
  className = '',
}) => {
  const configs = {
    working: {
      label: 'WORKING',
      icon: CheckCircle2,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    },
    warning: {
      label: 'WARNING',
      icon: AlertTriangle,
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      dot: 'bg-amber-500',
    },
    broken: {
      label: 'DEAD / BROKEN',
      icon: XCircle,
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
      dot: 'bg-rose-500',
    },
    unknown: {
      label: 'UNKNOWN',
      icon: HelpCircle,
      bg: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
  };

  const config = configs[status] || configs.unknown;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase shadow-xs transition-colors ${config.bg} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dot} ${
            status === 'broken' ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      <Icon size={iconSizes[size]} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
