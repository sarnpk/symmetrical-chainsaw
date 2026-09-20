"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import EmotionalStateSelector from "@/components/journal/mobile/EmotionalStateSelector";
import Link from "next/link";
import { Sparkles, ArrowRight, AlertTriangle } from "lucide-react";

const emotionalStates = [
  { label: 'Happy', intensity: 'positive', value: 'happy' },
  { label: 'Content', intensity: 'positive', value: 'content' },
  { label: 'Hopeful', intensity: 'positive', value: 'hopeful' },
  { label: 'Calm', intensity: 'neutral', value: 'calm' },
  { label: 'Neutral', intensity: 'neutral', value: 'neutral' },
  { label: 'Confused', intensity: 'neutral', value: 'confused' },
  { label: 'Anxious', intensity: 'negative', value: 'anxious' },
  { label: 'Sad', intensity: 'negative', value: 'sad' },
  { label: 'Angry', intensity: 'negative', value: 'angry' },
  { label: 'Scared', intensity: 'negative', value: 'scared' },
  { label: 'Overwhelmed', intensity: 'negative', value: 'overwhelmed' },
  { label: 'Numb', intensity: 'negative', value: 'numb' },
] as const;

const UpgradePrompt = ({ feature, helpText }: { feature: string; helpText?: string }) => (
  <div className="py-2 px-3 space-y-1">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Sparkles className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
      <span>{feature} — available on <Link href="/subscription" className="text-indigo-600 hover:underline">Recovery</Link> plan</span>
    </div>
    {helpText && <p className="text-xs text-gray-400 pl-5 leading-relaxed">{helpText}</p>}
  </div>
);

export default function EmotionalImpactPage() {
  const router = useRouter();
  const { 
    draft, 
    toggleEmotionalState,
    nextStep,
    prevStep,
    markStepComplete,
    saveDraftNow,
    subscriptionTier,
    isPaidUser,
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const onContinue = async () => {
    setBusy(true);
    markStepComplete(6);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/photo-evidence");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/impact-assessment");
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Emotional Impact" 
        progressText="Step 6 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="How This Affected You"
          description="Your emotional wellbeing matters"
        >
          {isPaidUser() ? (
            <div className="space-y-8">
              <EmotionalStateSelector
                title="How were you feeling before?"
                states={emotionalStates}
                selected={draft.emotionalStateBefore}
                onToggle={(state) => toggleEmotionalState(state, 'before')}
              />
              
              <EmotionalStateSelector
                title="How did you feel after?"
                states={emotionalStates}
                selected={draft.emotionalStateAfter}
                onToggle={(state) => toggleEmotionalState(state, 'after')}
              />
            </div>
          ) : (
            <UpgradePrompt
              feature="Emotional Impact Tracking"
              helpText="Track how you felt before and after the incident. This helps you notice shifts in your wellbeing and spot patterns across entries."
            />
          )}
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="flex items-center justify-center text-teal-600"><AlertTriangle className="h-4 w-4" /></span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-teal-900">
                Emotional Awareness
              </h4>
              <p className="text-sm text-teal-700 mt-1">
                Understanding your emotional journey helps validate your experiences and track healing progress over time.
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
    </div>
  );
}