import Link from 'next/link'
import { Metadata } from 'next'
import { FileText, Clock, Mic, ChevronRight, ArrowLeft, ArrowRight, Shield, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react'
import QuizShell from '@/components/marketing/QuizShell'

export const metadata: Metadata = {
  title: 'How to Document Emotional Abuse for Court',
  description:
    'Learn how to document emotional abuse with timestamps, audio, and evidence that attorneys and courts accept. Free tools included.',
  alternates: {
    canonical: '/learn-more/evidence',
  },
}

export default function EvidencePage() {
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
        <span className="text-gray-800 font-medium">Evidence &amp; Documentation</span>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Legal Preparation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            How to Document Emotional Abuse for Court
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Emotional abuse is one of the hardest forms of abuse to prove in court. Unlike physical abuse, there are
            often no visible injuries. That is why documentation is your most powerful tool. A consistent, detailed
            record can show the court what words alone cannot.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Documentation Matters</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Courts operate on evidence. Judges and mediators see hundreds of cases, and many of them involve one
              parent accusing the other of being difficult. Without documentation, your claims look like one person&apos;s
              word against another&apos;s. With documentation, you have something concrete to show.
            </p>
            <p>
              Documentation serves several critical purposes. It establishes patterns of behavior, which are far more
              persuasive than isolated incidents. It provides timestamps that show the frequency and duration of abuse.
              It protects you from false claims by the other party. And it helps attorneys build a more effective case
              on your behalf.
            </p>
            <p>
              Many people wait too long to start documenting. They think things will get better, or they do not realize
              how important a paper trail is until they are already in a legal battle. The best time to start is now.
              Every day without documentation is a day that could be harder to prove later.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Counts as Evidence</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: FileText,
                title: 'Written Records',
                items: ['Text messages and chat logs', 'Emails and letters', 'Social media posts and messages', 'Notes from conversations'],
              },
              {
                icon: Mic,
                title: 'Audio and Video',
                items: ['Voice recordings of conversations', 'Video recordings of interactions', 'Voicemails from the abuser', 'Screen recordings of online interactions'],
              },
              {
                icon: Clock,
                title: 'Timestamped Entries',
                items: ['Journal entries with dates and times', 'GPS and location data', 'Calendar entries', 'Receipts and transaction records'],
              },
              {
                icon: Shield,
                title: 'Third-Party Evidence',
                items: ['Witness statements', 'Therapist or counselor notes', 'Police reports', 'Medical records'],
              },
            ].map((category, index) => (
              <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <category.icon className="w-6 h-6 text-blue-700" />
                  <h3 className="font-bold text-gray-900">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use Timestamps Effectively</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Timestamps are the backbone of credible documentation. A journal entry that says &quot;they were mean to
              me last week&quot; is not useful. An entry that says &quot;On March 3 at 7:45 PM, they told me I was a
              terrible parent in front of the children, and our daughter cried for 20 minutes afterward&quot; is powerful.
            </p>
            <p>
              Always include the date and time of every incident. Record as much detail as you can remember as soon as
              possible after it happens. Over time, your memory of specific details will fade, but a timestamped entry
              written within hours of the event will be accurate and credible.
            </p>
            <p>
              Use your phone to your advantage. Set a reminder to journal every evening. Use your phone&apos;s built-in
              note app to jot down incidents before they are lost. The Reclaim journal tool automatically timestamps
              every entry and stores it securely, so you do not have to worry about organizing or backing up your
              records.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Audio Recording Tips</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Know Your State Laws</h3>
              <p className="text-gray-700">
                Some states require two-party consent for recording, meaning both people must agree to be recorded.
                Other states allow one-party consent, where only one person needs to know about the recording. Before
                you record anything, understand what is legal in your jurisdiction. Recording illegally can undermine
                your case.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Keep Recordings Short and Relevant</h3>
              <p className="text-gray-700">
                Record conversations that contain admissions, threats, or evidence of manipulation. Do not record
                hours of mundane conversation hoping to catch something. Short, focused recordings are easier for
                attorneys and judges to review and more impactful.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Store Recordings Safely</h3>
              <p className="text-gray-700">
                Keep backups in multiple locations. Cloud storage, external drives, and copies with your attorney
                ensure that recordings are not lost if your phone is damaged, stolen, or confiscated. Never store
                recordings only on your primary device.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Court-Ready Exports</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Court-ready documentation means organized, chronological, and clearly presented. Scattered notes and
              random screenshots are not enough. You need a system that allows an attorney or judge to look at your
              records and immediately understand the pattern of abuse.
            </p>
            <p>
              Your documentation should be organized by category: communications, incidents, financial records,
              and third-party evidence. Each category should be in chronological order. Every entry should include
              a date, time, description of what happened, and any supporting evidence attached.
            </p>
            <p>
              When you are ready to share your documentation, export it in a format that is easy to read and present.
              PDF exports with clear formatting are standard. Some attorneys prefer digital exports they can search
              through, while others prefer printed copies for court. Having both options available gives you
              flexibility.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Free Tools to Help You Document</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/journal"
              className="group block bg-teal-50 border border-teal-100 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-teal-700" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                  Secure Journal
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Write timestamped entries about every incident. Categorize them, attach notes, and export your
                complete journal as a court-ready document.
              </p>
              <span className="inline-flex items-center gap-1 text-teal-700 font-medium text-sm mt-3">
                Start Journaling Free <ArrowRight className="w-4 h-4" />
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
                Specifically designed to track gaslighting incidents with categories, severity levels, and patterns
                over time. Perfect for high-conflict custody situations.
              </p>
              <span className="inline-flex items-center gap-1 text-blue-700 font-medium text-sm mt-3">
                Track Incidents <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>

        <section className="mb-12 bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">Start Documenting Today</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">
            The hardest part of documenting emotional abuse is starting. You do not need a perfect system. You just
            need to begin writing things down. Every entry is one more piece of evidence that supports your truth.
            Our free tools make it easy to start right now.
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
            href="/learn-more/co-parenting"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Co-Parenting with a Narcissist
          </Link>
          <Link
            href="/learn-more/leaving"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            How to Leave a Narcissist <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </article>
    </QuizShell>
  )
}
