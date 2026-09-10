import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: settings } = await supabase
    .from('no_contact_settings')
    .select('no_contact_start_date')
    .eq('user_id', user.id)
    .single();

  const daysNoContact = settings?.no_contact_start_date
    ? Math.floor((Date.now() - new Date(settings.no_contact_start_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const { data: urges } = await supabase
    .from('withdrawal_tracker')
    .select('urge_intensity, logged_at')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(30);

  const avgUrgeIntensity = urges?.length
    ? urges.reduce((sum, u) => sum + (u.urge_intensity || 0), 0) / urges.length
    : 0;

  return NextResponse.json({
    daysNoContact,
    totalUrgesLogged: urges?.length || 0,
    avgUrgeIntensity: Math.round(avgUrgeIntensity * 10) / 10,
    recentUrges: urges || []
  });
}
