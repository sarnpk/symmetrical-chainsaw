"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";

export type PhotoEvidence = {
  file: File;
  caption: string;
  timestamp: string;
  preview: string;
};

export type AudioEvidence = {
  file: File;
  caption: string;
  timestamp: string;
  duration: number;
  transcription?: string;
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  audioUrl: string;
};

export type AIBehaviorSuggestion = {
  pattern: string;
  confidence: number;
  explanation: string;
  isCustom: boolean; // true if not in base patterns
};

export type AITitleSuggestion = {
  title: string;
  confidence: number;
  rationale: string;
};

export type JournalDraft = {
  tempId: string;
  // Step 1: When & Where
  incidentDate: string;
  incidentTime: string;
  location: string;
  
  // Step 2: What Happened
  title: string;
  description: string;
  content: string;
  
  // Step 3: Behavior Assessment
  selectedAbuseTypes: string[];
  
  // Step 4: Safety Assessment
  safetyRating: number;
  
  // Step 5: Impact Assessment (Recovery+)
  moodRating: number;
  triggerLevel: number;
  
  // Step 6: How This Affected You (Recovery+)
  emotionalStateBefore: string[];
  emotionalStateAfter: string[];
  
  // Step 7: Evidence
  photoEvidence: PhotoEvidence[];
  audioEvidence: AudioEvidence[];
  
  // Step 8: Additional Context (Empowerment)
  behaviorCategories: string[];
  emotionalImpact: string[];
  patternFlags: string[];
  evidenceType: string[];
  evidenceNotes: string;
  contentWarnings: string[];
  isEvidence: boolean;
  
  // NPD Trait Tagging
  npdTraitsIdentified: string[];
  
  // AI Suggestions
  aiTitleSuggestions: AITitleSuggestion[];
  aiBehaviorSuggestions: AIBehaviorSuggestion[];
  aiAnalysisEnabled: boolean;
  aiAnalysisStatus: 'idle' | 'analyzing' | 'completed' | 'error';
  aiError: string | null;
  
  // Meta
  witnesses: string;
  isDraft: boolean;
  currentStep: number;
  completedSteps: number[];
};

type Ctx = {
  draft: JournalDraft;
  
  // Step navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (step: number) => void;
  
  // Step 1: When & Where
  setIncidentDate: (date: string) => void;
  setIncidentTime: (time: string) => void;
  setLocation: (location: string) => void;
  
  // Step 2: What Happened
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setContent: (content: string) => void;
  
  // Step 3: Behavior Assessment
  setSelectedAbuseTypes: (types: string[]) => void;
  toggleAbuseType: (type: string) => void;
  
  // Step 4: Safety Assessment
  setSafetyRating: (rating: number) => void;
  
  // Step 5: Impact Assessment
  setMoodRating: (rating: number) => void;
  setTriggerLevel: (level: number) => void;
  
  // Step 6: Emotional Impact
  setEmotionalStateBefore: (states: string[]) => void;
  setEmotionalStateAfter: (states: string[]) => void;
  toggleEmotionalState: (state: string, type: 'before' | 'after') => void;
  
  // Step 7: Evidence
  addPhotoEvidence: (photo: PhotoEvidence) => void;
  removePhotoEvidence: (index: number) => void;
  updatePhotoCaption: (index: number, caption: string) => void;
  addAudioEvidence: (audio: AudioEvidence) => void;
  removeAudioEvidence: (index: number) => void;
  updateAudioCaption: (index: number, caption: string) => void;
  
  // Step 8: Additional Context
  setBehaviorCategories: (categories: string[]) => void;
  setEmotionalImpact: (impact: string[]) => void;
  setPatternFlags: (flags: string[]) => void;
  setEvidenceType: (types: string[]) => void;
  setEvidenceNotes: (notes: string) => void;
  setContentWarnings: (warnings: string[]) => void;
  setIsEvidence: (isEvidence: boolean) => void;
  
  // NPD Trait Tagging
  setNpdTraitsIdentified: (traits: string[]) => void;
  
  // AI Methods
  setAiAnalysisEnabled: (enabled: boolean) => void;
  triggerAiAnalysis: () => Promise<void>;
  acceptAiTitleSuggestion: (suggestion: AITitleSuggestion) => void;
  acceptAiBehaviorSuggestion: (suggestion: AIBehaviorSuggestion) => void;
  clearAiSuggestions: () => void;
  
  // Other
  setWitnesses: (witnesses: string) => void;
  setIsDraft: (isDraft: boolean) => void;
  
  // Actions
  saveDraftNow: () => void;
  clearDraft: () => void;
  submitEntry: () => Promise<void>;
  
  // Validation
  isStepValid: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
};

