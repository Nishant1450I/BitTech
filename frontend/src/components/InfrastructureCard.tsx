import React from 'react';
import Link from 'next/link';
import { InfrastructureItem } from '../types/infrastructure';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { VerificationBadge } from './VerificationBadge';
import { INFRA_TYPE_LABELS, INFRA_TYPE_ICONS, formatRelativeTime } from '../utils/infraHelpers';
import { MapPin, Users, ArrowRight } from 'lucide-react';

interface InfrastructureCardProps {
  item: InfrastructureItem;
  isSelected?: boolean;
  onSelect?: (item: InfrastructureItem) => void;
  showLinkOnly?: boolean;
}

export const InfrastructureCard: React.FC<InfrastructureCardProps> = ({
  item,
  isSelected = false,
  onSelect,
  showLinkOnly = false,
}) => {
  const Icon = INFRA_TYPE_ICONS[item.type] || INFRA_TYPE_ICONS.other;
  const typeLabel = INFRA_TYPE_LABELS[item.type] || item.type;

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <div
      onClick={onSelect ? () => onSelect(item) : undefined}
      className={`group relative rounded-xl border bg-white p-4 transition-all duration-200 cursor-pointer dark:bg-slate-900 ${
        isSelected
          ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20 dark:border-rose-500 dark:ring-rose-500/30'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-rose-50 group-hover:text-rose-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-rose-950/60 dark:group-hover:text-rose-400 transition-colors">
            <Icon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                {typeLabel}
              </span>
              <span className="text-[11px] font-mono text-slate-400">#{item.id}</span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {item.name}
            </h4>
          </div>
        </div>

        <StatusBadge status={item.status} size="sm" showDot />
      </div>

      <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[180px]">
          <MapPin size={13} className="shrink-0 text-slate-400" />
          <span className="truncate">{item.address || item.area}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 font-medium">
          <Users size={13} className="text-slate-400" />
          <span>{item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <SeverityBadge severity={item.severity} size="sm" />
          <VerificationBadge status={item.verificationStatus} size="sm" />
        </div>

        <Link
          href={`/infrastructure/${item.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
