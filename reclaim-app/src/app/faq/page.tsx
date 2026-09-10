'use client'

import { useState } from 'react'
import { ChevronDown, Check, Scale, Search, Zap, ShieldCheck, CreditCard, Wrench } from 'lucide-react'
import SiteHeader from '@/components/marketing/SiteHeader'
import SiteFooter from '@/components/marketing/SiteFooter'
import SectionHeading from '@/components/marketing/SectionHeading'
import Reveal from '@/components/marketing/Reveal'

interface FAQItem {
  question: string
  answer: string
  category: 'trial' | 'features' | 'safety' | 'subscription' | 'technical' | 'legal'
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
]

const faqSchemaJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})

const categories = {
  legal: { name: 'Legal Evidence & Court Cases', icon: Scale },
  trial: { name: 'Free Trial & Abuse Identification', icon: Search },
  features: { name: 'Features & Tools', icon: Zap },
  safety: { name: 'Safety & Privacy', icon: ShieldCheck },
  subscription: { name: 'Subscriptions & Pricing', icon: CreditCard },
  technical: { name: 'Technical Support', icon: Wrench }
} as const

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQs = selectedCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === selectedCategory)

  const pillActive = (key: string) =>
    selectedCategory === key
      ? 'bg-brand-600 text-white shadow-soft'
      : 'bg-ink-100 text-ink-700 hover:bg-ink-200'

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchemaJson }}
        />
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked questions"
            lead="Answers about identifying abuse, using our features, and how Reclaim supports your journey to freedom and healing."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-panel bg-gradient-to-br from-brand-600 to-hope-600 p-7 text-white shadow-lift">
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold text-white">Court-Admissible Evidence Collection</h2>
              </div>
              <p className="text-[15px] leading-relaxed text-white/90">
                Build legal cases with timestamped, GPS-tagged documentation. Our AI creates court-ready
                evidence for divorce, custody, and harassment cases that attorneys use to win.
              </p>
              <ul className="mt-2 space-y-2 text-sm text-white/95">
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> Timestamped documentation — court-admissible evidence</li>
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> AI pattern analysis — prove manipulation tactics</li>
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> Audio transcription — convert conversations to legal text</li>
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> Secure evidence storage — tamper-proof documentation</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 rounded-panel bg-gradient-to-br from-hope-600 to-brand-600 p-7 text-white shadow-lift">
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold text-white">Discover if you're being abused — free</h2>
              </div>
              <p className="text-[15px] leading-relaxed text-white/90">
                Not sure if you're experiencing narcissistic abuse? The free Foundation tier gives you
                enough AI conversations and analysis tools to recognize manipulation patterns.
              </p>
              <ul className="mt-2 space-y-2 text-sm text-white/95">
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> 15 AI conversations / month — get professional insights</li>
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> 3 manipulation analyses / month — decode messages</li>
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> Basic safety tools — essential protection features</li>
                <li className="flex gap-2"><Check className="h-5 w-5 shrink-0" aria-hidden="true" /> 10 journal entries / month — document and reflect</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${pillActive('all')}`}
            >
              All Questions
            </button>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${pillActive(key)}`}
              >
                <category.icon className="h-4 w-4" aria-hidden="true" />
                {category.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 space-y-4">
          {filteredFAQs.map((item, index) => {
            const isOpen = openItems.has(index)
            const category = categories[item.category]
            const globalIndex = faqData.indexOf(item)

            return (
              <div
                key={globalIndex}
                className="overflow-hidden rounded-panel border border-ink-200 bg-white shadow-soft transition-shadow hover:shadow-lift"
              >
                <button
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${globalIndex}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-ink-50/60"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                    <h3 className="font-display text-lg font-semibold text-ink-900">{item.question}</h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-ink-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div id={`faq-panel-${globalIndex}`} className="px-6 pb-5 pl-14">
                    <p className="text-[15px] leading-relaxed text-ink-600">{item.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Reveal delay={100}>
          <div className="mt-14 rounded-panel border border-ink-200 bg-ink-50/60 p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Still have questions?</h2>
            <p className="mt-2 text-ink-600">
              Our support team understands the unique challenges of narcissistic abuse recovery.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/auth"
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Get started
              </a>
              <a
                href="mailto:support@reclaim.app"
                className="inline-flex items-center justify-center rounded-lg bg-ink-100 px-8 py-3 font-semibold text-ink-700 transition-colors hover:bg-ink-200"
              >
                Contact support
              </a>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  )
}