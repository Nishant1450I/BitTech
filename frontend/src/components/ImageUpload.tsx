'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

const SAMPLE_PRESETS = [
  {
    name: 'Broken Streetlight',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Damaged Sidewalk',
    url: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Blocked Ramp',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Broken Signal',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc22d?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        onChange(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 group">
          <img
            src={value}
            alt="Report evidence preview"
            className="h-56 w-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-md hover:bg-slate-100 transition-colors"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 transition-colors flex items-center gap-1"
            >
              <X size={14} /> Remove
            </button>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 rounded-full bg-slate-900/80 p-1.5 text-white hover:bg-rose-600 transition-colors"
            aria-label="Remove photo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/40 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs text-rose-600 dark:bg-slate-800 dark:text-rose-400 mb-3">
            <UploadCloud size={24} />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Click to upload or drag & drop photo
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PNG, JPG, or WEBP (Max 5MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Preset Samples Helper */}
      <div className="pt-1">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
          Or select a sample photo for quick demo testing:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = value === preset.url;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`relative flex items-center gap-2 rounded-lg border p-1.5 text-left text-xs transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="h-8 w-8 rounded-md object-cover shrink-0"
                />
                <span className="truncate font-medium">{preset.name}</span>
                {isSelected && (
                  <Check size={12} className="absolute top-1 right-1 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
