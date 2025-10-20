"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import EmotionalStateSelector from "@/components/journal/mobile/EmotionalStateSelector";
import Link from "next/link";

// Mock subscription tier - in real app, get from user context
const subscriptionTier = 'foundation'; // 'foundation', 'recovery', 'empowerment'

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

const UpgradePrompt = ({ feature }: { feature: string }) => (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">✨</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-purple-900 mb-1">
          Unlock {feature} with Recovery Plan
        </h4>
        <p className="text-sm text-purple-700 mb-3">
          Track your emotional journey and understand how experiences affect you over time.
        </p>
        <Link
          href="/subscription"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Upgrade to Recovery
          <span className="text-xs">→</span>
        </Link>
      </div>
    </div>
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
    saveDraftNow
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const isPaidUser = () => subscriptionTier === 'recovery' || subscriptionTier === 'empowerment';

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
          title="🛡️ How This Affected You"
          description="Your emotional wellbeing matters"
        >
          {isPaidUser() ? (
            <div className="space-y-8">
              <EmotionalStateSelector
                title="💙 How were you feeling before?"
                states={emotionalStates}
                selected={draft.emotionalStateBefore}
                onToggle={(state) => toggleEmotionalState(state, 'before')}
              />
              
              <EmotionalStateSelector
                title="💔 How did you feel after?"
                states={emotionalStates}
                selected={draft.emotionalStateAfter}
                onToggle={(state) => toggleEmotionalState(state, 'after')}
              />
            </div>
          ) : (
            <UpgradePrompt feature="Emotional Impact Tracking" />
          )}
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold text-sm">💚</span>
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