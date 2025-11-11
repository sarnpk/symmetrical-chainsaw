import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { geminiAI } from '@/lib/gemini-ai'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { step, userAnswer, conversationHistory } = body

  const { data: belief } = await supabase
    .from('false_beliefs')
    .select('belief_text')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!belief) {
    return NextResponse.json({ error: 'Belief not found' }, { status: 404 })
  }

  const questions = [
    {
      id: 1,
      question: `What evidence SUPPORTS the belief "${belief.belief_text}"?`,
      followUp: 'Think about where this evidence came from. Who told you this? What was their motivation?'
    },
    {
      id: 2,
      question: `What evidence CONTRADICTS the belief "${belief.belief_text}"?`,
      followUp: 'Even small moments count. What have you done or experienced that shows this belief might not be true?'
    },
    {
      id: 3,
      question: `What is a more likely explanation than "${belief.belief_text}"?`,
      followUp: 'Consider: Could this belief have been installed by someone who needed you to feel this way to control you?'
    },
    {
      id: 4,
      question: 'Who benefits from you believing this? What would change if you stopped believing it?',
      followUp: 'This is about recognizing the source and purpose of the belief.'
    }
  ]

  if (step === 0) {
    return NextResponse.json({ 
      question: questions[0].question,
      followUp: questions[0].followUp,
      step: 1,
      totalSteps: 4
    })
  }

  if (step > 0 && step <= 4 && userAnswer) {
    const prompt = `You are a trauma-informed therapist guiding a CBT reality testing session for narcissistic abuse recovery.

BELIEF: "${belief.belief_text}"
CURRENT QUESTION: ${questions[step - 1].question}
USER'S ANSWER: "${userAnswer}"

Provide:
1. Brief validation of their answer (1 sentence)
2. A gentle follow-up question or insight to deepen their reflection (1-2 sentences)
3. If this is step 4, also provide a brief summary of their progress

Keep it warm, empathetic, and under 100 words.`

    try {
      const aiResponse = await geminiAI.chat(prompt, conversationHistory || [], 'mind-reset')
      
      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error('Empty AI response')
      }
      
      const nextStep = step + 1
      const hasMore = nextStep <= 4

      return NextResponse.json({
        aiResponse: aiResponse.trim(),
        question: hasMore ? questions[nextStep - 1].question : null,
        followUp: hasMore ? questions[nextStep - 1].followUp : null,
        step: nextStep,
        totalSteps: 4,
        completed: !hasMore
      })
    } catch (error: any) {
      console.error('AI reality test error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        step,
        userAnswer: userAnswer?.substring(0, 100)
      })
      return NextResponse.json({ 
        error: 'Failed to process response',
        details: error.message 
      }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}
