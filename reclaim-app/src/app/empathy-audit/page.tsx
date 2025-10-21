'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function EmpathyAuditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState<any>(null);
  const [percentages, setPercentages] = useState({
    ex_partner: 25,
    children: 25,
    self: 25,
    others: 25
  });
  const [reflection, setReflection] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [guiltFeeling, setGuiltFeeling] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
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
      
      fetch('/api/empathy-audit').then(r => r.json()).then(data => {
        if (data) {
          setAudit(data);
        }
      });
    };
    init();
  }, [router, supabase]);

  const handleSave = async () => {
    const entries = Object.entries(percentages).map(([target, percentage]) => ({
      empathy_target: target,
      percentage,
      reflection
    }));

    for (const entry of entries) {
      await fetch('/api/empathy-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    }

    fetch('/api/empathy-audit').then(r => r.json()).then(setAudit);
  };

  const handleSliderChange = (target: string, value: number) => {
    setPercentages(prev => ({ ...prev, [target]: value }));
  };

  const total = Object.values(percentages).reduce((a, b) => a + b, 0);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user || !profile) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Empathy Audit</h1>
        <p className="text-gray-600 mb-8">Where is your empathy going? Redirect it toward your children and yourself.</p>

        <div className="border rounded-lg p-6 bg-white mb-6">
          <h2 className="text-xl font-semibold mb-6">Current Empathy Distribution</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-red-600">Ex-Partner</label>
                <span className="text-2xl font-bold">{percentages.ex_partner}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={percentages.ex_partner}
                onChange={(e) => handleSliderChange('ex_partner', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">Goal: Minimize this. They don't deserve your empathy.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-blue-600">Children</label>
                <span className="text-2xl font-bold">{percentages.children}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={percentages.children}
                onChange={(e) => handleSliderChange('children', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">Goal: Maximize this. They need your emotional energy.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-green-600">Self</label>
                <span className="text-2xl font-bold">{percentages.self}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={percentages.self}
                onChange={(e) => handleSliderChange('self', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">Goal: Increase this. You deserve compassion too.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium text-purple-600">Others</label>
                <span className="text-2xl font-bold">{percentages.others}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={percentages.others}
                onChange={(e) => handleSliderChange('others', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">Friends, family, community</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Total: <span className={total === 100 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{total}%</span></div>
            {total !== 100 && <p className="text-sm text-red-600 mt-1">Adjust sliders to total 100%</p>}
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Reflection</label>
            <textarea
              className="w-full border rounded p-3"
              rows={4}
              placeholder="What surprised you? What do you want to change?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={total !== 100}
              className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
            >
              Save Audit
            </button>
            <button
              onClick={async () => {
                setAnalyzingAI(true);
                setShowAIPanel(true);
                try {
                  const res = await fetch('/api/empathy-audit/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ percentages, reflection, guilt_feeling: guiltFeeling })
                  });
                  const data = await res.json();
                  setAiAnalysis(data.fallback || data);
                } catch (error) {
                  console.error('AI analysis failed:', error);
                }
                setAnalyzingAI(false);
              }}
              disabled={total !== 100 || analyzingAI}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {analyzingAI ? 'Analyzing...' : 'Get AI Guidance'}
            </button>
          </div>
        </div>

        {showAIPanel && aiAnalysis && (
          <div className="border rounded-lg p-6 bg-indigo-50 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              AI Empathy Advisor
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded p-4">
                <h4 className="font-semibold text-sm mb-2">Assessment</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.assessment}</p>
              </div>

              {aiAnalysis.red_flags && aiAnalysis.red_flags.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-red-900">
                    <AlertCircle className="h-4 w-4" />
                    Red Flags
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {aiAnalysis.red_flags.map((flag: string, idx: number) => (
                      <li key={idx}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white rounded p-4">
                <h4 className="font-semibold text-sm mb-3">Rebalancing Strategies</h4>
                <div className="space-y-3">
                  {aiAnalysis.rebalancing_strategies?.map((strategy: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-indigo-400 pl-3">
                      <div className="font-medium text-sm text-indigo-900">{strategy.target.replace('_', '-')}: {strategy.action}</div>
                      <div className="text-xs text-gray-600 mt-1">{strategy.why}</div>
                    </div>
                  ))}
                </div>
              </div>

              {aiAnalysis.guilt_buster && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h4 className="font-semibold text-sm mb-2 text-green-900">Guilt-Buster</h4>
                  <p className="text-sm text-green-800">{aiAnalysis.guilt_buster}</p>
                </div>
              )}

              <div className="bg-white rounded p-4">
                <h4 className="font-semibold text-sm mb-2">Affirmations</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {aiAnalysis.affirmations?.map((aff: string, idx: number) => (
                    <li key={idx}>• {aff}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded p-4">
                <h4 className="font-semibold text-sm mb-2">Next Steps</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {aiAnalysis.next_steps?.map((step: string, idx: number) => (
                    <li key={idx}>• {step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="border rounded-lg p-6 bg-white mb-6">
          <h3 className="font-semibold mb-3">Feeling Guilty?</h3>
          <p className="text-sm text-gray-600 mb-3">Tell the AI what you feel guilty about, and get personalized support.</p>
          <textarea
            className="w-full border rounded p-3 text-sm"
            rows={2}
            placeholder="e.g., I feel guilty about not caring about her problems anymore..."
            value={guiltFeeling}
            onChange={(e) => setGuiltFeeling(e.target.value)}
          />
        </div>

        <div className="border rounded-lg p-6 bg-amber-50">
          <h3 className="font-semibold mb-3">💡 Guilt-Busting Affirmations</h3>
          <ul className="space-y-2 text-sm">
            <li>• Detaching from her is not cruel—it's survival</li>
            <li>• My children need a stable parent, not one drained by her chaos</li>
            <li>• I'm not abandoning her—she's an adult responsible for herself</li>
            <li>• Protecting my peace is protecting my children</li>
            <li>• I deserve to redirect my empathy to those who reciprocate</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
