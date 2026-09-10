"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import MobileSlider from "@/components/journal/mobile/MobileSlider";
import Link from "next/link";

// Mock subscription tier - in real app, get from user context
const subscriptionTier = 'foundation'; // 'foundation', 'recovery', 'empowerment'

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

const UpgradePrompt = ({ feature }: { feature: string }) => (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">âœ¨</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-purple-900 mb-1">
          Unlock {feature} with Recovery Plan
        </h4>
        <p className="text-sm text-purple-700 mb-3">
          Track emotional impact and get enhanced documentation features starting at $9.99/month.
        </p>
        <Link
          href="/subscription"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Upgrade to Recovery
          <span className="text-xs">â†’</span>
        </Link>
      </div>
    </div>
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
    saveDraftNow
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const isPaidUser = () => subscriptionTier === 'recovery' || subscriptionTier === 'empowerment';

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
          title="ðŸ’Ÿ Impact Assessment"
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
            <UpgradePrompt feature="Impact Assessment" />
          )}
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">ðŸ“Š</span>
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