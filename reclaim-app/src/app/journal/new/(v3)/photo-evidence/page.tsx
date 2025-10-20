"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import { CameraIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Mock subscription tier - in real app, get from user context
const subscriptionTier = 'foundation'; // 'foundation', 'recovery', 'empowerment'

export default function PhotoEvidencePage() {
  const router = useRouter();
  const { 
    draft,
    addPhotoEvidence,
    removePhotoEvidence,
    updatePhotoCaption,
    nextStep,
    prevStep,
    markStepComplete,
    saveDraftNow
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);

  const isFoundationUser = () => subscriptionTier === 'foundation';
  const maxPhotos = isFoundationUser() ? 3 : null;

  const areMandatoryFieldsFilled = () => {
    return draft.title.trim().length > 0 && 
           draft.description.trim().length > 0 && 
           draft.incidentDate.trim().length > 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, captureType?: string) => {
    if (!areMandatoryFieldsFilled()) {
      alert('Please fill in the required fields (Date, Title, and Description) before uploading photos.');
      e.target.value = '';
      return;
    }

    if (maxPhotos && draft.photoEvidence.length >= maxPhotos) {
      alert(`Foundation users can upload up to ${maxPhotos} photos. Upgrade for unlimited uploads.`);
      e.target.value = '';
      return;
    }

    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          addPhotoEvidence({
            file,
            caption: '',
            timestamp: new Date().toISOString(),
            preview
          });
        };
        reader.readAsDataURL(file);
      }
    });
    
    e.target.value = '';
  };

  const onContinue = async () => {
    setBusy(true);
    markStepComplete(7);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/audio-evidence");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/emotional-impact");
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Photo Evidence" 
        progressText="Step 7 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="📸 Photo Evidence"
          description={
            !areMandatoryFieldsFilled() 
              ? "Please fill in Date, Title, and Description before uploading photos"
              : "Upload photos related to this entry (optional)"
          }
        >
          <div className="space-y-6">
            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex-1 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                !areMandatoryFieldsFilled() 
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}>
                <CameraIcon className="h-6 w-6 mb-1" />
                Take Photo
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  onChange={(e) => handlePhotoUpload(e, 'camera')}
                  disabled={!areMandatoryFieldsFilled()}
                />
              </label>
              
              <label className={`flex-1 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                !areMandatoryFieldsFilled() 
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}>
                <PhotoIcon className="h-6 w-6 mb-1" />
                From Library
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  multiple
                  disabled={!areMandatoryFieldsFilled()}
                />
              </label>
            </div>

            {/* Photo Limit Info */}
            {isFoundationUser() && (
              <div className="text-xs text-gray-500 text-center">
                {draft.photoEvidence.length} of {maxPhotos} photos used
              </div>
            )}

            {/* Photo Grid */}
            {draft.photoEvidence.length > 0 ? (
              <div className="space-y-4">
                {draft.photoEvidence.map((photo, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="relative">
                      <img
                        src={photo.preview}
                        alt="Evidence"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhotoEvidence(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add a caption..."
                        value={photo.caption}
                        onChange={(e) => updatePhotoCaption(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500">
                        Added: {new Date(photo.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PhotoIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No photos added yet</p>
              </div>
            )}
          </div>
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">📷</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-900">
                Photo Evidence Tips
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Photos can include screenshots of messages, images of damage, or any visual evidence. Add captions to provide context.
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