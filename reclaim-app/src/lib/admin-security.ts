import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface SecurityCheck {
  isValid: boolean
  reason?: string
  userId?: string
}

export async function validateAdminAccess(req: NextRequest): Promise<SecurityCheck> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return { isValid: false, reason: 'Missing authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    return { isValid: false, reason: 'Invalid token format' }
  }

  // IP whitelist check (optional - add your admin IPs)
  const clientIP = getClientIP(req)
  if (!isAllowedIP(clientIP)) {
    await logSecurityEvent('BLOCKED_IP', { ip: clientIP, path: req.nextUrl.pathname })
    return { isValid: false, reason: 'IP not whitelisted' }
  }

  // Validate token and admin status
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: auth } = await supabase.auth.getUser(token)
  if (!auth?.user) {
    await logSecurityEvent('INVALID_TOKEN', { ip: clientIP, path: req.nextUrl.pathname })
    return { isValid: false, reason: 'Invalid authentication token' }
  }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('role, is_active, last_login_ip, failed_attempts')
    .eq('user_id', auth.user.id)
    .single()

  if (!admin || !admin.is_active || admin.role !== 'super_admin') {
    await logSecurityEvent('UNAUTHORIZED_ACCESS', { 
      userId: auth.user.id, 
      ip: clientIP, 
      path: req.nextUrl.pathname 
    })
    return { isValid: false, reason: 'Insufficient privileges' }
  }

  // Check for suspicious activity
  if (admin.failed_attempts >= 5) {
    await logSecurityEvent('ACCOUNT_LOCKED', { userId: auth.user.id, ip: clientIP })
    return { isValid: false, reason: 'Account temporarily locked' }
  }

  // Update last login info
  await supabase
    .from('admin_users')
    .update({ 
      last_login_ip: clientIP, 
      last_login_at: new Date().toISOString(),
      failed_attempts: 0 
    })
    .eq('user_id', auth.user.id)

  await logSecurityEvent('ADMIN_ACCESS_GRANTED', { userId: auth.user.id, ip: clientIP })
  
  return { isValid: true, userId: auth.user.id }
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || req.ip || 'unknown'
}

function isAllowedIP(ip: string): boolean {
  // Add your admin IP addresses here for production
  const allowedIPs = [
    '127.0.0.1',
    '::1',
    // Add your production admin IPs here
  ]
  
  // For development, allow all IPs
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  return allowedIPs.includes(ip)
}

async function logSecurityEvent(event: string, data: Record<string, any>) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase.from('security_logs').insert({
    event_type: event,
    event_data: data,
    created_at: new Date().toISOString()
  }).catch(console.error) // Don't fail if logging fails
}