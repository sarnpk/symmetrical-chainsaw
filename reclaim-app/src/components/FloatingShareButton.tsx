'use client'

import { Share2 } from 'lucide-react'
import { useState } from 'react'

interface FloatingShareButtonProps {
  title: string
  description: string
  url?: string
}

export default function FloatingShareButton({ title, description, url }: FloatingShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (navigator.share) {
      try {
        setIsSharing(true)
        await navigator.share({ title, text: description, url: shareUrl })
      } catch (err) {
        // User cancelled
      } finally {
        setIsSharing(false)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      setIsSharing(true)
      setTimeout(() => setIsSharing(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center gap-2 group"
      aria-label="Share this tool"
    >
      <Share2 className={`h-6 w-6 ${isSharing ? 'animate-bounce' : ''}`} />
      <span className="hidden group-hover:inline-block text-sm font-medium pr-2 whitespace-nowrap">
        {isSharing ? 'Shared!' : 'Share'}
      </span>
    </button>
  )
}
