import { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!supabaseUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Supabase URL not configured' })
      }
    }

    // Simple health check to keep Supabase awake
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Content-Type': 'application/json'
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        timestamp: new Date().toISOString(),
        supabaseStatus: response.ok ? 'active' : 'error'
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Keep-alive failed' })
    }
  }
}
