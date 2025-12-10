import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// GET /api/community/rooms - List all active rooms with participant counts
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: rooms, error } = await supabase
      .from('community_chat_rooms')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error

    // Get participant counts for each room
    const roomsWithCounts = await Promise.all(
      (rooms || []).map(async (room) => {
        const { count } = await supabase
          .from('community_room_participants')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room.id)
        
        return { ...room, participant_count: count || 0 }
      })
    )

    return NextResponse.json({ rooms: roomsWithCounts })
  } catch (err) {
    console.error('GET /community/rooms error:', err)
    return NextResponse.json({ error: 'Failed to load rooms' }, { status: 500 })
  }
}
