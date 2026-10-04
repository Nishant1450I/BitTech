'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { InfrastructureItem, InfrastructureStatus } from '../../../types/infrastructure';
import {
  getInfrastructureById,
  updateInfrastructureStatus,
  upvoteInfrastructure,
} from '../../../services/infrastructureService';
import { StatusBadge } from '../../../components/StatusBadge';
import { SeverityBadge } from '../../../components/SeverityBadge';
import { VerificationBadge } from '../../../components/VerificationBadge';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { MapComponent } from '../../../components/MapComponent';
import {
  INFRA_TYPE_LABELS,
  INFRA_TYPE_ICONS,
  formatDate,
  formatRelativeTime,
} from '../../../utils/infraHelpers';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ThumbsUp,
  CheckCircle2,
  Share2,
  AlertTriangle,
  History,
  ShieldCheck,
  Compass,
  FileCheck,
} from 'lucide-react';

export default function InfrastructureDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<InfrastructureItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');

  const loadItem = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getInfrastructureById(id);
      if (!res) {
        setError(`Infrastructure record #${id} not found.`);
      } else {
        setItem(res);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [id]);

  const handleUpvote = async () => {
    if (!item) return;
    setActionLoading(true);
    try {
      const updated = await upvoteInfrastructure(item.id);
      setItem(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!item) return;
    setActionLoading(true);
    try {
      const updated = await updateInfrastructureStatus(item.id, 'working', resolveNotes);
      setItem(updated);
      setResolveModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <LoadingState message="Fetching infrastructure record and verification history..." count={4} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState
          title="Asset Record Not Found"
          message={error || 'The requested infrastructure asset could not be located in the civic index.'}
          onRetry={loadItem}
        />
        <div className="mt-6 text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
          >
            <ArrowLeft size={16} /> Back to Reality Map
          </Link>
        </div>
      </div>
    );
  }

  const Icon = INFRA_TYPE_ICONS[item.type] || INFRA_TYPE_ICONS.other;
  const typeLabel = INFRA_TYPE_LABELS[item.type] || item.type;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Reality Map</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Share2 size={14} />
              <span>{copied ? 'Copied Link!' : 'Share Asset'}</span>
            </button>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
            >
              <span>Report Issue Nearby</span>
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Icon size={16} /> {typeLabel}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">#{item.id}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500">{item.area}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {item.name}
              </h1>

              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                <StatusBadge status={item.status} size="lg" showDot />
                <SeverityBadge severity={item.severity} />
                <VerificationBadge status={item.verificationStatus} />
              </div>
            </div>

            {/* Actions Box */}
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleUpvote}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
              >
                <ThumbsUp size={15} className="text-rose-600" />
                <span>Confirm Issue ({item.reportCount} reports)</span>
              </button>

              {item.status !== 'working' ? (
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                >
                  <CheckCircle2 size={15} />
                  <span>Mark as Resolved</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => updateInfrastructureStatus(item.id, 'broken')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all"
                >
                  <AlertTriangle size={15} />
                  <span>Report Broken Again</span>
                </button>
              )}
            </div>
          </div>

          {/* The Reality Gap Callout Banner */}
          <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/30">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-2">
              The Reality Gap Audit
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white/90 p-3 dark:bg-slate-900/70">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Official Municipal Registry Claim
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {item.officialRecordStatus === 'officially_operational'
                    ? '100% Operational in Budget Files'
                    : 'Scheduled Maintenance'}
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 dark:bg-slate-900/70">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  Independent Ground Truth Verification
                </span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase">
                  {item.status === 'working' ? 'Verified Working' : 'Confirmed Dead / Non-Functional'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Details + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Details & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description & Photo Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Issue Description & Ground Findings
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {item.imageUrl && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500 block mb-2">
                    Verified Photographic Evidence
                  </span>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-72 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Lifecycle Stages Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <History size={15} /> Full Audit Trail & Lifecycle
              </h3>

              {/* Progress Stepper */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold mb-6">
                <div
                  className={`p-2.5 rounded-xl border ${
                    ['reported', 'under_review', 'verified', 'resolved'].includes(item.lifecycleStage)
                      ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400">Step 1</span>
                  Reported
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    ['under_review', 'verified', 'resolved'].includes(item.lifecycleStage)
                      ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400">Step 2</span>
                  Under Review
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    ['verified', 'resolved'].includes(item.lifecycleStage)
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400">Step 3</span>
                  Verified
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    item.lifecycleStage === 'resolved' || item.status === 'working'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400">Step 4</span>
                  Resolved
                </div>
              </div>

              {/* History Event Logs */}
              <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-4">
                {item.history.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    <span className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="text-[11px] text-slate-400">{formatDate(log.timestamp)}</span>
                    </div>
                    <span className="text-slate-500 font-medium block">{log.author}</span>
                    {log.details && (
                      <p className="mt-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {log.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Location & Mini Map */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Location & Coordinates
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.address}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                  <div>First Discovered: <strong>{formatDate(item.reportedAt)}</strong></div>
                  <div>Last Audit Date: <strong>{formatDate(item.verifiedAt)}</strong></div>
                  <div>Ward Zone: <strong>{item.area}</strong></div>
                </div>
              </div>

              {/* Mini Map */}
              <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <MapComponent
                  items={[item]}
                  selectedItem={item}
                  onSelectItem={() => {}}
                  center={[item.latitude, item.longitude]}
                  zoom={15}
                />
              </div>

              <Link
                href="/map"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                <Compass size={14} />
                <span>Explore Surrounding Assets On Map</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Confirmation Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Asset Restoration
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Confirm that this infrastructure is fully repaired, accessible, and functioning on site.
            </p>

            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                Audit Notes / Contractor Reference
              </label>
              <textarea
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="e.g. Repairs inspected by Ward 14 audit team on Oct 4."
                rows={2}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResolveModalOpen(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolve}
                disabled={actionLoading}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                {actionLoading ? 'Updating...' : 'Confirm Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
