'use client'

import { Trash2 } from 'lucide-react'
import type { JournalEntry } from '@/lib/supabase'

interface DeleteConfirmationModalProps {
  entry: JournalEntry
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmationModal({ 
  entry, 
  isOpen, 
  isDeleting, 
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Experience</h3>
            <p className="text-xs sm:text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-sm sm:text-base text-gray-700 mb-6">
          Are you sure you want to delete "<strong className="break-words">{entry.title}</strong>"? 
          This will permanently remove the experience and all associated evidence files.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Experience
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}