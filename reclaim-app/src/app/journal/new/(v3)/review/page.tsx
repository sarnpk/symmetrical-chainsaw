"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ReviewPage() {
  const router = useRouter();
  const { 
    draft,
    submitEntry,
    saveDraftNow
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setBusy(true);
    try {
      await submitEntry();
      router.push("/journal?success=true");
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit entry. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onBack = () => {
    router.push("/journal/new/audio-evidence");
  };

  const formatPatternName = (pattern: string) => {
    return pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSafetyLabel = (rating: number) => {
    const labels = ['', 'Very Unsafe', 'Unsafe', 'Neutral', 'Safe', 'Very Safe'];
    return labels[rating] || 'Unknown';
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Review & Submit" 
        progressText="Step 9 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {/* Summary Card */}
        <MobileFormCard 
          title="ðŸ“‹ Entry Summary"
          description="Review your entry before submitting"
        >
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">When & Where</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Date:</strong> {new Date(draft.incidentDate).toLocaleDateString()}</p>
                {draft.incidentTime && <p><strong>Time:</strong> {draft.incidentTime}</p>}
                {draft.location && <p><strong>Location:</strong> {draft.location}</p>}
              </div>
            </div>

            {/* What Happened */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">What Happened</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Title:</strong> {draft.title}</p>
                <p><strong>Description:</strong> {draft.description.substring(0, 150)}{draft.description.length > 150 ? '...' : ''}</p>
              </div>
            </div>

            {/* Safety Rating */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Safety Assessment</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{draft.safetyRating}/5</span>
                <span className="text-sm text-gray-600">({getSafetyLabel(draft.safetyRating)})</span>
              </div>
            </div>

            {/* Behavior Patterns */}
            {draft.selectedAbuseTypes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Behavior Patterns</h4>
                <div className="flex flex-wrap gap-2">
                  {draft.selectedAbuseTypes.map((type) => (
                    <span 
                      key={type}
                      className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                    >
                      {formatPatternName(type)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Evidence</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Photos:</strong> {draft.photoEvidence.length}</p>
                <p><strong>Audio recordings:</strong> {draft.audioEvidence.length}</p>
              </div>
            </div>

            {/* Emotional Impact */}
            {(draft.emotionalStateBefore.length > 0 || draft.emotionalStateAfter.length > 0) && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Emotional Impact</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {draft.emotionalStateBefore.length > 0 && (
                    <p><strong>Before:</strong> {draft.emotionalStateBefore.join(', ')}</p>
                  )}
                  {draft.emotionalStateAfter.length > 0 && (
                    <p><strong>After:</strong> {draft.emotionalStateAfter.join(', ')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </MobileFormCard>

        {/* Submission Options */}
        <MobileFormCard title="ðŸ’¾ Save Options">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="save-as-draft"
                checked={draft.isDraft}
                onChange={(e) => {/* TODO: implement draft toggle */}}
                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <label htmlFor="save-as-draft" className="text-sm font-medium text-gray-900">
                  Save as draft
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  You can continue editing this entry later
                </p>
              </div>
            </div>
          </div>
        </MobileFormCard>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-900">
                Ready to Submit
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Your entry will be securely saved and you can access it anytime from your journal.
              </p>
            </div>
          </div>
        </div>
      </main>

      <StickyActionBar
        primaryLabel="Submit Entry"
        onPrimary={onSubmit}
        secondaryLabel="Save Draft"
        onSecondary={saveDraftNow}
        busy={busy}
      />
    </div>
  );
}