'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import type { EvidenceFile } from '@/lib/supabase'

interface PhotoEvidenceCardProps {
  evidenceFiles: EvidenceFile[]
  evidenceUrls: {[key: string]: string}
}

export default function PhotoEvidenceCard({ evidenceFiles, evidenceUrls }: PhotoEvidenceCardProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  
  const photoFiles = evidenceFiles.filter(file => file.file_type?.startsWith('image'))
  
  if (photoFiles.length === 0) return null

  const openImageModal = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeImageModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : photoFiles.length - 1)
    } else {
      setSelectedImage(selectedImage < photoFiles.length - 1 ? selectedImage + 1 : 0)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            📸 Photo Evidence
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {photoFiles.length} {photoFiles.length === 1 ? 'image' : 'images'} attached to this entry
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Mobile: Single column, Desktop: Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photoFiles.map((file, index) => (
              <div key={file.id} className="group relative">
                <div className="aspect-square sm:aspect-video overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                  <img
                    src={evidenceUrls[file.id] || ''}
                    alt={file.caption || 'Evidence photo'}
                    className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                    loading="lazy"
                    onClick={() => openImageModal(index)}
                    onError={(e) => {
                      console.error('Image failed to load:', file.storage_path, 'Bucket:', file.storage_bucket)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                {/* Caption and timestamp */}
                <div className="mt-2 space-y-1">
                  {file.caption && (
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{file.caption}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    📅 {new Date(file.uploaded_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full-screen image modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation buttons */}
            {photoFiles.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={evidenceUrls[photoFiles[selectedImage].id] || ''}
              alt={photoFiles[selectedImage].caption || 'Evidence photo'}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              {photoFiles[selectedImage].caption && (
                <p className="font-medium mb-1">{photoFiles[selectedImage].caption}</p>
              )}
              <p className="text-sm opacity-75">
                📅 {new Date(photoFiles[selectedImage].uploaded_at).toLocaleString()}
              </p>
              {photoFiles.length > 1 && (
                <p className="text-sm opacity-75 mt-1">
                  {selectedImage + 1} of {photoFiles.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}