import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Clock, User, BookOpen, ExternalLink, Heart, Zap, Phone } from "lucide-react"
import QuizShell from "@/components/marketing/QuizShell"

export const metadata: Metadata = {
  title: "Trauma Bonding: Why You Can Not Leave (And How to Break Free)",
  description: "Trauma bonding keeps you attached to your abuser. Understand the science, recognize the signs, and start breaking free.",
  alternates: {
    canonical: "https://reclaimyourlife.app/blog/trauma-bonding",
  },
  openGraph: {
    title: "Trauma Bonding: Why You Can Not Leave (And How to Break Free)",
    description: "Trauma bonding keeps you attached to your abuser. Understand the science, recognize the signs, and start breaking free.",
    type: "article",
    url: "https://reclaimyourlife.app/blog/trauma-bonding",
  },
}

export default function TraumaBondingPage() {
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
          <span className="text-slate-700">Trauma Bonding</span>
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
              <span>11 min read</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Trauma Bonding: Why You Can Not Leave (And How to Break Free)
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Trauma bonding keeps you attached to your abuser. Understand the science, recognize the signs, and start breaking free.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Trauma Bonding</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Recovery</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Understanding</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            You know the relationship is toxic. You have told yourself a hundred times that you will leave. And yet, when the moment comes, you cannot do it. You stay. You go back. You find yourself making excuses for their behavior, even when you know better. If this sounds familiar, you may be experiencing one of the most powerful psychological forces in abusive relationships: trauma bonding.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is Trauma Bonding?</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Trauma bonding is a strong emotional attachment that forms between a victim and their abuser. It is not love. It is not loyalty. It is a survival response hardwired into your brain by repeated cycles of abuse and intermittent reinforcement. This bond is so powerful that it can keep people in dangerous relationships for years or even decades.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            The term was coined by psychologist Patrick Carnes, who studied how cycles of abuse create powerful emotional connections that feel like love but are actually rooted in fear, confusion, and biological responses to trauma.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Science Behind Trauma Bonding</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            To understand why trauma bonds are so hard to break, you need to understand intermittent reinforcement. This is a psychological principle where rewards are given at unpredictable intervals. In abusive relationships, the good moments become unpredictable. You never know when kindness is coming, so you stay hypervigilant and hopeful.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Research shows that unpredictable rewards create stronger behavioral patterns than predictable ones. This is the same principle that makes gambling addictive. The abuser alternates between cruelty and affection, and your brain becomes hooked on the anticipation of the next good moment. The cycle creates an emotional rollercoaster that is chemically identical to addiction.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            When the abuser is kind, your brain floods with dopamine and oxytocin, the bonding chemicals. When they are cruel, your brain releases cortisol and adrenaline, putting you in survival mode. This cycle of stress and relief creates a dependency that mimics substance addiction.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Cycle of Abuse</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Tension Building</h3>
                  <p className="text-slate-700">Walking on eggshells. The abuser becomes irritable and you feel anxious, trying desperately to prevent the next explosion.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Explosion</h3>
                  <p className="text-slate-700">The abuse happens. It could be verbal, emotional, physical, or sexual. You feel devastated, confused, and powerless.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Reconciliation</h3>
                  <p className="text-slate-700">The abuser apologizes, cries, promises to change. They may buy gifts or become the person you fell in love with. This is the most addictive phase.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Calm</h3>
                  <p className="text-slate-700">Things settle down. The abuser is loving and attentive. You feel relieved and hopeful. This phase reinforces the belief that things will get better.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Signs You Are Trauma Bonded</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Recognizing a trauma bond is the first step toward breaking free. Here are the most common signs:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-3 mb-8 pl-4">
            <li>You make excuses for their behavior to yourself and others</li>
            <li>You feel like you cannot leave even though you know you should</li>
            <li>You keep hoping they will change</li>
            <li>You feel physically ill when you think about leaving</li>
            <li>You minimize the abuse or tell yourself it is not that bad</li>
            <li>You feel addicted to the good moments</li>
            <li>You defend the abuser when others express concern</li>
            <li>You have lost your sense of self and identity</li>
            <li>You feel responsible for their emotions and behavior</li>
            <li>You stay because of the children, finances, or fear</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Break a Trauma Bond</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Breaking a trauma bond is one of the hardest things you will ever do. It requires courage, support, and a plan. Here is how to start:
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <p className="text-slate-700"><strong className="text-slate-900">Name it for what it is.</strong> Once you recognize the trauma bond, it loses some of its power. You are not in love. You are in a cycle of addiction.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <p className="text-slate-700"><strong className="text-slate-900">Build a support network.</strong> Tell trusted friends, family, or a therapist what is happening. Isolation is a key tool of abusers.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <p className="text-slate-700"><strong className="text-slate-900">Document everything.</strong> Keep a record of the abuse. When you are tempted to go back, read it and remind yourself of the truth.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <p className="text-slate-700"><strong className="text-slate-900">Create distance.</strong> Go no-contact if possible. If not, use the grey rock method to make yourself uninteresting.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">5</div>
              <p className="text-slate-700"><strong className="text-slate-900">Reframe your beliefs.</strong> Challenge the lies you have internalized. You are not worthless. You do not need them to survive.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Start Your Healing Journey</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Breaking free from a trauma bond is not a single event. It is a process. There will be setbacks. You may go back. You may miss them. That does not make you weak. It makes you human. The important thing is that you keep moving forward, one day at a time.
          </p>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 my-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Free Tools to Help You Break Free
            </h3>
            <div className="space-y-4">
              <Link
                href="/hope-reframe"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors group"
              >
                <Zap className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Hope Reframe Tool</p>
                  <p className="text-sm text-slate-500">Rewrite the negative beliefs keeping you stuck</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/crisis-reframe"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors group"
              >
                <BookOpen className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">Crisis Reframe Tool</p>
                  <p className="text-sm text-slate-500">Get clarity during moments of panic and confusion</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 mt-16">
            <h3 className="text-2xl font-bold mb-4">You Deserve Better</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Healing from trauma bonding takes time, but you do not have to do it alone. Our free tools help you understand what happened, rebuild your sense of self, and take the next step.
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
                <p className="font-semibold text-slate-900 mb-1">Need Immediate Help?</p>
                <p className="text-slate-600 text-sm">
                  If you are in danger, please call 911. For the National Domestic Violence Hotline, call{" "}
                  <a href="tel:18007997233" className="text-blue-600 font-semibold hover:underline">1-800-799-7233</a>{" "}
                  or text START to 88788.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </QuizShell>
  )
}
