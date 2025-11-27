'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Shield } from 'lucide-react';
import AuthButton from '@/components/AuthButton';

interface FAQItem {
  question: string;
  answer: string;
  category: 'trial' | 'features' | 'safety' | 'subscription' | 'technical';
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'trial' | 'features' | 'safety' | 'subscription' | 'technical' | 'legal';
}

const faqData: FAQItem[] = [
  // Legal Evidence & Documentation
  {
    category: 'legal',
    question: "Can Reclaim help with my divorce or custody case?",
    answer: "Absolutely! Reclaim creates court-admissible evidence with timestamps, GPS data, and AI analysis. Our Reality Log documents incidents objectively, while the Manipulation Decoder identifies gaslighting patterns. Many users have successfully used our evidence in divorce proceedings, custody battles, and restraining order applications. The documentation is tamper-proof and includes digital signatures for legal authenticity."
  },
  {
    category: 'legal',
    question: "Is the evidence from Reclaim accepted in court?",
    answer: "Yes! Our evidence meets legal standards with automatic timestamps, GPS coordinates, digital signatures, and audit trails. The AI analysis provides expert-level pattern recognition that attorneys use to prove manipulation and abuse. We export data in legal formats (PDF with metadata) and provide documentation that courts regularly accept in family law, custody, and harassment cases."
  },
  {
    category: 'legal',
    question: "How does Reclaim help prove parental alienation?",
    answer: "Reclaim documents parental alienation through timestamped incidents, communication analysis, and pattern recognition. Our AI identifies manipulation tactics used against children, tracks violations of custody agreements, and creates comprehensive reports showing alienation patterns over time. This evidence is crucial for custody modifications and protecting children from psychological manipulation."
  },
  {
    category: 'legal',
    question: "Can I use Reclaim for workplace harassment cases?",
    answer: "Yes! Reclaim documents workplace manipulation, hostile environments, and discriminatory behavior. Our tools help you build strong cases for HR complaints, EEOC filings, and legal action. The AI identifies workplace gaslighting, documents retaliation patterns, and creates evidence packages that employment attorneys use to win harassment and discrimination cases."
  },
  {
    category: 'legal',
    question: "Do attorneys recommend Reclaim?",
    answer: "Many family law and employment attorneys recommend Reclaim because it provides organized, timestamped evidence that strengthens their cases. Our documentation helps attorneys prepare better, win more cases, and provide added value to their clients. We partner with law firms to offer white-label versions and provide expert witness services for AI analysis testimony."
  },
  {
    category: 'legal',
    question: "How do I export evidence for my attorney?",
    answer: "Reclaim provides secure evidence export in legal formats. You can generate comprehensive reports with timestamps, GPS data, AI analysis, and pattern summaries. Free tier includes 1 export per month, while paid tiers offer unlimited exports. All exports are encrypted and include metadata that courts require for digital evidence authentication."
  },

  // Free Trial & Identification
  {
    category: 'trial',
    question: "Can the free trial help me identify if I'm in an abusive relationship?",
    answer: "Yes! Our free Foundation tier includes 15 AI conversations per month and access to our Manipulation Decoder (3 uses/month). These features can help you analyze concerning behaviors and conversations. The AI is trained to recognize narcissistic patterns and can provide insights into whether certain behaviors constitute emotional abuse or manipulation."
  },
  {
    category: 'trial',
    question: "What can I discover about my relationship during the free trial?",
    answer: "With 10 journal entries and 15 AI chats monthly, you can document incidents, analyze patterns, and get professional insights. Our AI can identify gaslighting, love-bombing, triangulation, and other narcissistic tactics. Many users discover they're experiencing abuse within their first week of using our tools."
  },
  {
    category: 'trial',
    question: "How does the Manipulation Decoder work in identifying abuse?",
    answer: "The Manipulation Decoder analyzes text conversations, emails, or verbal interactions for manipulation tactics. It identifies gaslighting phrases, emotional blackmail, blame-shifting, and other narcissistic communication patterns. With 3 free analyses per month, you can quickly assess if your partner's communication style is abusive."
  },
  {
    category: 'trial',
    question: "Is the free version enough to determine if I need help?",
    answer: "The free tier provides enough insight to recognize red flags and abuse patterns. However, for comprehensive pattern analysis, unlimited AI support, and advanced tracking features, upgrading to Recovery ($15/month) or Empowered ($24.99/month) tiers provides the full support system needed for healing and recovery."
  },

  // Features & Capabilities
  {
    category: 'features',
    question: "What's included in the Reality Anchor routine?",
    answer: "Reality Anchor is available with Recovery ($15/month) and Empowered ($24.99/month) tiers. It includes Morning Intentions, Affirmations, Reality Log (for documenting factual abuse incidents), Mental Pause (guided breathing with trauma-informed mantras), and Decompression Rituals. This routine helps maintain your sense of reality when experiencing gaslighting."
  },
  {
    category: 'features',
    question: "How does the AI understand narcissistic abuse?",
    answer: "Our AI is specifically trained on narcissistic abuse patterns, trauma-informed responses, and recovery strategies. It recognizes manipulation tactics, provides validation, and offers personalized coping strategies. The AI adapts to your abuser's gender and your preferred language for more accurate support."
  },
  {
    category: 'features',
    question: "What's the difference between Reality Log and Journal?",
    answer: "Reality Log (Recovery/Empowered tiers) is for documenting factual abuse incidents with timestamps and evidence - crucial for maintaining reality during gaslighting. Journal entries (10/month free) are for emotional processing, reflection, and healing work. Both serve different but important purposes in recovery."
  },
  {
    category: 'features',
    question: "Can I track patterns in abusive behavior?",
    answer: "Yes! The free tier allows basic pattern recognition through journal entries and Reality Log. For advanced Pattern Analysis with detailed insights, trends, and predictive warnings about escalation cycles, upgrade to Recovery or Empowered tiers for comprehensive tracking and analytics."
  },

  // Safety & Privacy
  {
    category: 'safety',
    question: "Is my data safe from my abuser?",
    answer: "Absolutely. We use military-grade encryption, secure authentication, and never share data with law enforcement without a court order. Your abuser cannot access your account, and we provide guidance on safe usage practices. All safety features (Safety Plan, Grey Rock Method) are unlimited and free."
  },
  {
    category: 'safety',
    question: "Do you use my personal data to train AI models?",
    answer: "NO. We want to be crystal clear: We DO NOT use your journal entries, conversations, or any personal content to train AI models. We DO NOT sell or share your data with third parties. When AI processes your content (like analyzing manipulation patterns), it happens in real-time and your data is immediately discarded by the AI provider. Your healing journey is private and stays private."
  },
  {
    category: 'safety',
    question: "What happens to my data when I use AI features?",
    answer: "When you use AI features, your content is sent to Google AI for real-time processing only. We have strict contractual agreements ensuring your data is NOT used to train their models. The AI generates a response and immediately discards your input - nothing is retained. We never store your content with third-party AI providers."
  },
  {
    category: 'safety',
    question: "Can you guarantee my data won't be used for AI training?",
    answer: "Yes. This is legally binding in our Terms of Service and Privacy Policy. We have contractual agreements with all AI providers (Google AI) that explicitly prohibit using customer data for model training. If we ever change this policy, we will notify you 90 days in advance and give you the option to export and delete all your data before any changes take effect."
  },
  {
    category: 'safety',
    question: "What if I'm in immediate danger?",
    answer: "If you're in immediate danger, call emergency services (911, 999, etc.). Our Safety Plan feature (free unlimited) helps you prepare for dangerous situations, but it's not a substitute for professional help. We provide crisis hotline numbers and emergency resources within the app."
  },
  {
    category: 'safety',
    question: "Can I use this app secretly?",
    answer: "Yes, we provide guidance on safe usage, including clearing browser history, using private browsing, and recognizing signs of digital monitoring. The app doesn't send notifications that could alert an abuser, and you can quickly exit to a neutral website if needed."
  },

  // Subscription & Upgrades
  {
    category: 'subscription',
    question: "Why should I upgrade from the free tier?",
    answer: "The free tier helps identify abuse, but recovery requires ongoing support. Recovery tier ($15/month) provides 300 AI conversations, 50 manipulation analyses, and pattern tracking. Empowered tier ($24.99/month) offers unlimited everything plus advanced analytics for comprehensive healing and empowerment."
  },
  {
    category: 'subscription',
    question: "What happens if I can't afford a subscription?",
    answer: "We understand financial abuse is common. The free tier provides essential safety tools forever. We also offer sliding scale pricing and emergency access programs for survivors in crisis. Contact support for assistance - your safety and healing matter more than payment."
  },
  {
    category: 'subscription',
    question: "Can I cancel anytime?",
    answer: "Yes, cancel anytime with no penalties. Your data remains secure and accessible. If you're leaving due to safety concerns, we can help you export your data securely. We never make it difficult to leave - your autonomy is paramount."
  },

  // Technical
  {
    category: 'technical',
    question: "Do you support multiple languages?",
    answer: "Yes! We support 70+ languages with automatic detection. The AI can communicate in your preferred language and understands cultural contexts around abuse. This ensures accurate support regardless of your linguistic background."
  },
  {
    category: 'technical',
    question: "Can I export my data?",
    answer: "Yes, you can export your data for personal records or to share with therapists. Free tier includes 1 export per month, while paid tiers offer more frequent exports. All exports are encrypted and secure."
  },
  {
    category: 'technical',
    question: "Is there a mobile app?",
    answer: "Currently, we're a web-based platform optimized for mobile browsers. This provides better security and privacy than app stores while ensuring you always have the latest features. You can add us to your home screen for app-like experience."
  },

  // Additional Legal Use Cases
  {
    category: 'legal',
    question: "How does Reclaim help with restraining orders?",
    answer: "Reclaim provides crucial evidence for restraining orders by documenting harassment patterns, threats, and stalking behaviors with timestamps and GPS data. Our AI analysis shows escalation patterns and identifies threatening language that courts consider when granting protection orders. The objective documentation counters gaslighting attempts during legal proceedings."
  },
  {
    category: 'legal',
    question: "Can Reclaim prove financial abuse in divorce cases?",
    answer: "Yes! Reclaim documents financial control tactics, hidden assets, and economic manipulation. Our tools help you track financial abuse patterns, document restricted access to money, and identify coercive financial behaviors. This evidence is crucial for asset division and spousal support determinations in divorce proceedings."
  },
  {
    category: 'legal',
    question: "How does the AI analysis help in legal cases?",
    answer: "Our AI provides expert-level analysis that identifies manipulation patterns, predicts escalation cycles, and quantifies abuse severity. This analysis serves as expert testimony in court, helping judges understand the psychological impact of narcissistic abuse. Many attorneys use our AI reports as supporting evidence to strengthen their legal arguments."
  },
  {
    category: 'legal',
    question: "What legal professionals work with Reclaim?",
    answer: "We partner with family law attorneys, employment lawyers, domestic violence advocates, and forensic psychologists. These professionals use Reclaim to gather better evidence, prepare stronger cases, and provide enhanced services to their clients. We also offer training for legal professionals on using digital evidence in abuse cases."
  },
  {
    category: 'legal',
    question: "How secure is the evidence for legal proceedings?",
    answer: "Reclaim uses military-grade encryption, blockchain-style verification, and digital signatures to ensure evidence integrity. All documentation includes audit trails showing when data was created and modified. This security meets legal standards for digital evidence and prevents tampering claims that could invalidate your case."
  },
  {
    category: 'legal',
    question: "Can Reclaim help with child protective services (CPS) cases?",
    answer: "Yes! Reclaim documents unsafe environments, parental manipulation of children, and neglect patterns. Our evidence helps CPS workers and family courts understand the psychological harm to children in narcissistic abuse situations. The documentation supports decisions about child safety and custody arrangements."
  }
];

