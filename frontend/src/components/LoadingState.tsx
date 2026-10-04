import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
  type?: 'card' | 'table' | 'map';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading infrastructure data...',
  count = 3,
  type = 'card',
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`} aria-busy="true" aria-label={message}>
      {message && (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 mb-2">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span>{message}</span>
        </div>
      )}

      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
};
