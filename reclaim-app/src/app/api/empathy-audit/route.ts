import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

async function requireTier(supabase: any, minTier: string = 'recovery') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single()
  const tierRank: Record<string, number> = { foundation: 0, recovery: 1, empowerment: 2 }
  if (!profile || (tierRank[profile.subscription_tier] || 0) < (tierRank[minTier] || 0)) {
    return { error: NextResponse.json({ error: 'Upgrade required', requiredTier: minTier }, { status: 403 }) }
  }
  return { user }
}

export async function GET() {
  const supabase = await createServerSupabase();
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const { data, error } = await supabase
    .from('empathy_distribution')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] || null);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const auth = await requireTier(supabase)
  if (auth.error) return auth.error

  const body = await request.json();
  const { data, error } = await supabase
    .from('empathy_distribution')
    .insert({ user_id: auth.user.id, ...body })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
