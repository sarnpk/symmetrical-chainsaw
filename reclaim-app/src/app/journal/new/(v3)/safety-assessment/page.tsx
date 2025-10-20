"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import MobileRatingScale from "@/components/journal/mobile/MobileRatingScale";

const safetyLabels = ['Very Unsafe', 'Unsafe', 'Neutral', 'Safe', 'Very Safe'];
const safetyColors = ['red', 'orange', 'yellow', 'blue', 'green'];

export default function SafetyAssessmentPage() {
  const router = useRouter();
  const { 
    draft, 
    setSafetyRating,
    nextStep,
    prevStep,
    markStepComplete,
    saveDraftNow,
    isStepValid
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const onContinue = async () => {
    if (!isStepValid(4)) return;
    
    setBusy(true);
    markStepComplete(4);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/impact-assessment");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/behavior-assessment");
  };

  const canContinue = draft.safetyRating > 0;

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Safety Assessment" 
        progressText="Step 4 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="🛡️ Safety Check"
          description="How safe did you feel during this experience?"
          required={true}
        >
          <MobileRatingScale
            value={draft.safetyRating}
            onChange={setSafetyRating}
            labels={safetyLabels}
            colors={safetyColors}
          />
        </MobileFormCard>

        {/* Safety Resources Card */}
        {draft.safetyRating <= 2 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">🚨</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-900">
                  Safety Resources Available
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  If you're in immediate danger, please call 911. For support, contact the National Domestic Violence Hotline: 1-800-799-7233
                </p>
                <div className="mt-3">
                  <button className="text-sm font-medium text-red-800 underline">
                    View Safety Resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">💡</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                Why we ask about safety
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Understanding your safety level helps us provide appropriate resources and support. Your wellbeing is our priority.
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
        disabled={!canContinue}
        busy={busy}
      />
    </div>
  );
}