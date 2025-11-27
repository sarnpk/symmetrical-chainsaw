'use client'

import { useState } from 'react'
import { X, Gift, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'

interface RedeemCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RedeemCodeModal({ isOpen, onClose, onSuccess }: RedeemCodeModalProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)

  const validateCode = async () => {
    if (!code.trim()) return

    try {
      const response = await fetch(`/api/redeem?code=${encodeURIComponent(code.trim())}`)
      const result = await response.json()
      
      if (result.valid) {
        setValidationResult(result)
      } else {
        toast.error(result.error || 'Invalid code')
        setValidationResult(null)
      }
    } catch (error) {
      toast.error('Failed to validate code')
      setValidationResult(null)
    }
  }

  const redeemCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter a code')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        onSuccess()
        onClose()
        setCode('')
        setValidationResult(null)
      } else {
        toast.error(result.error || 'Failed to redeem code')
      }
    } catch (error) {
      toast.error('Failed to redeem code')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCode('')
    setValidationResult(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Redeem Trial Code</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                setValidationResult(null)
              }}
              onBlur={validateCode}
              placeholder="YOUTUBE7DAY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-center text-lg"
            />
          </div>

          {validationResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Valid Code!</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>• Upgrade to: <span className="font-medium capitalize">{validationResult.target_tier}</span></p>
                <p>• Trial duration: <span className="font-medium">{validationResult.trial_duration_days} days</span></p>
                {validationResult.description && (
                  <p>• {validationResult.description}</p>
                )}
                {validationResult.remaining_uses !== -1 && (
                  <p>• Remaining uses: <span className="font-medium">{validationResult.remaining_uses}</span></p>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">How it works</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enter a valid trial code to upgrade your account</li>
              <li>• Enjoy premium features for the trial period</li>
              <li>• Your account will revert to your original tier when the trial ends</li>
              <li>• You can upgrade to a paid plan anytime during the trial</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={redeemCode}
              disabled={loading || !validationResult}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Redeeming...' : 'Redeem Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}