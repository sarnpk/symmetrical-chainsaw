'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const commonAreas = [
  'School events/activities',
  'Medical appointments',
  'Extracurricular schedules',
  'Homework/education',
  'Discipline decisions',
  'Financial support',
  'Holiday planning',
  'Communication about kids',
  'Her emotional state',
  'Her opinions of you',
  'Her personal problems',
  'Her relationships'
];

export default function RoleReframingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [boundaries, setBoundaries] = useState<any[]>([]);
  const [customArea, setCustomArea] = useState('');
  const [isMyResponsibility, setIsMyResponsibility] = useState(true);
  const [notes, setNotes] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingSituation, setAnalyzingSituation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
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
      
      fetch('/api/role-reframing').then(r => r.json()).then(setBoundaries);
    };
    init();
  }, [router, supabase]);

  const handleAdd = async (area: string) => {
    await fetch('/api/role-reframing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        responsibility_area: area, 
        my_responsibility: isMyResponsibility,
        notes 
      })
    });
    
    fetch('/api/role-reframing').then(r => r.json()).then(setBoundaries);
    setCustomArea('');
    setNotes('');
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/role-reframing?id=${id}`, { method: 'DELETE' });
    fetch('/api/role-reframing').then(r => r.json()).then(setBoundaries);
  };

  const myResponsibilities = boundaries.filter(b => b.my_responsibility);
  const notMyResponsibilities = boundaries.filter(b => !b.my_responsibility);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user || !profile) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Role Reframing</h1>
        <p className="text-gray-600 mb-8">You're not her spouse anymore. You're a project manager handling a difficult counterpart.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6 bg-green-50">
            <h2 className="text-xl font-bold mb-4 text-green-800">✓ My Responsibilities</h2>
            <ul className="space-y-2">
              {myResponsibilities.map(b => (
                <li key={b.id} className="flex items-start justify-between p-3 bg-white rounded">
                  <div>
                    <div className="font-medium">{b.responsibility_area}</div>
                    {b.notes && <div className="text-sm text-gray-600 mt-1">{b.notes}</div>}
                  </div>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800 ml-2">×</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-6 bg-red-50">
            <h2 className="text-xl font-bold mb-4 text-red-800">✗ NOT My Responsibilities</h2>
            <ul className="space-y-2">
              {notMyResponsibilities.map(b => (
                <li key={b.id} className="flex items-start justify-between p-3 bg-white rounded">
                  <div>
                    <div className="font-medium">{b.responsibility_area}</div>
                    {b.notes && <div className="text-sm text-gray-600 mt-1">{b.notes}</div>}
                  </div>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800 ml-2">×</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {aiAnalysis && (
          <div className="border rounded-lg p-6 bg-indigo-50 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              AI Boundary Advisor
            </h3>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                aiAnalysis.is_my_responsibility 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {aiAnalysis.is_my_responsibility ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h4 className="font-semibold">
                    {aiAnalysis.is_my_responsibility ? 'Your Responsibility' : 'NOT Your Responsibility'}
                  </h4>
                </div>
                <p className="text-sm">{aiAnalysis.reasoning}</p>
              </div>

              {!aiAnalysis.is_my_responsibility && aiAnalysis.boundary_statement && (
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-sm mb-2">Suggested Boundary Statement</h4>
                  <p className="text-sm text-gray-700 italic">"{aiAnalysis.boundary_statement}"</p>
                </div>
              )}

              {aiAnalysis.emotional_vs_logical && (
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-sm mb-3">Emotional vs Logical</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-red-600">Emotional: </span>
                      <span className="text-gray-700">{aiAnalysis.emotional_vs_logical.emotional_response}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">Logical: </span>
                      <span className="text-gray-700">{aiAnalysis.emotional_vs_logical.logical_response}</span>
                    </div>
                  </div>
                </div>
              )}

              {aiAnalysis.project_manager_approach && (
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-sm mb-2">Project Manager Approach</h4>
                  <p className="text-sm text-gray-700">{aiAnalysis.project_manager_approach}</p>
                </div>
              )}

              {aiAnalysis.red_flags && aiAnalysis.red_flags.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="font-semibold text-sm mb-2 text-red-900">Red Flags</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {aiAnalysis.red_flags.map((flag: string, idx: number) => (
                      <li key={idx}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysis.action_steps && (
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-sm mb-2">Action Steps</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {aiAnalysis.action_steps.map((step: string, idx: number) => (
                      <li key={idx}>• {step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysis.affirmation && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h4 className="font-semibold text-sm mb-2 text-green-900">Affirmation</h4>
                  <p className="text-sm text-green-800 italic">{aiAnalysis.affirmation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border rounded-lg p-6 bg-white mb-6">
          <h3 className="text-lg font-semibold mb-4">Need Help Deciding?</h3>
          <p className="text-sm text-gray-600 mb-3">Describe a situation and let AI help you determine if it's your responsibility.</p>
          <textarea
            className="w-full border rounded p-3 mb-3"
            rows={3}
            placeholder="e.g., She wants me to help her move to a new apartment..."
            value={analyzingSituation}
            onChange={(e) => setAnalyzingSituation(e.target.value)}
          />
          <button
            onClick={async () => {
              setLoadingAI(true);
              try {
                const res = await fetch('/api/role-reframing/analyze', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ situation: analyzingSituation })
                });
                const data = await res.json();
                setAiAnalysis(data.fallback || data);
              } catch (error) {
                console.error('AI analysis failed:', error);
              }
              setLoadingAI(false);
            }}
            disabled={!analyzingSituation || loadingAI}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {loadingAI ? 'Analyzing...' : 'Get AI Guidance'}
          </button>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Add Boundary</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quick Add:</label>
            <div className="flex flex-wrap gap-2">
              {commonAreas.map(area => (
                <button
                  key={area}
                  onClick={() => handleAdd(area)}
                  className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Custom responsibility area..."
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              className="w-full border rounded p-2"
            />
            
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isMyResponsibility}
                  onChange={() => setIsMyResponsibility(true)}
                  className="mr-2"
                />
                My Responsibility
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isMyResponsibility}
                  onChange={() => setIsMyResponsibility(false)}
                  className="mr-2"
                />
                NOT My Responsibility
              </label>
            </div>

            <textarea
              placeholder="Notes (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded p-2"
              rows={2}
            />

            <button
              onClick={() => customArea && handleAdd(customArea)}
              disabled={!customArea}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
            >
              Add Custom
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
