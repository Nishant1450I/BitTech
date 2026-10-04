'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnalyticsStats, AreaRealityScore } from '../../types/infrastructure';
import { getAnalyticsStats, getRealityScores } from '../../services/analyticsService';
import { StatCard } from '../../components/StatCard';
import { RealityScoreCard } from '../../components/RealityScoreCard';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Compass,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [areaScores, setAreaScores] = useState<AreaRealityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, scoresData] = await Promise.all([
        getAnalyticsStats(),
        getRealityScores(),
      ]);
      setStats(statsData);
      setAreaScores(scoresData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingState message="Aggregating civic reality metrics..." count={6} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState message={error || 'Unable to load analytics.'} onRetry={fetchData} />
      </div>
    );
  }

  // Calculate percentages for status breakdown
  const workingPct = Math.round((stats.working / stats.totalInfrastructure) * 100);
  const brokenPct = Math.round((stats.broken / stats.totalInfrastructure) * 100);
  const reviewPct = Math.round((stats.underReview / stats.totalInfrastructure) * 100);
  const otherPct = 100 - (workingPct + brokenPct + reviewPct);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 mb-2">
              <BarChart3 size={13} />
              <span>Civic Health & Transparency Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Public Infrastructure Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Aggregated ground-truth data tracking usability, dead asset clusters, and municipal response rates.
            </p>
          </div>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-rose-700"
          >
            <Compass size={16} />
            <span>Open Reality Map</span>
          </Link>
        </div>

        {/* 1. TOP STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Infrastructure"
            value={stats.totalInfrastructure}
            subtitle="Cataloged in city index"
            color="slate"
          />
          <StatCard
            label="Verified Working"
            value={stats.working}
            subtitle={`${workingPct}% of monitored total`}
            color="emerald"
            icon={CheckCircle2}
          />
          <StatCard
            label="Dead / Broken"
            value={stats.broken}
            subtitle={`${brokenPct}% unusable`}
            color="rose"
            icon={XCircle}
          />
          <StatCard
            label="Under Review"
            value={stats.underReview}
            subtitle="Municipal work in progress"
            color="amber"
            icon={Clock}
          />
          <StatCard
            label="Critical Hazards"
            value={stats.critical}
            subtitle="Immediate safety risk"
            color="rose"
            icon={Flame}
            badge="URGENT"
          />
        </div>

        {/* 2. THE REALITY GAP & RESOLUTION VELOCITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Official vs Reality Gap Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  The Reality Gap
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Government Registry vs Audited Reality
                </h3>
              </div>
              <span className="rounded-full bg-rose-100 dark:bg-rose-950 px-2.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                25.8% Usability Deficit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Official Facility Record
                </span>
                <span className="text-3xl font-black text-blue-700 dark:text-blue-300 block mt-1">
                  {stats.officialFacilitiesCount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">
                  Presumed operational on paper
                </span>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block">
                  Ground Verified Working
                </span>
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300 block mt-1">
                  {stats.realityVerifiedCount.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 block">
                  74.2% actually usable
                </span>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
                <span className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-400 block">
                  Dead / Non-Functional
                </span>
                <span className="text-3xl font-black text-rose-700 dark:text-rose-300 block mt-1">
                  {stats.deadUnusableCount.toLocaleString()}
                </span>
                <span className="text-xs text-rose-700 dark:text-rose-400 mt-1 block">
                  Missing, broken, or blocked
                </span>
              </div>
            </div>

            {/* Ratio Progress Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-700 dark:text-emerald-400">
                  Functional Usability (74.2%)
                </span>
                <span className="text-rose-700 dark:text-rose-400">Dead Deficit (25.8%)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex dark:bg-slate-800">
                <div style={{ width: '74.2%' }} className="bg-emerald-500" />
                <div style={{ width: '25.8%' }} className="bg-rose-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Resolution Velocity Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Performance Metrics
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Resolution Velocity
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                How quickly reported issues are acknowledged and repaired by municipal divisions.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Resolution Rate
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {stats.resolutionRatePercent}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Average Resolution Time
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {stats.avgResolutionDays} days
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Community peer-audited after every repair</span>
            </div>
          </div>
        </div>

        {/* 3. CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Issues by Infrastructure Type */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Category Breakdown
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Issues by Infrastructure Type
                </h3>
              </div>
              <span className="text-xs text-slate-400">Total vs Broken</span>
            </div>

            <div className="space-y-4">
              {stats.issuesByType.map((cat) => {
                const brokenPct = Math.round((cat.brokenCount / cat.count) * 100);
                return (
                  <div key={cat.type} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cat.label}
                      </span>
                      <span className="text-slate-500">
                        <strong className="text-rose-600 dark:text-rose-400">{cat.brokenCount} dead</strong>{' '}
                        / {cat.count} total ({brokenPct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div
                        style={{ width: `${brokenPct}%` }}
                        className="bg-rose-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Issues Over Time */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Monthly Trajectory
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Citizen Reports vs Repairs Over Time
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-medium text-rose-600">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Reported
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Resolved
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-6 gap-2 sm:gap-4 h-52 items-end pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              {stats.issuesOverTime.map((item) => {
                const maxVal = 250;
                const reportedHeight = Math.round((item.reported / maxVal) * 100);
                const resolvedHeight = Math.round((item.resolved / maxVal) * 100);

                return (
                  <div key={item.month} className="flex flex-col items-center h-full justify-end gap-1">
                    <div className="flex items-end gap-1 w-full justify-center h-40">
                      <div
                        style={{ height: `${reportedHeight}%` }}
                        className="w-3 sm:w-4 bg-rose-500 rounded-t-sm transition-all hover:bg-rose-600"
                        title={`Reported: ${item.reported}`}
                      />
                      <div
                        style={{ height: `${resolvedHeight}%` }}
                        className="w-3 sm:w-4 bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
                        title={`Resolved: ${item.resolved}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-full">
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-slate-500 text-center">
              Active citizen audits surged in Q3, increasing resolution turnaround by 34%.
            </p>
          </div>
        </div>

        {/* 4. AREA COMPARISON & REALITY SCORES */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Municipal Ward Comparison
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Area Reality Scores
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Evaluating the usability gap across different neighborhoods. Scores below 60 demand immediate municipal remediation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areaScores.map((scoreData) => (
              <RealityScoreCard key={scoreData.areaId} scoreData={scoreData} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
