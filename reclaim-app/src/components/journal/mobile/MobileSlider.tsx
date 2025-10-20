"use client";

import React from 'react';

interface MobileSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  descriptor?: string;
  color?: string;
}

export default function MobileSlider({ 
  label,
  value, 
  onChange, 
  min = 1,
  max = 10,
  step = 1,
  descriptor,
  color = 'indigo'
}: MobileSliderProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'accent-blue-500';
      case 'green': return 'accent-green-500';
      case 'red': return 'accent-red-500';
      case 'orange': return 'accent-orange-500';
      default: return 'accent-indigo-500';
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="text-right">
          <span className="text-lg font-semibold text-gray-900">{value}</span>
          {descriptor && (
            <div className="text-xs text-gray-500">{descriptor}</div>
          )}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${getColorClasses()}`}
        />
        
        {/* Progress fill */}
        <div 
          className="absolute top-0 h-2 bg-indigo-500 rounded-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div 
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full transform -translate-y-1/2 pointer-events-none shadow-sm"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}