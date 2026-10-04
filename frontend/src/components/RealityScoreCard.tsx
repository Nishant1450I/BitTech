import React from 'react';
import { AreaRealityScore } from '../types/infrastructure';
import { TrendingUp, TrendingDown, Minus, Info, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface RealityScoreCardProps {
  scoreData: AreaRealityScore;
  showDetails?: boolean;
  className?: string;
  compact?: boolean;
}

export const RealityScoreCard: React.FC<RealityScoreCardProps> = ({
  scoreData,
  showDetails = true,
  className = '',
  compact = false,
}) => {
  const { score, areaName, breakdown, totalFacilities, trend } = scoreData;

  const getScoreColor = (val: number) => {
    if (val >= 75) return { text: 'text-emerald-600 dark:text-emerald-400', stroke: '#059669', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 55) return { text: 'text-amber-600 dark:text-amber-400', stroke: '#d97706', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { text: 'text-rose-600 dark:text-rose-400', stroke: '#e11d48', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Reality Score
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
            {areaName}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          {trend === 'improving' && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp size={14} /> Improving
            </span>
          )}
          {trend === 'declining' && (
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
              <TrendingDown size={14} /> Critical
            </span>
          )}
          {trend === 'stable' && (
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Minus size={14} /> Stable
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        {/* Score Ring / Display */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 shadow-inner">
            <span className={`text-2xl font-black tracking-tight ${scoreTheme.text}`}>
              {score}
            </span>
            <span className="text-[10px] text-slate-400 absolute bottom-1 font-medium">/100</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
              {score >= 75 ? 'Healthy Usability' : score >= 55 ? 'Degraded Assets' : 'Critical Usability Gap'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {totalFacilities} surveyed facilities
            </span>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400 block">Ground Reality</span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {breakdown.workingPercent}% Actually Working
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Segmented Bar */}
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div
              style={{ width: `${breakdown.workingPercent}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Working: ${breakdown.workingPercent}%`}
            />
            <div
              style={{ width: `${breakdown.brokenPercent}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Broken: ${breakdown.brokenPercent}%`}
            />
            <div
              style={{ width: `${breakdown.inaccessiblePercent}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Inaccessible: ${breakdown.inaccessiblePercent}%`}
            />
            <div
              style={{ width: `${breakdown.unknownPercent}%` }}
              className="bg-slate-400 transition-all duration-500"
              title={`Unknown: ${breakdown.unknownPercent}%`}
            />
          </div>

          {/* Breakdown legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Working: <b className="text-slate-900 dark:text-white">{breakdown.workingPercent}%</b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Broken: <b className="text-slate-900 dark:text-white">{breakdown.brokenPercent}%</b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Blocked: <b className="text-slate-900 dark:text-white">{breakdown.inaccessiblePercent}%</b>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Unknown: <b className="text-slate-900 dark:text-white">{breakdown.unknownPercent}%</b>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
            <Info size={12} className="shrink-0 text-slate-400" />
            <span>Higher score indicates closer match between official records and ground usability.</span>
          </p>
        </div>
      )}
    </div>
  );
};