const categories = {
  legal: { name: 'Legal Evidence & Court Cases', icon: '⚖️' },
  trial: { name: 'Free Trial & Abuse Identification', icon: '🔍' },
  features: { name: 'Features & Tools', icon: '⚡' },
  safety: { name: 'Safety & Privacy', icon: '🛡️' },
  subscription: { name: 'Subscriptions & Pricing', icon: '💳' },
  technical: { name: 'Technical Support', icon: '🔧' }
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Reclaim</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers about identifying abuse, using our features, and how Reclaim can support your journey to freedom and healing.
          </p>
        </div>

        {/* Legal Evidence Highlight */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-3">⚖️ Court-Admissible Evidence Collection</h2>
          <p className="text-lg mb-4">
            Build legal cases with timestamped, GPS-tagged documentation. Our AI creates court-ready evidence for divorce, custody, and harassment cases that attorneys use to win.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>✓ Timestamped Documentation</strong> - Court-admissible evidence
            </div>
            <div>
              <strong>✓ AI Pattern Analysis</strong> - Prove manipulation tactics
            </div>
            <div>
              <strong>✓ Audio Transcription</strong> - Convert conversations to legal text
            </div>
            <div>
              <strong>✓ Secure Evidence Storage</strong> - Tamper-proof documentation
            </div>
          </div>
        </div>

        {/* Free Trial Box */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-3">🔍 Discover If You're Being Abused - Free Trial</h2>
          <p className="text-lg mb-4">
            Not sure if you're experiencing narcissistic abuse? Our free trial provides enough AI conversations and analysis tools to help you identify manipulation patterns and abusive behaviors in your relationship.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>✓ 15 AI Conversations/month</strong> - Get professional insights
            </div>
            <div>
              <strong>✓ 3 Manipulation Analyses/month</strong> - Decode concerning messages
            </div>
            <div>
              <strong>✓ Basic Safety Tools</strong> - Essential protection features
            </div>
            <div>
              <strong>✓ 10 Journal Entries/month</strong> - Document and reflect
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Questions
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => {
            const isOpen = openItems.has(index);
            const category = categories[item.category];
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.question}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-4">
                    <div className="pl-8">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team understands the unique challenges of narcissistic abuse recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthButton />
              <a
                href="mailto:support@reclaim.app"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}