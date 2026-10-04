import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Users,
  Compass,
  FileCheck,
  Eye,
  Radio,
  HelpCircle,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

export default function AboutPage() {
  const principles = [
    {
      title: 'Ground Truth Over Bureaucracy',
      desc: 'Municipal registries often mark an asset operational the day the invoice is cleared. We monitor whether real humans can use it today.',
      icon: Eye,
    },
    {
      title: 'Decentralized Community Verification',
      desc: 'Reports are audited by nearby residents and volunteers to ensure authentic, high-integrity evidence without spam.',
      icon: Users,
    },
    {
      title: 'The Reality Score Standard',
      desc: 'Our patent-pending Reality Score mathematically bridges official municipal promises with real-world accessibility.',
      icon: Radio,
    },
    {
      title: 'Open Data for Public Good',
      desc: 'All verified coordinates and defect logs are accessible for civic researchers, urban planners, and municipal contractors.',
      icon: Database,
    },
  ];

  const verificationLevels = [
    {
      badge: 'Community Verified',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
      desc: 'Inspected and confirmed by at least 3 independent local citizens or verified ward volunteers.',
      threshold: '3+ Peer confirmations',
    },
    {
      badge: 'Officially Verified',
      color: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300',
      desc: 'Acknowledged by municipal department inspectors or matched with official utility dispatch logs.',
      threshold: 'Departmental inspection log',
    },
    {
      badge: 'Unverified Citizen Report',
      color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
      desc: 'Freshly submitted citizen discovery pending peer review and photo validation.',
      threshold: 'Initial submission (<24h)',
    },
  ];

  const faqs = [
    {
      q: 'How does Dead Infrastructure Mapper differ from a standard municipal complaint portal?',
      a: 'Traditional portals treat issues as private support tickets that vanish into bureaucratic backlogs. Dead Infrastructure Mapper publicly aggregates ground reality into a shared live map, creating measurable "Reality Scores" for every ward that highlight systemic neglect and reward proactive maintenance.',
    },
    {
      q: 'What prevents false or spam reports?',
      a: 'Every report requires geo-coordinates and timestamped photographic evidence. Our community verification layer requires local resident confirmations before an issue is labeled "Community Verified". An integrated AI vision model checks for duplicates and filters fake uploads.',
    },
    {
      q: 'How is the Reality Score calculated?',
      a: 'The Reality Score (0 to 100) measures the percentage of officially registered infrastructure in a ward that is actually operational, weighted by severity. Missing wheelchair ramps and dead traffic signals carry higher penalty weights than minor cosmetic issues.',
    },
    {
      q: 'Can municipal authorities integrate with this system?',
      a: 'Yes. Our platform provides standard REST API endpoints (/api/v1/infrastructure) and Webhooks allowing city agencies to pull real-time repair tickets and push official status updates directly.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            <ShieldCheck size={14} />
            <span>Civic Tech Transparency Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            See what actually works.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Public infrastructure exists to serve citizens. But when streetlights stay dark, wheelchair ramps are blocked, and water booths stand dry, official claims of &quot;smart cities&quot; fall apart. We create an unfiltered, verifiable Reality Map.
          </p>
        </div>

        {/* Core Principles */}
        <div>
          <h2 className="text-center text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-8">
            Our Architectural Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification System Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trust & Data Integrity
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              The 3-Tier Verification Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              To prevent rumors and maintain high evidential trust, every pin on the Reality Map carries a transparent verification badge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verificationLevels.map((lvl) => (
              <div
                key={lvl.badge}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-950/60 flex flex-col justify-between"
              >
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${lvl.color}`}
                  >
                    <CheckCircle2 size={13} /> {lvl.badge}
                  </span>
                  <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lvl.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
                  Criteria: {lvl.threshold}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Common Questions
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-start gap-2.5">
                  <HelpCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 p-8 sm:p-12 text-center text-white border border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to audit your neighborhood?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Explore active infrastructure reports near your route or submit photographic evidence for a broken asset.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-colors"
            >
              <Compass size={16} />
              <span>Explore Reality Map</span>
            </Link>
            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              <span>Submit A Report</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
