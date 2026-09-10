'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles, AlertCircle, HelpCircle, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import VoiceTextInput from '@/components/VoiceTextInput';

export default function EmpathyAuditPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [showReflectionVoice, setShowReflectionVoice] = useState(false);
  const [showGuiltVoice, setShowGuiltVoice] = useState(false);
  const [activeTab, setActiveTab] = useState<'situations' | 'distribution' | 'guilt'>('situations');
  const [situations, setSituations] = useState<any[]>([]);
  const [newSituation, setNewSituation] = useState({
    type: 'sick',
    description: '',
    asked_how_feeling: false,
    listened_without_interrupting: false,
    validated_emotions: false,
    offered_comfort: false,
    made_it_about_themselves: false,
    minimized_experience: false,
    blamed_for_feelings: false,
    got_angry: false
  });
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
      
      fetch('/api/empathy-audit/situations').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setSituations(data);
      });
    };
    init();
  }, [router, supabase]);

  const saveSituation = async () => {
    const score = [
      newSituation.asked_how_feeling,
      newSituation.listened_without_interrupting,
      newSituation.validated_emotions,
      newSituation.offered_comfort
    ].filter(Boolean).length - [
      newSituation.made_it_about_themselves,
      newSituation.minimized_experience,
      newSituation.blamed_for_feelings,
      newSituation.got_angry
    ].filter(Boolean).length;

    await fetch('/api/empathy-audit/situations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        situation_type: newSituation.type,
        situation_description: newSituation.description,
        asked_how_feeling: newSituation.asked_how_feeling,
        listened_without_interrupting: newSituation.listened_without_interrupting,
        validated_emotions: newSituation.validated_emotions,
        offered_comfort: newSituation.offered_comfort,
        made_it_about_themselves: newSituation.made_it_about_themselves,
        minimized_experience: newSituation.minimized_experience,
        blamed_for_feelings: newSituation.blamed_for_feelings,
        got_angry: newSituation.got_angry,
        empathy_score: score
      })
    });

    fetch('/api/empathy-audit/situations').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSituations(data);
    });
    
    setNewSituation({
      type: 'sick',
      description: '',
      asked_how_feeling: false,
      listened_without_interrupting: false,
      validated_emotions: false,
      offered_comfort: false,
      made_it_about_themselves: false,
      minimized_experience: false,
      blamed_for_feelings: false,
      got_angry: false
    });
  };

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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Empathy Audit</h1>
          <Link href="/docs/EMPATHY_AUDIT_USER_GUIDE.html" target="_blank">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="h-5 w-5" />
              <span className="font-medium">Guide</span>
            </button>
          </Link>
        </div>
        <p className="text-gray-600 mb-6">Where is your empathy going? Redirect it toward your children and yourself.</p>

        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('situations')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'situations'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Situation Audits
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'distribution'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Distribution Analysis
          </button>
          <button
            onClick={() => setActiveTab('guilt')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'guilt'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Guilt Support
          </button>
        </div>

        {activeTab === 'situations' && (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">New Situation Audit</h2>
              <p className="text-sm text-gray-600 mb-4">Pick a recent moment when you needed support and evaluate their response.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Situation Type</label>
                  <select
                    value={newSituation.type}
                    onChange={(e) => setNewSituation({...newSituation, type: e.target.value})}
                    className="w-full border rounded p-2"
                  >
                    <option value="sick">I was sick or injured</option>
                    <option value="bad_day">I had a bad day at work</option>
                    <option value="loss">I experienced a loss</option>
                    <option value="stressed">I was stressed or overwhelmed</option>
                    <option value="good_news">I shared good news</option>
                    <option value="custom">Other situation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Describe the Situation</label>
                  <textarea
                    value={newSituation.description}
                    onChange={(e) => setNewSituation({...newSituation, description: e.target.value})}
                    className="w-full border rounded p-3"
                    rows={2}
                    placeholder="What happened? What did you need?"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Their Response (check all that apply):</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-green-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.asked_how_feeling}
                        onChange={(e) => setNewSituation({...newSituation, asked_how_feeling: e.target.checked})}
                      />
                      <span className="text-sm">âœ… Asked how I was feeling</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-green-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.listened_without_interrupting}
                        onChange={(e) => setNewSituation({...newSituation, listened_without_interrupting: e.target.checked})}
                      />
                      <span className="text-sm">âœ… Listened without interrupting</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-green-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.validated_emotions}
                        onChange={(e) => setNewSituation({...newSituation, validated_emotions: e.target.checked})}
                      />
                      <span className="text-sm">âœ… Validated my emotions</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-green-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.offered_comfort}
                        onChange={(e) => setNewSituation({...newSituation, offered_comfort: e.target.checked})}
                      />
                      <span className="text-sm">âœ… Offered comfort or support</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-red-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.made_it_about_themselves}
                        onChange={(e) => setNewSituation({...newSituation, made_it_about_themselves: e.target.checked})}
                      />
                      <span className="text-sm">âŒ Made it about themselves</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-red-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.minimized_experience}
                        onChange={(e) => setNewSituation({...newSituation, minimized_experience: e.target.checked})}
                      />
                      <span className="text-sm">âŒ Minimized my experience</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-red-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.blamed_for_feelings}
                        onChange={(e) => setNewSituation({...newSituation, blamed_for_feelings: e.target.checked})}
                      />
                      <span className="text-sm">âŒ Blamed me for my feelings</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded hover:bg-red-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSituation.got_angry}
                        onChange={(e) => setNewSituation({...newSituation, got_angry: e.target.checked})}
                      />
                      <span className="text-sm">âŒ Got angry at me for needing support</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={saveSituation}
                  disabled={!newSituation.description}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  Save Situation Audit
                </button>
              </div>
            </div>

            {situations.length > 0 && (
              <div className="border rounded-lg p-6 bg-white">
                <h2 className="text-xl font-semibold mb-4">Past Situation Audits</h2>
                <div className="space-y-3">
                  {situations.map(s => (
                    <div key={s.id} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{s.situation_type.replace('_', ' ')}</span>
                        <span className={`px-3 py-1 rounded text-sm font-bold ${
                          s.empathy_score >= 2 ? 'bg-green-100 text-green-800' :
                          s.empathy_score >= 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Score: {s.empathy_score}/4
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{s.situation_description}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="border rounded-lg p-6 bg-white">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block font-medium">Reflection</label>
                <button
                  onClick={() => setShowReflectionVoice(true)}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                >
                  <Maximize2 className="h-4 w-4" />
                  Fullscreen + Voice
                </button>
              </div>
              <textarea
                className="w-full border rounded p-3"
                rows={4}
                placeholder="What surprised you? What do you want to change?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
            </div>

            <VoiceTextInput
              isOpen={showReflectionVoice}
              onClose={() => setShowReflectionVoice(false)}
              onSave={(text) => {
                setReflection(text);
                setShowReflectionVoice(false);
              }}
              placeholder="What surprised you? What do you want to change?"
              title="Reflection"
              initialValue={reflection}
              submitLabel="Save Reflection"
            />

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
        )}

        {activeTab === 'guilt' && (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="font-semibold mb-3">Feeling Guilty?</h3>
              <p className="text-sm text-gray-600 mb-3">Tell the AI what you feel guilty about, and get personalized support.</p>
              <div className="flex items-start gap-2">
                <textarea
                  className="flex-1 border rounded p-3 text-sm"
                  rows={2}
                  placeholder="e.g., I feel guilty about not caring about her problems anymore..."
                  value={guiltFeeling}
                  onChange={(e) => setGuiltFeeling(e.target.value)}
                />
                <button
                  onClick={() => setShowGuiltVoice(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded border"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <VoiceTextInput
                isOpen={showGuiltVoice}
                onClose={() => setShowGuiltVoice(false)}
                onSave={(text) => {
                  setGuiltFeeling(text);
                  setShowGuiltVoice(false);
                }}
                placeholder="Tell me what you feel guilty about..."
                title="Feeling Guilty?"
                initialValue={guiltFeeling}
                submitLabel="Save"
              />
            </div>

            <div className="border rounded-lg p-6 bg-amber-50">
              <h3 className="font-semibold mb-3">ðŸ’¡ Guilt-Busting Affirmations</h3>
              <ul className="space-y-2 text-sm">
                <li>â€¢ Detaching from her is not cruelâ€”it's survival</li>
                <li>â€¢ My children need a stable parent, not one drained by her chaos</li>
                <li>â€¢ I'm not abandoning herâ€”she's an adult responsible for herself</li>
                <li>â€¢ Protecting my peace is protecting my children</li>
                <li>â€¢ I deserve to redirect my empathy to those who reciprocate</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
