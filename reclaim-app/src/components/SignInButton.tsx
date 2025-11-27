'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogIn, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'

interface SignInButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function SignInButton({ variant = 'secondary', className }: SignInButtonProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      // Create user profile if it doesn't exist (do NOT overwrite existing)
      if (data.user) {
        try {
          const { data: existingProfile, error: fetchErr } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle()

          if (fetchErr) {
            console.error('Error checking existing profile:', fetchErr)
          }

          if (!existingProfile) {
            const { error: insertErr } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                display_name: data.user.email?.split('@')[0],
                subscription_tier: 'foundation',
              })

            if (insertErr) {
              console.error('Profile creation error:', insertErr)
            }
          }
        } catch (e) {
          console.error('Unexpected profile ensure error:', e)
        }
      }
      
      toast.success('Welcome back!')
      setShowForm(false)
      setEmail('')
      setPassword('')
      
      // Force a page refresh to update auth state
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 500)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowForm(false)
    setEmail('')
    setPassword('')
    setLoading(false)
  }
  
  const Modal = (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative my-8">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Continue your recovery journey</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-600">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Forgot your password?
            </a>
          </p>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={closeModal}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Get Started
            </button>
          </p>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )

  const primaryClasses = "bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
  const secondaryClasses = "text-gray-700 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"

  return (
    <>
      {showForm && typeof window !== 'undefined' && createPortal(Modal, document.body)}
      <button
        onClick={() => setShowForm(true)}
        className={className || (variant === 'primary' ? primaryClasses : secondaryClasses)}
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </button>
    </>
  )
}