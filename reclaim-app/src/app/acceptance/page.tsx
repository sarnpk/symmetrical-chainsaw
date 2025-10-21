'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

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
      
      fetch('/api/acceptance').then(r => r.json()).then(setProgress);
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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user || !profile) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Diagnosis Acceptance</h1>
        <p className="text-gray-600 mb-8">NPD is permanent. This is about accepting reality, not changing them.</p>

        <div className="space-y-4">
          {modules.map(module => (
            <div key={module.id} className="border rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  
                  {selectedModule === module.id && (
                    <div className="mt-4">
                      <textarea
                        className="w-full border rounded p-3 mb-3"
                        rows={4}
                        placeholder="Your reflections..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => handleComplete(module.id)}
                          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
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
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          {loadingCoach ? 'Coaching...' : 'Get AI Coaching'}
                        </button>
                        <button
                          onClick={() => setSelectedModule(null)}
                          className="px-4 py-2 border rounded hover:bg-gray-50"
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
                
                <div className="ml-4">
                  {isCompleted(module.id) ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      ✓ Complete
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedModule(module.id)}
                      className="px-4 py-2 border border-amber-600 text-amber-600 rounded hover:bg-amber-50"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
