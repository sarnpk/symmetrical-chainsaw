"use client";

import React from "react";

type StickyActionBarProps = {
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  disabled?: boolean;
  busy?: boolean;
};

export default function StickyActionBar({ primaryLabel, onPrimary, secondaryLabel, onSecondary, disabled, busy }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-gray-200">
      <div className="safe-area-inset p-4 flex gap-2">
        {secondaryLabel ? (
          <button
            type="button"
            onClick={onSecondary}
            className="flex-1 h-11 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100"
          >
            {secondaryLabel}
          </button>
        ) : null}
        <button
          type="button"
          disabled={disabled || busy}
          onClick={onPrimary}
          className="flex-1 h-11 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Please waitâ€¦" : primaryLabel}
        </button>
      </div>
    </div>
  );
}
