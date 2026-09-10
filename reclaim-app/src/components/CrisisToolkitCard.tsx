'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CrisisToolkitCard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/crisis-toolkit/stats')
      .then(res => res.ok ? res.json() : null)
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">Crisis Toolkit</h3>
          <p className="text-blue-100 text-sm">Quick support when you need it</p>
        </div>
        <div className="text-3xl">ðŸ†˜</div>
      </div>

      {stats && stats.totalUses > 0 ? (
        <div className="bg-white/10 rounded-lg p-3 mb-4 backdrop-blur-sm">
          <p className="text-sm font-medium mb-1">Your Resilience</p>
          <p className="text-2xl font-bold">{stats.totalUses}</p>
          <p className="text-xs text-blue-100">times you've shown up for yourself</p>
        </div>
      ) : (
        <div className="bg-white/10 rounded-lg p-3 mb-4 backdrop-blur-sm">
          <p className="text-sm">
            Access grounding techniques for anxiety, depression, PTSD, and more
          </p>
        </div>
      )}

      <Link
        href="/crisis-toolkit"
        className="block w-full bg-white text-purple-600 text-center py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors"
      >
        Open Toolkit
      </Link>
    </div>
  );
}