// NPD Expert AI Analysis Function
function analyzeContentAsNPDExpert(content: string): {
  titleSuggestions: AITitleSuggestion[];
  behaviorSuggestions: AIBehaviorSuggestion[];
} {
  const titleSuggestions: AITitleSuggestion[] = [];
  const behaviorSuggestions: AIBehaviorSuggestion[] = [];

  // Analyze for specific patterns based on content
  
  // NEGLECT & ABANDONMENT PATTERNS
  if (content.includes('waited') || content.includes('waiting') || content.includes('didn\'t come') || content.includes('left me')) {
    titleSuggestions.push({
      title: "Neglect and abandonment during vulnerable time",
      confidence: 0.88,
      rationale: "Partner failed to provide promised care when you were sick and vulnerable"
    });
    behaviorSuggestions.push({
      pattern: "emotional_manipulation",
      confidence: 0.85,
      explanation: "Using your vulnerability and need for care as a control mechanism",
      isCustom: false
    });
    behaviorSuggestions.push({
      pattern: "neglect_abandonment",
      confidence: 0.92,
      explanation: "Deliberately abandoning you when you needed care and support",
      isCustom: true
    });
  }

  // BROKEN PROMISES & LIES
  if (content.includes('said') && (content.includes('but') || content.includes('didn\'t')) || content.includes('promise')) {
    titleSuggestions.push({
      title: "Broken promises and deliberate deception",
      confidence: 0.82,
      rationale: "Pattern of making commitments with no intention to follow through"
    });
    behaviorSuggestions.push({
      pattern: "misscommitment",
      confidence: 0.89,
      explanation: "Making false promises to manipulate your expectations and behavior",
      isCustom: false
    });
  }

  // SILENT TREATMENT & AVOIDANCE
  if (content.includes('didn\'t answer') || content.includes('not respond') || content.includes('ignored')) {
    titleSuggestions.push({
      title: "Silent treatment as punishment and control",
      confidence: 0.86,
      rationale: "Using communication withdrawal to punish and control you"
    });
    behaviorSuggestions.push({
      pattern: "silent_treatment",
      confidence: 0.91,
      explanation: "Deliberately withholding communication as a form of emotional abuse",
      isCustom: false
    });
  }

  // GASLIGHTING & REALITY DISTORTION
  if (content.includes('excuse') || content.includes('denied') || content.includes('said i')) {
    titleSuggestions.push({
      title: "Gaslighting with false excuses and reality distortion",
      confidence: 0.79,
      rationale: "Providing implausible explanations to make you question your perception"
    });
    behaviorSuggestions.push({
      pattern: "gaslighting",
      confidence: 0.84,
      explanation: "Making you question your reality with false explanations",
      isCustom: false
    });
  }

  // CONTROL & POWER DYNAMICS
  if (content.includes('sick') || content.includes('hungry') || content.includes('needed')) {
    behaviorSuggestions.push({
      pattern: "control",
      confidence: 0.87,
      explanation: "Exploiting your vulnerable state to maintain power and control",
      isCustom: false
    });
    behaviorSuggestions.push({
      pattern: "vulnerability_exploitation",
      confidence: 0.90,
      explanation: "Taking advantage of your illness and dependency to assert dominance",
      isCustom: true
    });
  }

  // LACK OF EMPATHY
  if (content.includes('hungry') || content.includes('sick') || content.includes('pain')) {
    behaviorSuggestions.push({
      pattern: "lack_of_empathy",
      confidence: 0.88,
      explanation: "Showing no concern for your physical and emotional suffering",
      isCustom: true
    });
  }

  // Default fallback if no specific patterns detected
  if (titleSuggestions.length === 0) {
    titleSuggestions.push({
      title: "Emotional neglect and manipulation incident",
      confidence: 0.75,
      rationale: "General pattern of emotional harm and manipulation detected"
    });
  }

  if (behaviorSuggestions.length === 0) {
    behaviorSuggestions.push({
      pattern: "emotional_manipulation",
      confidence: 0.70,
      explanation: "General emotional manipulation patterns detected",
      isCustom: false
    });
  }

  return { titleSuggestions, behaviorSuggestions };
}

