import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for storage access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const evidenceFileId = url.searchParams.get('evidence_file_id')
    const token = url.searchParams.get('token')
    
    if (!evidenceFileId) {
      return NextResponse.json({ error: 'Missing evidence_file_id' }, { status: 400 })
    }

    // Verify the token if provided (optional for now, but recommended for security)
    let userId: string | null = null
    if (token) {
      try {
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
        if (!authError && user) {
          userId = user.id
        }
      } catch (error) {
        console.warn('Token verification failed:', error)
      }
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

    // Optional: Check if user owns the file (if token was provided)
    if (userId && evidenceFile.user_id !== userId) {
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

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer()
    
    // Return the file with appropriate headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': evidenceFile.file_type || 'audio/wav',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Content-Disposition': `inline; filename="${evidenceFile.file_name}"`,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*', // Allow external access (for Gladia)
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })

  } catch (error: any) {
    console.error('❌ Audio proxy error:', error)
    
    return NextResponse.json({
      error: 'Audio proxy failed',
      details: error.message
    }, { status: 500 })
  }
}

// Handle preflight requests
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}