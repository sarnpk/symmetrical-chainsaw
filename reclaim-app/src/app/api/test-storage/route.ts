import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service-role client for storage access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    console.log('🗄️ Storage test API called')
    
    const body = await request.json()
    const { test_type, storage_path } = body
    
    if (!storage_path) {
      return NextResponse.json({ 
        error: 'Missing storage_path',
        test_mode: true 
      }, { status: 400 })
    }

    if (test_type === 'create_signed_url') {
      console.log('🔗 Testing signed URL creation for:', storage_path)
      
      try {
        // Test creating signed URL with service role
        const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
          .from('evidence-audio')
          .createSignedUrl(storage_path, 3600) // 1 hour

        console.log('📊 Signed URL result:', { 
          success: !!signedUrlData?.signedUrl, 
          error: signedError?.message 
        })

        if (signedError) {
          return NextResponse.json({
            success: false,
            error: signedError.message,
            storage_path,
            test_type: 'create_signed_url',
            test_mode: true
          })
        }

        if (!signedUrlData?.signedUrl) {
          return NextResponse.json({
            success: false,
            error: 'No signed URL returned',
            storage_path,
            test_type: 'create_signed_url',
            test_mode: true
          })
        }

        return NextResponse.json({
          success: true,
          signed_url: signedUrlData.signedUrl,
          storage_path,
          test_type: 'create_signed_url',
          test_mode: true
        })

      } catch (error: any) {
        console.error('❌ Signed URL creation error:', error)
        return NextResponse.json({
          success: false,
          error: error.message,
          storage_path,
          test_type: 'create_signed_url',
          test_mode: true
        }, { status: 500 })
      }
    }

    if (test_type === 'test_gladia_access') {
      console.log('🤖 Testing Gladia access to storage path:', storage_path)
      
      try {
        // First create signed URL
        const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
          .from('evidence-audio')
          .createSignedUrl(storage_path, 3600)

        if (signedError || !signedUrlData?.signedUrl) {
          return NextResponse.json({
            success: false,
            error: 'Failed to create signed URL',
            details: signedError?.message,
            storage_path,
            test_type: 'test_gladia_access',
            test_mode: true
          })
        }

        console.log('🔗 Created signed URL, testing Gladia access...')

        // Test if Gladia can access the URL by making a HEAD request
        const gladiaApiKey = process.env.GLADIA_API_KEY
        if (!gladiaApiKey) {
          return NextResponse.json({
            success: false,
            error: 'GLADIA_API_KEY not configured',
            test_type: 'test_gladia_access',
            test_mode: true
          }, { status: 500 })
        }

        // Try to start a transcription with Gladia to test access
        const gladiaResponse = await fetch('https://api.gladia.io/v2/transcription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gladia-key': gladiaApiKey,
          },
          body: JSON.stringify({ 
            audio_url: signedUrlData.signedUrl 
          }),
        })

        console.log('📡 Gladia API response status:', gladiaResponse.status)

        const gladiaResult = await gladiaResponse.json()
        console.log('📊 Gladia API response:', gladiaResult)

        return NextResponse.json({
          success: gladiaResponse.ok,
          signed_url: signedUrlData.signedUrl,
          gladia_response: {
            status: gladiaResponse.status,
            statusText: gladiaResponse.statusText,
            data: gladiaResult
          },
          storage_path,
          test_type: 'test_gladia_access',
          test_mode: true
        })

      } catch (error: any) {
        console.error('❌ Gladia access test error:', error)
        return NextResponse.json({
          success: false,
          error: error.message,
          storage_path,
          test_type: 'test_gladia_access',
          test_mode: true
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'Invalid test_type. Use "create_signed_url" or "test_gladia_access"',
      valid_types: ['create_signed_url', 'test_gladia_access'],
      test_mode: true
    }, { status: 400 })

  } catch (error: any) {
    console.error('❌ Storage test error:', error)
    
    return NextResponse.json({
      error: 'Storage test failed',
      details: error.message,
      test_mode: true
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Storage test endpoint',
    endpoints: {
      'POST with test_type: "create_signed_url"': 'Test creating signed URLs',
      'POST with test_type: "test_gladia_access"': 'Test if Gladia can access signed URLs'
    },
    warning: 'This is a test endpoint - remove in production'
  })
}