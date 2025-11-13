'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Sparkles, Copy, Check, Upload, Mic, Trash2, X } from 'lucide-react';

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
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [showConversationModal, setShowConversationModal] = useState(false);
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
        grey_rock_responses: ['Noted.', 'I will consider that.', 'Okay.'],
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

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const handleTranscribeAudio = async () => {
    if (!audioFile) return;
    
    setTranscribing(true);
    setSpeakers([]);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('language', selectedLanguage);
      
      // Start transcription
      const response = await fetch('/api/manipulation-decoder/transcribe', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success || !data.jobId) {
        alert('Failed to start transcription: ' + (data.error || 'Unknown error'));
        setTranscribing(false);
        return;
      }

      // Poll for results
      const jobId = data.jobId;
      let attempts = 0;
      const maxAttempts = 180; // 6 minutes for longer files

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        const pollResponse = await fetch('/api/manipulation-decoder/transcribe-poll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId })
        });

        const pollData = await pollResponse.json();

        if (pollData.status === 'done' && pollData.transcription) {
          setTranscriptionResult(pollData.transcription);
          setMessage(pollData.transcription);
          setSpeakers(pollData.speakers || []);
          break;
        }

        if (pollData.status === 'error') {
          alert('Transcription failed: ' + (pollData.error || 'Unknown error'));
          break;
        }

        attempts++;
      }

      if (attempts >= maxAttempts) {
        alert('Transcription timeout - please try a shorter file');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Transcription failed');
    }
    setTranscribing(false);
  };

  const handleDeleteHistoryItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to delete')
        return
      }

      const response = await fetch(`/api/manipulation-decoder/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (response.ok) {
        setHistory(history.filter(item => item.id !== itemId));
      } else {
        alert('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete analysis');
    }
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
        <p className="text-gray-600 mb-8">Paste a message or conversation. We will identify the manipulation tactics.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">Analyze Message</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Audio Upload</span>
                  </div>
                  {speakers.length > 0 && (
                    <button
                      onClick={() => setShowConversationModal(true)}
                      className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200"
                    >
                      View Conversation
                    </button>
                  )}
                </div>
                
                {/* Language Selector */}
                <div className="mb-3">
                  <label className="text-xs text-gray-600 block mb-1">Language (optional)</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="ar">Arabic</option>
                    <option value="hi">Hindi</option>
                    <option value="ur">Urdu</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {audioFile ? audioFile.name : 'Click to upload audio file'}
                    </p>
                  </label>
                  {audioFile && (
                    <button
                      onClick={handleTranscribeAudio}
                      disabled={transcribing}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
                    </button>
                  )}
                </div>
              </div>

              <textarea
                className="w-full border rounded p-3 mb-4"
                rows={8}
                placeholder="Paste the message, text, or email here... or upload audio above"
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
                <h3 className="text-lg font-semibold mb-4">Basic Pattern Match</h3>
                
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete analysis"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      {/* Conversation Modal */}
      {showConversationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Conversation Analysis</h3>
              <button
                onClick={() => setShowConversationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {speakers.length > 0 ? (
                <div className="space-y-4">
                  {speakers.map((speaker, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-indigo-600">
                          {speaker.speaker}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          speaker.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          speaker.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {speaker.sentiment}
                        </span>
                        <span className="text-xs text-gray-500">
                          {speaker.start?.toFixed(1)}s - {speaker.end?.toFixed(1)}s
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{speaker.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No speaker data available</p>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowConversationModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}