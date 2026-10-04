import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load infrastructure data',
  message = 'There was an issue connecting to the civic grid service. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/20 ${className}`}
      role="alert"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400 mb-3">
        <AlertOctagon size={24} />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
        >
          <RotateCcw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
