import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Clock, User, BookOpen, ExternalLink, FileText, Clipboard, Phone } from "lucide-react"
import QuizShell from "@/components/marketing/QuizShell"

export const metadata: Metadata = {
  title: "Workplace Gaslighting: What to Do When Your Boss Denies Reality",
  description: "Workplace gaslighting damages your career and mental health. Learn to identify it, document it, and protect yourself.",
  alternates: {
    canonical: "https://reclaimyourlife.app/blog/workplace-gaslighting",
  },
  openGraph: {
    title: "Workplace Gaslighting: What to Do When Your Boss Denies Reality",
    description: "Workplace gaslighting damages your career and mental health. Learn to identify it, document it, and protect yourself.",
    type: "article",
    url: "https://reclaimyourlife.app/blog/workplace-gaslighting",
  },
}

export default function WorkplaceGaslightingPage() {
  return (
    <QuizShell>
      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-6 pt-24 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-700 transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-slate-700">Workplace Gaslighting</span>
        </div>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 pb-20">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Reclaim Team</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Sep 10, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>10 min read</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Workplace Gaslighting: What to Do When Your Boss Denies Reality
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Workplace gaslighting damages your career and mental health. Learn to identify it, document it, and protect yourself.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Workplace</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Gaslighting</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Career</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            You were told the project deadline was moved up. You documented it in an email. But when the deadline arrives and the work is not done, your boss says, &quot;I never said that. You must have misunderstood.&quot; You start to question yourself. Did you misread the email? Did you imagine the conversation? Welcome to workplace gaslighting, and it is more common than you think.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is Workplace Gaslighting?</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Workplace gaslighting is a form of psychological manipulation where a colleague, manager, or organization causes you to question your own perception, memory, or sanity. It is a systematic effort to make you doubt what you know to be true, often to maintain power or avoid accountability.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Unlike romantic gaslighting, workplace gaslighting can be more subtle because it operates within professional norms. It hides behind corporate language, plausible deniability, and power dynamics. The gaslighter may not even be conscious of their behavior, though the effect on you is the same.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Workplace Gaslighting Looks Like</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Here are common scenarios that reveal workplace gaslighting:
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Scenario 1: The Disappearing Instruction</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">What happened:</p>
                <p className="text-slate-700">Your boss told you to handle the Johnson account a specific way in a team meeting.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-red-600 font-semibold mb-1">What they say later:</p>
                <p className="text-slate-700 italic">&quot;I never said that. You are putting words in my mouth. If you had a problem with the direction, you should have spoken up then.&quot;</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Scenario 2: The Shifting Goalposts</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">What happened:</p>
                <p className="text-slate-700">You were told to complete a report by Friday. You completed it. Now your boss says it needed a different format and frames it as your failure to ask for clarification.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-red-600 font-semibold mb-1">What they say:</p>
                <p className="text-slate-700 italic">&quot;I assumed you knew the format. You should have asked more questions. This is why you need to be more proactive.&quot;</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Scenario 3: The Emotional Discount</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">What happened:</p>
                <p className="text-slate-700">You expressed concern about unrealistic deadlines and workload.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-red-600 font-semibold mb-1">What they say:</p>
                <p className="text-slate-700 italic">&quot;You are being too emotional. Everyone else handles this workload fine. Maybe this role is not the right fit for you.&quot;</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Workplace Gaslighting Is So Effective</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Gaslighting in the workplace is especially powerful because of the power dynamics at play. Your boss controls your paycheck, your career advancement, and your professional reputation. Challenging them feels risky. Additionally, workplace culture often reinforces the idea that you should not rock the boat or cause drama, which makes you more likely to internalize their version of events.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            The workplace also provides structural cover for gaslighting. Emails get lost. Meetings are not documented. Verbal instructions are common. This ambiguity makes it easy for a gaslighter to deny reality and claim you are misunderstanding things.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Document Workplace Gaslighting</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Documentation is your most powerful defense against workplace gaslighting. Here is how to build a solid record:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Follow Up Every Conversation in Writing</h3>
                  <p className="text-slate-700">After any verbal conversation, send an email summarizing what was discussed. Start with &quot;Just to confirm our conversation today, we agreed that...&quot; This creates a paper trail they cannot deny.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Keep a Personal Log</h3>
                  <p className="text-slate-700">Write down every incident as it happens. Include dates, times, what was said, who was present, and how it made you feel. Use a personal device or notebook, not company resources.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Save Everything</h3>
                  <p className="text-slate-700">Save emails, chat messages, and any written communication. Take screenshots. If your company uses project management tools, document task assignments and changes there.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Use Witnesses</h3>
                  <p className="text-slate-700">When possible, have a colleague present for important conversations. Or CC relevant team members on follow-up emails so there are multiple people who know what was agreed upon.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Escalate</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Escalate the situation when:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-3 mb-8 pl-4">
            <li>The gaslighting is affecting your performance reviews or career advancement</li>
            <li>You are experiencing anxiety, depression, or physical symptoms from the stress</li>
            <li>The behavior is discriminatory or creating a hostile work environment</li>
            <li>Documentation proves the pattern of manipulation</li>
            <li>Colleagues are experiencing the same behavior</li>
            <li>Your mental health is deteriorating</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Steps to Protect Yourself</h2>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <p className="text-slate-700"><strong className="text-slate-900">Trust yourself.</strong> If something feels wrong, it probably is. You are not crazy for noticing patterns that others might not see.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <p className="text-slate-700"><strong className="text-slate-900">Document relentlessly.</strong> Build your evidence file. Documentation protects you legally and helps you stay grounded in reality.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <p className="text-slate-700"><strong className="text-slate-900">Set boundaries.</strong> You do not have to accept every unreasonable demand. Use phrases like &quot;I want to make sure we are aligned on this, so I am sending a follow-up email.&quot;</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <p className="text-slate-700"><strong className="text-slate-900">Talk to HR.</strong> If HR is not complicit, they can be an ally. Bring your documentation. Be factual, not emotional.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">5</div>
              <p className="text-slate-700"><strong className="text-slate-900">Start your exit plan.</strong> If the environment is truly toxic, begin preparing for a move. Update your resume, network quietly, and save your documentation outside of company systems.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Recover Your Reality</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Workplace gaslighting chips away at your confidence and your sense of professional competence. You start second-guessing yourself, doubting your skills, and feeling like you are losing your mind. The reality is that you are experiencing manipulation, and recognizing it is the first step to protecting yourself.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 my-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Free Tools to Protect Yourself
            </h3>
            <div className="space-y-4">
              <Link
                href="/gaslighting-tracker"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-green-300 transition-colors group"
              >
                <Clipboard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">Gaslighting Tracker</p>
                  <p className="text-sm text-slate-500">Document incidents and build your evidence file</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/journal"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-green-300 transition-colors group">
                <BookOpen className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">Journal Tool</p>
                  <p className="text-sm text-slate-500">Record your experiences and protect your sanity</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/biff-assistant"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-green-300 transition-colors group"
              >
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">BIFF Assistant</p>
                  <p className="text-sm text-slate-500">Write brief, informative, friendly, and firm responses</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 mt-16">
            <h3 className="text-2xl font-bold mb-4">Protect Your Career and Your Mind</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              You deserve a workplace where your reality is respected. Our free tools help you document abuse, write effective responses, and plan your next steps with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Start Free Account
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:border-slate-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Read More Guides
              </Link>
            </div>
          </div>

          {/* Crisis Line */}
          <div className="mt-8 p-6 border border-slate-200 rounded-xl bg-slate-50">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">Need Immediate Support?</p>
                <p className="text-slate-600 text-sm">
                  If you are experiencing a mental health crisis related to workplace abuse, call or text 988 for the Suicide and Crisis Lifeline. You can also contact the Crisis Text Line by texting HOME to 741741.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </QuizShell>
  )
}
