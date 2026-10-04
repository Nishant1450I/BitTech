'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  InfrastructureType,
  IssueCondition,
  SeverityLevel,
  NewReportPayload,
} from '../../types/infrastructure';
import { submitReport } from '../../services/reportService';
import { ImageUpload } from '../../components/ImageUpload';
import { MapComponent } from '../../components/MapComponent';
import { INFRA_TYPE_LABELS, INFRA_TYPE_ICONS } from '../../utils/infraHelpers';
import {
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Compass,
} from 'lucide-react';

export default function ReportIssuePage() {
  const router = useRouter();

  // Form State
  const [type, setType] = useState<InfrastructureType>('streetlight');
  const [issueCondition, setIssueCondition] = useState<IssueCondition>('not_working');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('College Road Near Model Colony Park, Nashik');
  const [latitude, setLatitude] = useState(20.0063);
  const [longitude, setLongitude] = useState(73.7634);
  const [imageUrl, setImageUrl] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const conditionOptions: { value: IssueCondition; label: string; desc: string }[] = [
    { value: 'not_working', label: 'Not Working / Dead', desc: 'No power, no water, or totally inactive' },
    { value: 'broken', label: 'Physically Broken', desc: 'Damaged structural parts, shattered glass' },
    { value: 'blocked', label: 'Blocked / Obstructed', desc: 'Covered with debris, construction, or barriers' },
    { value: 'inaccessible', label: 'Inaccessible', desc: 'Cannot be used by wheelchair, elderly, or strollers' },
    { value: 'unsafe', label: 'Unsafe / Dangerous', desc: 'Exposed live wires, deep holes, falling parts' },
    { value: 'missing', label: 'Missing Asset', desc: 'Listed on official plan but nonexistent on site' },
    { value: 'other', label: 'Other Issue', desc: 'Any other infrastructure failure' },
  ];

  const severityOptions: { value: SeverityLevel; label: string; dot: string; desc: string }[] = [
    { value: 'critical', label: 'Critical', dot: 'bg-red-500', desc: 'Imminent safety hazard, full paralysis' },
    { value: 'high', label: 'High', dot: 'bg-orange-500', desc: 'Major daily disruption or risk at night' },
    { value: 'medium', label: 'Medium', dot: 'bg-amber-500', desc: 'Noticeable inconvenience or partial failure' },
    { value: 'low', label: 'Low', dot: 'bg-blue-500', desc: 'Minor cosmetic or maintenance backlog' },
  ];

  const handleLocationPick = (lat: number, lng: number) => {
    setLatitude(parseFloat(lat.toFixed(5)));
    setLongitude(parseFloat(lng.toFixed(5)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!description.trim() || description.length < 10) {
      setFormError('Please enter a description of at least 10 characters.');
      return;
    }

    if (!address.trim()) {
      setFormError('Please enter an approximate location address or landmark.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: NewReportPayload = {
        type,
        issueCondition,
        severity,
        description,
        address,
        latitude,
        longitude,
        imageUrl,
        reporterName: reporterName || undefined,
        reporterContact: reporterContact || undefined,
      };

      const result = await submitReport(payload);
      if (result.success) {
        setSubmittedRef(result.referenceNumber);
      } else {
        setFormError(result.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRef(null);
    setDescription('');
    setImageUrl('');
    setFormError(null);
  };

  // SUCCESS STATE SCREEN
  if (submittedRef) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-xl dark:border-emerald-900/60 dark:bg-slate-900 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4 shadow-sm animate-bounce">
            <CheckCircle2 size={36} />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-3 border border-emerald-200">
            <ShieldCheck size={14} /> Report Logged to Civic Ledger
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Report Submitted Successfully!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Your evidence has been recorded and immediately pinned to the public Reality Map for community audit.
          </p>

          {/* Reference badge */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Official Tracking Reference
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-wider">
              {submittedRef}
            </span>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Category: {INFRA_TYPE_LABELS[type]}</span>
              <span className="capitalize">Severity: {severity}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all"
            >
              <Compass size={16} />
              <span>View On Reality Map</span>
            </Link>

            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all"
            >
              <RotateCcw size={14} />
              <span>Submit Another Report</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 mb-2">
            <Sparkles size={13} />
            <span>Citizen Ground-Truth Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Report Infrastructure That Isn&apos;t Working
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Help build an honest, transparent map of public assets. Document what is broken, blocked, or missing.
          </p>
        </div>

        {/* Error Banner */}
        {formError && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Infrastructure Type */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              1. What Type of Infrastructure Is Broken?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(INFRA_TYPE_LABELS) as InfrastructureType[]).map((t) => {
                const Icon = INFRA_TYPE_ICONS[t];
                const isSelected = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 text-rose-900 ring-2 ring-rose-500/20 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={22} className={isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'} />
                    <span className="mt-2 text-xs font-bold">{INFRA_TYPE_LABELS[t]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Issue Condition & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                2. Nature of the Problem
              </label>
              <div className="space-y-2">
                {conditionOptions.map((opt) => {
                  const isSelected = issueCondition === opt.value;
                  return (
                    <label
                      key={opt.value}
                      onClick={() => setIssueCondition(opt.value)}
                      className={`flex items-start gap-3 rounded-xl border p-2.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/60 dark:border-rose-500 dark:bg-rose-950/40'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueCondition"
                        checked={isSelected}
                        onChange={() => setIssueCondition(opt.value)}
                        className="mt-1 text-rose-600 focus:ring-rose-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {opt.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Severity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                  3. Severity Level
                </label>
                <div className="space-y-2">
                  {severityOptions.map((opt) => {
                    const isSelected = severity === opt.value;
                    return (
                      <label
                        key={opt.value}
                        onClick={() => setSeverity(opt.value)}
                        className={`flex items-start gap-3 rounded-xl border p-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/60 dark:border-rose-500 dark:bg-rose-950/40'
                            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="severity"
                          checked={isSelected}
                          onChange={() => setSeverity(opt.value)}
                          className="mt-1 text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {opt.label} Severity
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {opt.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
                <strong>Tip:</strong> Critical severity triggers priority notification to community volunteers and municipal monitors.
              </div>
            </div>
          </div>

          {/* 4. Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              4. Detailed Description of the Issue *
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Explain how long it has been broken, what hazards exist, and whether it prevents daily transit.
            </p>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Streetlight has been totally blacked out for the past 2 weeks. The junction is pitch black, making it dangerous for students walking home from the coaching classes."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-1 flex justify-end text-[11px] text-slate-400">
              {description.length} characters (min 10)
            </div>
          </div>

          {/* 5. Location with Map Pin Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              5. Location & Coordinates *
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Enter address/landmark and click anywhere on the map to accurately place the pin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, landmark, or intersection (e.g. College Road Near Model Colony)"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-mono text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-mono text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        handleLocationPick(pos.coords.latitude, pos.coords.longitude);
                      });
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 p-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Use My GPS
                </button>
              </div>
            </div>

            {/* Interactive Location Picker Map */}
            <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapComponent
                items={[]}
                selectedItem={null}
                onSelectItem={() => {}}
                center={[latitude, longitude]}
                zoom={14}
                onLocationPick={handleLocationPick}
                pickMode
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              💡 Click on map above to relocate the report pin.
            </span>
          </div>

          {/* 6. Photo Evidence Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              6. Photo Evidence (Recommended)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Photographs speed up community verification and prevent municipal dismissal.
            </p>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>

          {/* 7. Reporter Details (Optional) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              7. Citizen Information (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your Name (or leave blank for Anonymous)"
                className="rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Email or Mobile (for resolution updates)"
                className="rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-4">
            <Link
              href="/map"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={16} />
              <span>{submitting ? 'Verifying & Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
