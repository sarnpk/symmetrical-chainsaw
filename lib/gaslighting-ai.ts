import { geminiAI } from './gemini-ai'

interface GaslightingStatement {
  id: string
  statement_date: string
  their_claim: string
  topic: string
  actual_truth: string
}

interface ContradictionAnalysis {
  contradictions: Array<{
    statement_1: GaslightingStatement
    statement_2: GaslightingStatement
    contradiction_type: 'direct_opposite' | 'timeline_conflict' | 'fact_denial' | 'blame_shift'
    confidence: number
    explanation: string
    days_apart: number
  }>
  summary: {
    total_contradictions: number
    most_contradicted_topic: string
    credibility_score: number
    pattern_severity: 'low' | 'medium' | 'high' | 'severe'
  }
}

interface TruthTimelineAnalysis {
  event_title: string
  original_truth: string
  their_versions: Array<{
    version: string
    date: string
    changes_from_previous: string[]
  }>
  confabulation_score: number
  ai_assessment: string
}

export class GaslightingAI {
  /**
   * Detect contradictions between statements
   */
  async detectContradictions(statements: GaslightingStatement[]): Promise<ContradictionAnalysis> {
    if (statements.length < 2) {
      return {
        contradictions: [],
        summary: {
          total_contradictions: 0,
          most_contradicted_topic: '',
          credibility_score: 100,
          pattern_severity: 'low'
        }
      }
    }

    const prompt = `Analyze these statements for contradictions and gaslighting patterns:

${statements.map((s, i) => `
Statement ${i + 1} (${new Date(s.statement_date).toLocaleDateString()}):
Topic: ${s.topic}
Their Claim: "${s.their_claim}"
Actual Truth: "${s.actual_truth}"
`).join('\n')}

Identify contradictions where they said opposite things at different times. Return JSON:
{
  "contradictions": [
    {
      "statement_1_index": 0,
      "statement_2_index": 1,
      "contradiction_type": "direct_opposite|timeline_conflict|fact_denial|blame_shift",
      "confidence": 0.95,
      "explanation": "detailed explanation",
      "days_apart": 30
    }
  ],
  "summary": {
    "total_contradictions": 0,
    "most_contradicted_topic": "topic",
    "credibility_score": 0-100,
    "pattern_severity": "low|medium|high|severe"
  }
}`

    try {
      const response = await geminiAI.chat(prompt, [], 'pattern-analysis')
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON in response')
      
      const result = JSON.parse(jsonMatch[0])
      
      return {
        contradictions: result.contradictions.map((c: any) => ({
          statement_1: statements[c.statement_1_index],
          statement_2: statements[c.statement_2_index],
          contradiction_type: c.contradiction_type,
          confidence: c.confidence,
          explanation: c.explanation,
          days_apart: c.days_apart
        })),
        summary: result.summary
      }
    } catch (error) {
      console.error('Contradiction detection error:', error)
      return {
        contradictions: [],
        summary: {
          total_contradictions: 0,
          most_contradicted_topic: '',
          credibility_score: 100,
          pattern_severity: 'low'
        }
      }
    }
  }

  /**
   * Analyze truth timeline revisions
   */
  async analyzeTimelineRevisions(timeline: {
    event_title: string
    what_actually_happened: string
    their_versions: Array<{ version: string; date: string }>
  }): Promise<TruthTimelineAnalysis> {
    const prompt = `Analyze how their story changed over time:

Event: ${timeline.event_title}
What Actually Happened: ${timeline.what_actually_happened}

Their Versions:
${timeline.their_versions.map((v, i) => `
Version ${i + 1} (${new Date(v.date).toLocaleDateString()}): "${v.version}"
`).join('\n')}

Analyze the changes and confabulation. Return JSON:
{
  "versions_with_changes": [
    {
      "version": "text",
      "date": "date",
      "changes_from_previous": ["change1", "change2"]
    }
  ],
  "confabulation_score": 1-10,
  "ai_assessment": "detailed analysis of the pattern"
}`

    try {
      const response = await geminiAI.chat(prompt, [], 'pattern-analysis')
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON in response')
      
      const result = JSON.parse(jsonMatch[0])
      
      return {
        event_title: timeline.event_title,
        original_truth: timeline.what_actually_happened,
        their_versions: result.versions_with_changes,
        confabulation_score: result.confabulation_score,
        ai_assessment: result.ai_assessment
      }
    } catch (error) {
      console.error('Timeline analysis error:', error)
      return {
        event_title: timeline.event_title,
        original_truth: timeline.what_actually_happened,
        their_versions: timeline.their_versions.map(v => ({
          ...v,
          changes_from_previous: []
        })),
        confabulation_score: 5,
        ai_assessment: 'Unable to analyze at this time'
      }
    }
  }

  /**
   * Generate gaslighting pattern report
   */
  async generatePatternReport(statements: GaslightingStatement[]): Promise<{
    total_statements: number
    topics_breakdown: Record<string, number>
    avg_severity: number
    key_insights: string[]
    red_flags: string[]
    evidence_strength: 'weak' | 'moderate' | 'strong' | 'overwhelming'
  }> {
    const prompt = `Analyze these gaslighting statements for patterns:

${statements.map((s, i) => `
${i + 1}. ${new Date(s.statement_date).toLocaleDateString()} - ${s.topic}
Claim: "${s.their_claim}"
Truth: "${s.actual_truth}"
`).join('\n')}

Provide pattern analysis in JSON:
{
  "topics_breakdown": {"topic": count},
  "avg_severity": 1-10,
  "key_insights": ["insight1", "insight2"],
  "red_flags": ["flag1", "flag2"],
  "evidence_strength": "weak|moderate|strong|overwhelming"
}`

    try {
      const response = await geminiAI.chat(prompt, [], 'pattern-analysis')
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON in response')
      
      const result = JSON.parse(jsonMatch[0])
      
      return {
        total_statements: statements.length,
        ...result
      }
    } catch (error) {
      console.error('Pattern report error:', error)
      return {
        total_statements: statements.length,
        topics_breakdown: {},
        avg_severity: 5,
        key_insights: [],
        red_flags: [],
        evidence_strength: 'moderate'
      }
    }
  }
}

export const gaslightingAI = new GaslightingAI()
