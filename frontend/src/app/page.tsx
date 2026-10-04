import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Footprints,
  Accessibility,
  Bath,
  Droplet,
  Bus,
  Activity,
  Layers,
  TrendingDown,
  BarChart3,
  Users,
  Compass,
} from 'lucide-react';
import { RealityScoreCard } from '../components/RealityScoreCard';
import { AREA_REALITY_SCORES } from '../data/mockData';

export default function HomePage() {
  const problemExamples = [
    {
      title: 'Broken Streetlights',
      desc: 'Officially mapped as illuminated corridors, yet left dark for weeks creating unsafe pedestrian routes.',
      icon: Lightbulb,
      status: 'broken' as const,
      statusLabel: 'DEAD / DARK',
      affected: '89 Junctions',
    },
    {
      title: 'Blocked Footpaths',
      desc: 'Uncovered cable trenches, illegal construction debris, and missing tiles force walkers into heavy traffic.',
      icon: Footprints,
      status: 'broken' as const,
      statusLabel: 'IMPASSABLE',
      affected: '108 Walkways',
    },
    {
      title: 'Missing Wheelchair Ramps',
      desc: 'Transit hubs claiming full ADA/universal access have 25-degree slopes or permanent steel barricades.',
      icon: Accessibility,
      status: 'broken' as const,
      statusLabel: 'INACCESSIBLE',
      affected: '38 Stations',
    },
    {
      title: 'Unusable Public Toilets',
      desc: 'Installed at public expense, but locked, lacking running water, or abandoned to vandalism.',
      icon: Bath,
      status: 'broken' as const,
      statusLabel: 'NON-FUNCTIONAL',
      affected: '32 Facilities',
    },
    {
      title: 'Non-functional Drinking Water',
      desc: 'Smart RO purification booths displaying system errors with zero water flow for thirsty commuters.',
      icon: Droplet,
      status: 'warning' as const,
      statusLabel: 'NO WATER FLOW',
      affected: '24 Points',
    },
    {
      title: 'Broken Traffic Signals',
      desc: 'Stuck on flashing yellow or uncoordinated timers leading to daily peak-hour gridlocks.',
      icon: Activity,
      status: 'broken' as const,
      statusLabel: 'OUT OF ORDER',
      affected: '27 Intersections',
    },
    {
      title: 'Missing / Broken Bus Shelters',
      desc: 'Monsoon-damaged roofs, missing commuter benches, and broken digital arrival timetables.',
      icon: Bus,
      status: 'warning' as const,
      statusLabel: 'DAMAGED ROOF',
      affected: '18 Shelters',
    },
    {
      title: 'Damaged Roads & Potholes',
      desc: 'Eroded asphalt, cratered intersections, and unpaved bypasses that official maps mark as completed.',
      icon: Layers,
      status: 'broken' as const,
      statusLabel: 'HAZARDOUS',
      affected: '54 Corridors',
    },
  ];

  const narrativeSteps = [
    {
      step: '01',
      title: 'Infrastructure Exists Officially',
      desc: 'Municipal registries mark facilities as 100% operational on paper.',
      badge: 'Official Claim',
      color: 'border-blue-500/40 text-blue-600',
    },
    {
      step: '02',
      title: 'The Ground Reality Differs',
      desc: 'Weather, contractor neglect, and lack of maintenance leave assets dead.',
      badge: 'Ground Gap',
      color: 'border-amber-500/40 text-amber-600',
    },
    {
      step: '03',
      title: 'Citizens Document & Report',
      desc: 'Residents submit geo-tagged photo evidence in under 30 seconds.',
      badge: 'Civic Action',
      color: 'border-rose-500/40 text-rose-600',
    },
    {
      step: '04',
      title: 'Community Verifies',
      desc: 'Peer reports and volunteer checks confirm the dead status independently.',
      badge: 'Trust Layer',
      color: 'border-emerald-500/40 text-emerald-600',
    },
    {
      step: '05',
      title: 'The Reality Map Unveils Truth',
      desc: 'City-wide Reality Scores expose where public money is working vs dead.',
      badge: 'Public Accountability',
      color: 'border-purple-500/40 text-purple-600',
    },
    {
      step: '06',
      title: 'Accountability Drives Fixes',
      desc: 'Audited reality data compels municipal agencies to restore broken assets.',
      badge: 'Resolution',
      color: 'border-emerald-500/40 text-emerald-600',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Civic Ground-Truth Platform</span>
              <span className="text-rose-300 dark:text-rose-700">•</span>
              <span className="font-normal text-rose-600 dark:text-rose-400">
                Official Data vs Ground Reality
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
              Map the infrastructure that{' '}
              <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                actually works.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Public infrastructure may exist on paper, but reality can be very different.
              <strong className="text-slate-900 dark:text-white font-semibold"> Dead Infrastructure Mapper </strong>
              helps citizens identify, report, and visualize infrastructure that is broken, inaccessible, or unusable.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/30 active:scale-95 transition-all"
              >
                <Compass size={18} />
                <span>Explore Reality Map</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
              >
                <PlusCircle size={18} className="text-rose-600 dark:text-rose-400" />
                <span>Report an Issue</span>
              </Link>
            </div>

            {/* Quick Live Audit Counters */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
              <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Monitored</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">1,248</span>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">Working</span>
                <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">823 (66%)</span>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 shadow-xs dark:border-rose-900/40 dark:bg-rose-950/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 block">Dead / Broken</span>
                <span className="text-lg font-extrabold text-rose-700 dark:text-rose-300">286 (23%)</span>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 block">Critical Alerts</span>
                <span className="text-lg font-extrabold text-amber-700 dark:text-amber-300">45 Active</span>
              </div>
            </div>
          </div>

          {/* VISUAL PREVIEW OF MAP / DASHBOARD */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5 rounded-t-xl dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-500">
                    reality-map.live/nashik-ward-14
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-rose-100 dark:bg-rose-950 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                    ● 286 Dead Nodes Visualized
                  </span>
                </div>
              </div>

              {/* Map Teaser Container */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-b-xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
                  alt="City aerial satellite map preview"
                  className="h-full w-full object-cover opacity-60 mix-blend-luminosity filter contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Mock Marker Nodes */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
                  <div className="group relative cursor-pointer">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/50 marker-beacon-broken">
                      <Lightbulb size={16} />
                    </span>
                    <div className="absolute left-10 top-0 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-xs text-white shadow-md backdrop-blur-xs">
                      Streetlight #SL-1042 • <span className="text-rose-400 font-bold">DEAD</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-2/3 right-1/3">
                  <div className="group relative cursor-pointer">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/50 marker-beacon-broken">
                      <Footprints size={16} />
                    </span>
                    <div className="absolute -left-32 top-0 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-xs text-white shadow-md backdrop-blur-xs">
                      Sidewalk #FP-204 • <span className="text-rose-400 font-bold">BLOCKED</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 right-1/4">
                  <div className="group relative cursor-pointer">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                      <Droplet size={14} />
                    </span>
                  </div>
                </div>

                {/* Center Callout Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 backdrop-blur-md">
                  <div>
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                      Ground Truth Interactive Layer
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Explore live status of streetlights, ramps, walkways, and sanitation
                    </h4>
                  </div>
                  <Link
                    href="/map"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-md hover:bg-slate-100 transition-colors"
                  >
                    <span>Launch Full Map</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE KEY DIFFERENTIATOR: OFFICIAL MAP vs REALITY MAP */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              The Reality Gap
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Official Records vs Ground Reality
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Municipal data declares assets operational simply because they were commissioned.
              We measure whether citizens can actually use them today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Official Infrastructure Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  PAPER RECORD
                </span>
                <span className="text-xs text-slate-400">Gov Registry</span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Infrastructure
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">1,000</span>
                <span className="text-xs text-slate-500">facilities logged</span>
              </div>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                100% listed as installed and presumed operational under municipal jurisdiction.
              </p>
            </div>

            {/* Reality Verified Card */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={12} /> AUDITED
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">74.2%</span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Reality Verified Usable
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-700 dark:text-emerald-300">742</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">actually functioning</span>
              </div>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                Facilities checked and confirmed in working order by ground inspection and community audits.
              </p>
            </div>

            {/* Dead / Unusable Card */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 dark:border-rose-900/60 dark:bg-rose-950/30">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                  <XCircle size={12} /> DEAD ASSETS
                </span>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">25.8% Gap</span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Dead / Unusable
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-black text-rose-700 dark:text-rose-300">258</span>
                <span className="text-xs text-rose-600 dark:text-rose-400">broken or blocked</span>
              </div>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                Assets that exist in budget files, but are broken, dark, inaccessible, or non-functional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              The Reality on Our Streets
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Officially available doesn&apos;t mean actually usable.
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Every day, citizens encounter infrastructure that creates safety risks, accessibility barriers, and daily frustration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {problemExamples.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Icon size={20} />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          item.status === 'broken'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900'
                        }`}
                      >
                        {item.statusLabel}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Audited impact:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.affected}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT NARRATIVE / HOW IT WORKS */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              The Lifecycle of Ground Truth
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              How Dead Infrastructure Mapper Works
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              A transparent, closed-loop civic audit process from first discovery to verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {narrativeSteps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700 font-mono">
                    {step.step}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${step.color}`}
                  >
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REALITY SCORES PREVIEW */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Civic Accountability Index
              </span>
              <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
                Area Reality Scores
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Comparing usability scores across municipal zones. Higher score means fewer dead assets.
              </p>
            </div>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              <span>View Full Analytics & Charts</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AREA_REALITY_SCORES.slice(0, 3).map((area) => (
              <RealityScoreCard key={area.areaId} scoreData={area} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-amber-600 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Spot a broken streetlight or impassable sidewalk?
          </h2>
          <p className="text-base sm:text-lg text-rose-100 max-w-2xl mx-auto">
            Take 30 seconds to drop a pin and upload a photo. Your report powers the community Reality Map and holds local authorities accountable.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm sm:text-base font-bold text-rose-700 shadow-lg hover:bg-slate-50 active:scale-95 transition-all"
            >
              <PlusCircle size={18} />
              <span>Report Infrastructure Problem</span>
            </Link>
            <Link
              href="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-white/20 active:scale-95 transition-all"
            >
              <Compass size={18} />
              <span>Explore The Map</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
