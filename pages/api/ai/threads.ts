// Next.js API route to list AI chat threads with pagination
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Auth
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Authorization header required' })
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 50)
    const cursor = (req.query.cursor as string) || null // ISO timestamp for updated_at

    let query = supabase
      .from('ai_conversations')
      .select('id, title, context_type, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('updated_at', cursor)
    }

    const { data, error } = await query
    if (error) {
      console.error('List threads error:', error)
      return res.status(500).json({ error: 'Failed to list threads' })
    }

    let next_cursor: string | null = null
    let items = data || []
    if (items.length > limit) {
      const last = items[limit - 1]
      next_cursor = last.updated_at
      items = items.slice(0, limit)
    }

    return res.status(200).json({ items, next_cursor })
  } catch (e) {
    console.error('Threads API error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
