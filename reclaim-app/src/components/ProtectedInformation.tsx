'use client'

import { useState, useEffect } from 'react'
import { Lock, Unlock, Eye, EyeOff, Save, Shield, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { getSafetyPlan, updateProtectedInfo, getProtectedInfoHash } from '@/lib/supabase'
import { hashPassword, verifyPassword } from '@/lib/password-utils'
import toast from 'react-hot-toast'

interface ProtectedInformationProps {
  userId: string
}

export default function ProtectedInformation({ userId }: ProtectedInformationProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [protectedInfo, setProtectedInfo] = useState('')
  const [originalInfo, setOriginalInfo] = useState('')
  const [hasPassword, setHasPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const supabase = createClient()

  useEffect(() => {
    checkExistingPassword()
  }, [userId])

  const checkExistingPassword = async () => {
    try {
      const { data, error } = await getProtectedInfoHash(userId)
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking password:', error)
        return
      }
      
      setHasPassword(!!data?.protected_info_password_hash)
    } catch (error) {
      console.error('Error checking existing password:', error)
    }
  }

  const handleUnlock = async () => {
    if (!password.trim()) {
      toast.error('Please enter your password')
      return
    }

    setLoading(true)
    try {
      const { data: hashData, error: hashError } = await getProtectedInfoHash(userId)
      
      if (hashError) {
        toast.error('Error accessing protected information')
        return
      }

      if (!hashData?.protected_info_password_hash) {
        toast.error('No password set for protected information')
        return
      }

      const isValid = await verifyPassword(password, hashData.protected_info_password_hash)
      
      if (isValid) {
        // Load the protected information
        const { data: safetyPlan, error: planError } = await getSafetyPlan(userId)
        
        if (planError) {
          toast.error('Error loading protected information')
          return
        }

        setProtectedInfo(safetyPlan?.protected_information || '')
        setOriginalInfo(safetyPlan?.protected_information || '')
        setIsUnlocked(true)
        setPassword('')
        toast.success('Protected information unlocked')
      } else {
        toast.error('Incorrect password')
      }
    } catch (error) {
      console.error('Error unlocking:', error)
      toast.error('Error unlocking protected information')
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async () => {
    if (!password.trim()) {
      toast.error('Please enter a password')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      const passwordHash = await hashPassword(password)
      await updateProtectedInfo(userId, '', passwordHash)
      
      setHasPassword(true)
      setIsSettingPassword(false)
      setPassword('')
      setConfirmPassword('')
      toast.success('Password set successfully')
    } catch (error) {
      console.error('Error setting password:', error)
      toast.error('Error setting password')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!isUnlocked) return

    setSaving(true)
    try {
      const { data: hashData } = await getProtectedInfoHash(userId)
      const passwordHash = hashData?.protected_info_password_hash || ''
      
      await updateProtectedInfo(userId, protectedInfo, passwordHash)
      setOriginalInfo(protectedInfo)
      toast.success('Protected information saved')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Error saving protected information')
    } finally {
      setSaving(false)
    }
  }

  const handleLock = () => {
    setIsUnlocked(false)
    setProtectedInfo('')
    setOriginalInfo('')
    setPassword('')
  }

  const hasChanges = protectedInfo !== originalInfo

  if (!hasPassword && !isSettingPassword) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Protected Information</h2>
          </div>
        </div>

        <div className="text-center py-8">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Vault</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Store sensitive information like financial details, passwords, or important notes with an additional layer of security.
          </p>
          <button
            onClick={() => setIsSettingPassword(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Set Up Protection
          </button>
        </div>
      </div>
    )
  }

  if (isSettingPassword) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Set Protection Password</h2>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> This password is separate from your account password. 
                  Make sure to remember it as it cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protection Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter a secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm your password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsSettingPassword(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSetPassword}
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Setting...' : 'Set Password'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render locked or unlocked UI
  if (!isUnlocked) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Protected Information</h2>
          </div>
        </div>

        <div className="text-center py-8">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enter Password</h3>
          <p className="text-gray-600 mb-6">
            Enter your protection password to access your secure information.
          </p>

          <div className="max-w-sm mx-auto space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Unlocking...'
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  Unlock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Protected Information</h2>
          <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-700 border border-green-200">
            <Unlock className="h-3.5 w-3.5 mr-1" /> Unlocked
          </span>
        </div>
        <button
          onClick={handleLock}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Lock className="h-4 w-4" /> Lock
        </button>
      </div>

      <div className="max-w-2xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secure Notes
        </label>
        <textarea
          value={protectedInfo}
          onChange={(e) => setProtectedInfo(e.target.value)}
          placeholder="Write sensitive info here (financial details, important notes, passwords, etc.)"
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
          {hasChanges && (
            <span className="text-sm text-gray-500">Unsaved changes</span>
          )}
        </div>
      </div>
    </div>
  )
}
