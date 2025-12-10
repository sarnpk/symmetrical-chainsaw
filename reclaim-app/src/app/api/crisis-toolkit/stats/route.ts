import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get overall stats
    const { data: logs, error } = await supabase
      .from('crisis_toolkit_logs')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const totalUses = logs?.length || 0;
    const conditionBreakdown = logs?.reduce((acc: any, log) => {
      acc[log.condition_type] = (acc[log.condition_type] || 0) + 1;
      return acc;
    }, {});

    const avgRating = logs?.filter(l => l.helpful_rating).reduce((sum, l) => sum + l.helpful_rating, 0) / 
                      (logs?.filter(l => l.helpful_rating).length || 1);

    return NextResponse.json({ 
      totalUses,
      conditionBreakdown,
      avgRating: avgRating.toFixed(1),
      resilience: `You've gotten through this ${totalUses} times before`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
