import Link from 'next/link'
import { Metadata } from 'next'
import { Shield, FileText, ChevronRight, ArrowLeft, ArrowRight, AlertTriangle, BookOpen, Heart, CheckCircle, Clock } from 'lucide-react'
import QuizShell from '@/components/marketing/QuizShell'

export const metadata: Metadata = {
  title: 'How to Leave a Narcissist Safely',
  description:
    'A step-by-step guide to leaving a narcissistic relationship safely. Safety planning, no contact, and recovery resources.',
  alternates: {
    canonical: '/learn-more/leaving',
  },
}

export default function LeavingPage() {
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
        <span className="text-gray-800 font-medium">Leaving Safely</span>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Safety Planning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            How to Leave a Narcissist Safely
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Leaving a narcissistic relationship is one of the most dangerous times. The narcissist feels their
            control slipping, and they may escalate their behavior. A safety plan is not optional. It is essential
            for protecting yourself and your children during this transition.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Before You Leave: Safety Planning</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Do not announce your departure. Telling a narcissist you are leaving gives them time to retaliate,
              manipulate, or try to cut off your resources. The safest approach is to plan quietly and execute
              when you have everything in place.
            </p>
            <p>
              A safety plan involves much more than packing a bag. You need to think about finances, documents,
              housing, children, legal protection, and emotional support. The more thoroughly you plan, the safer
              your exit will be.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Safety Plan</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Secure Important Documents',
                desc: 'Gather passports, birth certificates, Social Security cards, financial records, medical records, and any legal documents. Make copies and store them somewhere the narcissist cannot access, such as a trusted friend\'s house, a safety deposit box, or a secure cloud account.',
                icon: FileText,
              },
              {
                step: 2,
                title: 'Build Financial Independence',
                desc: 'Open a separate bank account in your name only. Start saving money quietly. If you have access to joint accounts, understand the balance and recent transactions. Gather credit card statements and financial records. If you are financially controlled, reach out to local domestic violence organizations for help.',
                icon: Shield,
              },
              {
                step: 3,
                title: 'Secure a Safe Place to Stay',
                desc: 'Identify where you will go when you leave. This could be a friend\'s house, a family member\'s home, or a domestic violence shelter. Make sure the narcissist does not know this location. If you are staying in the marital home, consider whether it is safe to do so and what legal options you have.',
                icon: Heart,
              },
              {
                step: 4,
                title: 'Document Everything',
                desc: 'Before you leave, create a complete record of the abuse. Save text messages, emails, voicemails, and social media messages. Write down incidents with dates, times, and details. This documentation will be critical in any custody or legal proceedings.',
                icon: BookOpen,
              },
              {
                step: 5,
                title: 'Build a Support Network',
                desc: 'Tell trusted friends and family what is happening. Connect with a therapist who understands narcissistic abuse. Reach out to domestic violence hotlines and local organizations. You need people who believe you and can support you during and after the transition.',
                icon: Heart,
              },
              {
                step: 6,
                title: 'Create a Go-Bag',
                desc: 'Prepare a bag with essentials that you can grab quickly: medications, phone charger, cash, copies of important documents, a change of clothes, and anything else you need for the first few days. Keep it somewhere accessible but hidden.',
                icon: Shield,
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-teal-700 font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The No Contact Rule</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Once you leave, the single most important thing you can do for your recovery is go no contact. This
              means no phone calls, no text messages, no emails, no social media interaction, and no in-person meetings
              unless absolutely necessary and supervised.
            </p>
            <p>
              No contact is not about punishment. It is about survival. Every interaction with a narcissist is an
              opportunity for them to manipulate, guilt-trip, or re-engage you. They will use every tool at their
              disposal: love bombing, threats, pity, anger, and promises to change. None of it is real. It is all
              a strategy to pull you back.
            </p>
            <p>
              If you share children and cannot go fully no contact, use parallel parenting with strict boundaries.
              All communication goes through written channels. Keep it brief, factual, and focused only on logistics.
              Never engage in emotional or personal conversations.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Grey Rock During the Transition</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              If you are still living with the narcissist while you prepare to leave, the grey rock method is your
              best defense. Become as boring and uninteresting as a grey rock. Do not react to provocations. Do not
              share your plans or feelings. Give them nothing to work with.
            </p>
            <p>
              Respond to questions with short, factual answers. Do not argue. Do not explain yourself. Do not show
              emotion. The narcissist feeds on emotional reactions. When you stop providing them, they lose interest
              and look elsewhere for supply.
            </p>
            <p>
              This is not forever. It is a temporary strategy to keep you safe while you make your exit. Once you
              are out and have established no contact, you will no longer need to perform this emotional survival
              technique.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Preparation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Know Your Financial Picture',
                desc: 'Gather statements for all bank accounts, credit cards, retirement accounts, and investments. Understand the full financial picture before you leave.',
              },
              {
                title: 'Protect Your Credit',
                desc: 'Check your credit report. If you have joint accounts, understand your liability. Consider freezing your credit to prevent the narcissist from opening accounts in your name.',
              },
              {
                title: 'Document Joint Assets',
                desc: 'Photograph and list all valuable items in the home. This documentation can be important in divorce proceedings.',
              },
              {
                title: 'Seek Legal Advice',
                desc: 'Consult with a family law attorney before you leave if possible. Many offer free initial consultations. Understand your rights regarding property, custody, and support.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-amber-50 border border-amber-100 rounded-lg p-5">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recovery Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/safety-plan"
              className="group block bg-red-50 border border-red-100 rounded-xl p-5 hover:shadow-md transition-all text-center"
            >
              <Shield className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-1">
                Safety Plan
              </h3>
              <p className="text-gray-600 text-sm">
                Create a personalized safety plan tailored to your specific situation.
              </p>
              <span className="inline-flex items-center gap-1 text-red-700 font-medium text-sm mt-2">
                Create Plan <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              href="/no-contact-anchor"
              className="group block bg-teal-50 border border-teal-100 rounded-xl p-5 hover:shadow-md transition-all text-center"
            >
              <Clock className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors mb-1">
                No Contact Anchor
              </h3>
              <p className="text-gray-600 text-sm">
                A tool to help you maintain no contact when the urge to reach out feels overwhelming.
              </p>
              <span className="inline-flex items-center gap-1 text-teal-700 font-medium text-sm mt-2">
                Try It Free <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              href="/crisis-reframe"
              className="group block bg-blue-50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition-all text-center"
            >
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                Crisis Reframe
              </h3>
              <p className="text-gray-600 text-sm">
                When emotions feel overwhelming, this tool helps you reframe the situation and find clarity.
              </p>
              <span className="inline-flex items-center gap-1 text-blue-700 font-medium text-sm mt-2">
                Try It Free <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Expect After Leaving</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Leaving is not the end of the journey. It is the beginning of recovery. The narcissist may try to
              hoover you back in with grand gestures, apologies, or threats. They may use mutual friends, family
              members, or even your children as intermediaries. Stay firm. Every time you break no contact, you
              reset your recovery.
            </p>
            <p>
              You may feel grief, guilt, confusion, and relief all at the same time. These feelings are normal.
              Recovery is not linear. Some days you will feel strong and free. Other days you will question your
              decision. This is part of the healing process. Be patient with yourself.
            </p>
            <p>
              Surround yourself with people who understand what you have been through. Join support groups for
              survivors of narcissistic abuse. Work with a therapist who specializes in this type of trauma. The
              more support you have, the faster and more completely you will heal.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">You Deserve to Be Free</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">
            Leaving a narcissist takes courage. The fact that you are here, reading this, planning your exit, shows
            strength you may not even recognize in yourself right now. You are not crazy. You are not weak. You are
            taking the hardest step of your life, and you are not alone.
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
            href="/learn-more/evidence"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Documenting Emotional Abuse
          </Link>
          <Link
            href="/learn-more"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            Back to Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </article>
    </QuizShell>
  )
}
