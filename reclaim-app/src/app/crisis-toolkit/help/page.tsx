import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CrisisToolkitHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto pt-8 pb-16">
        <Link href="/crisis-toolkit" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Crisis Toolkit
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 border-b-3 border-indigo-600 pb-3 mb-6">Crisis Toolkit Guide</h1>
          <p className="text-lg font-semibold text-gray-800 mb-4">Quick support when you need it most.</p>
          <p className="text-gray-600 mb-6">Evidence-based grounding techniques for anxiety, depression, PTSD, social anxiety, and OCD.</p>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">What is the Crisis Toolkit?</h2>
          <p className="text-gray-600 mb-4">The Crisis Toolkit provides immediate access to clinically-validated coping strategies when you&apos;re experiencing distress. Each intervention follows a structured approach: assess safety, practice grounding skills, reinforce self-compassion, and remember that this moment will pass.</p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg my-6">
            <p className="text-sm text-amber-900"><strong>Key Insight:</strong> These techniques are based on Dialectical Behavior Therapy (DBT) and Cognitive Behavioral Therapy (CBT). They work by interrupting your body&apos;s stress response and bringing you back to the present moment.</p>
          </div>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">How to Use This Feature</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 ml-2">
            <li><strong>Access Quickly:</strong> Click the crisis button (bottom-right corner) from any page in the app.</li>
            <li><strong>Select Your Condition:</strong> Choose what you&apos;re experiencing right now.</li>
            <li><strong>Answer the Rule-Out:</strong> A safety check question to help you assess the situation.</li>
            <li><strong>Practice Skills:</strong> Try one or more grounding techniques. Timers guide you through timed exercises.</li>
            <li><strong>Read Your Affirmation:</strong> A personalized self-compassion statement based on your history.</li>
            <li><strong>Rate Helpfulness:</strong> Track what works for you to build your personal toolkit.</li>
          </ol>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">Available Interventions</h2>

          <div className="bg-gray-50 border-l-4 border-indigo-400 p-5 rounded-lg my-5">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">Anxiety</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-3 text-sm font-medium">
              <strong>Rule Out:</strong> Am I unsafe, or am I uncomfortable?
            </div>
            <p className="font-semibold mb-2">Skills:</p>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Cold Water Reset (30 seconds):</strong> Run cold water over your wrists. The temperature change activates your parasympathetic nervous system.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>4-6 Breathing (1 minute):</strong> Inhale for 4 counts, exhale for 6 counts. Longer exhales calm your nervous system.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>5-4-3 Grounding:</strong> Name 5 things you see, 4 things you hear, 3 things you can feel. Anchors you to the present.
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center italic text-lg border-2 border-purple-200 my-3">
              &ldquo;My anxiety is loud, not necessarily accurate. I am safe in this moment.&rdquo;
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center font-medium text-green-800">
              This wave will pass. It always does.
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-indigo-400 p-5 rounded-lg my-5">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">Depression</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-3 text-sm font-medium">
              <strong>Rule Out:</strong> Is this physical exhaustion, emotional exhaustion, or both?
            </div>
            <p className="font-semibold mb-2">Skills:</p>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Hydration Reset:</strong> Drink a full glass of cold water. Dehydration worsens mood and fatigue.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Sunlight Exposure (2 minutes):</strong> Step outside and face the sun. Light exposure boosts serotonin.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Micro Task:</strong> Complete one task under 3 minutes. Small wins build momentum.
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center italic text-lg border-2 border-purple-200 my-3">
              &ldquo;This is heavy. I&apos;m doing what I can with what I have and that is more than enough.&rdquo;
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center font-medium text-green-800">
              This feeling is temporary. I have survived this before, and will get myself through it again, stronger.
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-indigo-400 p-5 rounded-lg my-5">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">PTSD/Flashback</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-3 text-sm font-medium">
              <strong>Rule Out:</strong> Am I having a reaction to the past, or to a danger that is tangible in the present?
            </div>
            <p className="font-semibold mb-2">Skills:</p>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Color Grounding:</strong> Look around and name 3 colors in the room. Engages your visual cortex.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Physical Grounding:</strong> Press both feet firmly into the floor. Reconnects you to your body.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Present Moment Statement:</strong> Say out loud: &ldquo;Today is [date]. I am here.&rdquo; Orients you to now.
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center italic text-lg border-2 border-purple-200 my-3">
              &ldquo;My body is remembering something painful. I can hold that feeling while remembering that now, it doesn&apos;t mean I&apos;m unsafe.&rdquo;
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center font-medium text-green-800">
              This flashback will end. My body is learning safety again.
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-indigo-400 p-5 rounded-lg my-5">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">Social Anxiety</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-3 text-sm font-medium">
              <strong>Rule Out:</strong> Is this emotion a prediction, or an observable truth?
            </div>
            <p className="font-semibold mb-2">Skills:</p>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Voice Steadying (30 seconds):</strong> Slow your exhale to steady your voice before speaking.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Brief Eye Contact:</strong> Make eye contact for 1-2 seconds. You don&apos;t need to stare.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Light Conversation:</strong> Say one grounding sentence: &ldquo;How&apos;s your day going?&rdquo;
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Act Opposite:</strong> Do the opposite of what fear tells you. Show up anyway.
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center italic text-lg border-2 border-purple-200 my-3">
              &ldquo;Feeling nervous doesn&apos;t make me awkward. It makes me human.&rdquo;
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center font-medium text-green-800">
              Confidence comes from showing up and believing in my worth, not from being perfect.
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-indigo-400 p-5 rounded-lg my-5">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">OCD/Intrusive Thoughts</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mb-3 text-sm font-medium">
              <strong>Rule Out:</strong> Is this an intrusive thought, or a risk someone I trust would tell me to worry about?
            </div>
            <p className="font-semibold mb-2">Skills:</p>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Label the Thought (Interactive):</strong> Type your intrusive thought in the text box. Writing it down externalizes it and creates distance. The app will label it as &ldquo;sticky/intrusive thought&rdquo; for you.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Delay Compulsion (1 minute):</strong> Wait just 60 seconds before acting. Build tolerance gradually.
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-2 text-sm">
              <strong>Exposure Response:</strong> If OCD says do X, do the opposite. This breaks the cycle.
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center italic text-lg border-2 border-purple-200 my-3">
              &ldquo;My brain is sending a false alarm. I don&apos;t have to respond to it.&rdquo;
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center font-medium text-green-800">
              Every minute I delay the compulsion, I retrain my brain and body. This is how I build a life worth living.
            </div>
          </div>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">Key Features</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">Timers:</span> Guided timers for timed exercises (30s, 60s, 120s) help you stay focused.</li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">Guided Voice:</span> Listen to affirmations read aloud in a calming voice. Hands-free support during crisis.</li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">Thought Journaling:</span> For OCD, type intrusive thoughts to externalize them and create distance.</li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">AI Personalization:</span> Your affirmations adapt based on your history.</li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">Resilience Tracking:</span> See how many times you&apos;ve shown up for yourself. Build evidence of your strength.</li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">Effectiveness Ratings:</span> Track which techniques work best for you to build your personal toolkit.</li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold">Private &amp; Secure:</span> All your data is encrypted and only visible to you.</li>
          </ul>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">Tips for Success</h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li><strong>Use it early</strong> - Don&apos;t wait until you&apos;re at a 10/10. Practice when you&apos;re at a 5 or 6.</li>
            <li><strong>Try multiple skills</strong> - Different techniques work for different moments.</li>
            <li><strong>Be patient</strong> - Grounding takes practice. It&apos;s normal if it doesn&apos;t work perfectly the first time.</li>
            <li><strong>Track what works</strong> - Rate each session so you learn your most effective techniques.</li>
            <li><strong>No judgment</strong> - Using the toolkit is a sign of strength, not weakness.</li>
            <li><strong>Combine with other tools</strong> - Use alongside therapy, medication, or other support.</li>
          </ul>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg my-6">
            <p className="text-sm text-amber-900"><strong>Remember:</strong> These techniques interrupt your body&apos;s stress response. They&apos;re not about &ldquo;thinking positive&rdquo; &mdash; they&apos;re about regulating your nervous system. That&apos;s why they work.</p>
          </div>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">When to Seek Additional Help</h2>
          <p className="text-gray-600 mb-3">The Crisis Toolkit is a powerful tool, but it&apos;s not a replacement for professional help. Reach out immediately if:</p>
          <ul className="space-y-1 text-gray-600 list-disc list-inside mb-4">
            <li>You&apos;re having thoughts of self-harm or suicide</li>
            <li>You feel unsafe or in danger</li>
            <li>Symptoms are interfering with daily functioning</li>
            <li>You&apos;re experiencing a mental health emergency</li>
          </ul>
          <p className="font-semibold text-gray-800 mb-2">Crisis Resources:</p>
          <ul className="space-y-1 text-gray-600 list-disc list-inside">
            <li><strong>988 Suicide &amp; Crisis Lifeline:</strong> Call or text 988</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
            <li><strong>Emergency:</strong> Call 911 or go to your nearest ER</li>
          </ul>

          <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-4 border-b-2 border-purple-200 pb-2">The Science Behind It</h2>
          <p className="text-gray-600 mb-3">These interventions are based on:</p>
          <ul className="space-y-1 text-gray-600 list-disc list-inside">
            <li><strong>DBT (Dialectical Behavior Therapy):</strong> Distress tolerance and emotion regulation skills</li>
            <li><strong>CBT (Cognitive Behavioral Therapy):</strong> Thought challenging and behavioral activation</li>
            <li><strong>Trauma-Informed Care:</strong> Safety-first approach and grounding techniques</li>
            <li><strong>Polyvagal Theory:</strong> Nervous system regulation through physical interventions</li>
          </ul>

          <p className="text-center mt-10 text-indigo-600 font-bold text-lg">
            You&apos;ve got this. You&apos;re stronger than you know.
          </p>
        </div>
      </div>
    </div>
  )
}