'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InfrastructureItem, FilterOptions } from '../../types/infrastructure';
import { getInfrastructure } from '../../services/infrastructureService';
import { MapComponent } from '../../components/MapComponent';
import { MapSidebar } from '../../components/MapSidebar';
import { DetailDrawer } from '../../components/DetailDrawer';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { Map as MapIcon, List, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function RealityMapPage() {
  const [items, setItems] = useState<InfrastructureItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InfrastructureItem | null>(null);
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    severity: 'all',
    verificationStatus: 'all',
    area: 'all',
    query: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInfrastructure(filters);
      setItems(data);
      if (totalCount === 0 || (!filters.query && filters.type === 'all' && filters.status === 'all')) {
        setTotalCount(data.length);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load infrastructure data.');
    } finally {
      setLoading(false);
    }
  }, [filters, totalCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectItem = (item: InfrastructureItem) => {
    setSelectedItem(item);
    // On mobile, if user clicks card in list, switch to map to see location
    if (mobileTab === 'list') {
      setMobileTab('map');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      severity: 'all',
      verificationStatus: 'all',
      area: 'all',
      query: '',
    });
  };

  const handleItemUpdated = (updated: InfrastructureItem) => {
    setSelectedItem(updated);
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900 z-30">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              mobileTab === 'map'
                ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <MapIcon size={14} />
            <span>Map View</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              mobileTab === 'list'
                ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <List size={14} />
            <span>List ({items.length})</span>
          </button>
        </div>

        <Link
          href="/report"
          className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-xs"
        >
          <PlusCircle size={14} />
          <span>Report</span>
        </Link>
      </div>

      {/* Main Split Layout */}
      <div className="relative flex flex-1 w-full h-full overflow-hidden">
        {/* Left Sidebar (Desktop: 380px fixed width, Mobile: toggled via tab) */}
        <div
          className={`w-full md:w-[380px] lg:w-[420px] shrink-0 h-full z-20 transition-all ${
            mobileTab === 'list' ? 'block' : 'hidden md:block'
          }`}
        >
          {loading && items.length === 0 ? (
            <div className="p-4 bg-white dark:bg-slate-950 h-full">
              <LoadingState message="Loading civic grid nodes..." count={5} />
            </div>
          ) : error ? (
            <div className="p-4 bg-white dark:bg-slate-950 h-full">
              <ErrorState message={error} onRetry={fetchData} />
            </div>
          ) : (
            <MapSidebar
              items={items}
              totalCount={totalCount || items.length}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>

        {/* Map Center Canvas */}
        <div
          className={`flex-1 h-full relative z-10 ${
            mobileTab === 'map' ? 'block' : 'hidden md:block'
          }`}
        >
          <MapComponent
            items={items}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
          />
        </div>

        {/* Right Detail Drawer Overlay */}
        {selectedItem && (
          <DetailDrawer
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onItemUpdated={handleItemUpdated}
          />
        )}
      </div>
    </div>
  );
}
