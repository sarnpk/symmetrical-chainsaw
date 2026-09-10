"use client";

import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { AIBehaviorSuggestion } from '@/app/journal/new/(v3)/JournalEntryContext';

interface MobileBehaviorGridProps {
  patterns: string[];
  selected: string[];
  onToggle: (pattern: string) => void;
  helpButton?: boolean;
  onHelp?: () => void;
  aiSuggestions?: AIBehaviorSuggestion[];
}

export default function MobileBehaviorGrid({ 
  patterns, 
  selected, 
  onToggle,
  helpButton = false,
  onHelp,
  aiSuggestions = []
}: MobileBehaviorGridProps) {
  const formatPatternName = (pattern: string) => {
    return pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAiSuggestion = (pattern: string) => {
    return aiSuggestions.find(s => s.pattern === pattern);
  };

  const getPatternStyle = (pattern: string) => {
    const isSelected = selected.includes(pattern);
    const aiSuggestion = getAiSuggestion(pattern);
    
    if (isSelected) {
      if (aiSuggestion) {
        return 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200';
      }
      return 'border-teal-500 bg-teal-50 text-teal-700';
    }
    
    if (aiSuggestion) {
      return 'border-indigo-300 bg-indigo-25 text-indigo-700 hover:border-indigo-400';
    }
    
    return 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white';
  };

  return (
    <div className="space-y-4">
      {helpButton && (
        <div className="flex justify-end">
          <button
            onClick={onHelp}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Learn about behavior patterns"
            type="button"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {patterns.map((pattern) => {
          const aiSuggestion = getAiSuggestion(pattern);
          
          return (
            <button
              key={pattern}
              onClick={() => onToggle(pattern)}
              className={`p-4 text-sm font-medium rounded-xl border-2 transition-all min-h-[56px] relative ${getPatternStyle(pattern)}`}
              type="button"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-center leading-tight">
                  {formatPatternName(pattern)}
                </span>
                
                {aiSuggestion && (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-xs">AI</span>
                    </div>
                    <span className="text-xs text-indigo-600">
                      {Math.round(aiSuggestion.confidence * 100)}%
                    </span>
                  </div>
                )}
                
                {aiSuggestion?.isCustom && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {selected.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {selected.length} pattern{selected.length !== 1 ? 's' : ''} selected
          {aiSuggestions.some(s => selected.includes(s.pattern)) && (
            <span className="ml-2 text-indigo-600">
              (includes AI suggestions)
            </span>
          )}
        </div>
      )}
    </div>
  );
}