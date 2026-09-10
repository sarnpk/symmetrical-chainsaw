"use client";

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface MobileTopBarProps {
  title: string;
  progressText?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export default function MobileTopBar({ 
  title, 
  progressText, 
  onBack,
  rightSlot 
}: MobileTopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center flex-1 mx-4">
          <h1 className="text-sm font-medium text-gray-900 truncate">{title}</h1>
          {progressText && (
            <p className="text-xs text-gray-500 mt-0.5">{progressText}</p>
          )}
        </div>
        
        <div className="w-9 flex justify-end">
          {rightSlot}
        </div>
      </div>
    </div>
  );
}