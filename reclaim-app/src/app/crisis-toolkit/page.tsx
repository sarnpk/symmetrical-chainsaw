'use client';

import { useState, useEffect } from 'react';
import { CRISIS_INTERVENTIONS, ConditionType } from '@/lib/crisis-toolkit-data';
import { createClient } from '@/lib/supabase';

export default function CrisisToolkitPage() {
  const [selectedCondition, setSelectedCondition] = useState<ConditionType | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'ruleout' | 'skills' | 'affirmation' | 'complete'>('select');
  const [usedSkills, setUsedSkills] = useState<string[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [personalizedAffirmation, setPersonalizedAffirmation] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [showAiSkills, setShowAiSkills] = useState(false);
  const [userTier, setUserTier] = useState<string>('');
  const [usage, setUsage] = useState<any>(null);
  const [intrusiveThought, setIntrusiveThought] = useState<string>('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchUserTier();
    
    // Load voices for better TTS quality
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth?redirect=/crisis-toolkit';
    }
  };

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => setTimer(t => t! - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const fetchStats = async () => {
    const res = await fetch('/api/crisis-toolkit/stats');
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
    
    const logRes = await fetch('/api/crisis-toolkit/log');
    if (logRes.ok) {
      const logData = await logRes.json();
      setUsage(logData.usage);
    }
  };

  const fetchUserTier = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();
      setUserTier(data?.subscription_tier || '');
    }
  };

  const fetchAiRecommendations = async () => {
    if (!selectedCondition) return;
    
    const res = await fetch('/api/crisis-toolkit/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        condition_type: selectedCondition,
        current_intensity: 7,
        time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
        context: 'Crisis toolkit session'
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      setAiRecommendations(data.recommendations || []);
      setShowAiSkills(true);
    }
  };

  const handleConditionSelect = async (condition: ConditionType) => {
    setSelectedCondition(condition);
    setCurrentStep('ruleout');
    
    // Fetch personalized affirmation
    const intervention = CRISIS_INTERVENTIONS[condition];
    const res = await fetch('/api/crisis-toolkit/personalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        condition_type: condition,
        affirmation: intervention.affirmation
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      setPersonalizedAffirmation(data.personalizedAffirmation);
    }
  };

  const startSkill = (skillId: string, duration?: number) => {
    setActiveSkill(skillId);
    if (duration) {
      setTimer(duration);
    }
    if (!usedSkills.includes(skillId)) {
      setUsedSkills([...usedSkills, skillId]);
    }
  };

  const completeSession = async (rating: number) => {
    if (!selectedCondition) return;

    await fetch('/api/crisis-toolkit/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        condition_type: selectedCondition,
        skills_used: usedSkills,
        helpful_rating: rating,
        notes: intrusiveThought ? `Intrusive thought: ${intrusiveThought}` : undefined
      })
    });

    setCurrentStep('complete');
    fetchStats();
  };

  const playVoiceAffirmation = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Get available voices and select a natural-sounding one
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Natural') || 
         voice.name.includes('Premium') ||
         voice.name.includes('Enhanced') ||
         voice.name.includes('Samantha') || // macOS
         voice.name.includes('Google') || // Android
         voice.name.includes('Microsoft Zira') || // Windows
         voice.localService)
      );
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use best available voice
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }
      
      // Natural, calming settings
      utterance.rate = 0.8;    // Slower for calmness
      utterance.pitch = 1.1;   // Slightly higher for warmth
      utterance.volume = 0.9;  // Slightly softer
      
      utterance.onstart = () => setIsPlayingVoice(true);
      utterance.onend = () => setIsPlayingVoice(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const reset = () => {
    setSelectedCondition(null);
    setCurrentStep('select');
    setUsedSkills([]);
    setTimer(null);
    setActiveSkill(null);
    setPersonalizedAffirmation('');
  };

  if (!selectedCondition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Crisis Toolkit</h1>
            <p className="text-gray-600">Quick support when you need it most</p>
            <a href="/crisis-toolkit/help" className="text-sm text-blue-600 hover:underline">ðŸ“– How to use this toolkit</a>
            {usage && (
              <div className="mt-2 text-sm">
                <span className={usage.remaining < 3 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                  {usage.remaining} of {usage.limit} uses remaining this month
                </span>
                {usage.tier !== 'recovery' && usage.remaining < 3 && (
                  <a href="/pricing" className="ml-2 text-purple-600 hover:underline">Upgrade for unlimited</a>
                )}
              </div>
            )}
            {stats && stats.totalUses > 0 && (
              <p className="text-sm text-purple-600 mt-2 font-medium">
                ðŸ’ª {stats.resilience}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(CRISIS_INTERVENTIONS).map((intervention) => (
              <button
                key={intervention.condition}
                onClick={() => handleConditionSelect(intervention.condition)}
                className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-${intervention.color}-200 hover:border-${intervention.color}-400`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{intervention.label}</h3>
                <p className="text-sm text-gray-600">{intervention.skills.length} techniques available</p>
              </button>
            ))}
          </div>

          {/* Hope Reframe Link */}
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ðŸ’› Hope Reframe</h3>
                <p className="text-sm text-gray-600">Transform distressing thoughts into grounded hope</p>
              </div>
              <a
                href="/hope-reframe"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
              >
                Open â†’
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const intervention = CRISIS_INTERVENTIONS[selectedCondition];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <button onClick={reset} className="mb-4 text-gray-600 hover:text-gray-900">
          â† Back
        </button>

        {currentStep === 'ruleout' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">First, let's check in</h2>
            <p className="text-lg text-gray-700 mb-6">{intervention.ruleOut}</p>
            <button
              onClick={() => setCurrentStep('skills')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Continue to Techniques
            </button>
          </div>
        )}

        {currentStep === 'skills' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a technique</h2>
            <div className="space-y-4">
              {intervention.skills.map((skill) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{skill.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{skill.description}</p>
                  
                  {skill.id === 'label_thought' && activeSkill === skill.id && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type your intrusive thought:
                      </label>
                      <textarea
                        value={intrusiveThought}
                        onChange={(e) => setIntrusiveThought(e.target.value)}
                        placeholder="Write it down to externalize it..."
                        className="w-full p-3 border rounded-lg text-sm"
                        rows={3}
                      />
                      {intrusiveThought && (
                        <p className="mt-2 text-sm font-medium text-purple-600">
                          âœ“ Labeled as: "This is a sticky/intrusive thought"
                        </p>
                      )}
                    </div>
                  )}
                  
                  {activeSkill === skill.id && timer !== null && (
                    <div className="mb-3">
                      <div className="text-3xl font-bold text-blue-600 text-center">
                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => startSkill(skill.id, skill.duration)}
                    className={`w-full py-2 rounded-lg font-medium ${
                      usedSkills.includes(skill.id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {usedSkills.includes(skill.id) ? 'âœ“ Used' : 'Try This'}
                  </button>
                </div>
              ))}
            </div>
            {userTier === 'recovery' && !showAiSkills && (
              <button
                onClick={fetchAiRecommendations}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
              >
                âœ¨ Get AI Skill Recommendations
              </button>
            )}
            
            {showAiSkills && aiRecommendations.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  âœ¨ AI Recommended for You
                </h3>
                {aiRecommendations.map((rec, idx) => (
                  <div key={idx} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                    <h4 className="font-bold text-purple-900 mb-2">{rec.name}</h4>
                    <p className="text-gray-700 text-sm mb-2">{rec.description}</p>
                    <p className="text-xs text-purple-600 italic mb-2">ðŸ’¡ {rec.why}</p>
                    <button
                      onClick={() => startSkill(rec.name, rec.duration)}
                      className={`w-full py-2 rounded-lg font-medium ${
                        usedSkills.includes(rec.name)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {usedSkills.includes(rec.name) ? 'âœ“ Used' : 'Try This'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setCurrentStep('affirmation')}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
            >
              Continue to Affirmation
            </button>
          </div>
        )}

        {currentStep === 'affirmation' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Remember this</h2>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-4">
              <p className="text-lg text-gray-800 italic">
                {personalizedAffirmation || intervention.affirmation}
              </p>
            </div>
            <button
              onClick={() => playVoiceAffirmation(personalizedAffirmation || intervention.affirmation)}
              disabled={isPlayingVoice}
              className="w-full mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPlayingVoice ? 'ðŸ”Š Playing...' : 'ðŸŽ™ï¸ Listen to Guided Voice'}
            </button>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
              <p className="text-gray-800">{intervention.futureVision}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">How helpful was this?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => completeSession(rating)}
                    className="flex-1 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">ðŸ’ª</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You did it</h2>
            <p className="text-gray-600 mb-6">You showed up for yourself. That takes courage.</p>
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Back to Toolkit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
