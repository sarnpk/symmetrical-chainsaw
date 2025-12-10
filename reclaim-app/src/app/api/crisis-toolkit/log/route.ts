import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check tier and usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = profile?.subscription_tier || 'foundation';
    
    // Count usage this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('crisis_toolkit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    const limits: any = {
      foundation: 10,
      healing: 30,
      recovery: 999999
    };

    const usageLimit = limits[tier] || 10;

    if ((count || 0) >= usageLimit) {
      return NextResponse.json({ 
        error: 'Monthly usage limit reached',
        limit: usageLimit,
        tier,
        upgradeRequired: true
      }, { status: 403 });
    }

    const body = await request.json();
    const { condition_type, skills_used, helpful_rating, notes } = body;

    const { data, error } = await supabase
      .from('crisis_toolkit_logs')
      .insert({
        user_id: user.id,
        condition_type,
        skills_used,
        helpful_rating,
        notes
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check tier - basic toolkit is free, but limit usage
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = profile?.subscription_tier || 'foundation';
    
    // Count usage this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('crisis_toolkit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    const limits: any = {
      foundation: 10,
      healing: 30,
      recovery: 999999
    };

    const usageLimit = limits[tier] || 10;
    const remaining = Math.max(0, usageLimit - (count || 0));

    const { searchParams } = new URL(request.url);
    const condition = searchParams.get('condition');

    let query = supabase
      .from('crisis_toolkit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (condition) {
      query = query.eq('condition_type', condition);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;

    return NextResponse.json({ 
      data,
      usage: {
        count: count || 0,
        limit: usageLimit,
        remaining,
        tier
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
