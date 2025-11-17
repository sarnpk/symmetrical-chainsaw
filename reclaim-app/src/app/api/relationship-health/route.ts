import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the latest relationship health assessment
    const { data: assessment, error } = await supabase
      .from('relationship_assessments')
      .select('overall_score, risk_level, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching relationship health:', error)
      return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 })
    }

    // If no assessment exists, calculate based on journal entries
    if (!assessment) {
      const { data: recentEntries } = await supabase
        .from('journal_entries')
        .select('safety_rating, emotional_impact')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (!recentEntries || recentEntries.length === 0) {
        return NextResponse.json({ 
          score: 50, 
          risk_level: 'moderate',
          source: 'default',
          message: 'No data available. Take the assessment for personalized insights.'
        })
      }
      
      const avgSafety = recentEntries.reduce((sum, entry) => sum + (entry.safety_rating || 3), 0) / recentEntries.length
      const avgImpact = recentEntries.reduce((sum, entry) => sum + (entry.emotional_impact || 3), 0) / recentEntries.length
      
      const healthScore = Math.round(((avgSafety + (6 - avgImpact)) / 2) * 20)
      const finalScore = Math.max(0, Math.min(100, healthScore))
      
      const riskLevel = finalScore >= 70 ? 'low' : finalScore >= 40 ? 'moderate' : 'high'
      
      return NextResponse.json({ 
        score: finalScore, 
        risk_level: riskLevel,
        source: 'journal_analysis',
        message: 'Based on recent journal entries. Take the full assessment for detailed insights.'
      })
    }

    return NextResponse.json({ 
      score: assessment.overall_score, 
      risk_level: assessment.risk_level,
      source: 'assessment',
      last_updated: assessment.created_at
    })

  } catch (error) {
    console.error('Relationship health API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}