const JournalEntryContext = createContext<Ctx | null>(null);

function getInitialDraft(): JournalDraft {
  const existing = typeof window !== "undefined" ? localStorage.getItem("journal_draft_v3") : null;
  if (existing) {
    try { 
      const parsed = JSON.parse(existing) as Partial<JournalDraft>;
      return {
        tempId: parsed.tempId || (crypto?.randomUUID?.() ?? String(Date.now())),
        incidentDate: parsed.incidentDate || new Date().toISOString().split('T')[0],
        incidentTime: parsed.incidentTime || new Date().toTimeString().slice(0, 5),
        location: parsed.location || '',
        title: parsed.title || '',
        description: parsed.description || '',
        content: parsed.content || '',
        selectedAbuseTypes: parsed.selectedAbuseTypes || [],
        safetyRating: parsed.safetyRating || 3,
        moodRating: parsed.moodRating || 5,
        triggerLevel: parsed.triggerLevel || 3,
        emotionalStateBefore: parsed.emotionalStateBefore || [],
        emotionalStateAfter: parsed.emotionalStateAfter || [],
        photoEvidence: parsed.photoEvidence || [],
        audioEvidence: parsed.audioEvidence || [],
        behaviorCategories: parsed.behaviorCategories || [],
        emotionalImpact: parsed.emotionalImpact || [],
        patternFlags: parsed.patternFlags || [],
        evidenceType: parsed.evidenceType || [],
        evidenceNotes: parsed.evidenceNotes || '',
        contentWarnings: parsed.contentWarnings || [],
        isEvidence: parsed.isEvidence || false,
        npdTraitsIdentified: parsed.npdTraitsIdentified || [],
        aiTitleSuggestions: parsed.aiTitleSuggestions || [],
        aiBehaviorSuggestions: parsed.aiBehaviorSuggestions || [],
        aiAnalysisEnabled: parsed.aiAnalysisEnabled || false,
        aiAnalysisStatus: parsed.aiAnalysisStatus || 'idle',
        aiError: parsed.aiError || null,
        witnesses: parsed.witnesses || '',
        isDraft: parsed.isDraft || true,
        currentStep: parsed.currentStep || 1,
        completedSteps: parsed.completedSteps || [],
      };
    } catch {}
  }
  
  const now = new Date();
  return {
    tempId: (crypto?.randomUUID?.() ?? String(Date.now())),
    incidentDate: now.toISOString().split('T')[0],
    incidentTime: now.toTimeString().slice(0, 5),
    location: '',
    title: '',
    description: '',
    content: '',
    selectedAbuseTypes: [],
    safetyRating: 3,
    moodRating: 5,
    triggerLevel: 3,
    emotionalStateBefore: [],
    emotionalStateAfter: [],
    photoEvidence: [],
    audioEvidence: [],
    behaviorCategories: [],
    emotionalImpact: [],
    patternFlags: [],
    evidenceType: [],
    evidenceNotes: '',
    contentWarnings: [],
    isEvidence: false,
    npdTraitsIdentified: [],
    aiTitleSuggestions: [],
    aiBehaviorSuggestions: [],
    aiAnalysisEnabled: false,
    aiAnalysisStatus: 'idle',
    aiError: null,
    witnesses: '',
    isDraft: true,
    currentStep: 1,
    completedSteps: [],
  };
}

