import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://reclaim.app'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const evidenceFileId = url.searchParams.get('evidence_file_id')
    const token = url.searchParams.get('token')

    if (!evidenceFileId) {
      return NextResponse.json({ error: 'Missing evidence_file_id' }, { status: 400 })
    }

    // Require authentication token
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify the token
    let userId: string | null = null
    try {
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
      if (authError || !user) {
        return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
      }
      userId = user.id
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Get evidence file details
    const { data: evidenceFile, error: fileError } = await supabaseAdmin
      .from('evidence_files')
      .select('*')
      .eq('id', evidenceFileId)
      .single()

    if (fileError || !evidenceFile) {
      return NextResponse.json({ error: 'Evidence file not found' }, { status: 404 })
    }

    // Verify user owns the file
    if (evidenceFile.user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get the file from Supabase storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from(evidenceFile.storage_bucket)
      .download(evidenceFile.storage_path)

    if (downloadError || !fileData) {
      console.error('Storage download error:', downloadError)
      return NextResponse.json({
        error: 'Failed to download file from storage',
        details: downloadError?.message
      }, { status: 500 })
    }

    const arrayBuffer = await fileData.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': evidenceFile.file_type || 'audio/wav',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Content-Disposition': `inline; filename="${evidenceFile.file_name}"`,
        'Cache-Control': 'private, max-age=3600',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })

  } catch (error: any) {
    console.error('Audio proxy error:', error)
    return NextResponse.json({
      error: 'Audio proxy failed',
      details: error.message
    }, { status: 500 })
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
