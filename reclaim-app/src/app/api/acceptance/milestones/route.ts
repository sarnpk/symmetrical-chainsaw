import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('acceptance_milestones')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Milestones error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Milestones API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}