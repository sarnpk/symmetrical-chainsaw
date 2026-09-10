'use client'

import { Share2, Facebook, Twitter, MessageCircle, Lock, Unlock } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ShareToUnlockModalProps {
  onUnlock: () => void
  toolName: string
}

export default function ShareToUnlockModal({ onUnlock, toolName }: ShareToUnlockModalProps) {
  const [hasShared, setHasShared] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const shareText = `I just used this free ${toolName} and it helped me understand narcissistic abuse patterns. Check it out:`

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}&hashtags=NarcissisticAbuse,ToxicRelationships`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    }
    
    window.open(links[platform], '_blank', 'width=600,height=400')
    
    // Mark as shared after 2 seconds (time to complete share)
    setTimeout(() => {
      setHasShared(true)
      toast.success('Thanks for sharing! Unlocking your second analysis...')
    }, 2000)
  }

  const handleUnlock = () => {
    if (hasShared) {
      localStorage.setItem(`${toolName}_shared`, 'true')
      onUnlock()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
        <div className="text-center mb-6">
          {hasShared ? (
            <Unlock className="h-16 w-16 text-green-600 mx-auto mb-4" />
          ) : (
            <Lock className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {hasShared ? 'Unlocked!' : 'Share to Unlock'}
          </h2>
          <p className="text-gray-600">
            {hasShared 
              ? 'Your second free analysis is now unlocked!'
              : 'You\'ve used your 1 free analysis. Share this tool to unlock 1 more free use!'}
          </p>
        </div>

        {!hasShared ? (
          <>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="h-5 w-5 text-purple-600" />
                <p className="font-semibold text-purple-900">Help Others & Get 1 More Free Use</p>
              </div>
              <p className="text-sm text-purple-800">
                Share this tool with someone who might need it. You could help them recognize abuse patterns.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Facebook className="h-5 w-5" />
                Share on Facebook
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Twitter className="h-5 w-5" />
                Share on Twitter
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                Share on WhatsApp
              </button>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-3">
                Want unlimited analyses?
              </p>
              <a
                href="/auth"
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Create Free Account
              </a>
            </div>
          </>
        ) : (
          <button
            onClick={handleUnlock}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg"
          >
            Continue to Second Analysis
          </button>
        )}
      </div>
    </div>
  )
}
