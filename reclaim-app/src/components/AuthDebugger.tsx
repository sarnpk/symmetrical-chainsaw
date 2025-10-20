'use client'

import React, { useState, useEffect } from 'react'

export function AuthDebugger() {
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkAuth = async () => {
    setLoading(true)
    const info: any = {
      timestamp: new Date().toISOString(),
      windowExists: typeof window !== 'undefined',
      localStorage: {},
      sessionStorage: {},
      cookies: {},
      supabaseGlobal: null,
      supabaseClient: null,
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
      }
    }

    if (typeof window !== 'undefined') {
      // Check localStorage
      try {
        const keys = Object.keys(localStorage)
        info.localStorage = {
          totalKeys: keys.length,
          supabaseKeys: keys.filter(k => k.includes('supabase')),
          authKeys: keys.filter(k => k.includes('auth')),
          allKeys: keys
        }
        
        // Try to get specific auth data
        const authToken = localStorage.getItem('supabase.auth.token')
        if (authToken) {
          try {
            info.localStorage.authTokenParsed = JSON.parse(authToken)
          } catch {
            info.localStorage.authTokenRaw = authToken.substring(0, 100) + '...'
          }
        }
      } catch (error) {
        info.localStorage.error = error.message
      }

      // Check sessionStorage
      try {
        const keys = Object.keys(sessionStorage)
        info.sessionStorage = {
          totalKeys: keys.length,
          supabaseKeys: keys.filter(k => k.includes('supabase')),
          authKeys: keys.filter(k => k.includes('auth')),
          allKeys: keys
        }
      } catch (error) {
        info.sessionStorage.error = error.message
      }

      // Check cookies
      try {
        info.cookies = {
          all: document.cookie,
          supabaseCookies: document.cookie.split(';').filter(c => c.includes('supabase'))
        }
      } catch (error) {
        info.cookies.error = error.message
      }

      // Check global supabase
      try {
        const supabase = (window as any).supabase
        if (supabase) {
          info.supabaseGlobal = {
            exists: true,
            type: typeof supabase,
            methods: Object.getOwnPropertyNames(supabase).filter(name => typeof supabase[name] === 'function')
          }
          
          try {
            const { data: { session } } = await supabase.auth.getSession()
            info.supabaseGlobal.session = {
              exists: !!session,
              user: session?.user ? {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role
              } : null,
              accessToken: session?.access_token ? 'EXISTS' : 'MISSING'
            }
          } catch (error) {
            info.supabaseGlobal.sessionError = error.message
          }
        } else {
          info.supabaseGlobal = { exists: false }
        }
      } catch (error) {
        info.supabaseGlobal = { error: error.message }
      }

      // Try to create supabase client
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (supabaseUrl && supabaseKey) {
          const client = createClient(supabaseUrl, supabaseKey)
          info.supabaseClient = {
            created: true,
            url: supabaseUrl,
            keyLength: supabaseKey.length
          }
          
          try {
            const { data: { session } } = await client.auth.getSession()
            info.supabaseClient.session = {
              exists: !!session,
              user: session?.user ? {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role
              } : null,
              accessToken: session?.access_token ? 'EXISTS' : 'MISSING'
            }
          } catch (error) {
            info.supabaseClient.sessionError = error.message
          }
        } else {
          info.supabaseClient = {
            created: false,
            reason: 'Missing environment variables',
            url: supabaseUrl ? 'SET' : 'MISSING',
            key: supabaseKey ? 'SET' : 'MISSING'
          }
        }
      } catch (error) {
        info.supabaseClient = { error: error.message }
      }
    }

    setAuthInfo(info)
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Authentication Debugger</h2>
        <button
          onClick={checkAuth}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {authInfo && (
        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Environment Variables</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(authInfo.envVars, null, 2)}
            </pre>
          </div>

          {/* Global Supabase */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Global Supabase Instance</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(authInfo.supabaseGlobal, null, 2)}
            </pre>
          </div>

          {/* Supabase Client */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">Supabase Client</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(authInfo.supabaseClient, null, 2)}
            </pre>
          </div>

          {/* LocalStorage */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">LocalStorage</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(authInfo.localStorage, null, 2)}
            </pre>
          </div>

          {/* SessionStorage */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">SessionStorage</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(authInfo.sessionStorage, null, 2)}
            </pre>
          </div>

          {/* Cookies */}
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold mb-2">Cookies</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(authInfo.cookies, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}