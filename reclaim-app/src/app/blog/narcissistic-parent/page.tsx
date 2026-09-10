import Link from "next/link"
import { Metadata } from "next"
import { ArrowLeft, Clock, User, BookOpen, ExternalLink, Heart, Star, Phone } from "lucide-react"
import QuizShell from "@/components/marketing/QuizShell"

export const metadata: Metadata = {
  title: "Signs You Have a Narcissistic Parent",
  description: "Growing up with a narcissistic parent leaves lasting wounds. Recognize the signs and start your healing journey.",
  alternates: {
    canonical: "https://reclaimyourlife.app/blog/narcissistic-parent",
  },
  openGraph: {
    title: "Signs You Have a Narcissistic Parent",
    description: "Growing up with a narcissistic parent leaves lasting wounds. Recognize the signs and start your healing journey.",
    type: "article",
    url: "https://reclaimyourlife.app/blog/narcissistic-parent",
  },
}

export default function NarcissisticParentPage() {
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
          <span className="text-slate-700">Narcissistic Parent</span>
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
              <span>12 min read</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Signs You Have a Narcissistic Parent
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Growing up with a narcissistic parent leaves lasting wounds. Recognize the signs and start your healing journey.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Family</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Childhood</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Healing</span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            You have always felt something was off in your family, but you could never quite put your finger on it. Maybe your parent was the center of attention at every gathering. Maybe you were expected to manage their emotions while yours were ignored. If you grew up walking on eggshells around a parent, you may be dealing with something more than just a difficult personality.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What Is Narcissistic Parenting?</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Narcissistic parenting is when a parent has narcissistic traits that fundamentally distort their relationship with their child. Instead of meeting the child&apos;s needs, the narcissistic parent uses the child to meet their own needs. The child becomes a mirror, an extension, or a tool rather than a person with their own feelings and desires.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            This does not mean the parent never shows affection. Many narcissistic parents alternate between idealization and devaluation, showering the child with praise one moment and withdrawing love the next. This creates a deeply confusing attachment where the child is always chasing the parent&apos;s approval.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">10 Signs You Have a Narcissistic Parent</h2>

          <div className="space-y-6 mb-10">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                They Make Everything About Them
              </h3>
              <p className="text-slate-700">No matter what is happening in your life, the conversation always circles back to them. You got a promotion? They talk about their own career. You are upset? They are more upset. Your achievements are only acknowledged if they reflect well on them.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                They Withhold Love as Punishment
              </h3>
              <p className="text-slate-700">When you do something they disapprove of, they do not just correct the behavior. They withdraw affection, give you the silent treatment, or make you feel unworthy of their love. You learned early that love was conditional on performance.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                They Envy Your Success
              </h3>
              <p className="text-slate-700">A healthy parent celebrates their child&apos;s achievements. A narcissistic parent feels threatened by them. They may belittle your accomplishments, change the subject, or somehow make your success about their own sacrifice.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                They Parentify You
              </h3>
              <p className="text-slate-700">Instead of being the caregiver, they made you take care of them. You were the emotional confidant, the mediator between parents, or the one who had to keep them from falling apart. You lost your childhood because you were too busy managing theirs.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                They Gaslight You
              </h3>
              <p className="text-slate-700">They deny things that happened, rewrite history, and make you question your own memory. &quot;I never said that.&quot; &quot;That never happened.&quot; &quot;You are too sensitive.&quot; You grew up not trusting your own perceptions.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                They Use Guilt to Control You
              </h3>
              <p className="text-slate-700">They remind you of everything they sacrificed for you. They say things like &quot;After everything I have done for you&quot; or &quot;I guess I am just a terrible parent.&quot; You feel guilty for having your own needs or setting boundaries.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
                They Have No Boundaries
              </h3>
              <p className="text-slate-700">They read your diary, go through your things, share your private information with others, or show up uninvited. They believe they are entitled to access every part of your life because you are &quot;theirs.&quot;</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">8</span>
                They Play Favorites
              </h3>
              <p className="text-slate-700">If you have siblings, you know the golden child and scapegoat dynamic. One child can do no wrong while another can do no right. The roles may even shift depending on who is most useful to the parent at the moment.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">9</span>
                They Weaponize Your Emotions
              </h3>
              <p className="text-slate-700">When you cry, they mock you or tell you to stop being dramatic. When you are angry, they call you unstable. You learn that having emotions is dangerous and you must suppress them to stay safe.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">10</span>
                They Take No Responsibility
              </h3>
              <p className="text-slate-700">Nothing is ever their fault. They blame you, the other parent, society, or circumstances. They never apologize genuinely. If they do apologize, it is followed by &quot;but&quot; which negates everything.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Impact on Adult Children</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Growing up with a narcissistic parent shapes how you see yourself and the world. Common symptoms in adulthood include:
          </p>
          <ul className="list-disc list-inside text-slate-700 space-y-3 mb-8 pl-4">
            <li>Chronic people-pleasing and difficulty saying no</li>
            <li>Deep-seated shame and feeling like you are never good enough</li>
            <li>Difficulty trusting others and forming healthy relationships</li>
            <li>Perfectionism and fear of making mistakes</li>
            <li>Codependency and attracting narcissistic partners</li>
            <li>Emotional dysregulation and difficulty identifying your feelings</li>
            <li>Guilt when you put yourself first</li>
            <li>A persistent inner critic that sounds like your parent&apos;s voice</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Healing From a Narcissistic Parent</h2>
          <p className="text-slate-700 leading-relaxed mb-6">
            Healing is possible, but it requires acknowledging the truth of what happened. You are not responsible for your parent&apos;s behavior. You were a child. You deserved unconditional love and you did not get it. That was never your fault.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <p className="text-slate-700"><strong className="text-slate-900">Get honest assessment.</strong> Take our free narcissist test to understand the patterns you grew up with. Awareness is the first step to change.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <p className="text-slate-700"><strong className="text-slate-900">Reframe your beliefs.</strong> The beliefs you internalized as a child, that you are not enough, that you must earn love, are not facts. They are programming that can be rewritten.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <p className="text-slate-700"><strong className="text-slate-900">Set boundaries.</strong> You have the right to protect yourself, even from family. Boundaries are not selfish. They are necessary for your wellbeing.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <p className="text-slate-700"><strong className="text-slate-900">Find your community.</strong> Connect with other adult children of narcissists. You are not alone, and there is profound healing in realizing your experience was real.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 my-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              Free Tools for Your Healing Journey
            </h3>
            <div className="space-y-4">
              <Link
                href="/free-narcissist-test"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors group"
              >
                <Heart className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Free Narcissist Test</p>
                  <p className="text-sm text-slate-500">Assess narcissistic patterns in your relationships</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/belief-reframe"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors group"
              >
                <BookOpen className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Belief Reframe Tool</p>
                  <p className="text-sm text-slate-500">Rewrite the toxic beliefs instilled in childhood</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
              <Link
                href="/healing"
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors group"
              >
                <Star className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Healing Program</p>
                  <p className="text-sm text-slate-500">A structured path to recovery from narcissistic abuse</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 mt-16">
            <h3 className="text-2xl font-bold mb-4">Your Healing Starts Here</h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              You survived a childhood that was not your fault. Now you have the chance to build a life that is truly yours. Our free tools help you understand what happened and take the first steps toward wholeness.
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
                  If you are in crisis, please call or text 988 for the Suicide and Crisis Lifeline. For the National Domestic Violence Hotline, call{" "}
                  <a href="tel:18007997233" className="text-blue-600 font-semibold hover:underline">1-800-799-7233</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </QuizShell>
  )
}
