import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, conversationId } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Save user message
    await supabaseClient
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'user',
        content: message
      })

    // Call Gemini API
    // Get conversation context if provided
    const context = url.searchParams.get('context') || 'general'

    // Get conversation history if provided
    const conversationHistory = []
    if (conversation_id) {
      const { data: messages } = await supabaseClient
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', conversation_id)
        .order('created_at', { ascending: true })
        .limit(10) // Last 10 messages for context

      if (messages) {
        conversationHistory.push(...messages)
      }
    }

    // Build system prompt based on context
    const systemPrompts = {
      general: `You are a compassionate AI coach specialized in helping survivors of narcissistic abuse. Provide validation and emotional support.`,
      crisis: `You are a trauma-informed crisis support AI. This is a crisis situation. Prioritize safety and provide immediate support resources. If the user is in immediate danger, encourage them to contact emergency services.`,
      'pattern-analysis': `You are an AI specialist in narcissistic abuse pattern recognition. Help identify patterns in abusive behavior and provide insights.`,
      'mind-reset': `You are a trauma-informed AI therapist specializing in cognitive reframing. Help reframe negative thoughts and provide coping strategies.`,
      'grey-rock': `You are an AI coach specializing in the grey rock technique. Provide guidance on minimizing conflict through strategic disengagement.`
    }

    const systemPrompt = systemPrompts[context] || systemPrompts.general

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          },
          ...conversationHistory.map(msg => ({
            parts: [{ text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}` }]
          })),
          {
            parts: [{ text: `User: ${message}` }]
          }
        ],
        generationConfig: {
          temperature: context === 'crisis' ? 0.3 : 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot provide a response right now. Please try again.'

    // Save AI response
    await supabaseClient
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: 'assistant',
        content: aiResponse
      })

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})