import React from 'react';
import { SearchX, PlusCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onReset?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No infrastructure reports found',
  description = 'Try adjusting your filters, searching for a different area, or report a newly discovered issue.',
  actionText = 'Report an Issue',
  actionHref = '/report',
  onReset,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 mb-4 shadow-inner">
        <SearchX size={24} />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
          >
            <PlusCircle size={14} />
            <span>{actionText}</span>
          </Link>
        )}
      </div>
    </div>
  );
};
