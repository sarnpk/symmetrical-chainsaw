import Link from 'next/link'
import { Metadata } from 'next'
import { MessageSquare, FileText, ChevronRight, ArrowLeft, ArrowRight, Shield, Users, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react'
import QuizShell from '@/components/marketing/QuizShell'

export const metadata: Metadata = {
  title: 'Co-Parenting with a Narcissist: Complete Guide',
  description:
    'Learn how to co-parent with a narcissist safely. Communication strategies, documentation tips, and tools for protecting your children.',
  alternates: {
    canonical: '/learn-more/co-parenting',
  },
}

export default function CoParentingPage() {
  return (
    <QuizShell>
      <nav className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-teal-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/learn-more" className="hover:text-teal-600 transition-colors">
          Learn More
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Co-Parenting</span>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-purple-600 mb-4">
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Family &amp; Parenting</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Co-Parenting with a Narcissist: Complete Guide
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Co-parenting with a narcissist is one of the most exhausting challenges a person can face. You are not
            just managing schedules and homework. You are navigating a relationship where the other parent may
            sabotage your efforts, manipulate your children, and use the court system as a weapon.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding the Challenge</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              When you share children with a narcissist, the relationship does not end when the divorce is finalized.
              In many ways, it intensifies. The narcissist no longer has the marriage to control, so they redirect
              their energy toward the children, custody arrangements, and every small decision that affects your
              family.
            </p>
            <p>
              Narcissistic co-parents often engage in parental alienation, where they systematically turn the children
              against the other parent. They may badmouth you in front of the kids, interfere with custody exchanges,
              make unilateral decisions about education or healthcare, or use the children as messengers and spies.
            </p>
            <p>
              The courts are not always equipped to handle this kind of behavior. A narcissist can appear charming
              and reasonable in front of a judge while behaving completely differently behind closed doors. This
              makes documentation and strategy essential.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Communication Strategies That Work</h2>
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-6 h-6 text-purple-700" />
                <h3 className="text-lg font-bold text-gray-900">The BIFF Method</h3>
              </div>
              <p className="text-gray-700 mb-3">
                BIFF stands for Brief, Informative, Friendly, and Firm. This method was developed by Bill Eddy, a
                family law attorney and therapist who specializes in high-conflict personalities.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Brief</strong> - Keep messages short. The more you write, the more ammunition you give them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Informative</strong> - Stick to facts. Do not include emotions, opinions, or attempts to explain yourself.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Friendly</strong> - A neutral or mildly friendly tone prevents them from claiming you were hostile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Firm</strong> - End the conversation. Do not leave openings for argument or debate.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-700" />
                <h3 className="text-lg font-bold text-gray-900">Parallel Parenting</h3>
              </div>
              <p className="text-gray-700 mb-3">
                When traditional co-parenting is impossible because the other parent is hostile, manipulative, or
                abusive, parallel parenting is the answer. You each parent in your own home with minimal contact
                and minimal interference.
              </p>
              <p className="text-gray-700">
                This means you do not discuss discipline, parenting styles, or household rules with the other parent.
                You handle these things in your own home. The only communication that happens is logistical: pickup
                times, medical appointments, and school events. Everything goes through written communication so there
                is a record.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
                <h3 className="text-lg font-bold text-gray-900">What NOT to Do</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>Do not argue with a narcissist. They will never concede a point, and every argument becomes fuel for their narrative.</li>
                <li>Do not try to explain your feelings to them. They will use your vulnerability against you.</li>
                <li>Do not discuss custody or legal matters in front of the children.</li>
                <li>Do not engage with provocations. If they send an inflammatory message, respond only to the logistical parts.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentation for Court</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Courts rely on evidence. Feelings and accusations without documentation are rarely persuasive. If you
              are dealing with a narcissistic co-parent, you need a systematic approach to documentation that can
              withstand scrutiny from judges, mediators, and attorneys.
            </p>
            <p>
              Every incident should be documented with a date, time, what happened, who was present, and how it
              affected the children. Save all text messages, emails, and voicemails. Keep a journal of interactions
              at custody exchanges. If the other parent violates a custody order, document it immediately.
            </p>
            <p>
              The goal is not to build a case for revenge. The goal is to protect yourself and your children by
              creating an accurate, unbiased record of what is happening. This record can be the difference between
              a judge taking your concerns seriously and dismissing them as one parent&apos;s bitterness toward the other.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Protecting Your Children</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Do Not Badmouth the Other Parent',
                desc: 'Even if the other parent is terrible, children benefit from having a relationship with both parents when it is safe. Let your actions speak louder than words.',
              },
              {
                title: 'Maintain Routine and Stability',
                desc: 'Children thrive on predictability. Keep consistent bedtimes, homework routines, and household rules. This gives them a safe anchor when things feel chaotic.',
              },
              {
                title: 'Listen Without Coaching',
                desc: 'When your children share concerns about the other parent, listen without leading them. Ask open-ended questions. Let them form their own conclusions.',
              },
              {
                title: 'Get Professional Support',
                desc: 'A therapist who specializes in high-conflict family dynamics can help both you and your children process the experience in healthy ways.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Free Tools for Co-Parents</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/biff-assistant"
              className="group block bg-teal-50 border border-teal-100 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-teal-700" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                  BIFF Assistant
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Type a message you received and get help crafting a BIFF response. Keep your communication brief,
                informative, friendly, and firm.
              </p>
              <span className="inline-flex items-center gap-1 text-teal-700 font-medium text-sm mt-3">
                Try It Free <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              href="/journal"
              className="group block bg-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  Parenting Journal
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Document co-parenting interactions, custody exchange issues, and incidents that affect your children.
                Export for court at any time.
              </p>
              <span className="inline-flex items-center gap-1 text-blue-700 font-medium text-sm mt-3">
                Start Journaling <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How do I communicate with a narcissistic co-parent?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Use the BIFF method: Brief, Informative, Firm, and Friendly. Keep all communication in writing. Never engage in emotional conversations. Stick to facts about the children.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I modify custody because of narcissistic abuse?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Document everything. Courts look for patterns of behavior, not isolated incidents. Use timestamped records, screenshots, and professional evaluations.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is parallel parenting?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Parallel parenting is a custody arrangement where each parent makes decisions during their time without consulting the other. It minimizes direct conflict while protecting the children.",
                    },
                  },
                ],
              }),
            }}
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">How do I communicate with a narcissistic co-parent?</h3>
              <p className="text-gray-600">Use the BIFF method: Brief, Informative, Firm, and Friendly. Keep all communication in writing. Never engage in emotional conversations. Stick to facts about the children.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Can I modify custody because of narcissistic abuse?</h3>
              <p className="text-gray-600">Document everything. Courts look for patterns of behavior, not isolated incidents. Use timestamped records, screenshots, and professional evaluations.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">What is parallel parenting?</h3>
              <p className="text-gray-600">Parallel parenting is a custody arrangement where each parent makes decisions during their time without consulting the other. It minimizes direct conflict while protecting the children.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">You Are Not Alone in This</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">
            Co-parenting with a narcissist is exhausting, but you do not have to figure it out alone. The right
            strategies, documentation, and support can help you protect your children and maintain your sanity.
            Start with the tools that are available to you right now.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn-more"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Learn More
            </Link>
          </div>
        </section>

        <nav className="flex items-center justify-between py-6 border-t border-gray-200">
          <Link
            href="/learn-more/gaslighting"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> What Is Gaslighting?
          </Link>
          <Link
            href="/learn-more/evidence"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            Documenting Emotional Abuse <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </article>
    </QuizShell>
  )
}
