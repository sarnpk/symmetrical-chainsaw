"use client";

import React from 'react';

interface EmotionalState {
  label: string;
  intensity: 'positive' | 'neutral' | 'negative';
  value: string;
}

interface EmotionalStateSelectorProps {
  title: string;
  states: EmotionalState[];
  selected: string[];
  onToggle: (state: string) => void;
}

export default function EmotionalStateSelector({ 
  title, 
  states, 
  selected, 
  onToggle 
}: EmotionalStateSelectorProps) {
  const getIntensityStyle = (intensity: string, isSelected: boolean) => {
    if (!isSelected) return 'border-gray-200 hover:border-gray-300 bg-white text-gray-700';
    
    switch (intensity) {
      case 'positive': return 'border-green-400 bg-green-50 text-green-700';
      case 'neutral': return 'border-blue-400 bg-blue-50 text-blue-700';
      case 'negative': return 'border-red-400 bg-red-50 text-red-700';
      default: return 'border-gray-400 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {states.map((state) => (
          <button
            key={state.value}
            onClick={() => onToggle(state.value)}
            className={`p-3 text-sm font-medium rounded-lg border-2 transition-all min-h-[48px] ${
              getIntensityStyle(state.intensity, selected.includes(state.value))
            }`}
            type="button"
          >
            {state.label}
          </button>
        ))}
      </div>
      
      {selected.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {selected.length} emotion{selected.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}