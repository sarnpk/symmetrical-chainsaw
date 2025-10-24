'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles, Copy, Check } from 'lucide-react';

export default function ManipulationDecoderPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [traits, setTraits] = useState<any[]>([]);
  const [emotionalImpact, setEmotionalImpact] = useState<string>('moderate');
  const [isMyFault, setIsMyFault] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<string | null>(null);
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
      
      fetch('/api/npd-traits').then(r => r.json()).then(data => setTraits(Array.isArray(data) ? data : [])).catch(() => setTraits([]));
      fetch('/api/manipulation-decoder').then(r => r.json()).then(data => setHistory(Array.isArray(data) ? data : []));
    };
    init();
  }, [router, supabase]);

  const handleAnalyze = async () => {
    const res = await fetch('/api/manipulation-decoder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message_text: message,
        emotional_impact: emotionalImpact,
        is_my_fault: isMyFault
      })
    });
    
    const data = await res.json();
    setAnalysis(data);
    fetch('/api/manipulation-decoder').then(r => r.json()).then(data => setHistory(Array.isArray(data) ? data : []));
  };

  const handleAIAnalyze = async () => {
    setAnalyzingAI(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/manipulation-decoder/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_text: message })
      });
      const data = await res.json();
      if (data.fallback) {
        setAiAnalysis(data.fallback);
      } else {
        setAiAnalysis(data);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiAnalysis({
        tactics: ['Analysis unavailable'],
        emotional_hooks: ['Service temporarily unavailable'],
        hidden_agenda: 'Unable to analyze at this time',
        grey_rock_responses: ['Noted.', 'I\'ll consider that.', 'Okay.'],
        explanation: 'AI service is currently unavailable. Please try again later.'
      });
    }
    setAnalyzingAI(false);
  };

  const copyResponse = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedResponse(text);
    setTimeout(() => setCopiedResponse(null), 2000);
  };

  const getIdentifiedTraits = (tacticIds: string[]) => {
    return (Array.isArray(traits) ? traits : []).filter(t => tacticIds?.includes(t.id));
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user || !profile) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Manipulation Decoder</h1>
        <p className="text-gray-600 mb-8">Paste a message or conversation. We'll identify the manipulation tactics.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">Analyze Message</h2>
              
              <textarea
                className="w-full border rounded p-3 mb-4"
                rows={8}
                placeholder="Paste the message, text, or email here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Emotional Impact</label>
                <select
                  value={emotionalImpact}
                  onChange={(e) => setEmotionalImpact(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isMyFault}
                    onChange={(e) => setIsMyFault(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">I feel like this is my fault</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={!message}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
                >
                  Basic Analysis
                </button>
                <button
                  onClick={handleAIAnalyze}
                  disabled={!message || analyzingAI}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {analyzingAI ? 'Analyzing...' : 'AI Analysis'}
                </button>
              </div>
            </div>

            {aiAnalysis && (
              <div className="border rounded-lg p-6 bg-indigo-50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  AI Analysis
                </h3>
                
                {/* Therapy Referral for Severe Manipulation */}
                {aiAnalysis.tactics && aiAnalysis.tactics.length > 2 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">
                      ⚠️ Severe Manipulation Detected
                    </h4>
                    <p className="text-red-700 text-sm mb-3">
                      This analysis indicates serious psychological manipulation. 
                      Professional support is strongly recommended for your safety and recovery.
                    </p>
                    <button
                      onClick={() => {
                        const referralUrl = 'https://www.talkspace.com/online-therapy/referral/?ref=reclaim_manipulation_detected&source=reclaim_app&specialty=trauma&utm_source=reclaim&utm_medium=referral&utm_campaign=manipulation_detected';
                        window.open(referralUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 shadow-lg hover:shadow-xl hover:scale-105 w-full"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Connect with Specialist Now
                    </button>
                    <div className="mt-2 text-xs text-red-600 text-center">
                      Crisis support • Trauma specialists • Immediate help available
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Manipulation Tactics</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.tactics?.map((tactic: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {tactic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Emotional Hooks</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {aiAnalysis.emotional_hooks?.map((hook: string, idx: number) => (
                        <li key={idx}>• {hook}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Hidden Agenda</h4>
                    <p className="text-sm text-gray-700">{aiAnalysis.hidden_agenda}</p>
                  </div>

                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-sm mb-2">Explanation</h4>
                    <p className="text-sm text-gray-700">{aiAnalysis.explanation}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <h4 className="font-semibold text-sm mb-3 text-green-900">Grey Rock Responses (Click to Copy)</h4>
                    <div className="space-y-2">
                      {aiAnalysis.grey_rock_responses?.map((response: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => copyResponse(response)}
                          className="w-full text-left p-3 bg-white border border-green-300 rounded hover:bg-green-50 flex items-center justify-between group"
                        >
                          <span className="text-sm text-gray-900">{response}</span>
                          {copiedResponse === response ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {analysis && (
              <div className="border rounded-lg p-6 bg-red-50">
                <h3 className="text-lg font-semibold mb-4">🚨 Basic Pattern Match</h3>
                
                {getIdentifiedTraits(analysis.identified_tactics).length > 0 ? (
                  <div className="space-y-3">
                    {getIdentifiedTraits(analysis.identified_tactics).map((trait: any) => (
                      <div key={trait.id} className="p-4 bg-white rounded">
                        <Link href={`/npd-traits/${trait.id}`} className="font-semibold text-amber-600 hover:underline">
                          {trait.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{trait.description}</p>
                        
                        {trait.response_strategies && (
                          <div className="mt-3">
                            <div className="text-sm font-medium mb-1">Response Strategy:</div>
                            <div className="text-sm text-gray-700">{trait.response_strategies[0]}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No obvious manipulation tactics detected. Trust your gut if something feels off.</p>
                )}

                {analysis.is_my_fault && (
                  <div className="mt-4 p-4 bg-amber-100 rounded">
                    <div className="font-semibold mb-2">⚠️ Reality Check</div>
                    <p className="text-sm">You indicated this feels like your fault. Remember: Manipulation is designed to make you feel responsible for their behavior. You are not responsible for their actions, reactions, or emotions.</p>
                  </div>
                )}
                
                {/* Professional Support for Self-Blame */}
                {analysis.is_my_fault && (
                  <div className="mt-4 space-y-3">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        🧠 Mental Health Support
                      </h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Self-blame is a common response to manipulation. A trauma-informed therapist 
                        can help you rebuild confidence and recognize your true worth.
                      </p>
                      <button
                        onClick={() => {
                          const referralUrl = 'https://www.betterhelp.com/rpc/track/referral/?ref=reclaim_self_blame&source=reclaim_app&specialty=trauma&utm_source=reclaim&utm_medium=referral&utm_campaign=manipulation_detected';
                          window.open(referralUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 shadow-md hover:shadow-lg hover:scale-105 w-full text-sm"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Find Therapist
                      </button>
                    </div>
                    
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">
                        ⚖️ Legal Documentation
                      </h4>
                      <p className="text-amber-700 text-sm mb-3">
                        This manipulation analysis can serve as evidence. Consider consulting with 
                        a family law attorney about your legal options.
                      </p>
                      <button
                        onClick={() => {
                          const referralUrl = 'https://www.findlaw.com/find-a-lawyer/referral/?ref=reclaim_manipulation_evidence&source=reclaim_app&specialty=family_law&practice_area=divorce&utm_source=reclaim&utm_medium=legal_referral&utm_campaign=manipulation_detected&evidence_available=true';
                          window.open(referralUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-600 shadow-md hover:shadow-lg hover:scale-105 w-full text-sm"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Legal Consultation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Analysis History</h2>
            
            {history.length === 0 ? (
              <p className="text-gray-500">No analyses yet. Start by decoding a message.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {history.map((item: any) => (
                  <div key={item.id} className="p-4 border rounded hover:bg-gray-50">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm mb-2 line-clamp-2">{item.message_text}</div>
                    <div className="flex gap-2 flex-wrap">
                      {getIdentifiedTraits(item.identified_tactics).map((trait: any) => (
                        <span key={trait.id} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {trait.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
