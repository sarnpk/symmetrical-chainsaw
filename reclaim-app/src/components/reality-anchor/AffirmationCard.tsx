'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Copy, Check } from 'lucide-react'

interface AffirmationCardProps {
  id: string
  text: string
  category: string
}

export default function AffirmationCard({ id, text, category }: AffirmationCardProps) {
  const [copied, setCopied] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <p className="text-gray-700 mb-4 leading-relaxed">"{text}"</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFavorited(!favorited)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              favorited
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
            <span className="text-sm">Favorite</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
