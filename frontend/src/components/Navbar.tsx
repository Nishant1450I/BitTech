'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Map as MapIcon,
  BarChart3,
  PlusCircle,
  Info,
  Menu,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Radio },
    { href: '/map', label: 'Reality Map', icon: MapIcon },
    { href: '/report', label: 'Report Issue', icon: PlusCircle },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/about', label: 'About & How It Works', icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-slate-900 dark:text-white transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <MapPin className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight leading-tight flex items-center gap-2 text-slate-900 dark:text-white">
              Dead Infrastructure Mapper
              <span className="hidden md:inline-flex items-center rounded bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                CIVIC REALITY
              </span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              See what actually works.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  active
                    ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon size={16} className={active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'} />
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-rose-600 dark:bg-rose-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/report"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            <PlusCircle size={16} />
            <span>Report an Issue</span>
          </Link>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/report"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/40"
            aria-label="Report issue shortcut"
          >
            <PlusCircle size={22} />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    active
                      ? 'bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/50 dark:text-rose-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              <PlusCircle size={18} />
              <span>Report an Issue</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
