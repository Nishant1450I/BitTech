'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InfrastructureItem, InfrastructureStatus } from '../types/infrastructure';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { VerificationBadge } from './VerificationBadge';
import { INFRA_TYPE_LABELS, INFRA_TYPE_ICONS, formatDate, formatRelativeTime } from '../utils/infraHelpers';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ThumbsUp,
  CheckCircle2,
  Share2,
  ExternalLink,
  AlertTriangle,
  History,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { upvoteInfrastructure, updateInfrastructureStatus } from '../services/infrastructureService';

interface DetailDrawerProps {
  item: InfrastructureItem | null;
  onClose: () => void;
  onItemUpdated?: (updated: InfrastructureItem) => void;
  className?: string;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  item,
  onClose,
  onItemUpdated,
  className = '',
}) => {
  const [upvoting, setUpvoting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');

  if (!item) return null;

  const Icon = INFRA_TYPE_ICONS[item.type] || INFRA_TYPE_ICONS.other;
  const typeLabel = INFRA_TYPE_LABELS[item.type] || item.type;

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const updated = await upvoteInfrastructure(item.id);
      if (onItemUpdated) onItemUpdated(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setUpvoting(false);
    }
  };

  const handleConfirmResolve = async () => {
    setResolving(true);
    try {
      const updated = await updateInfrastructureStatus(item.id, 'working', resolveNotes);
      if (onItemUpdated) onItemUpdated(updated);
      setResolveModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setResolving(false);
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/infrastructure/${item.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl border-l border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Icon size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {typeLabel}
            </span>
            <span className="text-xs font-mono font-medium text-slate-500">#{item.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            title="Share report"
          >
            <Share2 size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
            aria-label="Close detail panel"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {copied && (
        <div className="bg-emerald-500 text-white text-xs py-1 px-4 text-center font-medium animate-fadeIn">
          Direct link copied to clipboard!
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Photo if available */}
        {item.imageUrl && (
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-48 w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <StatusBadge status={item.status} size="sm" showDot />
            </div>
          </div>
        )}

        {/* Title and Badges */}
        <div>
          <h2 id="drawer-title" className="text-xl font-bold text-slate-900 dark:text-white">
            {item.name}
          </h2>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <StatusBadge status={item.status} size="md" showDot />
            <SeverityBadge severity={item.severity} size="sm" />
            <VerificationBadge status={item.verificationStatus} size="sm" />
          </div>
        </div>

        {/* The Reality Gap Comparison Callout */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-900/60 dark:bg-rose-950/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
            Official Claim vs Ground Truth
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 block">Official Record</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {item.officialRecordStatus === 'officially_operational'
                  ? 'Listed Operational'
                  : 'Scheduled Work'}
              </span>
            </div>
            <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/60">
              <span className="text-[10px] text-slate-400 block">Ground Reality</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase">
                {item.status === 'working' ? 'Functional' : 'Dead / Broken'}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="shrink-0 text-slate-400 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">{item.address}</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)} ({item.area})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <Calendar size={16} className="shrink-0 text-slate-400" />
            <div>
              <span className="text-slate-500">First Reported: </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(item.reportedAt)} ({formatRelativeTime(item.reportedAt)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
            <div>
              <span className="text-slate-500">Last Verified: </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {item.verifiedAt ? formatDate(item.verifiedAt) : 'Pending community peer audit'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Damage & Usability Description
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            {item.description}
          </p>
        </div>

        {/* Verification & Lifecycle Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
            <History size={14} /> Status Timeline
          </h4>

          {/* Stepper indicator */}
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold mb-4">
            <div
              className={`p-1.5 rounded-md border ${
                ['reported', 'under_review', 'verified', 'resolved'].includes(item.lifecycleStage)
                  ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              Reported
            </div>
            <div
              className={`p-1.5 rounded-md border ${
                ['under_review', 'verified', 'resolved'].includes(item.lifecycleStage)
                  ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              Review
            </div>
            <div
              className={`p-1.5 rounded-md border ${
                ['verified', 'resolved'].includes(item.lifecycleStage)
                  ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              Verified
            </div>
            <div
              className={`p-1.5 rounded-md border ${
                item.lifecycleStage === 'resolved' || item.status === 'working'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              Resolved
            </div>
          </div>

          {/* History logs */}
          <div className="space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-3">
            {item.history.map((log) => (
              <div key={log.id} className="relative text-xs">
                <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(log.timestamp)}</span>
                </div>
                <span className="text-slate-500 text-[11px] block">{log.author}</span>
                {log.details && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2 rounded">
                    {log.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="border-t border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-950/90 space-y-2">
        <div className="flex items-center gap-2">
          {/* Upvote / Endorse button */}
          <button
            type="button"
            onClick={handleUpvote}
            disabled={upvoting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <ThumbsUp size={14} className={upvoting ? 'animate-bounce' : 'text-rose-600'} />
            <span>Confirm Issue ({item.reportCount})</span>
          </button>

          {/* Mark as Resolved Modal Trigger */}
          {item.status !== 'working' ? (
            <button
              type="button"
              onClick={() => setResolveModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <CheckCircle2 size={14} />
              <span>Mark as Resolved</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => updateInfrastructureStatus(item.id, 'broken')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-95 transition-all"
            >
              <AlertTriangle size={14} />
              <span>Report Broken Again</span>
            </button>
          )}
        </div>

        <Link
          href={`/infrastructure/${item.id}`}
          className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <span>View Dedicated Infrastructure Page</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Mark Resolved Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Community Verification
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Has this infrastructure item been fully repaired and is now safe for public use?
            </p>

            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                Resolution Notes (Optional)
              </label>
              <textarea
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="e.g. Lamp pole repaired and illuminated on Oct 4."
                rows={2}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-rose-500"
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
                onClick={handleConfirmResolve}
                disabled={resolving}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                {resolving ? 'Submitting...' : 'Confirm Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
