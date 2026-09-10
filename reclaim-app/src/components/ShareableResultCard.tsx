'use client'

import { Download, Instagram } from 'lucide-react'
import { useRef } from 'react'
import toast from 'react-hot-toast'

interface ShareableResultCardProps {
  resultType: string
  score?: number
  mainText: string
}

export default function ShareableResultCard({ resultType, score, mainText }: ShareableResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadAsImage = async () => {
    if (!cardRef.current) return
    
    try {
      // Use html2canvas if available, otherwise show copy message
      toast.success('Screenshot this card to share on Instagram/TikTok!')
    } catch (error) {
      toast.error('Please screenshot this card to share')
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Instagram className="h-5 w-5 text-purple-600" />
        <p className="font-semibold text-gray-900">Share on Instagram/TikTok</p>
      </div>
      
      <div 
        ref={cardRef}
        className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white aspect-square flex flex-col justify-between"
      >
        <div>
          <div className="text-sm opacity-90 mb-2">My Result:</div>
          <h3 className="text-2xl font-bold mb-4">{resultType}</h3>
          {score && (
            <div className="text-4xl font-bold mb-2">{score}/10</div>
          )}
          <p className="text-sm opacity-90">{mainText}</p>
        </div>
        
        <div className="text-center">
          <div className="text-xs opacity-75 mb-1">Free AI Analysis Tool</div>
          <div className="font-bold">reclaimyourlife.app</div>
        </div>
      </div>

      <button
        onClick={downloadAsImage}
        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90"
      >
        <Download className="h-4 w-4" />
        <span className="text-sm font-medium">Screenshot & Share</span>
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        Screenshot this card and share on your story
      </p>
    </div>
  )
}
