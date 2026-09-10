'use client'

import { useState } from 'react'
import { Image, Video, Mic, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface MediaUploadProps {
  onUploadComplete: (urls: { audio?: string; video?: string; images?: string[] }) => void
}

export default function MediaUpload({ onUploadComplete }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()
  const [videoUrl, setVideoUrl] = useState<string>()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const supabase = createClient()

  const uploadFile = async (file: File, type: 'audio' | 'video' | 'image') => {
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${user.id}/${type}s/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('toxic-memories')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('toxic-memories')
        .getPublicUrl(filePath)

      if (type === 'audio') {
        setAudioUrl(data.publicUrl)
        onUploadComplete({ audio: data.publicUrl })
      } else if (type === 'video') {
        setVideoUrl(data.publicUrl)
        onUploadComplete({ video: data.publicUrl })
      } else {
        const newImages = [...imageUrls, data.publicUrl]
        setImageUrls(newImages)
        onUploadComplete({ images: newImages })
      }

      toast.success(`${type} uploaded`)
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url: string) => {
    const newImages = imageUrls.filter(u => u !== url)
    setImageUrls(newImages)
    onUploadComplete({ images: newImages })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'audio')}
            disabled={uploading || !!audioUrl}
          />
          <div className={`p-4 sm:p-6 border-2 border-dashed rounded-lg text-center ${audioUrl ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:border-blue-500'}`}>
            <Mic className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <span className="text-sm sm:text-xs text-gray-600 font-medium">{audioUrl ? 'Audio added' : 'Upload Audio'}</span>
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'video')}
            disabled={uploading || !!videoUrl}
          />
          <div className={`p-4 sm:p-6 border-2 border-dashed rounded-lg text-center ${videoUrl ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:border-blue-500'}`}>
            <Video className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <span className="text-sm sm:text-xs text-gray-600 font-medium">{videoUrl ? 'Video added' : 'Upload Video'}</span>
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              files.forEach(file => uploadFile(file, 'image'))
            }}
            disabled={uploading}
          />
          <div className="p-4 sm:p-6 border-2 border-dashed rounded-lg text-center border-gray-300 hover:border-blue-500">
            <Image className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <span className="text-sm sm:text-xs text-gray-600 font-medium">Upload Images ({imageUrls.length})</span>
          </div>
        </label>
      </div>

      {uploading && (
        <div className="text-center text-sm text-gray-600">
          <Upload className="h-4 w-4 inline animate-pulse mr-2" />
          Uploading...
        </div>
      )}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover rounded border" />
              <button
                onClick={() => removeImage(url)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
