'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogIn, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import UnifiedHeader from '@/components/UnifiedHeader'
import { Turnstile } from '@marsidev/react-turnstile'

function AuthForm() {
  const searchParams = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [abuserGender, setAbuserGender] = useState('')
  const [hasChildren, setHasChildren] = useState<boolean | null>(null)
  const [childrenCount, setChildrenCount] = useState(0)
  const [custodyArrangement, setCustodyArrangement] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!turnstileToken) {
      toast.error('Please complete the security check')
      return
    }
    
    setLoading(true)

    try {
      // Verify Turnstile token
      const verifyRes = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken })
      })
      
      if (!verifyRes.ok) {
        throw new Error('Security verification failed')
      }
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        
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
        
        if (data.user) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle()

          if (!existingProfile) {
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email!,
              display_name: data.user.email?.split('@')[0],
              subscription_tier: 'foundation',
            })
          }
        }
        
        toast.success('Welcome back!')
        router.push(redirectTo)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            {isSignUp ? <UserPlus className="h-6 w-6 text-indigo-600" /> : <LogIn className="h-6 w-6 text-indigo-600" />}
          </div>
          {redirectTo !== '/dashboard' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                🔒 Please sign in to access {redirectTo.replace('/', '').replace('-', ' ')}
              </p>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isSignUp ? 'Start your healing journey today' : 'Continue your recovery path'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="How should we address you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person You're Managing Interactions With (Optional)
                </label>
                <select
                  value={abuserGender}
                  onChange={(e) => setAbuserGender(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
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
                      className="w-20 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custody arrangement
                    </label>
                    <select
                      value={custodyArrangement}
                      onChange={(e) => setCustodyArrangement(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            )}
          </div>
          
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAACHvmqj6aVkicEsF'}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => toast.error('Security check failed')}
              onExpire={() => setTurnstileToken('')}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !turnstileToken}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/privacy" className="underline">privacy policy</Link>.
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <UnifiedHeader showAuth={false} />
      <Suspense fallback={<div className="flex items-center justify-center px-4 py-16">Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  )
}
