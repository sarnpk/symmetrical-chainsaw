import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import NoContactAnchorContent from './NoContactAnchorContent';
import DashboardLayout from '@/components/DashboardLayout';
import { Crown } from 'lucide-react';
import Link from 'next/link';

export default async function NoContactAnchorPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const tier = profile?.subscription_tier || 'foundation';
  const hasAccess = tier === 'recovery' || tier === 'empowerment';

  if (!hasAccess) {
    return (
      <DashboardLayout user={user} profile={profile}>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Crown className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Contact Anchor</h1>
          <p className="text-gray-600 mb-6">
            This feature is available for Recovery and Empowerment tier subscribers.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-indigo-900 mb-2">What you'll get:</h2>
            <ul className="text-left text-indigo-800 space-y-2">
              <li>�S& Track your no-contact streak</li>
              <li>�S& Crisis intervention tool</li>
              <li>�S& Urge intensity tracking & graphs</li>
              <li>�S& Milestone badges & achievements</li>
              <li>�S& "Why I Left" anchor list</li>
            </ul>
          </div>
          <Link
            href="/subscription"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Upgrade to Recovery Tier
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      <NoContactAnchorContent userId={user.id} />
    </DashboardLayout>
  );
}
