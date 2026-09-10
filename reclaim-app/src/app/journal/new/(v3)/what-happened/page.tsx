"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useJournalEntry } from "../JournalEntryContext";
import MobileTopBar from "@/components/journal/mobile/MobileTopBar";
import StickyActionBar from "@/components/journal/mobile/StickyActionBar";
import MobileFormCard from "@/components/journal/mobile/MobileFormCard";
import { SparklesIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function WhatHappenedPage() {
  const router = useRouter();
  const { 
    draft, 
    setTitle,
    setDescription,
    setContent,
    nextStep,
    prevStep,
    markStepComplete,
    saveDraftNow,
    isStepValid,
    setAiAnalysisEnabled,
    triggerAiAnalysis,
    acceptAiTitleSuggestion,
    clearAiSuggestions
  } = useJournalEntry();
  
  const [busy, setBusy] = useState(false);
  const [showWhatHelp, setShowWhatHelp] = useState(false);

  // Mobile full-screen editor + voice dictation state
  const [showVoiceEditor, setShowVoiceEditor] = useState(false);
  const [editorText, setEditorText] = useState("");
  const [isDictating, setIsDictating] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported(!!((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition));
    }
  }, []);

  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const openFullScreenEditor = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isMobile()) return;
    setEditorText(draft.description || "");
    setShowVoiceEditor(true);
  };

  const stopDictation = () => {
    try {
      const rec = recognitionRef.current;
      if (rec) {
        rec.onend = null; // avoid auto-restart on manual stop
        rec.stop();
      }
    } catch {}
    setIsDictating(false);
  };

  const startDictation = () => {
    if (!speechSupported) return;
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (event: any) => {
        let addition = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            addition += res[0].transcript + ' ';
          }
        }
        if (addition) {
          setEditorText(prev => (prev ? prev + (prev.endsWith(' ') ? '' : ' ') : '') + addition.trim());
        }
      };
      rec.onerror = (e: any) => {
        console.warn('Speech recognition error', e);
      };
      rec.onend = () => {
        // On some mobile browsers recognition may stop after a while; auto-restart if still dictating
        if (showVoiceEditor && isDictating) {
          try { rec.start(); } catch {}
        }
      };
      recognitionRef.current = rec;
      rec.start();
      setIsDictating(true);
    } catch (e) {
      console.warn('Failed to start dictation', e);
    }
  };

  useEffect(() => {
    if (showVoiceEditor) {
      // Auto-start dictation when editor opens on mobile
      if (speechSupported) {
        startDictation();
      }
      // Prevent background scroll while editor is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
        stopDictation();
      };
    }
  }, [showVoiceEditor, speechSupported]);

  const onContinue = async () => {
    if (!isStepValid(2)) return;
    
    setBusy(true);
    markStepComplete(2);
    saveDraftNow();
    nextStep();
    router.push("/journal/new/behavior-assessment");
  };

  const onBack = () => {
    prevStep();
    router.push("/journal/new/when-where");
  };

  const canContinue = draft.title.length > 0 && draft.description.length > 0;

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileTopBar 
        title="What Happened" 
        progressText="Step 2 of 9"
        onBack={onBack}
      />
      
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <MobileFormCard 
          title="ðŸ“ Tell Your Story"
          description="Share what happened in your own words"
          required={true}
        >
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={triggerAiAnalysis}
                  disabled={!draft.aiAnalysisEnabled || draft.aiAnalysisStatus === 'analyzing' || draft.description.length < 20}
                  className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  {draft.aiAnalysisStatus === 'analyzing' ? 'Analyzing...' : 'AI Suggest'}
                </button>
              </div>
              <input
                id="title"
                type="text"
                value={draft.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of what happened"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  What happened? <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowWhatHelp(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Get help writing what happened"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <textarea
                id="description"
                rows={6}
                value={draft.description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={openFullScreenEditor}
                onClick={openFullScreenEditor}
                placeholder="Example: Partner denied saying hurtful things I have in messages, insisted I 'imagined it,' and said I'm too sensitive. I started doubting my memory despite the proof."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-base"
                required
              />
              <div className="mt-2 text-right text-xs text-gray-500">
                {draft.description.length} characters
              </div>
            </div>

            {/* AI Assist Toggle */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">AI Assist</div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.aiAnalysisEnabled}
                  onClick={() => setAiAnalysisEnabled(!draft.aiAnalysisEnabled)}
                  className="inline-flex items-center gap-2"
                >
                  <span
                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${
                      draft.aiAnalysisEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-[2px] ${
                        draft.aiAnalysisEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </span>
                  <span className="text-sm text-gray-700">Enable</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Get AI suggestions for titles and behavior patterns based on your description.
              </p>
              
              {!draft.aiAnalysisEnabled && (
                <p className="mt-2 text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded px-3 py-2">
                  AI Assist is available on Recovery and Empowerment plans.
                </p>
              )}

              {/* AI Analysis Section */}
              {draft.aiAnalysisEnabled && (
                <div className="mt-4 space-y-4">
                  {/* Analyze Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={triggerAiAnalysis}
                      disabled={draft.aiAnalysisStatus === 'analyzing' || draft.description.length < 20}
                      className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <SparklesIcon className="h-4 w-4" />
                      {draft.aiAnalysisStatus === 'analyzing' ? 'Analyzing...' : 'Analyze Content'}
                    </button>
                    {draft.aiTitleSuggestions.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAiSuggestions}
                        className="px-3 py-2 text-gray-600 text-sm rounded-lg hover:bg-gray-100"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Analysis Status */}
                  {draft.aiAnalysisStatus === 'analyzing' && (
                    <div className="flex items-center gap-2 text-sm text-indigo-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      Analyzing your description...
                    </div>
                  )}

                  {/* Error State */}
                  {draft.aiError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {draft.aiError}
                    </div>
                  )}

                  {/* Title Suggestions */}
                  {draft.aiTitleSuggestions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">AI Title Suggestions</h4>
                      <div className="space-y-2">
                        {draft.aiTitleSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => acceptAiTitleSuggestion(suggestion)}
                            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {suggestion.title}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {suggestion.rationale}
                                </div>
                              </div>
                              <div className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                {Math.round(suggestion.confidence * 100)}%
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Behavior Pattern Preview */}
                  {draft.aiBehaviorSuggestions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        AI Behavior Pattern Suggestions
                      </h4>
                      <div className="text-xs text-gray-600 mb-2">
                        These patterns will be highlighted in the next step
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {draft.aiBehaviorSuggestions
                          .sort((a, b) => b.confidence - a.confidence)
                          .slice(0, 3)
                          .map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full flex items-center gap-1"
                            >
                              <span>{suggestion.pattern.replace(/_/g, ' ')}</span>
                              <span className="text-teal-600">
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                            </div>
                          ))}
                        {draft.aiBehaviorSuggestions.length > 3 && (
                          <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{draft.aiBehaviorSuggestions.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </MobileFormCard>

        {/* Help Text */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">âœï¸</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-900">
                Writing Tips
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Write in your own words. Include specific details, quotes, and how it made you feel. This is your safe space to document everything.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Full-screen voice editor for mobile */}
      {showVoiceEditor && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <button
              type="button"
              onClick={() => { stopDictation(); setShowVoiceEditor(false); }}
              className="text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <div className="text-sm text-gray-800 flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${isDictating ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
              {isDictating ? 'Dictatingâ€¦' : (speechSupported ? 'Tap mic to dictate' : 'Dictation not supported')}
            </div>
            <button
              type="button"
              onClick={() => { setDescription(editorText); stopDictation(); setShowVoiceEditor(false); }}
              className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
          <div className="flex-1 p-4">
            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              className="w-full h-full resize-none outline-none text-base"
              placeholder="Speak or type what happenedâ€¦"
            />
          </div>
          <div className="p-4 border-t flex items-center justify-between">
            <button
              type="button"
              onClick={() => (isDictating ? stopDictation() : startDictation())}
              disabled={!speechSupported}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isDictating ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'} disabled:bg-gray-300 disabled:text-gray-600`}
            >
              <span className="inline-block h-3 w-3 rounded-full bg-white/80"></span>
              {isDictating ? 'Stop' : 'Start'} Mic
            </button>
            <div className="text-xs text-gray-500">
              Your words will be inserted into the What happened field.
            </div>
          </div>
        </div>
      )}

      <StickyActionBar
        primaryLabel="Continue"
        onPrimary={onContinue}
        secondaryLabel="Save Draft"
        onSecondary={saveDraftNow}
        disabled={!canContinue}
        busy={busy}
      />

      {/* Help Modal */}
      {showWhatHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tips for "What Happened?"
              </h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-900 mb-2">
                    Write a brief, factual description in your own words. Include:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Specific actions, quotes, and context</li>
                    <li>Who was involved and when it happened</li>
                    <li>Key actions or words used (quotes help)</li>
                    <li>Any evidence you have (texts, audio, photos)</li>
                    <li>How it made you feel or impacted you</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-2">Example:</p>
                  <p className="text-gray-700 italic">
                    Partner denied saying hurtful things I have in messages, insisted I "imagined it," 
                    and said I'm too sensitive. I started doubting my memory despite the proof.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-blue-900 mb-1">ðŸ’¡ Tip:</p>
                  <p className="text-blue-700">
                    Longer, concrete details improve AI suggestions. Minimum ~20 characters for analysis.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-green-900 mb-1">âœ… Remember:</p>
                  <p className="text-green-700">
                    This is your safe space. Write honestly and include as much detail as you're comfortable with. 
                    You can always edit or add more later.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowWhatHelp(false)}
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