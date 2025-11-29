'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { Copy, Check, Search, Sparkles, X, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  category: string;
  situation: string;
  template_text: string;
  variations: string[];
  when_to_use: string;
  tone: string;
}

export default function GreyRockTemplatesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customizing, setCustomizing] = useState<string | null>(null);
  const [aiVariations, setAiVariations] = useState<{[key: string]: string[]}>({});
  const [contextMessage, setContextMessage] = useState('');
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
      
      fetch('/api/grey-rock-templates')
        .then(r => r.ok ? r.json() : [])
        .then(data => setTemplates(data || []))
        .catch(() => setTemplates([]));
    };
    init();
  }, [router, supabase]);

  const copyToClipboard = async (text: string, templateId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(templateId);
    setTimeout(() => setCopiedId(null), 2000);
    
    await fetch('/api/grey-rock-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId, custom_text: text })
    });
  };

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(t => {
    const categoryMatch = selectedCategory === 'All' || t.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      t.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.template_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.when_to_use.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'brief': return 'bg-blue-100 text-blue-800';
      case 'formal': return 'bg-purple-100 text-purple-800';
      case 'redirect': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user || !profile) return null;

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Grey Rock Templates</h1>
          <Link href="/docs/GREY_ROCK_USER_GUIDE.html" target="_blank">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="h-5 w-5" />
              <span className="font-medium">Guide</span>
            </button>
          </Link>
        </div>
        <p className="text-gray-600 mb-8">Copy/paste responses for real-world communication. Keep it brief, boring, and neutral.</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-900 mb-2">💡 How to Use</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Click "Copy" to copy the template to your clipboard</li>
            <li>• Paste into your text/email and customize if needed</li>
            <li>• Keep responses short - don't over-explain or justify</li>
            <li>• Use variations to avoid sounding robotic</li>
          </ul>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search situations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{template.situation}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getToneColor(template.tone)}`}>
                      {template.tone}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.when_to_use}</p>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4 mb-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-gray-900 font-medium flex-1">{template.template_text}</p>
                  <button
                    onClick={() => copyToClipboard(template.template_text, template.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm whitespace-nowrap"
                  >
                    {copiedId === template.id ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {template.variations && template.variations.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Variations:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.variations.map((variation, idx) => (
                      <button
                        key={idx}
                        onClick={() => copyToClipboard(variation, `${template.id}-${idx}`)}
                        className="px-3 py-1.5 bg-white border rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        {variation}
                        {copiedId === `${template.id}-${idx}` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setCustomizing(customizing === template.id ? null : template.id)}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                {customizing === template.id ? 'Hide AI Customizer' : 'Customize with AI'}
              </button>

              {customizing === template.id && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-sm text-indigo-900">AI Customizer</h4>
                    <button onClick={() => setCustomizing(null)} className="text-indigo-600 hover:text-indigo-800">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    placeholder="Paste their message here for context (optional)..."
                    value={contextMessage}
                    onChange={(e) => setContextMessage(e.target.value)}
                    className="w-full border rounded p-2 text-sm mb-3"
                    rows={3}
                  />
                  <button
                    onClick={async () => {
                      const res = await fetch('/api/grey-rock-templates/customize', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          template_text: template.template_text,
                          their_message: contextMessage,
                          tone_preference: template.tone
                        })
                      });
                      const data = await res.json();
                      setAiVariations({ ...aiVariations, [template.id]: data.variations });
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Custom Responses
                  </button>

                  {aiVariations[template.id] && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-indigo-900 mb-2">AI-Generated Responses:</p>
                      <div className="space-y-2">
                        {aiVariations[template.id].map((variation, idx) => (
                          <button
                            key={idx}
                            onClick={() => copyToClipboard(variation, `${template.id}-ai-${idx}`)}
                            className="w-full text-left px-3 py-2 bg-white border border-indigo-300 rounded text-sm text-gray-900 hover:bg-indigo-50 flex items-center justify-between"
                          >
                            <span>{variation}</span>
                            {copiedId === `${template.id}-ai-${idx}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No templates found. Try adjusting your search or category filter.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
