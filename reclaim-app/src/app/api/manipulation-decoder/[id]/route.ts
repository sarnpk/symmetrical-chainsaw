import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { error } = await supabase
      .from('manipulation_analyses')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete analysis error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete analysis' 
    }, { status: 500 });
  }
}