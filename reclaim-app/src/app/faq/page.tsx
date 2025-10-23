'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: 'trial' | 'features' | 'safety' | 'subscription' | 'technical';
}

const faqData: FAQItem[] = [
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
  }
];

const categories = {
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

        {/* Highlight Box */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
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
              <a
                href="/contact"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/learn-more"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Learn About Narcissistic Abuse
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}