export function JournalEntryProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<JournalDraft>(getInitialDraft);

  // Debounced autosave
  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem("journal_draft_v3", JSON.stringify(draft)); } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [draft]);

  const api: Ctx = useMemo(() => ({
    draft,
    
    // Step navigation
    currentStep: draft.currentStep,
    setCurrentStep: (step: number) => setDraft(d => ({ ...d, currentStep: step })),
    nextStep: () => setDraft(d => ({ ...d, currentStep: Math.min(d.currentStep + 1, 9) })),
    prevStep: () => setDraft(d => ({ ...d, currentStep: Math.max(d.currentStep - 1, 1) })),
    markStepComplete: (step: number) => setDraft(d => ({ 
      ...d, 
      completedSteps: [...new Set([...d.completedSteps, step])] 
    })),
    
    // Step 1: When & Where
    setIncidentDate: (date: string) => setDraft(d => ({ ...d, incidentDate: date })),
    setIncidentTime: (time: string) => setDraft(d => ({ ...d, incidentTime: time })),
    setLocation: (location: string) => setDraft(d => ({ ...d, location })),
    
    // Step 2: What Happened
    setTitle: (title: string) => setDraft(d => ({ ...d, title })),
    setDescription: (description: string) => setDraft(d => ({ ...d, description })),
    setContent: (content: string) => setDraft(d => ({ ...d, content })),
    
    // Step 3: Behavior Assessment
    setSelectedAbuseTypes: (types: string[]) => setDraft(d => ({ ...d, selectedAbuseTypes: types })),
    toggleAbuseType: (type: string) => setDraft(d => ({
      ...d,
      selectedAbuseTypes: d.selectedAbuseTypes.includes(type)
        ? d.selectedAbuseTypes.filter(t => t !== type)
        : [...d.selectedAbuseTypes, type]
    })),
    
    // Step 4: Safety Assessment
    setSafetyRating: (rating: number) => setDraft(d => ({ ...d, safetyRating: rating })),
    
    // Step 5: Impact Assessment
    setMoodRating: (rating: number) => setDraft(d => ({ ...d, moodRating: rating })),
    setTriggerLevel: (level: number) => setDraft(d => ({ ...d, triggerLevel: level })),
    
    // Step 6: Emotional Impact
    setEmotionalStateBefore: (states: string[]) => setDraft(d => ({ ...d, emotionalStateBefore: states })),
    setEmotionalStateAfter: (states: string[]) => setDraft(d => ({ ...d, emotionalStateAfter: states })),
    toggleEmotionalState: (state: string, type: 'before' | 'after') => setDraft(d => {
      const key = type === 'before' ? 'emotionalStateBefore' : 'emotionalStateAfter';
      const current = d[key];
      return {
        ...d,
        [key]: current.includes(state)
          ? current.filter(s => s !== state)
          : [...current, state]
      };
    }),
    
    // Step 7: Evidence
    addPhotoEvidence: (photo: PhotoEvidence) => setDraft(d => ({ 
      ...d, 
      photoEvidence: [...d.photoEvidence, photo] 
    })),
    removePhotoEvidence: (index: number) => setDraft(d => ({ 
      ...d, 
      photoEvidence: d.photoEvidence.filter((_, i) => i !== index) 
    })),
    updatePhotoCaption: (index: number, caption: string) => setDraft(d => ({
      ...d,
      photoEvidence: d.photoEvidence.map((photo, i) => 
        i === index ? { ...photo, caption } : photo
      )
    })),
    addAudioEvidence: (audio: AudioEvidence) => setDraft(d => ({ 
      ...d, 
      audioEvidence: [...d.audioEvidence, audio] 
    })),
    removeAudioEvidence: (index: number) => setDraft(d => ({ 
      ...d, 
      audioEvidence: d.audioEvidence.filter((_, i) => i !== index) 
    })),
    updateAudioCaption: (index: number, caption: string) => setDraft(d => ({
      ...d,
      audioEvidence: d.audioEvidence.map((audio, i) => 
        i === index ? { ...audio, caption } : audio
      )
    })),
    
    // Step 8: Additional Context
    setBehaviorCategories: (categories: string[]) => setDraft(d => ({ ...d, behaviorCategories: categories })),
    setEmotionalImpact: (impact: string[]) => setDraft(d => ({ ...d, emotionalImpact: impact })),
    setPatternFlags: (flags: string[]) => setDraft(d => ({ ...d, patternFlags: flags })),
    setEvidenceType: (types: string[]) => setDraft(d => ({ ...d, evidenceType: types })),
    setEvidenceNotes: (notes: string) => setDraft(d => ({ ...d, evidenceNotes: notes })),
    setContentWarnings: (warnings: string[]) => setDraft(d => ({ ...d, contentWarnings: warnings })),
    setIsEvidence: (isEvidence: boolean) => setDraft(d => ({ ...d, isEvidence })),
    
    // NPD Trait Tagging
    setNpdTraitsIdentified: (traits: string[]) => setDraft(d => ({ ...d, npdTraitsIdentified: traits })),
    
    // AI Methods
    setAiAnalysisEnabled: (enabled: boolean) => setDraft(d => ({ ...d, aiAnalysisEnabled: enabled })),
    triggerAiAnalysis: async () => {
      if (!draft.description || draft.description.length < 20) {
        setDraft(d => ({ ...d, aiError: 'Please provide more details in your description for AI analysis.' }));
        return;
      }

      // Prevent duplicate analysis of the same content
      if (draft.aiAnalysisStatus === 'analyzing') {
        return; // Already analyzing
      }

      setDraft(d => ({ ...d, aiAnalysisStatus: 'analyzing', aiError: null }));

      try {
        // Get auth token from Supabase
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error('Authentication required for AI analysis');
        }

        // Use existing suggest-metadata API endpoint
        const response = await fetch('/api/ai/suggest-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            text: draft.description,
            limit: 3
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `AI API Error: ${response.status} ${response.statusText}`);
        }

        const aiResult = await response.json();
        
        // Parse AI response into our format
        const titleSuggestions: AITitleSuggestion[] = aiResult.title_suggestions?.map((t: any) => ({
          title: t.text || t.title,
          confidence: t.confidence || 0.8,
          rationale: t.rationale || 'AI-generated suggestion'
        })) || [];

        const behaviorSuggestions: AIBehaviorSuggestion[] = aiResult.abuse_types?.map((b: any) => ({
          pattern: b.key,
          confidence: b.confidence || 0.8,
          explanation: b.evidence?.join('; ') || 'AI-detected pattern',
          isCustom: false
        })) || [];

        // Add behavior categories as additional suggestions
        const behaviorCategorySuggestions: AIBehaviorSuggestion[] = aiResult.behavior_categories?.map((b: any) => ({
          pattern: b.key,
          confidence: b.confidence || 0.8,
          explanation: b.evidence?.join('; ') || 'AI-detected behavior pattern',
          isCustom: true
        })) || [];

        const allBehaviorSuggestions = [...behaviorSuggestions, ...behaviorCategorySuggestions];

        // Fallback to mock if AI returns empty results
        if (titleSuggestions.length === 0 && allBehaviorSuggestions.length === 0) {
          const content = draft.description.toLowerCase();
          const mockResults = analyzeContentAsNPDExpert(content);
          setDraft(d => ({
            ...d,
            aiTitleSuggestions: mockResults.titleSuggestions,
            aiBehaviorSuggestions: mockResults.behaviorSuggestions,
            aiAnalysisStatus: 'completed',
            aiError: 'Using fallback analysis - AI service may be unavailable'
          }));
        } else {
          setDraft(d => ({
            ...d,
            aiTitleSuggestions: titleSuggestions,
            aiBehaviorSuggestions: allBehaviorSuggestions,
            aiAnalysisStatus: 'completed'
          }));
        }

      } catch (error: any) {
        console.error('AI Analysis Error:', error);
        
        // Fallback to mock analysis if real AI fails
        const content = draft.description.toLowerCase();
        const mockResults = analyzeContentAsNPDExpert(content);
        
        setDraft(d => ({
          ...d,
          aiTitleSuggestions: mockResults.titleSuggestions,
          aiBehaviorSuggestions: mockResults.behaviorSuggestions,
          aiAnalysisStatus: 'completed',
          aiError: `AI service unavailable (${error.message}). Using fallback analysis.`
        }));
      }
    },
    acceptAiTitleSuggestion: (suggestion: AITitleSuggestion) => {
      setDraft(d => ({ ...d, title: suggestion.title }));
    },
    acceptAiBehaviorSuggestion: (suggestion: AIBehaviorSuggestion) => {
      setDraft(d => ({
        ...d,
        selectedAbuseTypes: [...new Set([...d.selectedAbuseTypes, suggestion.pattern])]
      }));
    },
    clearAiSuggestions: () => {
      setDraft(d => ({
        ...d,
        aiTitleSuggestions: [],
        aiBehaviorSuggestions: [],
        aiAnalysisStatus: 'idle',
        aiError: null
      }));
    },
    
    // Other
    setWitnesses: (witnesses: string) => setDraft(d => ({ ...d, witnesses })),
    setIsDraft: (isDraft: boolean) => setDraft(d => ({ ...d, isDraft })),
    
    // Actions
    saveDraftNow: () => {
    try { localStorage.setItem("journal_draft_v3", JSON.stringify(draft)); } catch {}
    // TODO: call server-side draft save
    },
    clearDraft: () => {
    try { 
    localStorage.removeItem("journal_draft_v3"); 
    setDraft(getInitialDraft());
    } catch {}
    },
    submitEntry: async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Step 1: Create journal entry in database
        const journalEntryData = {
          user_id: user.id,
          title: draft.title,
          description: draft.description,
          content: draft.content || draft.description,
          incident_date: draft.incidentDate,
          incident_time: draft.incidentTime,
          location: draft.location,
          safety_rating: draft.safetyRating,
          mood_rating: draft.moodRating,
          trigger_level: draft.triggerLevel,
          abuse_types: draft.selectedAbuseTypes,
          behavior_categories: draft.behaviorCategories,
          pattern_flags: draft.patternFlags,
          emotional_impact: draft.emotionalImpact,
          evidence_type: draft.evidenceType,
          evidence_notes: draft.evidenceNotes,
          witnesses: draft.witnesses ? [draft.witnesses] : [],
          emotional_state_before: draft.emotionalStateBefore.join(', '),
          emotional_state_after: draft.emotionalStateAfter.join(', '),
          npd_traits_identified: draft.npdTraitsIdentified,
          is_evidence: draft.isEvidence,
          is_draft: false,
          content_warnings: draft.contentWarnings,
          ai_analysis: draft.aiTitleSuggestions.length > 0 || draft.aiBehaviorSuggestions.length > 0 ? {
            title_suggestions: draft.aiTitleSuggestions,
            behavior_suggestions: draft.aiBehaviorSuggestions,
            analysis_enabled: draft.aiAnalysisEnabled
          } : null
        };

        const { data: journalEntry, error: journalError } = await supabase
          .from('journal_entries')
          .insert([journalEntryData])
          .select()
          .single();

        if (journalError || !journalEntry) {
          throw new Error(`Failed to create journal entry: ${journalError?.message}`);
        }

        // Step 2: Upload photo evidence
        const photoUploadPromises = draft.photoEvidence.map(async (photo, index) => {
          try {
            // Generate unique file path
            const fileExt = photo.file.name.split('.').pop();
            const fileName = `${journalEntry.id}_photo_${index + 1}.${fileExt}`;
            const filePath = `${user.id}/journal_evidence/${fileName}`;

            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('evidence-files')
              .upload(filePath, photo.file);

            if (uploadError) {
              throw new Error(`Photo upload failed: ${uploadError.message}`);
            }

            // Create evidence file record
            const evidenceData = {
              journal_entry_id: journalEntry.id,
              user_id: user.id,
              file_name: photo.file.name,
              storage_bucket: 'evidence-files',
              storage_path: filePath,
              file_type: photo.file.type,
              file_size: photo.file.size,
              caption: photo.caption,
              processing_status: 'completed',
              uploaded_at: new Date().toISOString(),
              processed_at: new Date().toISOString(),
              metadata: {
                timestamp: photo.timestamp,
                upload_source: 'mobile_v3'
              }
            };

            const { data: evidenceFile, error: evidenceError } = await supabase
              .from('evidence_files')
              .insert([evidenceData])
              .select()
              .single();

            if (evidenceError) {
              console.error('Failed to create evidence file record:', evidenceError);
            }

            return evidenceFile;
          } catch (error) {
            console.error('Photo upload error:', error);
            return null;
          }
        });

        // Step 3: Upload audio evidence and start transcription
        const audioUploadPromises = draft.audioEvidence.map(async (audio, index) => {
          try {
            // Generate unique file path
            const fileExt = audio.file.name.split('.').pop() || 'webm';
            const fileName = `${journalEntry.id}_audio_${index + 1}.${fileExt}`;
            const filePath = `${user.id}/journal_evidence/${fileName}`;

            // Upload to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('evidence-files')
              .upload(filePath, audio.file);

            if (uploadError) {
              throw new Error(`Audio upload failed: ${uploadError.message}`);
            }

            // Create evidence file record
            const evidenceData = {
              journal_entry_id: journalEntry.id,
              user_id: user.id,
              file_name: audio.file.name,
              storage_bucket: 'evidence-files',
              storage_path: filePath,
              file_type: audio.file.type,
              file_size: audio.file.size,
              caption: audio.caption,
              duration_seconds: audio.duration,
              transcription_status: 'pending',
              processing_status: 'pending',
              uploaded_at: new Date().toISOString(),
              metadata: {
                timestamp: audio.timestamp,
                upload_source: 'mobile_v3',
                duration: audio.duration
              }
            };

            const { data: evidenceFile, error: evidenceError } = await supabase
              .from('evidence_files')
              .insert([evidenceData])
              .select()
              .single();

            if (evidenceError) {
              console.error('Failed to create evidence file record:', evidenceError);
              return null;
            }

            // Start transcription process
            try {
              const { data: signedUrl } = await supabase.storage
                .from('evidence-files')
                .createSignedUrl(filePath, 3600); // 1 hour

              if (signedUrl?.signedUrl) {
                const transcribeResponse = await fetch('/api/evidence/transcribe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                  },
                  body: JSON.stringify({
                    journal_entry_id: journalEntry.id,
                    file_name: audio.file.name,
                    file_type: audio.file.type,
                    file_size: audio.file.size,
                    storage_bucket: 'evidence-files',
                    storage_path: filePath,
                    caption: audio.caption,
                    duration_seconds: audio.duration
                  })
                });

                if (!transcribeResponse.ok) {
                  console.error('Transcription request failed:', await transcribeResponse.text());
                }
              }
            } catch (transcribeError) {
              console.error('Transcription setup error:', transcribeError);
            }

            return evidenceFile;
          } catch (error) {
            console.error('Audio upload error:', error);
            return null;
          }
        });

        // Wait for all uploads to complete
        const [photoResults, audioResults] = await Promise.all([
          Promise.all(photoUploadPromises),
          Promise.all(audioUploadPromises)
        ]);

        console.log('Journal entry created successfully:', {
          journalEntry,
          photoUploads: photoResults.filter(Boolean).length,
          audioUploads: audioResults.filter(Boolean).length
        });

        // Clear draft after successful submission
        try { 
          localStorage.removeItem("journal_draft_v3"); 
          setDraft(getInitialDraft());
        } catch {}

        return journalEntry;
      } catch (error: any) {
        console.error('Submit entry error:', error);
        throw new Error(`Failed to submit journal entry: ${error.message}`);
      }
    },
    
    // Validation
    isStepValid: (step: number) => {
      switch (step) {
        case 1: return draft.incidentDate.length > 0;
        case 2: return draft.title.length > 0 && draft.description.length > 0;
        case 3: return true; // Optional
        case 4: return draft.safetyRating > 0;
        case 5: return true; // Optional for paid users
        case 6: return true; // Optional for paid users
        case 7: return true; // Optional
        case 8: return true; // Optional for premium users
        case 9: return true; // Review step
        default: return false;
      }
    },
    canProceedToStep: (step: number) => {
      // Can proceed if all previous required steps are valid
      for (let i = 1; i < step; i++) {
        if (!api.isStepValid(i)) return false;
      }
      return true;
    },
  }), [draft]);

  return (
    <JournalEntryContext.Provider value={api}>{children}</JournalEntryContext.Provider>
  );
}

export function useJournalEntry() {
  const ctx = useContext(JournalEntryContext);
  if (!ctx) throw new Error("useJournalEntry must be used within JournalEntryProvider");
  return ctx;
}
