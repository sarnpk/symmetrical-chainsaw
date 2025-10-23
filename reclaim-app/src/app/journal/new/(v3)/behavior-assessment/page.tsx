"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import MobileBehaviorGrid from "@/components/journal/mobile/MobileBehaviorGrid";
import NPDTraitTagger from "@/components/journal/NPDTraitTagger";

// Base abuse patterns - always available
const baseAbuseTypes = [
  'gaslighting',
  'love_bombing', 
  'silent_treatment',
  'triangulation',
  'projection',
  'hoovering',
  'smear_campaign',
  'financial_abuse',
  'emotional_manipulation',
  'isolation',
  'blame_shifting',
  'control',
  'misscommitment'
];

export default function BehaviorAssessmentPage() {
  const router = useRouter();
  const { 
    draft, 
    toggleAbuseType,
    acceptAiBehaviorSuggestion,
    setNpdTraitsIdentified,
    nextStep,
    prevStep,
    markStepComplete,
    saveDraftNow
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Combine base patterns with AI-suggested patterns
  const aiSuggestedPatterns = draft.aiBehaviorSuggestions.map(s => s.pattern);
  const allPatterns = [...new Set([...baseAbuseTypes, ...aiSuggestedPatterns])];

  const onContinue = async () => {
    setBusy(true);
    markStepComplete(3);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/safety-assessment");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/what-happened");
  };

  const onHelp = () => {
    setShowHelp(true);
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Behavior Assessment" 
        progressText="Step 3 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="🎭 Behavior Patterns"
          description="Select all patterns that apply (optional)"
        >
          {/* AI Suggestions Section */}
          {draft.aiBehaviorSuggestions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-xs">AI</span>
                </div>
                <h4 className="text-sm font-medium text-gray-700">
                  AI Suggested Patterns
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {draft.aiBehaviorSuggestions
                  .sort((a, b) => b.confidence - a.confidence)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => acceptAiBehaviorSuggestion(suggestion)}
                      className={`p-4 text-left rounded-xl border-2 transition-all ${
                        draft.selectedAbuseTypes.includes(suggestion.pattern)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-indigo-200 bg-indigo-25 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {suggestion.pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {suggestion.isCustom && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                New Pattern
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            {suggestion.explanation}
                          </div>
                        </div>
                        <div className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                          {Math.round(suggestion.confidence * 100)}%
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  All Available Patterns
                </h4>
              </div>
            </div>
          )}

          <MobileBehaviorGrid
            patterns={allPatterns}
            selected={draft.selectedAbuseTypes}
            onToggle={toggleAbuseType}
            helpButton={true}
            onHelp={onHelp}
            aiSuggestions={draft.aiBehaviorSuggestions}
          />
        </MobileFormCard>

        {/* NPD Trait Tagging */}
        <MobileFormCard 
          title="🎯 NPD Traits Identified"
          description="Tag specific narcissistic traits you observed (Recovery+ feature)"
        >
          <NPDTraitTagger
            selectedTraits={draft.npdTraitsIdentified}
            onTraitsChange={setNpdTraitsIdentified}
          />
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">🔍</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-amber-900">
                Pattern Recognition
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Identifying patterns helps understand the bigger picture. Don't worry if you're unsure - you can always skip this step.
              </p>
            </div>
          </div>
        </div>
      </main>

      <StickyActionBar
        primaryLabel="Continue"
        onPrimary={onContinue}
        secondaryLabel="Save Draft"
        onSecondary={saveDraftNow}
        busy={busy}
      />

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Understanding Behavior Patterns
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <strong>Gaslighting:</strong> Making you question your reality or memory
                </div>
                <div>
                  <strong>Love Bombing:</strong> Excessive attention and affection early on
                </div>
                <div>
                  <strong>Silent Treatment:</strong> Ignoring you as punishment
                </div>
                <div>
                  <strong>Triangulation:</strong> Bringing others into conflicts
                </div>
                <div>
                  <strong>Projection:</strong> Accusing you of their own behaviors
                </div>
                <div>
                  <strong>Financial Abuse:</strong> Controlling money or resources
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}