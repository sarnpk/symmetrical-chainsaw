"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import MobileSlider from "@/components/journal/mobile/MobileSlider";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";

const getMoodDescriptor = (val: number) => {
  if (val <= 2) return 'Very Low';
  if (val <= 4) return 'Low';
  if (val <= 7) return 'Moderate';
  if (val <= 9) return 'High';
  return 'Very High';
};

const getTriggerDescriptor = (val: number) => {
  if (val === 1) return 'Mild';
  if (val === 2) return 'Light';
  if (val === 3) return 'Moderate';
  if (val === 4) return 'Strong';
  return 'Severe';
};

const UpgradePrompt = ({ feature, helpText }: { feature: string; helpText?: string }) => (
  <div className="py-2 px-3 space-y-1">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Sparkles className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
      <span>{feature} — available on <Link href="/subscription" className="text-indigo-600 hover:underline">Recovery</Link> plan</span>
    </div>
    {helpText && <p className="text-xs text-gray-400 pl-5 leading-relaxed">{helpText}</p>}
  </div>
);

export default function ImpactAssessmentPage() {
  const router = useRouter();
  const { 
    draft, 
    setMoodRating,
    setTriggerLevel,
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
    markStepComplete(5);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/emotional-impact");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/safety-assessment");
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Impact Assessment" 
        progressText="Step 5 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="Impact Assessment"
          description="How did this experience affect you?"
        >
          {isPaidUser() ? (
            <div className="space-y-8">
              <MobileSlider
                label="Mood Impact"
                value={draft.moodRating}
                onChange={setMoodRating}
                min={1}
                max={10}
                descriptor={getMoodDescriptor(draft.moodRating)}
                color="blue"
              />
              
              <MobileSlider
                label="Trigger Level"
                value={draft.triggerLevel}
                onChange={setTriggerLevel}
                min={1}
                max={5}
                descriptor={getTriggerDescriptor(draft.triggerLevel)}
                color="orange"
              />
            </div>
          ) : (
            <UpgradePrompt
              feature="Impact Assessment"
              helpText="Rate your mood (1–10) and trigger level (1–5). This helps you and your therapist track emotional patterns over time."
            />
          )}
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="flex items-center justify-center text-indigo-600"><BookOpen className="h-4 w-4" /></span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-indigo-900">
                Understanding Impact
              </h4>
              <p className="text-sm text-indigo-700 mt-1">
                Tracking how experiences affect your mood and trigger responses helps identify patterns and measure progress over time.
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