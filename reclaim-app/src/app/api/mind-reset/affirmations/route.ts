import { NextResponse } from 'next/server'

// Phase 2: For now, return a curated default set. Favorites and prefs are handled by sibling routes.
// Playlists can later be stored in DB; this endpoint stays stateless for caching simplicity.

const DEFAULT_PLAYLISTS = [
  {
    id: 'self-worth',
    name: 'Self-worth',
    items: [
      'I am worthy of love and respect',
      'My feelings and experiences are valid',
      'I am enough, just as I am',
      'My voice matters',
      'I honor my needs and boundaries'
    ]
  },
  {
    id: 'healing',
    name: 'Healing',
    items: [
      'I have the strength to heal and grow',
      'Each day I choose small steps toward peace',
      'I release what doesn\'t serve me',
      'I am patient and gentle with myself',
      'I trust the process of my healing'
    ]
  },
  {
    id: 'boundaries',
    name: 'Boundaries',
    items: [
      'I deserve healthy relationships',
      'It\'s safe for me to set boundaries',
      'No is a complete sentence',
      'I can be kind and firm at the same time',
      'I protect my energy and time'
    ]
  }
]

export async function GET() {
  return NextResponse.json({ playlists: DEFAULT_PLAYLISTS })
}
