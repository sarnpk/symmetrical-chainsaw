'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogIn, UserPlus, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary'
}

export default function AuthButton({ variant = 'secondary' }: AuthButtonProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        toast.success('Check your email for confirmation link!')
        setShowForm(false)
        setEmail('')
        setPassword('')
      } else {
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
      }
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

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              {isSignUp ? <UserPlus className="h-6 w-6 text-indigo-600" /> : <LogIn className="h-6 w-6 text-indigo-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSignUp ? 'Start your healing journey today' : 'Continue your recovery path'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const primaryClasses = "bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
  const secondaryClasses = "text-gray-700 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"

  return (
    <button
      onClick={() => setShowForm(true)}
      className={variant === 'primary' ? primaryClasses : secondaryClasses}
    >
      <LogIn className="h-4 w-4" />
      Get Started
    </button>
  )
} 