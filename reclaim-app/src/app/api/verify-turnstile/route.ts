import { NextRequest, NextResponse } from 'next/server'

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAACHvmkCDaM8h8TVwPxF3bfwSTv4'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    )

    const data = await verifyResponse.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
