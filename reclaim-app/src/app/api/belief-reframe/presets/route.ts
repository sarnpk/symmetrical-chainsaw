import { NextResponse } from 'next/server'

const PRESET_BELIEFS = [
  { text: 'I am unlovable for who I am', category: 'self_worth' },
  { text: 'My needs are a burden', category: 'self_worth' },
  { text: "I can't survive without them", category: 'dependency' },
  { text: 'I am crazy/too sensitive/irrational', category: 'reality_doubt' },
  { text: 'No one else will ever want me', category: 'self_worth' },
  { text: 'I am responsible for their feelings and actions', category: 'responsibility' },
  { text: 'My reality is wrong', category: 'reality_doubt' },
  { text: 'I am worthless', category: 'self_worth' }
]

export async function GET() {
  return NextResponse.json({ presets: PRESET_BELIEFS })
}
