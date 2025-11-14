import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sampleEntries = [
    {
      entry_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      acceptance_level: 6,
      daily_struggle: 'Saw a photo of them on social media and felt that familiar pang of hope that maybe they changed',
      hope_triggers: ['Social media post showing them being kind to someone'],
      reality_anchors: ['Remembered the pattern of love bombing followed by devaluation'],
      emotional_state: 'sad'
    },
    {
      entry_date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
      acceptance_level: 4,
      daily_struggle: 'Friend mentioned they saw my ex at a coffee shop looking happy and I wondered if I was wrong about everything',
      hope_triggers: ['Hearing they looked happy and normal'],
      reality_anchors: ['My documented journal entries of the abuse cycles'],
      emotional_state: 'confused'
    },
    {
      entry_date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
      acceptance_level: 7,
      daily_struggle: 'Had a good day until I remembered how they used to make me laugh, then felt guilty for accepting they won\'t change',
      hope_triggers: ['Memory of good times we shared'],
      reality_anchors: ['Therapist reminder that good moments were part of the manipulation cycle'],
      emotional_state: 'peaceful'
    },
    {
      entry_date: new Date(Date.now() - 345600000).toISOString().split('T')[0], // 4 days ago
      acceptance_level: 3,
      daily_struggle: 'They texted asking for their stuff back and were surprisingly polite - made me wonder if they\'re getting help',
      hope_triggers: ['Polite text message asking for belongings'],
      reality_anchors: ['Remembered this is exactly how the hoovering started before'],
      emotional_state: 'hopeful'
    },
    {
      entry_date: new Date(Date.now() - 432000000).toISOString().split('T')[0], // 5 days ago
      acceptance_level: 8,
      daily_struggle: 'Felt strong and clear about the reality of NPD being permanent, but then doubted myself for being "too harsh"',
      hope_triggers: ['Self-doubt about being too judgmental'],
      reality_anchors: ['Research about NPD showing it\'s a personality disorder, not a choice'],
      emotional_state: 'resigned'
    }
  ];

  try {
    for (const entry of sampleEntries) {
      await supabase
        .from('acceptance_journal')
        .upsert({ 
          user_id: user.id, 
          ...entry
        });
    }

    return NextResponse.json({ message: 'Sample data created successfully', count: sampleEntries.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sample data' }, { status: 500 });
  }
}