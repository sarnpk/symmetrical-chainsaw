import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

/**
 * Idempotent "due boundary review" reminder generator.
 * Called by the notification bell on app load / poll. Finds pending
 * boundary reviews whose scheduled date has passed and creates one
 * notification each, then marks them as notified so they never repeat.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date().toISOString();

    const { data: due, error } = await supabase
      .from('boundary_reviews')
      .select('id, boundary_id, scheduled_date, boundaries(title)')
      .eq('user_id', user.id)
      .eq('review_status', 'pending')
      .lte('scheduled_date', now)
      .is('reminder_notified_at', null);

    if (error) throw error;

    if (!due || due.length === 0) {
      return NextResponse.json({ created: 0 });
    }

    let created = 0;
    const notifiedAt = new Date().toISOString();
    for (const review of due) {
      const boundaryTitle = (review.boundaries as any)?.title || 'a boundary';

      const { error: notifErr } = await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'boundary',
        title: 'Boundary Review Due',
        body: `Time to review your boundary: "${boundaryTitle}"`,
        link: `/boundaries/${review.boundary_id}`,
      });
      if (notifErr) {
        console.error('Failed to create boundary review notification:', notifErr.message);
        continue;
      }

      await supabase
        .from('boundary_reviews')
        .update({ reminder_notified_at: notifiedAt })
        .eq('id', review.id);

      created += 1;
    }

    return NextResponse.json({ created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}