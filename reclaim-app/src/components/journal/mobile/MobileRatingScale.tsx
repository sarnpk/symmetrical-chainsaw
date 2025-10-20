"use client";

import React from 'react';

interface MobileRatingScaleProps {
  value: number;
  onChange: (rating: number) => void;
  labels: string[];
  colors?: string[];
  min?: number;
  max?: number;
}

export default function MobileRatingScale({ 
  value, 
  onChange, 
  labels,
  colors = ['red', 'orange', 'yellow', 'blue', 'green'],
  min = 1,
  max = 5
}: MobileRatingScaleProps) {
  const getColorClasses = (rating: number, isSelected: boolean) => {
    const colorIndex = rating - 1;
    const color = colors[colorIndex] || 'gray';
    
    if (isSelected) {
      switch (color) {
        case 'red': return 'border-red-500 bg-red-500 text-white';
        case 'orange': return 'border-orange-500 bg-orange-500 text-white';
        case 'yellow': return 'border-yellow-500 bg-yellow-500 text-white';
        case 'blue': return 'border-blue-500 bg-blue-500 text-white';
        case 'green': return 'border-green-500 bg-green-500 text-white';
        default: return 'border-indigo-500 bg-indigo-500 text-white';
      }
    }
    
    return 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white';
  };

  const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {ratings.map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`aspect-square rounded-xl border-2 font-semibold transition-all text-lg min-h-[48px] ${
              getColorClasses(rating, value === rating)
            }`}
            type="button"
          >
            {rating}
          </button>
        ))}
      </div>
      
      {labels[value - 1] && (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900">
            {labels[value - 1]}
          </span>
        </div>
      )}
    </div>
  );
}