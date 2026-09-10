'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, LifeBuoy } from 'lucide-react';

export default function CrisisToolkitWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl p-4 w-64 animate-in slide-in-from-bottom">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-900">Need support?</h3>
            <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Quick access to grounding techniques and coping strategies
          </p>
          <Link
            href="/crisis-toolkit"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700"
          >
            Open Crisis Toolkit
          </Link>
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center"
        aria-label="Crisis Toolkit"
      >
        <LifeBuoy className="h-7 w-7" />
      </button>
    </div>
  );
}
