import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365];

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: settings } = await supabase
    .from('no_contact_settings')
    .select('no_contact_start_date')
    .eq('user_id', user.id)
    .single();

  if (!settings?.no_contact_start_date) {
    return NextResponse.json({ milestones: [], nextMilestone: null });
  }

  const daysNoContact = Math.floor((Date.now() - new Date(settings.no_contact_start_date).getTime()) / (1000 * 60 * 60 * 24));

  const { data: achieved } = await supabase
    .from('no_contact_milestones')
    .select('milestone_days')
    .eq('user_id', user.id);

  const achievedDays = new Set(achieved?.map(m => m.milestone_days) || []);

  // Auto-award new milestones
  for (const milestone of MILESTONES) {
    if (daysNoContact >= milestone && !achievedDays.has(milestone)) {
      await supabase
        .from('no_contact_milestones')
        .insert({ user_id: user.id, milestone_days: milestone });
      achievedDays.add(milestone);
    }
  }

  const nextMilestone = MILESTONES.find(m => m > daysNoContact) || null;

  return NextResponse.json({
    milestones: Array.from(achievedDays).sort((a, b) => b - a),
    nextMilestone,
    daysUntilNext: nextMilestone ? nextMilestone - daysNoContact : null
  });
}
