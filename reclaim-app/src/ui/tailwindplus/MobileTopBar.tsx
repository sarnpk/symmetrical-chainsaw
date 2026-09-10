"use client";

import React from "react";
import { useRouter } from "next/navigation";

type MobileTopBarProps = {
  title: string;
  rightSlot?: React.ReactNode;
  backHref?: string;
  progressText?: string; // e.g., "3/8"
};

export default function MobileTopBar({ title, rightSlot, backHref, progressText }: MobileTopBarProps) {
  const router = useRouter();
  const onBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="safe-area-inset px-4 h-12 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="-ml-2 p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {/* Chevron Left */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className="flex flex-col items-center min-w-0">
          <div className="text-sm font-medium truncate max-w-[60vw]">{title}</div>
          {progressText ? (
            <div className="text-[11px] text-gray-500 leading-none mt-0.5">{progressText}</div>
          ) : null}
        </div>
        <div className="min-w-[32px] flex items-center justify-end">
          {rightSlot}
        </div>
      </div>
    </div>
  );
}
