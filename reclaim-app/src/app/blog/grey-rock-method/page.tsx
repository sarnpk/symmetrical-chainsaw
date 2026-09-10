import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Clock, User, BookOpen, ExternalLink, Shield, Zap, Phone } from "lucide-react"
import QuizShell from "@/components/marketing/QuizShell"

export const metadata: Metadata = {
  title: "Grey Rock Method: Complete Guide to Dealing with a Narcissist",
  description: "The grey rock method makes you boring to narcissists. Learn the technique, see examples, and practice with our free simulator.",
  alternates: {
    canonical: "https://reclaimyourlife.app/blog/grey-rock-method",
  },
  openGraph: {
    title: "Grey Rock Method: Complete Guide to Dealing with a Narcissist",
    description: "The grey rock method makes you boring to narcissists. Learn the technique, see examples, and practice with our free simulator.",
    type: "article",
    url: "https://reclaimyourlife.app/blog/grey-rock-method",
  },
}

export default function GreyRockMethodPage() {
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
          <span className="text-slate-700">Grey Rock Method</span>
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
            Grey Rock Method: Complete Guide to Dealing with a Narcissist
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            The grey rock method makes you boring to narcissists. Learn the technique, see examples, and practice with our free simulator.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Narcissism</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Survival</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Techniques</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            If you are dealing with a narcissist, you have probably noticed that logic and reason do not work. Arguments go in circles, apologies are weaponized, and no matter what you say, the conversation always ends with you feeling confused and drained. The grey rock method is different. It is a communication technique that strips away the emotional reaction narcissists feed on, making you as uninteresting as a grey rock.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is the Grey Rock Method?</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            The grey rock method is a strategy designed for people who must interact with a narcissist or manipulator but cannot go no-contact. The core idea is simple: become as boring and unresponsive as a grey rock. When you stop providing emotional reactions, narcissists lose interest and move on to easier targets.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            This technique was popularized by therapist Shawn Meghan Burns, who recognized that narcissists thrive on emotional responses. They want to provoke anger, sadness, fear, or even joy because it gives them a sense of control and power. By denying them this supply, you take back control of the dynamic.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Does Grey Rock Work?</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Narcissists operate on what psychologists call narcissistic supply. This is the attention, admiration, emotional reactions, and energy they extract from others. Without it, their fragile sense of self begins to crumble. The grey rock method works because it systematically cuts off this supply.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            When you react emotionally, whether with rage, tears, or passionate defense, you are giving the narcissist exactly what they want. You are confirming that they matter enough to provoke a response. When you give nothing, they are forced to confront the emptiness of the interaction, and they will eventually seek stimulation elsewhere.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step-by-Step Guide to Grey Rocking</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Control Your Body Language</h3>
                  <p className="text-slate-700">Keep your facial expressions neutral. Do not roll your eyes, clench your jaw, or show frustration. Your face should be as blank as possible.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Use Boring Responses</h3>
                  <p className="text-slate-700">Give short, factual answers. No opinions, no stories, no emotions. Think of yourself as a customer service robot reading from a script.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Do Not Take the Bait</h3>
                  <p className="text-slate-700">Narcissists will escalate to provoke a reaction. They may insult you, bring up sensitive topics, or make outrageous claims. Stay calm and do not engage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Limit Contact Time</h3>
                  <p className="text-slate-700">Keep interactions as brief as possible. Have an exit strategy ready. Say you have an appointment or need to make a call.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Do Not Explain Yourself</h3>
                  <p className="text-slate-700">Narcissists love to demand explanations so they can dismantle your reasoning. You do not owe anyone an explanation for your boundaries.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Examples of Grey Rock Responses</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Here are practical examples of how to respond in common scenarios:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Scenario: Narcissist Provokes You About Your Appearance</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Narcissist:</p>
                <p className="text-slate-700 italic">&quot;You really let yourself go. Nobody else would put up with you.&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Grey Rock Response:</p>
                <p className="text-slate-700">&quot;Okay.&quot;</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Scenario: Narcissist Demands to Know Where You Were</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Narcissist:</p>
                <p className="text-slate-700 italic">&quot;Where were you? Who were you with? Why did you not answer my calls?&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Grey Rock Response:</p>
                <p className="text-slate-700">&quot;I was out. I am back now.&quot;</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Scenario: Narcissist Tries to Start an Argument</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Narcissist:</p>
                <p className="text-slate-700 italic">&quot;You never do anything right. You are just like your mother.&quot;</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Grey Rock Response:</p>
                <p className="text-slate-700">&quot;I hear you. I am going to finish my work now.&quot;</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">When to Use the Grey Rock Method</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            The grey rock method is ideal when you cannot go no-contact. This includes co-parenting situations, workplace dynamics, or when the narcissist is a family member you are not ready to cut off. It is also useful during the transition period while you are planning your exit from the relationship.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Grey rocking is not about suppressing your emotions or pretending everything is fine. It is a temporary survival strategy. Your real emotions matter and deserve to be felt and processed, but with the right people and in safe spaces.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Practice With Our Free Narcissist Simulator</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Knowing the grey rock technique and actually using it under pressure are two very different things. Our free narcissist simulator lets you practice grey rocking in a safe environment. You will face realistic scenarios and get feedback on your responses, building the muscle memory you need for real-life interactions.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 my-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Free Tools to Help You Grey Rock
            </h3>
            <div className="space-y-4">
              <Link
                href="/narcissist-simulator"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors group"
              >
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Narcissist Simulator</p>
                  <p className="text-sm text-slate-500">Practice grey rocking with realistic scenarios</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/grey-rock-templates"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors group"
              >
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Grey Rock Templates</p>
                  <p className="text-sm text-slate-500">Copy-paste responses for every situation</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Important Reminders</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Grey rocking requires practice. The first few times you try it, the narcissist will notice something is different and may escalate. Stay strong. This is normal and temporary. They are testing whether you will break. If you hold firm, they will eventually adjust their behavior or move on.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Remember, grey rocking is a tool, not a permanent lifestyle. It protects you while you build your exit plan, strengthen your boundaries, and develop a support network. You deserve relationships where you can be fully yourself, not one where you must shrink to survive.
          </p>

          {/* Final CTA */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 mt-16">
            <h3 className="text-2xl font-bold mb-4">Ready to Reclaim Your Life?</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              You do not have to navigate this alone. Our free tools help you recognize abuse, build coping strategies, and take the first steps toward healing.
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
