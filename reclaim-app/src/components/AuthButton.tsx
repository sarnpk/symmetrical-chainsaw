'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogIn, UserPlus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary'
}

export default function AuthButton({ variant = 'secondary' }: AuthButtonProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [abuserGender, setAbuserGender] = useState<string>('')
  const [hasChildren, setHasChildren] = useState<boolean | null>(null)
  const [childrenCount, setChildrenCount] = useState(0)
  const [custodyArrangement, setCustodyArrangement] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        
        // Create profile with additional info
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email!,
            display_name: displayName || data.user.email?.split('@')[0],
            abuser_gender: abuserGender || null,
            has_children: hasChildren || false,
            custody_arrangement: custodyArrangement || null,
            subscription_tier: 'foundation',
          })

          // Create affirmation preferences if user has children
          if (hasChildren) {
            await supabase.from('affirmation_preferences').insert({
              user_id: data.user.id,
              has_children: true,
              children_count: childrenCount,
              custody_situation: custodyArrangement,
              preferred_focus: ['children']
            })
          }
        }
        
        toast.success('Check your email for confirmation link!')
        setShowForm(false)
        setEmail('')
        setPassword('')
        setDisplayName('')
        setAbuserGender('')
        setHasChildren(null)
        setChildrenCount(0)
        setCustodyArrangement('')
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
    setDisplayName('')
    setAbuserGender('')
    setHasChildren(null)
    setChildrenCount(0)
    setCustodyArrangement('')
    setLoading(false)
  }
  
  const Modal = (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-4">
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

        <form onSubmit={handleAuth} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="How should we address you?"
              />
            </div>
          )}
          
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
              minLength={6}
            />
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            )}
          </div>
          
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person You're Managing Interactions With (Optional)
                </label>
                <select
                  value={abuserGender}
                  onChange={(e) => setAbuserGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This helps us personalize content and pronouns
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have children together? (Optional)
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasChildren"
                      checked={hasChildren === true}
                      onChange={() => setHasChildren(true)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasChildren"
                      checked={hasChildren === false}
                      onChange={() => setHasChildren(false)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {hasChildren && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How many children?
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={childrenCount || ''}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custody arrangement
                    </label>
                    <select
                      value={custodyArrangement}
                      onChange={(e) => setCustodyArrangement(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select arrangement</option>
                      <option value="full">Full custody</option>
                      <option value="shared">Shared custody</option>
                      <option value="limited">Limited visitation</option>
                      <option value="supervised">Supervised visitation</option>
                      <option value="none">No contact/custody</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
          
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )

  const primaryClasses = "bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
  const secondaryClasses = "text-gray-700 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"

  return (
    <>
      {showForm && typeof window !== 'undefined' && createPortal(Modal, document.body)}
      <button
        onClick={() => setShowForm(true)}
        className={variant === 'primary' ? primaryClasses : secondaryClasses}
      >
        <LogIn className="h-4 w-4" />
        Get Started
      </button>
    </>
  )
}