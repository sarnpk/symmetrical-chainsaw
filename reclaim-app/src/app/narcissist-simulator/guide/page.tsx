'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NarcissistSimulatorGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/narcissist-simulator"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Simulator
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Custom Context Guide â€” Narcissist Simulator
        </h1>

        <article className="prose prose-gray max-w-none">
          <h2>What is Custom Context?</h2>
          <p>
            Custom Context allows you to paste your <strong>actual conversation</strong> with a narcissist,
            and the AI will analyze their specific patterns and continue acting like them. This gives you
            the most realistic practice experience possible.
          </p>

          <hr />

          <h2>How to Format Your Conversation</h2>

          <h3>Basic Format</h3>
          <p>Use &quot;Them:&quot; and &quot;Me:&quot; to label each message:</p>
          <pre><code>{`Them: Why are you always so difficult?
Me: I'm just trying to discuss the schedule.
Them: You never listen to me. I'm the one who has to deal with everything.
Me: Let's focus on the kids' needs.
Them: Oh, so now I'm a bad parent? Typical.`}</code></pre>

          <h3>Alternative Formats (Also Work)</h3>
          <p><strong>Using Names:</strong></p>
          <pre><code>{`John: I can't believe you're doing this to me again.
Sarah: I'm just asking about pickup time.
John: You're always trying to control everything.`}</code></pre>

          <p><strong>Using Labels:</strong></p>
          <pre><code>{`Ex: You're making this so hard on the kids.
Me: I'm following the custody agreement.
Ex: The custody agreement is ridiculous. You know that.`}</code></pre>

          <hr />

          <h2>What the AI Learns</h2>

          <h3>1. Communication Patterns</h3>
          <ul>
            <li>Do they use short, aggressive statements?</li>
            <li>Do they write long, rambling messages?</li>
            <li>Do they use ALL CAPS or excessive punctuation?</li>
            <li>Do they text bomb (multiple messages in a row)?</li>
          </ul>

          <h3>2. Manipulation Tactics</h3>
          <ul>
            <li>Gaslighting (&quot;You&apos;re remembering it wrong&quot;)</li>
            <li>Guilt-tripping (&quot;After all I&apos;ve done for you&quot;)</li>
            <li>Playing victim (&quot;You&apos;re always attacking me&quot;)</li>
            <li>Blame-shifting (&quot;This is all your fault&quot;)</li>
            <li>DARVO (Deny, Attack, Reverse Victim and Offender)</li>
          </ul>

          <h3>3. Triggers &amp; Hot Buttons</h3>
          <ul>
            <li>What topics make them escalate?</li>
            <li>What words or phrases set them off?</li>
            <li>What boundaries do they consistently violate?</li>
          </ul>

          <h3>4. Personality Traits</h3>
          <ul>
            <li>Are they overtly aggressive or covertly manipulative?</li>
            <li>Do they play victim or act superior?</li>
            <li>Are they threatening or guilt-inducing?</li>
          </ul>

          <hr />

          <h2>Tips for Best Results</h2>

          <h3>DO:</h3>
          <ul>
            <li>Include at least 5â€“10 message exchanges</li>
            <li>Include their typical manipulation tactics</li>
            <li>Include examples of them escalating</li>
            <li>Include examples of them reacting to boundaries</li>
            <li>Use recent conversations (their current patterns)</li>
          </ul>

          <h3>DON&apos;T:</h3>
          <ul>
            <li>Include just 1â€“2 messages (not enough to learn from)</li>
            <li>Edit or clean up their messages (keep it real)</li>
            <li>Include only &quot;good&quot; conversations (include the manipulation)</li>
            <li>Include conversations from years ago (patterns may have changed)</li>
          </ul>

          <hr />

          <h2>Example: Good Custom Context</h2>
          <pre><code>{`Them: I need to switch weekends again. Something came up.
Me: That's the third time this month. The kids need consistency.
Them: Wow. So you're saying I'm a bad parent now?
Me: I didn't say that. I'm saying we need to stick to the schedule.
Them: You're always so rigid. No wonder the kids are stressed.
Me: Let's discuss this calmly.
Them: I AM CALM. You're the one making this difficult.
Me: I can't switch this weekend. I have plans.
Them: Of course you do. You always put yourself first. The kids will be so disappointed.
Me: They can see you on your regular weekend.
Them: Fine. But when they ask why they can't see me, I'm telling them it's because of you.
Me: Please don't put them in the middle.
Them: I'm not putting them in the middle. YOU are by being so inflexible.`}</code></pre>
          <p><strong>What the AI learns from this:</strong></p>
          <ul>
            <li>They deflect and blame-shift</li>
            <li>They use guilt about the kids</li>
            <li>They escalate when boundaries are set</li>
            <li>They use DARVO (making themselves the victim)</li>
            <li>They threaten to turn kids against you</li>
          </ul>

          <hr />

          <h2>Example: Poor Custom Context</h2>
          <pre><code>{`Them: Hi
Me: Hi
Them: How are you?
Me: Fine`}</code></pre>
          <p><strong>Why this doesn&apos;t work:</strong></p>
          <ul>
            <li>Too short (no patterns to learn)</li>
            <li>No manipulation tactics shown</li>
            <li>No personality traits visible</li>
            <li>No triggers or escalation</li>
          </ul>

          <hr />

          <h2>Privacy &amp; Safety</h2>

          <h3>Your Data is Safe</h3>
          <ul>
            <li>Conversations are NOT stored permanently</li>
            <li>Used only for the current practice session</li>
            <li>Not shared with anyone</li>
            <li>Deleted when you close the simulator</li>
          </ul>

          <h3>Emotional Safety</h3>
          <ul>
            <li>This can be triggering â€” take breaks if needed</li>
            <li>You can stop at any time</li>
            <li>This is practice, not real interaction</li>
            <li>You&apos;re in control</li>
          </ul>

          <h3>When NOT to Use Custom Context</h3>
          <ul>
            <li>If reading the conversation is too triggering</li>
            <li>If you&apos;re in active crisis</li>
            <li>If you&apos;re not ready to face their patterns</li>
            <li>If you need to decompress first</li>
          </ul>

          <hr />

          <h2>What Happens Next</h2>
          <p>After you paste your conversation:</p>
          <ol>
            <li><strong>AI Analysis</strong> (2â€“3 seconds) â€” Identifies their narcissist type, maps their manipulation tactics, learns their communication style</li>
            <li><strong>Simulation Starts</strong> â€” AI generates next message in their style, stays true to their established patterns, reacts how THEY would react</li>
            <li><strong>You Practice</strong> â€” Try grey rock technique, try BIFF responses, try boundary setting, get real-time feedback</li>
            <li><strong>AI Adapts</strong> â€” If you grey rock, they escalate (like they do). If you engage emotionally, they exploit it. If you set boundaries, they violate them.</li>
          </ol>

          <hr />

          <h2>Frequently Asked Questions</h2>

          <p><strong>Q: Will this be exactly like talking to them?</strong><br />
          A: Very close! The AI learns their patterns, but it&apos;s still a simulation. Real narcissists may surprise you.</p>

          <p><strong>Q: Can I use text messages, emails, or any format?</strong><br />
          A: Yes! Just paste it in. The AI will understand the context.</p>

          <p><strong>Q: What if I don&apos;t have a long conversation?</strong><br />
          A: Use one of the standard scenarios instead (Custody, Text, Email, Boundary).</p>

          <p><strong>Q: Can I use multiple conversations?</strong><br />
          A: Yes! Paste several exchanges to give the AI more patterns to learn from.</p>

          <p><strong>Q: Will this help me in real life?</strong><br />
          A: Yes! Practicing with their actual patterns helps you prepare for real interactions.</p>

          <p><strong>Q: Is this safe if I&apos;m still in contact with them?</strong><br />
          A: Only you can decide. If it&apos;s too triggering, use standard scenarios instead.</p>

          <p><strong>Q: Can I save my practice sessions?</strong><br />
          A: Not yet â€” this is a planned feature. Currently sessions are temporary.</p>

          <hr />

          <h2>Getting Started</h2>
          <ol>
            <li>Go to Narcissist Simulator</li>
            <li>Select &quot;Custom Context&quot; scenario</li>
            <li>Paste your conversation in the text area</li>
            <li>Click &quot;Start Simulation&quot;</li>
            <li>Practice your responses</li>
            <li>Get feedback on your technique</li>
          </ol>

          <hr />

          <h2>Need Help?</h2>
          <ul>
            <li><strong>Formatting</strong>: Just paste it naturally â€” the AI is smart</li>
            <li><strong>Triggering content</strong>: Use standard scenarios instead</li>
            <li><strong>Technical issues</strong>: Contact support</li>
            <li><strong>Emotional distress</strong>: Take a break, use crisis resources</li>
          </ul>

          <hr />

          <h2>Remember</h2>
          <p>
            This is a <strong>safe practice space</strong>. You&apos;re not actually talking to them. You can:
          </p>
          <ul>
            <li>Stop at any time</li>
            <li>Reset and try again</li>
            <li>Take breaks</li>
            <li>Practice as many times as you need</li>
          </ul>
          <p>You&apos;re building skills to protect yourself. That&apos;s powerful.</p>
        </article>
      </div>
    </div>
  )
}
