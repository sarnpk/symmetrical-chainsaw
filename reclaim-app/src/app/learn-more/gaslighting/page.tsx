import Link from 'next/link'
import { Metadata } from 'next'
import { AlertTriangle, Eye, FileText, ChevronRight, ArrowLeft, ArrowRight, Shield, BookOpen, Search } from 'lucide-react'
import QuizShell from '@/components/marketing/QuizShell'

export const metadata: Metadata = {
  title: 'What Is Gaslighting? Signs, Examples & How to Stop It',
  description:
    'Gaslighting makes you doubt your reality. Learn the signs, see real examples, and use our free tool to document what is actually happening.',
  alternates: {
    canonical: '/learn-more/gaslighting',
  },
}

export default function GaslightingPage() {
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
        <span className="text-gray-800 font-medium">Gaslighting</span>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-amber-600 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Emotional Abuse Awareness</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            What Is Gaslighting? Signs, Examples &amp; How to Stop It
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Gaslighting is a form of psychological manipulation where someone makes you question your own memory,
            perception, and sanity. It happens slowly, over time, until you no longer trust what you know to be true.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Exactly Is Gaslighting?</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Gaslighting is a pattern of manipulation where one person systematically undermines another person&apos;s
              grip on reality. The term comes from the 1944 film Gaslight, where a husband manipulates his wife into
              thinking she is going insane. In the movie, he dims the gas lights in their home and then denies that the
              lights are changing when she notices.
            </p>
            <p>
              In real life, gaslighting is rarely that dramatic. It often starts with small, seemingly innocent comments
              that accumulate over months or years. The person doing the gaslighting may deny saying something, twist
              your words, or dismiss your feelings. Over time, you begin to doubt yourself, and you may even start
              relying on them to tell you what is real.
            </p>
            <p>
              Gaslighting is not a one-time argument or disagreement. It is a sustained campaign of emotional control.
              The goal, whether conscious or not, is to create dependency. When you cannot trust your own mind, you
              become easier to control.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10 Real Examples of Gaslighting</h2>
          <div className="space-y-4">
            {[
              {
                example: '"I never said that. You are making things up again."',
                context:
                  "They deny something they clearly said. You check your memory, but they are so confident that you start to believe them.",
              },
              {
                example: '"You are too sensitive. It was just a joke."',
                context:
                  "After saying something hurtful, they dismiss your reaction as oversensitivity. This trains you to stop expressing your feelings.",
              },
              {
                example: '"That never happened. You are remembering it wrong."',
                context:
                  "They flatly deny events that took place. Over time, you stop trusting your own memory and start asking them to confirm what happened.",
              },
              {
                example: '"Everyone thinks you are crazy, not just me."',
                context:
                  "They claim others share their opinion of you. This isolates you and makes you feel like the problem is widespread.",
              },
              {
                example: '"I was joking. Why do you always take everything so seriously?"',
                context:
                  "They use humor as a shield. When you confront hurtful comments, they retreat behind the defense that you simply cannot take a joke.",
              },
              {
                example: '"You are imagining things. That did not happen the way you think."',
                context:
                  "They rewrite events to match their version. You remember the conversation going one way, but they insist it went another.",
              },
              {
                example: '"If you really loved me, you would not question me."',
                context:
                  "They use your love and loyalty against you. Questioning them becomes evidence that you are the problem.",
              },
              {
                example: '"I am the only one who puts up with you."',
                context:
                  "They convince you that no one else would tolerate you. This makes you feel trapped and grateful for their presence.",
              },
              {
                example: '"You are remembering that wrong. I told you this already."',
                context:
                  "They claim you forgot something they never actually told you. This makes you doubt your attention and memory.",
              },
              {
                example: '"You are being dramatic. Calm down."',
                context:
                  "When you express valid concerns, they label your reaction as dramatic or hysterical. This shuts down productive conversation.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-amber-50 border border-amber-100 rounded-lg p-5">
                <p className="text-gray-900 font-medium text-lg mb-1">{item.example}</p>
                <p className="text-gray-600">{item.context}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Signs You Are Being Gaslighted</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Search, title: 'Constant Self-Doubt', desc: 'You question your own thoughts and feelings more than you used to.' },
              { icon: AlertTriangle, title: 'Feeling Confused', desc: 'You feel disoriented or like you are losing your mind.' },
              { icon: FileText, title: 'Making Excuses', desc: 'You defend the other person\'s behavior to friends and family.' },
              { icon: Eye, title: 'Feeling Watched', desc: 'You feel like you are walking on eggshells all the time.' },
              { icon: Shield, title: 'Withholding Information', desc: 'You stop sharing things because you fear being told you are wrong.' },
              { icon: BookOpen, title: 'Questioning Your Memory', desc: 'You frequently wonder if you remembered something correctly.' },
              { icon: AlertTriangle, title: 'Feeling Like a Different Person', desc: 'You are not the confident person you used to be.' },
              { icon: Search, title: 'Apologizing Constantly', desc: 'You say sorry even when you have done nothing wrong.' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <item.icon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Documentation Matters</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              When you are being gaslighted, your memory becomes unreliable. The manipulator has spent months or years
              making you doubt what you remember. This is exactly why documentation is so powerful.
            </p>
            <p>
              Writing things down creates an objective record. You do not have to rely on your memory or their version
              of events. You have a timestamped log of what actually happened, what was said, and how it made you feel.
            </p>
            <p>
              Documentation serves multiple purposes. It helps you trust yourself again. It provides evidence if you need
              to involve law enforcement or family courts. And it helps you see patterns that are hard to recognize when
              you are living through them day by day.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Free Tools to Help You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/gaslighting-reality-check"
              className="group block bg-teal-50 border border-teal-100 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-teal-700" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                  Gaslighting Reality Check
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Answer a few questions about your situation and get an instant, private assessment of whether you
                are experiencing gaslighting.
              </p>
              <span className="inline-flex items-center gap-1 text-teal-700 font-medium text-sm mt-3">
                Take the Free Assessment <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              href="/gaslighting-tracker"
              className="group block bg-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  Gaslighting Tracker
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Document every incident with timestamps, categories, and notes. Build a record you can trust and share
                with professionals.
              </p>
              <span className="inline-flex items-center gap-1 text-blue-700 font-medium text-sm mt-3">
                Start Tracking <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>

        <section className="mb-12 bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">You Are Not Crazy. You Are Being Manipulated.</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">
            Gaslighting works by making you doubt yourself. The very fact that you are reading this, questioning
            whether your experience is valid, is a sign that something is wrong. Trust yourself. Your feelings
            are real. Your memories are valid.
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
            href="/learn-more"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learn More
          </Link>
          <Link
            href="/learn-more/co-parenting"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            Co-Parenting with a Narcissist <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </article>
    </QuizShell>
  )
}
