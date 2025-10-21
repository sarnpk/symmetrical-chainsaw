"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function WhenWherePage() {
  const router = useRouter();
  const { 
    draft, 
    setIncidentDate, 
    setIncidentTime, 
    setLocation,
    nextStep,
    markStepComplete,
    saveDraftNow,
    clearDraft,
    isStepValid
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const onContinue = async () => {
    if (!isStepValid(1)) return;
    
    setBusy(true);
    markStepComplete(1);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/what-happened");
  };

  const onBack = () => {
    router.push("/journal");
  };

  const canContinue = draft.incidentDate.length > 0;

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="When & Where" 
        progressText="Step 1 of 9"
        onBack={onBack}
        rightSlot={
          <button
            onClick={clearDraft}
            className="text-xs text-gray-600 hover:text-gray-900 underline"
            title="Start fresh entry"
          >
            Start Fresh
          </button>
        }
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="📅 When did this happen?"
          description="Start by recording when this incident occurred"
          required={true}
        >
          <div className="space-y-6">
            {/* Date Input */}
            <div>
              <label htmlFor="incident-date" className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="incident-date"
                  type="date"
                  value={draft.incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  required
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Time Input */}
            <div>
              <label htmlFor="incident-time" className="block text-sm font-medium text-gray-700 mb-2">
                Time (optional)
              </label>
              <input
                id="incident-time"
                type="time"
                value={draft.incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              />
            </div>

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  value={draft.location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where did this happen?"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                />
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </MobileFormCard>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">💡</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                Why we ask for date and time
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Recording when incidents happen helps identify patterns and provides important context for your documentation.
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