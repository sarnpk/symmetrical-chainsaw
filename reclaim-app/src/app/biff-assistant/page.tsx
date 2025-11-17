'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { HelpCircle, Sparkles, AlertTriangle, Trash2, Maximize2, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VoiceTextInput from '@/components/VoiceTextInput';

export default function BIFFAssistant() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);
  const [incomingMessage, setIncomingMessage] = useState('');
  const [draftResponse, setDraftResponse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [biffScore, setBiffScore] = useState(0);
  const [jadeWarning, setJadeWarning] = useState(false);
  const [showCoolingOff, setShowCoolingOff] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const [coparentName, setCoparentName] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [userTier, setUserTier] = useState<string>('foundation');
  const [showInfo, setShowInfo] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [messageTimestamp, setMessageTimestamp] = useState<Date | null>(null);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    checkAccess();
    loadTemplates();
    loadCommunications();
    loadMetrics();
    const savedName = localStorage.getItem('biff_coparent_name');
    if (savedName) setCoparentName(savedName);
  }, [filterCategory, filterScore]);

  const loadMetrics = async () => {
    const res = await fetch('/api/biff-assistant/metrics');
    const data = await res.json();
    setMetrics(data);
  };

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();
    
    const tier = profile?.subscription_tier || 'foundation';
    setUserTier(tier);
    
    if (tier === 'foundation') {
      router.push('/subscription?feature=biff-assistant');
    }
  };

  useEffect(() => {
    analyzeDraft();
  }, [draftResponse]);

  const loadTemplates = async () => {
    const { data } = await supabase
      .from('biff_templates')
      .select('*')
      .order('category');
    if (data) setTemplates(data);
  };

  const loadCommunications = async () => {
    let query = supabase
      .from('coparent_communications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (filterCategory !== 'all') {
      query = query.eq('category', filterCategory);
    }
    if (filterScore === 'high') {
      query = query.gte('biff_score', 7);
    } else if (filterScore === 'low') {
      query = query.lt('biff_score', 7);
    }
    
    const { data } = await query;
    if (data) setCommunications(data);
  };

  const analyzeDraft = () => {
    if (!draftResponse) {
      setBiffScore(0);
      setJadeWarning(false);
      return;
    }

    const wordCount = draftResponse.split(/\s+/).length;
    const sentences = draftResponse.split(/[.!?]+/).filter(s => s.trim());
    
    let score = 10;
    if (wordCount > 50) score -= 3;
    if (sentences.length > 5) score -= 2;
    if (/\b(feel|felt|think|believe|sorry|upset)\b/i.test(draftResponse)) score -= 2;
    if (/\?{2,}|!{2,}/g.test(draftResponse)) score -= 2;
    
    const jadePatterns = /\b(because|reason|justify|explain|defend|but|however|actually)\b/gi;
    const jadeMatches = draftResponse.match(jadePatterns);
    setJadeWarning((jadeMatches?.length || 0) > 2);
    
    setBiffScore(Math.max(1, score));
  };

  const applyTemplate = (template: any) => {
    let text = template.template_text;
    if (coparentName) {
      text = text.replace(/\[Name\]/g, coparentName);
    }
    setDraftResponse(text);
    setSelectedCategory(template.category);
  };

  const saveCoparentName = (name: string) => {
    setCoparentName(name);
    localStorage.setItem('biff_coparent_name', name);
  };

  const getAiAnalysis = async () => {
    if (!incomingMessage && !draftResponse) return;
    
    setAnalyzing(true);
    try {
      const res = await fetch('/api/biff-assistant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomingMessage, draftResponse })
      });
      const data = await res.json();
      setAiAnalysis(data);
      if (data.suggestedResponse && !draftResponse) {
        setDraftResponse(data.suggestedResponse);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
    setAnalyzing(false);
  };

  const deleteCommunication = async (id: string) => {
    if (!confirm('Delete this communication?')) return;
    
    await supabase
      .from('coparent_communications')
      .delete()
      .eq('id', id);
    
    loadCommunications();
  };

  const saveCommunication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const responseTime = messageTimestamp ? Math.round((new Date().getTime() - messageTimestamp.getTime()) / (1000 * 60 * 60)) : null;

    await supabase.from('coparent_communications').insert({
      user_id: user.id,
      direction: 'outgoing',
      message_text: incomingMessage,
      response_text: draftResponse,
      category: selectedCategory,
      biff_score: biffScore,
      jade_detected: jadeWarning,
      cooling_off_used: showCoolingOff,
      response_time_hours: responseTime,
      avoided_engagement: !jadeWarning && biffScore >= 7,
      sent_at: new Date().toISOString()
    });

    setIncomingMessage('');
    setDraftResponse('');
    setShowCoolingOff(false);
    setMessageTimestamp(null);
    loadCommunications();
    loadMetrics();
  };

  if (userTier === 'foundation') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-8 text-center">
            <Crown className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Recovery Tier Feature</h2>
            <p className="text-amber-800 mb-6">BIFF Assistant is available for Recovery and Empowerment tier members.</p>
            <Link href="/subscription">
              <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700">
                Upgrade to Empowerment
              </button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">BIFF Communication Assistant</h1>
              <p className="text-gray-600 text-sm">Brief • Informative • Friendly • Firm</p>
              <p className="text-indigo-600 text-xs font-medium mt-1">Radical Non-Engagement Tool</p>
            </div>
            <Link href="/docs/BIFF_ASSISTANT_USER_GUIDE.html" target="_blank">
              <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Guide</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 rounded-lg shadow p-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
            <h2 className="font-semibold text-indigo-800">💡 What is BIFF & Radical Non-Engagement?</h2>
            {showInfo ? <ChevronUp className="h-5 w-5 text-indigo-600" /> : <ChevronDown className="h-5 w-5 text-indigo-600" />}
          </div>
          {showInfo && (
            <div className="mt-3 space-y-2 text-sm text-indigo-900">
              <p className="font-semibold">BIFF Method:</p>
              <p><strong>Brief:</strong> Keep it short - 2-5 sentences max</p>
              <p><strong>Informative:</strong> Stick to facts, no emotions</p>
              <p><strong>Friendly:</strong> Neutral tone, not hostile</p>
              <p><strong>Firm:</strong> Clear boundaries, no JADE (Justify, Argue, Defend, Explain)</p>
              <p className="font-semibold mt-3">Radical Non-Engagement:</p>
              <p>Accept they won't change, refuse to engage emotionally. BIFF = Radical Non-Engagement in practice.</p>
              <p className="text-xs italic mt-2">Tip: Wait 24+ hours before sending to avoid emotional responses</p>
            </div>
          )}
        </div>

        {metrics && metrics.total_communications > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-lg shadow p-6">
            <h2 className="font-semibold text-green-800 mb-4">📊 This Month's Success Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.success_rate}%</div>
                <div className="text-xs text-green-700">Disengagement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.jade_avoided}/{metrics.total_communications}</div>
                <div className="text-xs text-green-700">JADE Avoided</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.avg_response_time_hours}h</div>
                <div className="text-xs text-green-700">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.high_biff_scores}/{metrics.total_communications}</div>
                <div className="text-xs text-green-700">High BIFF Scores</div>
              </div>
            </div>
            <p className="text-xs text-green-600 text-center mt-3">🎉 Every successful disengagement is a victory!</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Quick Templates</h2>
          <div className="grid grid-cols-2 gap-2">
            {templates.filter(t => !t.is_custom).map(t => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t)}
                className="p-3 text-left border rounded hover:bg-gray-50 text-sm"
              >
                <div className="font-medium capitalize">{t.category.replace('_', ' ')}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Co-Parent Name (for templates)</label>
            <input
              type="text"
              value={coparentName}
              onChange={(e) => saveCoparentName(e.target.value)}
              className="w-full p-3 border rounded"
              placeholder="e.g., John, Sarah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Their Message (optional)</label>
            <textarea
              value={incomingMessage}
              onChange={(e) => {
                setIncomingMessage(e.target.value);
                if (e.target.value && !messageTimestamp) setMessageTimestamp(new Date());
              }}
              className="w-full p-3 border rounded"
              rows={3}
              placeholder='Example: "You never let me see the kids! This is YOUR fault. I deserve more time and you know it. Stop being so controlling and difficult. The kids are suffering because of YOU."'
            />
            {messageTimestamp && (
              <p className="text-xs text-gray-500 mt-1">Message received: {messageTimestamp.toLocaleString()}</p>
            )}
          </div>

          {incomingMessage && (
            <button
              onClick={getAiAnalysis}
              disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300"
            >
              <Sparkles className="h-4 w-4" />
              {analyzing ? 'Analyzing...' : 'AI Analysis'}
            </button>
          )}

          {aiAnalysis && (
            <div className="space-y-3">
              {aiAnalysis.manipulationTactics?.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-900">Manipulation Detected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.manipulationTactics.map((tactic: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {aiAnalysis.suggestedResponse && (
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-900 mb-2">AI Suggested Response:</div>
                  <p className="text-green-800 text-sm">{aiAnalysis.suggestedResponse}</p>
                  <button
                    onClick={() => setDraftResponse(aiAnalysis.suggestedResponse)}
                    className="mt-2 text-xs text-green-700 hover:underline"
                  >
                    Use this response
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Your BIFF Response</label>
              <button
                onClick={() => setShowVoiceInput(true)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                <Maximize2 className="h-4 w-4" />
                Fullscreen + Voice
              </button>
            </div>
            <textarea
              value={draftResponse}
              onChange={(e) => setDraftResponse(e.target.value)}
              className="w-full p-3 border rounded"
              rows={4}
              placeholder="Type or select a template..."
            />
          </div>

          <VoiceTextInput
            isOpen={showVoiceInput}
            onClose={() => setShowVoiceInput(false)}
            onSave={(text) => {
              setDraftResponse(text);
              setShowVoiceInput(false);
            }}
            placeholder="Type or speak your BIFF response..."
            title="BIFF Response"
            initialValue={draftResponse}
            submitLabel="Save Response"
          />

          {draftResponse && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <div className="text-sm font-medium">BIFF Score</div>
                <div className={`text-2xl font-bold ${biffScore >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                  {biffScore}/10
                </div>
              </div>
              {jadeWarning && (
                <div className="text-sm text-orange-600 font-medium">
                  ⚠️ JADE detected - remove justifications
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showCoolingOff}
              onChange={(e) => setShowCoolingOff(e.target.checked)}
            />
            Wait 24hrs before sending (recommended for non-engagement)
          </label>
          {messageTimestamp && (
            <p className="text-xs text-gray-600">
              Time elapsed: {Math.round((new Date().getTime() - messageTimestamp.getTime()) / (1000 * 60 * 60))} hours
              {Math.round((new Date().getTime() - messageTimestamp.getTime()) / (1000 * 60 * 60)) >= 24 && ' ✅'}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={getAiAnalysis}
              disabled={analyzing || (!incomingMessage && !draftResponse)}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded font-medium disabled:bg-gray-300"
            >
              <Sparkles className="h-4 w-4" />
              {analyzing ? 'Analyzing...' : 'Get AI Help'}
            </button>
            <button
              onClick={saveCommunication}
              disabled={!draftResponse || biffScore < 5}
              className="flex-1 bg-blue-600 text-white py-3 rounded font-medium disabled:bg-gray-300"
            >
              Save Response
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Communications</h2>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Categories</option>
                <option value="pickup">Pickup</option>
                <option value="schedule_change">Schedule Change</option>
                <option value="accusation">Accusation</option>
                <option value="late_pickup">Late Pickup</option>
                <option value="holiday">Holiday</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Scores</option>
                <option value="high">High (7-10)</option>
                <option value="low">Low (1-6)</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {communications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No communications found. Try adjusting filters.
              </div>
            ) : (
              communications.map(c => (
                <div key={c.id} className="p-3 border rounded text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium capitalize">{c.category || 'General'}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={() => deleteCommunication(c.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700">{c.response_text?.substring(0, 100)}...</div>
                  <div className="mt-2 text-xs text-gray-500">
                    BIFF Score: {c.biff_score}/10
                    {c.jade_detected && ' • JADE detected'}
                    {c.cooling_off_used && ' • Cooling-off used'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
