import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Heart, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-xs">
                <MapPin className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Dead Infrastructure Mapper
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Bridging the gap between official municipal records and real-world ground usability.
              Empowering citizens to document, verify, and restore broken public infrastructure.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Civic Grid v0.1.0
              </span>
              <span>Open Civic Data Standard</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Civic Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/map" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Interactive Reality Map
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Report Broken Asset
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Reality Score & Analytics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  How It Works & Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Governance & API */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Transparency & Open API
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Community Audited
                </span>
              </li>
              <li>
                <span className="text-slate-500">API Endpoint: /api/v1/infrastructure</span>
              </li>
              <li>
                <span className="text-slate-500">OpenStreetMap © Contributors</span>
              </li>
              <li>
                <span className="text-slate-500">Public Interest Technology</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 Dead Infrastructure Mapper. Built for transparent, accessible public infrastructure.</p>
          <div className="flex items-center gap-4">
            <span>Official Records vs Ground Reality</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
