import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Clock, User, BookOpen, ExternalLink, Shield, Eye, Phone } from "lucide-react"
import QuizShell from "@/components/marketing/QuizShell"

export const metadata: Metadata = {
  title: "What Is DARVO? The Narcissist's Favorite Trick",
  description: "DARVO stands for Deny, Attack, Reverse Victim and Offender. Learn how narcissists use this tactic and how to defend against it.",
  alternates: {
    canonical: "https://www.reclaim.app/blog/darvo",
  },
  openGraph: {
    title: "What Is DARVO? The Narcissist's Favorite Trick",
    description: "DARVO stands for Deny, Attack, Reverse Victim and Offender. Learn how narcissists use this tactic and how to defend against it.",
    type: "article",
    url: "https://www.reclaim.app/blog/darvo",
  },
}

export default function DarvoPage() {
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
          <span className="text-slate-700">DARVO</span>
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
              <span>9 min read</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            What Is DARVO? The Narcissist&apos;s Favorite Trick
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            DARVO stands for Deny, Attack, Reverse Victim and Offender. Learn how narcissists use this tactic and how to defend against it.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">DARVO</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Manipulation</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Defense</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            You confront your partner about something hurtful they did. Instead of acknowledging it, they fly into a rage, accuse you of being the real problem, and suddenly you find yourself apologizing. If this sounds familiar, you have experienced DARVO, one of the most disorienting manipulation tactics narcissists use.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Does DARVO Stand For?</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            DARVO is an acronym coined by Dr. Jennifer Freyd, a psychologist who studied how perpetrators of abuse avoid accountability. It stands for:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">D</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Deny</h3>
                  <p className="text-slate-700">The abuser flatly denies the behavior happened. They say it did not occur, that you are misremembering, or that you are imagining things.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">A</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Attack</h3>
                  <p className="text-slate-700">Once denial is not working, the abuser attacks the person confronting them. They question your credibility, sanity, or motives.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">R</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Reverse Victim</h3>
                  <p className="text-slate-700">The abuser reframes the situation so they become the victim. They claim you are abusing them by confronting them.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">VO</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Offender</h3>
                  <p className="text-slate-700">The abuser reframes you as the offender. You become the villain for bringing it up in the first place.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How DARVO Works in Real Life</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Let us look at a realistic scenario to see how DARVO plays out:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Example: Confronting About Lying</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">You:</p>
                <p className="text-slate-700 italic">&quot;I found out you lied to me about where you were last night.&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-red-600 font-semibold mb-1">Step 1 - Deny:</p>
                <p className="text-slate-700 italic">&quot;I never said that. You are twisting my words. That is not what happened at all.&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-orange-600 font-semibold mb-1">Step 2 - Attack:</p>
                <p className="text-slate-700 italic">&quot;The real issue here is that you go through my phone. That is invasion of privacy. You are obsessed with controlling me.&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-purple-600 font-semibold mb-1">Step 3 - Reverse Victim and Offender:</p>
                <p className="text-slate-700 italic">&quot;I cannot believe you would accuse me of something like this. You are emotionally abusive. You are the one hurting me right now.&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 font-semibold mb-1">Result:</p>
                <p className="text-slate-700 italic">You end up apologizing for going through their phone and forget about the original issue entirely.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why DARVO Is So Effective</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            DARVO works because it exploits several psychological vulnerabilities. First, it creates cognitive overload. When someone attacks you suddenly, your brain goes into fight-or-flight mode, making it hard to think clearly. Second, it triggers shame. Being accused of being the abuser is terrifying for most people, so they back down immediately to avoid being seen as the bad guy.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Third, DARVO uses projection. The abuser projects their own behavior onto you, making you question your own perception. This is closely related to gaslighting, and the two tactics often work together to make you doubt your reality.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Recognize DARVO</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            The key to defending against DARVO is recognizing it as it happens. Here are the red flags:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-3 mb-8 pl-4">
            <li>The person denies something you have evidence of</li>
            <li>They immediately shift the conversation to your behavior</li>
            <li>They accuse you of the exact thing they did</li>
            <li>They claim to be the real victim in the situation</li>
            <li>You find yourself apologizing when you brought up a legitimate concern</li>
            <li>They use your emotional reaction against you as proof you are unstable</li>
            <li>The original issue is never resolved or even discussed</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Counter DARVO</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Defending against DARVO requires staying calm and anchored to the truth. Here are strategies that help:
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <p className="text-slate-700"><strong className="text-slate-900">Document the facts.</strong> Write down what happened before you bring it up. DARVO relies on making you doubt your memory. Having documentation keeps you grounded.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <p className="text-slate-700"><strong className="text-slate-900">Do not take the bait.</strong> When they attack, do not defend yourself against their accusations. Stay focused on the original issue. Say, &quot;I am not discussing that right now. We are talking about what you did.&quot;</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <p className="text-slate-700"><strong className="text-slate-900">Name the tactic.</strong> Say, &quot;This is DARVO. You are denying what happened, attacking me, and reversing who is the victim here.&quot; Naming it removes much of its power.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <p className="text-slate-700"><strong className="text-slate-900">Set a boundary.</strong> Say, &quot;I will not continue this conversation if you keep turning it around on me. We can talk when you are ready to address what I brought up.&quot;</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">You Are Not the Problem</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            DARVO is designed to make you feel like you are crazy for bringing up legitimate concerns. You are not crazy. You are not abusive for having boundaries. You are not wrong for expecting honesty. The fact that you are reading this means you are already seeing through the manipulation.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-8 my-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Free Tools to Defend Against Manipulation
            </h3>
            <div className="space-y-4">
              <Link
                href="/narcissist-detector"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors group"
              >
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">Narcissist Detector</p>
                  <p className="text-sm text-slate-500">Identify narcissistic patterns in your relationships</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/manipulation-decoder"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors group"
              >
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">Manipulation Decoder</p>
                  <p className="text-sm text-slate-500">Decode what they are really saying behind their words</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 mt-16">
            <h3 className="text-2xl font-bold mb-4">See the Manipulation for What It Is</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              The more you understand tactics like DARVO, the less power they have over you. Our free tools help you recognize manipulation patterns and respond with clarity.
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
