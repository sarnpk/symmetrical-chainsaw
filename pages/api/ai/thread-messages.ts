// Next.js API route to paginate messages for a given conversation
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

    const conversation_id = req.query.conversation_id as string
    if (!conversation_id) return res.status(400).json({ error: 'conversation_id is required' })

    // Verify conversation ownership
    const { data: conv, error: convErr } = await supabase
      .from('ai_conversations')
      .select('id, user_id')
      .eq('id', conversation_id)
      .single()

    if (convErr || !conv || conv.user_id !== user.id) return res.status(404).json({ error: 'Conversation not found' })

    const limit = Math.min(parseInt((req.query.limit as string) || '30', 10), 100)
    const cursor = (req.query.cursor as string) || null // ISO timestamp for created_at

    let query = supabase
      .from('ai_messages')
      .select('id, role, content, metadata, created_at')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query
    if (error) {
      console.error('List messages error:', error)
      return res.status(500).json({ error: 'Failed to list messages' })
    }

    let next_cursor: string | null = null
    let items = data || []
    if (items.length > limit) {
      const last = items[limit - 1]
      next_cursor = last.created_at
      items = items.slice(0, limit)
    }

    return res.status(200).json({ items, next_cursor })
  } catch (e) {
    console.error('Thread Messages API error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
