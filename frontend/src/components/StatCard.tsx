import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'emerald' | 'rose' | 'amber' | 'blue' | 'slate';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = 'slate',
  className = '',
}) => {
  const colorStyles = {
    emerald: {
      border: 'border-emerald-200 dark:border-emerald-800/60',
      iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400',
      valColor: 'text-emerald-700 dark:text-emerald-400',
      barBg: 'bg-emerald-500',
    },
    rose: {
      border: 'border-rose-200 dark:border-rose-800/60',
      iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400',
      valColor: 'text-rose-700 dark:text-rose-400',
      barBg: 'bg-rose-500',
    },
    amber: {
      border: 'border-amber-200 dark:border-amber-800/60',
      iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400',
      valColor: 'text-amber-700 dark:text-amber-400',
      barBg: 'bg-amber-500',
    },
    blue: {
      border: 'border-blue-200 dark:border-blue-800/60',
      iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400',
      valColor: 'text-blue-700 dark:text-blue-400',
      barBg: 'bg-blue-500',
    },
    slate: {
      border: 'border-slate-200 dark:border-slate-800',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      valColor: 'text-slate-900 dark:text-white',
      barBg: 'bg-slate-500',
    },
  };

  const scheme = colorStyles[color];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-xs dark:bg-slate-900 transition-all hover:shadow-md ${scheme.border} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${scheme.valColor}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {badge && (
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${scheme.iconBg}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${scheme.barBg} opacity-80`} />
    </div>
  );
};
