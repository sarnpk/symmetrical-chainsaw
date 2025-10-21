import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('manipulation_analysis')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { message_text } = body;

  // Fetch all traits for pattern matching
  const { data: traits } = await supabase.from('npd_traits').select('*');
  
  // Simple keyword matching for tactics
  const identifiedTactics = traits?.filter(trait => {
    const keywords = trait.name.toLowerCase().split(/[\s-]+/);
    const messageLC = message_text.toLowerCase();
    return keywords.some((kw: string) => messageLC.includes(kw)) || 
           trait.examples?.some((ex: string) => messageLC.includes(ex.toLowerCase().substring(0, 20)));
  }).map(t => t.id) || [];

  const { data, error } = await supabase
    .from('manipulation_analysis')
    .insert({ 
      user_id: user.id, 
      message_text,
      identified_tactics: identifiedTactics,
      ...body 
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
