'use client'

import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, Clock } from 'lucide-react'

interface SecurityInfo {
  lastLogin?: string
  loginIP?: string
  failedAttempts?: number
}

export default function AdminSecurityBanner() {
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo>({})
  const [sessionTimeout, setSessionTimeout] = useState<number>(0)

  useEffect(() => {
    // Mock security info - replace with actual API call
    setSecurityInfo({
      lastLogin: new Date().toISOString(),
      loginIP: '192.168.1.1',
      failedAttempts: 0
    })

    // Session timeout countdown (30 minutes)
    const timeout = 30 * 60 * 1000
    const interval = setInterval(() => {
      const elapsed = Date.now() - (Date.now() - timeout)
      setSessionTimeout(Math.max(0, elapsed))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Secure Admin Session</h3>
            <div className="text-sm opacity-90 flex gap-4">
              {securityInfo.lastLogin && (
                <span>Last login: {new Date(securityInfo.lastLogin).toLocaleString()}</span>
              )}
              {securityInfo.loginIP && (
                <span>IP: {securityInfo.loginIP}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {securityInfo.failedAttempts && securityInfo.failedAttempts > 0 && (
            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{securityInfo.failedAttempts} failed attempts</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Session: {formatTime(sessionTimeout)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}