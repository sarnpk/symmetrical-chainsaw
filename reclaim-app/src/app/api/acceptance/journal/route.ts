import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      const { data, error } = await supabase
        .from('acceptance_journal')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Journal GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('acceptance_journal')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Journal list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Journal API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('acceptance_journal')
      .upsert({ 
        user_id: user.id, 
        entry_date: today,
        ...body
      }, {
        onConflict: 'user_id,entry_date'
      })
      .select()
      .single();

    if (error) {
      console.error('Journal POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('Journal POST API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}