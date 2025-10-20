"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import { MicrophoneIcon, StopIcon, DocumentArrowUpIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Mock subscription tier - in real app, get from user context
const subscriptionTier = 'foundation'; // 'foundation', 'recovery', 'empowerment'

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
          Record audio evidence and get automatic transcription with Recovery plan starting at $9.99/month.
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

export default function AudioEvidencePage() {
  const router = useRouter();
  const { 
    draft,
    addAudioEvidence,
    removeAudioEvidence,
    updateAudioCaption,
    nextStep,
    prevStep,
    markStepComplete,
    saveDraftNow
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const isPaidUser = () => subscriptionTier === 'recovery' || subscriptionTier === 'empowerment';

  const areMandatoryFieldsFilled = () => {
    return draft.title.trim().length > 0 && 
           draft.description.trim().length > 0 && 
           draft.incidentDate.trim().length > 0;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (!areMandatoryFieldsFilled()) {
      alert('Please fill in the required fields (Date, Title, and Description) before recording audio.');
      return;
    }

    if (!isPaidUser()) {
      alert('Audio recording is available on Recovery and Empowerment plans.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      setDuration(0);
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
      
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mr.onstop = () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: mr.mimeType || "audio/webm" });

        addAudioEvidence({
          file,
          caption: '',
          timestamp: new Date().toISOString(),
          duration: duration,
          transcription: '',
          transcriptionStatus: 'pending',
          audioUrl
        });

        stream.getTracks().forEach((t) => t.stop());
      };
      
      mr.start();
      recRef.current = mr;
      setRecording(true);
    } catch (e) {
      alert("Microphone permission is required to record audio.");
    }
  };

  const stopRecording = () => {
    recRef.current?.stop();
    setRecording(false);
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!areMandatoryFieldsFilled()) {
      alert('Please fill in the required fields (Date, Title, and Description) before uploading audio files.');
      e.target.value = '';
      return;
    }

    if (!isPaidUser()) {
      alert('Audio upload is available on Recovery and Empowerment plans.');
      e.target.value = '';
      return;
    }

    const files = Array.from(e.target.files || []);
    const audioFiles = files.filter(f => f.type.startsWith('audio/'));
    
    audioFiles.forEach((file) => {
      const audioUrl = URL.createObjectURL(file);
      addAudioEvidence({
        file,
        caption: '',
        timestamp: new Date().toISOString(),
        duration: 0, // Will be calculated when audio loads
        transcription: '',
        transcriptionStatus: 'pending',
        audioUrl
      });
    });
    
    e.target.value = '';
  };

  const onContinue = async () => {
    setBusy(true);
    markStepComplete(8);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/review");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/photo-evidence");
  };

  const mm = Math.floor(duration / 60).toString().padStart(2, "0");
  const ss = Math.floor(duration % 60).toString().padStart(2, "0");

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="Audio Evidence" 
        progressText="Step 8 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="🎙️ Audio Evidence"
          description={
            !areMandatoryFieldsFilled() 
              ? "Please fill in Date, Title, and Description before recording or uploading audio"
              : "Record or upload audio evidence (optional)"
          }
        >
          {isPaidUser() ? (
            <div className="space-y-6">
              {/* Recording Interface */}
              <div className="text-center space-y-4">
                <div className="text-2xl font-semibold tabular-nums text-gray-900">
                  {mm}:{ss}
                </div>

                {recording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="h-16 w-16 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <StopIcon className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!areMandatoryFieldsFilled()}
                    className={`h-16 w-16 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform ${
                      !areMandatoryFieldsFilled() 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    <MicrophoneIcon className="h-6 w-6" />
                  </button>
                )}

                <p className="text-sm text-gray-600">
                  {recording ? 'Tap to stop recording' : 'Tap to start recording'}
                </p>
              </div>

              {/* File Upload */}
              <div className="border-t pt-4">
                <label className={`w-full h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                  !areMandatoryFieldsFilled() 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}>
                  <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                  Upload Audio File
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="audio/*" 
                    onChange={handleAudioFileUpload}
                    multiple
                    disabled={!areMandatoryFieldsFilled()}
                  />
                </label>
              </div>

              {/* Audio List */}
              {draft.audioEvidence.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Recorded Audio</h4>
                  {draft.audioEvidence.map((audio, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <audio controls className="flex-1" src={audio.audioUrl} />
                        <button
                          type="button"
                          onClick={() => removeAudioEvidence(index)}
                          className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Add a caption..."
                        value={audio.caption}
                        onChange={(e) => updateAudioCaption(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Added: {new Date(audio.timestamp).toLocaleString()}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Transcription: {audio.transcriptionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <UpgradePrompt feature="Audio Evidence & Transcription" />
          )}
        </MobileFormCard>

        {/* Info Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">🎵</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-purple-900">
                Audio Evidence
              </h4>
              <p className="text-sm text-purple-700 mt-1">
                Record voice notes, conversations, or upload audio files. Recovery+ users get automatic transcription.
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