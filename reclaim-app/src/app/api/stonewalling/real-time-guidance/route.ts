import { NextRequest, NextResponse } from 'next/server'
import { stonewallAI } from '@/lib/stonewalling-ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const guidance = await stonewallAI.getRealTimeGuidance(body)
    return NextResponse.json(guidance)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
