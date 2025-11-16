'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles, Calendar, TrendingUp, Award, Plus, BookOpen, HelpCircle, Mic } from 'lucide-react';
import VoiceTextInput from '@/components/VoiceTextInput';

const modules = [
  { id: 'mask_visualization', title: 'The Mask: Understanding the Illusion', description: 'The person you married wasn\'t real. Learn to see the mask.' },
  { id: 'grief_processing', title: 'Grief Processing Guide', description: 'Mourn the illusion and what you thought you had.' },
  { id: 'acceptance_affirmations', title: 'Acceptance Affirmations', description: 'Daily reminders that NPD is permanent and not your fault.' },
  { id: 'expectation_vs_reality', title: 'What I Expected vs. What Is Real', description: 'Interactive exercise to confront the gap.' },
  { id: 'trigger_identification', title: 'Trigger Identification', description: 'When do you slip back into hope? Identify your triggers.' }
];

export default function AcceptancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [aiCoaching, setAiCoaching] = useState<any>(null);
  const [coachingModule, setCoachingModule] = useState<string | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [journalEntry, setJournalEntry] = useState<any>(null);
  const [acceptanceLevel, setAcceptanceLevel] = useState(5);
  const [dailyStruggle, setDailyStruggle] = useState('');
  const [hopeTriggersText, setHopeTriggersText] = useState('');
  const [realityAnchorsText, setRealityAnchorsText] = useState('');
  const [emotionalState, setEmotionalState] = useState('');
  const [milestones, setMilestones] = useState<any[]>([]);
  const [showMilestones, setShowMilestones] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [voiceInputField, setVoiceInputField] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeTab, setActiveTab] = useState('modules');
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [insightForEntry, setInsightForEntry] = useState<string | null>(null);
  const [loadingInsightFor, setLoadingInsightFor] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profile);
      setLoading(false);
      
      loadTodayJournal();
      loadRecentEntries();
    };
    init();
  }, [router, supabase]);

  const handleComplete = async (moduleType: string) => {
    const existing = progress.find(p => p.module_type === moduleType);
    
    if (existing) {
      await fetch('/api/acceptance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: existing.id, completed: true, notes })
      });
    } else {
      await fetch('/api/acceptance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_type: moduleType, completed: true, notes })
      });
    }
    
    fetch('/api/acceptance').then(r => r.json()).then(setProgress);
    setSelectedModule(null);
    setNotes('');
  };

  const isCompleted = (moduleType: string) => 
    progress.some(p => p.module_type === moduleType && p.completed);

  const loadTodayJournal = async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`/api/acceptance/journal?date=${today}`);
    if (response.ok) {
      const data = await response.json();
      if (data) {
        setJournalEntry(data);
        setAcceptanceLevel(data.acceptance_level || 5);
        setDailyStruggle(data.daily_struggle || '');
        setHopeTriggersText(data.hope_triggers?.[0] || '');
        setRealityAnchorsText(data.reality_anchors?.[0] || '');
        setEmotionalState(data.emotional_state || '');
      }
    }
  };

  const loadRecentEntries = async () => {
    const response = await fetch('/api/acceptance/journal');
    if (response.ok) {
      const data = await response.json();
      setRecentEntries(data || []);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!confirm('Delete this journal entry?')) return;
    const response = await fetch(`/api/acceptance/journal/${entryId}`, { method: 'DELETE' });
    if (response.ok) {
      loadRecentEntries();
      loadTodayJournal();
    }
  };

  const getInsights = async (entry: any) => {
    setLoadingInsightFor(entry.id);
    try {
      const response = await fetch('/api/acceptance/journal/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptance_level: entry.acceptance_level,
          daily_struggle: entry.daily_struggle,
          hope_triggers: entry.hope_triggers,
          reality_anchors: entry.reality_anchors,
          emotional_state: entry.emotional_state
        })
      });
      if (response.ok) {
        const data = await response.json();
        setInsightForEntry(data.insight);
      }
    } catch (error) {
      console.error('Failed to get insights:', error);
    }
    setLoadingInsightFor(null);
  };



  const saveJournalEntry = async () => {
    const entry = {
      acceptance_level: acceptanceLevel,
      daily_struggle: dailyStruggle || null,
      hope_triggers: hopeTriggersText ? [hopeTriggersText] : null,
      reality_anchors: realityAnchorsText ? [realityAnchorsText] : null,
      emotional_state: emotionalState || null
    };

    console.log('Saving entry:', entry);

    const response = await fetch('/api/acceptance/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Journal saved:', result);
      

      
      setShowJournal(false);
      setAcceptanceLevel(5);
      setDailyStruggle('');
      setHopeTriggersText('');
      setRealityAnchorsText('');
      setEmotionalState('');
      loadTodayJournal();
      loadRecentEntries();
    } else {
      const error = await response.text();
      console.error('Failed to save journal:', error);
    }
  };

  const completedCount = progress.filter(p => p.completed).length;
  const totalModules = modules.length;
  const progressPercent = (completedCount / totalModules) * 100;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user || !profile) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Diagnosis Acceptance</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-4">NPD is permanent. This is about accepting reality, not changing them.</p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => window.open('/docs/acceptance_journal_user_guide.html', '_blank')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </button>
            <button
              onClick={() => setShowJournal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <BookOpen className="h-4 w-4" />
              Daily Check-in
            </button>
            <button
              onClick={() => setShowMilestones(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
            >
              <Award className="h-4 w-4" />
              Milestones
            </button>

          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-amber-800">Acceptance Journey</h3>
            <span className="text-sm text-amber-600">{completedCount}/{totalModules} modules</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
            <div 
              className="bg-amber-600 h-2 rounded-full transition-all" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {journalEntry && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-700">
                Today's acceptance level: {journalEntry.acceptance_level}/10
              </div>
              <button
                onClick={() => setShowJournal(true)}
                className="text-xs text-amber-600 hover:text-amber-700 underline"
              >
                Update
              </button>
            </div>
          )}
          {!journalEntry && (
            <div className="text-sm text-amber-600">
              No check-in today yet. How are you feeling?
            </div>
          )}
        </div>

        {/* Daily Journal Modal */}
        {showJournal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-lg my-4">
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 text-center">Daily Acceptance Check-in</h2>
                <p className="text-xs text-gray-600 text-center mb-4">Quick 2-minute reflection on your acceptance journey</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">How accepting do you feel today?</label>
                    <div className="grid grid-cols-5 gap-1">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <button
                          key={num}
                          onClick={() => setAcceptanceLevel(num)}
                          className={`h-10 rounded text-xs font-medium ${
                            acceptanceLevel === num
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Struggling</span>
                      <span>At Peace</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">What challenged your acceptance today?</label>
                    <textarea
                      value={dailyStruggle}
                      onChange={(e) => setDailyStruggle(e.target.value)}
                      onFocus={() => {
                        setVoiceInputField('dailyStruggle');
                        setShowVoiceInput(true);
                      }}
                      className="w-full p-3 border rounded-lg text-sm resize-none md:block hidden"
                      rows={2}
                      placeholder="e.g., Saw them being kind to someone and wondered if they've changed"
                    />
                    <div className="flex gap-2 md:hidden">
                      <div className="flex-1 p-3 border rounded-lg text-sm text-gray-700 bg-gray-50">
                        {dailyStruggle || 'e.g., Saw them being kind to someone and wondered if they\'ve changed'}
                      </div>
                      <button
                        onClick={() => {
                          setVoiceInputField('dailyStruggle');
                          setShowVoiceInput(true);
                        }}
                        className="p-3 border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hope trigger</label>
                      <input
                        value={hopeTriggersText}
                        onChange={(e) => setHopeTriggersText(e.target.value)}
                        onFocus={() => {
                          setVoiceInputField('hopeTriggersText');
                          setShowVoiceInput(true);
                        }}
                        className="w-full p-3 border rounded-lg text-sm md:block hidden"
                        placeholder="e.g., They sent an apology text that seemed genuine"
                      />
                      <div className="flex gap-2 md:hidden">
                        <div className="flex-1 p-3 border rounded-lg text-sm text-gray-700 bg-gray-50">
                          {hopeTriggersText || 'e.g., They sent an apology text that seemed genuine'}
                        </div>
                        <button
                          onClick={() => {
                            setVoiceInputField('hopeTriggersText');
                            setShowVoiceInput(true);
                          }}
                          className="p-3 border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Mic className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Reality anchor</label>
                      <input
                        value={realityAnchorsText}
                        onChange={(e) => setRealityAnchorsText(e.target.value)}
                        onFocus={() => {
                          setVoiceInputField('realityAnchorsText');
                          setShowVoiceInput(true);
                        }}
                        className="w-full p-3 border rounded-lg text-sm md:block hidden"
                        placeholder="e.g., This is the 8th apology in 3 years, same pattern"
                      />
                      <div className="flex gap-2 md:hidden">
                        <div className="flex-1 p-3 border rounded-lg text-sm text-gray-700 bg-gray-50">
                          {realityAnchorsText || 'e.g., This is the 8th apology in 3 years, same pattern'}
                        </div>
                        <button
                          onClick={() => {
                            setVoiceInputField('realityAnchorsText');
                            setShowVoiceInput(true);
                          }}
                          className="p-3 border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Mic className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Emotional state</label>
                    <select
                      value={emotionalState}
                      onChange={(e) => setEmotionalState(e.target.value)}
                      className="w-full p-3 border rounded-lg text-sm"
                    >
                      <option value="">How are you feeling?</option>
                      <option value="peaceful">Peaceful - accepting reality</option>
                      <option value="sad">Sad - mourning the illusion</option>
                      <option value="angry">Angry - at the deception</option>
                      <option value="confused">Confused - still processing</option>
                      <option value="hopeful">Hopeful - (concerning)</option>
                      <option value="resigned">Resigned - giving up fight</option>
                      <option value="relieved">Relieved - burden lifted</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={saveJournalEntry}
                    className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
                  >
                    Save Check-in
                  </button>
                  <button
                    onClick={() => {
                      setShowJournal(false);
                      setAcceptanceLevel(5);
                      setDailyStruggle('');
                      setHopeTriggersText('');
                      setRealityAnchorsText('');
                      setEmotionalState('');
                    }}
                    className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}





        {/* Tabs */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'modules' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Acceptance Modules
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'journal' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Journal Entries
            </button>
          </div>
          
          {activeTab === 'journal' && (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Recent Check-ins</h3>
              <div className="space-y-3">
                {recentEntries.length > 0 ? (
                  recentEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-600">{new Date(entry.entry_date).toLocaleDateString()}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => getInsights(entry)}
                            disabled={loadingInsightFor === entry.id}
                            className="text-purple-600 hover:text-purple-700 text-xs flex items-center gap-1"
                          >
                            <Sparkles className="h-3 w-3" />
                            {loadingInsightFor === entry.id ? 'Loading...' : 'AI Insights'}
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-sm"><strong>Acceptance Level:</strong> {entry.acceptance_level}/10</div>
                      {entry.daily_struggle && <div className="text-sm mt-1"><strong>Struggle:</strong> {entry.daily_struggle}</div>}
                      {entry.emotional_state && <div className="text-sm mt-1"><strong>Feeling:</strong> {entry.emotional_state}</div>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No journal entries yet</p>
                )}
              </div>
              
              {insightForEntry && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <h4 className="text-sm font-semibold text-purple-800">AI Therapeutic Insights</h4>
                    </div>
                    <button
                      onClick={() => setInsightForEntry(null)}
                      className="text-purple-600 hover:text-purple-700 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="text-sm text-purple-700 whitespace-pre-wrap">{insightForEntry}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {activeTab === 'modules' && (
          <div className="space-y-4">
          {modules.map(module => (
            <div key={module.id} className="border rounded-lg p-4 bg-white">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted(module.id) ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        ✓ Complete
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedModule(module.id)}
                        className="px-3 py-1 border border-amber-600 text-amber-600 rounded text-sm hover:bg-amber-50"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
                  
                {selectedModule === module.id && (
                  <div className="space-y-3">
                    <textarea
                      className="w-full border rounded p-3 text-sm resize-none md:block hidden"
                      rows={4}
                      placeholder="Your reflections..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="md:hidden">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 p-3 border rounded-lg text-sm text-gray-700 bg-gray-50 min-h-[100px]">
                          {notes || 'Your reflections...'}
                        </div>
                        <button
                          onClick={() => {
                            setVoiceInputField('notes');
                            setShowVoiceInput(true);
                          }}
                          className="p-3 border rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Mic className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleComplete(module.id)}
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={async () => {
                          setLoadingCoach(true);
                          setCoachingModule(module.id);
                          try {
                            const res = await fetch('/api/acceptance/coach', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ module_type: module.id, user_input: notes })
                            });
                            const data = await res.json();
                            setAiCoaching(data.fallback || data);
                          } catch (error) {
                            console.error('AI coaching failed:', error);
                          }
                          setLoadingCoach(false);
                        }}
                        disabled={!notes || loadingCoach}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                      >
                        <Sparkles className="h-4 w-4" />
                        {loadingCoach ? 'Coaching...' : 'Get AI Coaching'}
                      </button>
                      <button
                        onClick={() => setSelectedModule(null)}
                        className="w-full px-4 py-2 border rounded hover:bg-gray-50 text-sm"
                      >
                        Cancel
                      </button>
                    </div>

                    {coachingModule === module.id && aiCoaching && (
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-600" />
                          AI Coach Guidance
                        </h4>
                        
                        {aiCoaching.insight && (
                          <div className="bg-white rounded p-3">
                            <div className="text-sm font-medium mb-1">Insight</div>
                            <div className="text-sm text-gray-700">{aiCoaching.insight}</div>
                          </div>
                        )}

                        {aiCoaching.validation && (
                          <div className="bg-white rounded p-3">
                            <div className="text-sm font-medium mb-1">Validation</div>
                            <div className="text-sm text-gray-700">{aiCoaching.validation}</div>
                          </div>
                        )}

                        {aiCoaching.reasoning && (
                          <div className="bg-white rounded p-3">
                            <div className="text-sm font-medium mb-1">Understanding</div>
                            <div className="text-sm text-gray-700">{aiCoaching.reasoning}</div>
                          </div>
                        )}

                        {aiCoaching.affirmations && (
                          <div className="bg-white rounded p-3">
                            <div className="text-sm font-medium mb-2">Affirmations</div>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {aiCoaching.affirmations.map((aff: string, idx: number) => (
                                <li key={idx}>• {aff}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiCoaching.next_step && (
                          <div className="bg-white rounded p-3">
                            <div className="text-sm font-medium mb-1">Next Step</div>
                            <div className="text-sm text-gray-700">{aiCoaching.next_step}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Milestones Modal */}
        {showMilestones && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-lg my-4">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Acceptance Milestones</h2>
                <p className="text-sm text-gray-600 mb-4">Track your progress in accepting the reality of NPD</p>
                
                <div className="space-y-3">
                  {[
                    { id: 'mask_clarity', title: 'I see the mask clearly', desc: 'Understanding the false persona' },
                    { id: 'grief_acceptance', title: "I'm mourning an illusion", desc: "Accepting what you're really grieving" },
                    { id: 'hope_detachment', title: 'I no longer expect change', desc: 'Releasing false hope' },
                    { id: 'reality_integration', title: 'NPD is permanent', desc: 'Full acceptance of the diagnosis' },
                    { id: 'peace_achievement', title: 'I feel at peace with reality', desc: 'Emotional acceptance achieved' }
                  ].map(milestone => (
                    <div key={milestone.id} className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-300"></div>
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-gray-600">{milestone.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowMilestones(false)}
                  className="w-full mt-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Acceptance Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Daily Acceptance Tips</h3>
          <div className="space-y-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">When Hope Resurfaces:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Remember: NPD is permanent</li>
                <li>• The mask was never real</li>
                <li>• Your healing matters more than their change</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Reality Anchors:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Read your journal entries</li>
                <li>• Talk to your support network</li>
                <li>• Review documented abuse patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {showVoiceInput && (
        <VoiceTextInput
          isOpen={showVoiceInput}
          onClose={() => setShowVoiceInput(false)}
          onSave={(text) => {
            if (voiceInputField === 'dailyStruggle') {
              setDailyStruggle(text);
            } else if (voiceInputField === 'hopeTriggersText') {
              setHopeTriggersText(text);
            } else if (voiceInputField === 'realityAnchorsText') {
              setRealityAnchorsText(text);
            } else if (voiceInputField === 'notes') {
              setNotes(text);
            }
            setShowVoiceInput(false);
          }}
          initialText={
            voiceInputField === 'dailyStruggle' ? dailyStruggle :
            voiceInputField === 'hopeTriggersText' ? hopeTriggersText :
            voiceInputField === 'realityAnchorsText' ? realityAnchorsText :
            voiceInputField === 'notes' ? notes : ''
          }
          placeholder={
            voiceInputField === 'dailyStruggle' ? 'Brief note about what made acceptance difficult...' :
            voiceInputField === 'hopeTriggersText' ? 'What sparked false hope?' :
            voiceInputField === 'realityAnchorsText' ? 'What grounded you?' :
            voiceInputField === 'notes' ? 'Your reflections...' : ''
          }
        />
      )}
    </DashboardLayout>
  );
}
