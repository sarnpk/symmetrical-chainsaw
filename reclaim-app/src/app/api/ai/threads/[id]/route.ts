import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DELETE /api/ai/threads/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const conversationId = params.id

    // First, verify the conversation belongs to the user
    const { data: conversation, error: fetchError } = await supabase
      .from('ai_conversations')
      .select('user_id')
      .eq('id', conversationId)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (conversation.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete all messages in the conversation
    const { error: messagesError } = await supabase
      .from('ai_messages')
      .delete()
      .eq('conversation_id', conversationId)

    if (messagesError) {
      console.error('Error deleting messages:', messagesError)
      return NextResponse.json({ error: 'Failed to delete messages' }, { status: 500 })
    }

    // Delete the conversation
    const { error: deleteError } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', conversationId)

    if (deleteError) {
      console.error('Error deleting conversation:', deleteError)
      return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Delete thread error:', e)
    return NextResponse.json({ error: 'Unexpected error', message: e?.message || 'Unknown' }, { status: 500 })
  }
}
