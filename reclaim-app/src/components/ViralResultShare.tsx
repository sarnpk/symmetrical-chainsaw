'use client'

import { Share2, Facebook, Twitter, MessageCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface ViralResultShareProps {
  resultType: string
  score?: number
  url?: string
}

export default function ViralResultShare({ resultType, score, url }: ViralResultShareProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  
  const shareTexts = {
    narcissist: `I just discovered my partner shows signs of ${resultType}. This free AI tool helped me see the manipulation tactics. Check it out:`,
    discard: `I found out I'm in the ${resultType} stage. This free tool helped me understand what's happening:`,
    default: `This free AI tool helped me understand narcissistic abuse patterns:`
  }

  const getShareText = () => {
    if (resultType.includes('Narcissist')) return shareTexts.narcissist
    if (resultType.includes('Stage')) return shareTexts.discard
    return shareTexts.default
  }

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const text = getShareText()
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + shareUrl)}&hashtags=NarcissisticAbuse,ToxicRelationships`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
    }
    window.open(links[platform], '_blank', 'width=600,height=400')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Free Narcissist Analysis Tool',
          text: getShareText(),
          url: shareUrl
        })
        toast.success('Thanks for sharing!')
      } catch (err) {
        // User cancelled
      }
    }
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border-2 border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-green-600" />
        <p className="font-semibold text-green-900">Help Others Recognize Abuse</p>
      </div>
      <p className="text-sm text-green-800 mb-3">
        Share this tool with someone who might need it. You could save them years of confusion.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-1 px-3 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 text-sm"
        >
          <Facebook className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-1 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 text-sm"
        >
          <Twitter className="h-4 w-4" />
          Tweet
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-1 px-3 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <Share2 className="h-4 w-4" />
            More
          </button>
        )}
      </div>
    </div>
  )
}
