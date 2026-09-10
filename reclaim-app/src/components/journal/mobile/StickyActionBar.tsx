"use client";

import React from 'react';

interface StickyActionBarProps {
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  disabled?: boolean;
  busy?: boolean;
}

export default function StickyActionBar({ 
  primaryLabel, 
  onPrimary, 
  secondaryLabel, 
  onSecondary,
  disabled = false,
  busy = false
}: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 safe-area-inset">
      <div className="flex gap-3">
        {secondaryLabel && onSecondary && (
          <button
            onClick={onSecondary}
            disabled={busy}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          onClick={onPrimary}
          disabled={disabled || busy}
          className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          {busy ? 'Please wait...' : primaryLabel}
        </button>
      </div>
    </div>
  );
}