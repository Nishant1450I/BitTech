'use client';

import React from 'react';
import { InfrastructureItem, FilterOptions, InfrastructureType, InfrastructureStatus, SeverityLevel } from '../types/infrastructure';
import { InfrastructureCard } from './InfrastructureCard';
import { EmptyState } from './EmptyState';
import { Search, Filter, SlidersHorizontal, RotateCcw, X, MapPin } from 'lucide-react';
import { INFRA_TYPE_LABELS } from '../utils/infraHelpers';

interface MapSidebarProps {
  items: InfrastructureItem[];
  totalCount: number;
  selectedItem: InfrastructureItem | null;
  onSelectItem: (item: InfrastructureItem) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  className?: string;
}

export const MapSidebar: React.FC<MapSidebarProps> = ({
  items,
  totalCount,
  selectedItem,
  onSelectItem,
  filters,
  onFilterChange,
  onResetFilters,
  className = '',
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const brokenCount = items.filter((i) => i.status === 'broken').length;
  const workingCount = items.filter((i) => i.status === 'working').length;
  const warningCount = items.filter((i) => i.status === 'warning').length;

  const areas = ['all', 'College Road', 'Gangapur Road', 'Nashik Road', 'Mahatma Nagar', 'Panchavati'];

  const typeOptions: { value: InfrastructureType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'streetlight', label: 'Streetlights' },
    { value: 'footpath', label: 'Footpaths / Sidewalks' },
    { value: 'wheelchair_ramp', label: 'Wheelchair Ramps' },
    { value: 'public_toilet', label: 'Public Restrooms' },
    { value: 'drinking_water', label: 'Drinking Water' },
    { value: 'bus_stop', label: 'Bus Shelters' },
    { value: 'traffic_signal', label: 'Traffic Signals' },
    { value: 'other', label: 'Other Facilities' },
  ];

  const statusOptions: { value: InfrastructureStatus | 'all'; label: string; dot: string }[] = [
    { value: 'all', label: 'All Statuses', dot: 'bg-slate-400' },
    { value: 'broken', label: 'Dead / Broken', dot: 'bg-rose-500' },
    { value: 'warning', label: 'Warning', dot: 'bg-amber-500' },
    { value: 'working', label: 'Working', dot: 'bg-emerald-500' },
    { value: 'unknown', label: 'Unknown', dot: 'bg-slate-400' },
  ];

  const severityOptions: { value: SeverityLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const hasActiveFilters =
    (filters.type && filters.type !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.severity && filters.severity !== 'all') ||
    (filters.area && filters.area !== 'all') ||
    Boolean(filters.query);

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-800 ${className}`}
    >
      {/* Search Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
            placeholder="Search address, ID, or issue..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-rose-500"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Toggle and Counter */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              showFilters || hasActiveFilters
                ? 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {/* Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Infrastructure Type
              </label>
              <select
                value={filters.type || 'all'}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    type: e.target.value as InfrastructureType | 'all',
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ground Status
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {statusOptions.map((opt) => {
                  const isActive = (filters.status || 'all') === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          status: opt.value as InfrastructureStatus | 'all',
                        })
                      }
                      className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-left text-[11px] font-medium transition-colors ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Severity
              </label>
              <div className="flex gap-1 flex-wrap">
                {severityOptions.map((opt) => {
                  const isActive = (filters.severity || 'all') === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          severity: opt.value as SeverityLevel | 'all',
                        })
                      }
                      className={`rounded-md border px-2 py-0.5 text-[11px] capitalize transition-colors ${
                        isActive
                          ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold dark:bg-rose-950/60 dark:text-rose-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area quick jump */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Civic Ward / Area
              </label>
              <select
                value={filters.area || 'all'}
                onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'all' ? 'All Areas' : a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Live Filter Metric Strip */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{items.length}</strong> of{' '}
            {totalCount} facilities
          </span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {brokenCount} Dead
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              {workingCount} Working
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Infrastructure List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {items.length === 0 ? (
          <EmptyState
            title="No matching infrastructure"
            description="No facilities match the active filter criteria. Try clearing some filters to explore more of the city grid."
            onReset={onResetFilters}
          />
        ) : (
          items.map((item) => (
            <InfrastructureCard
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onSelect={onSelectItem}
            />
          ))
        )}
      </div>
    </div>
  );
};
