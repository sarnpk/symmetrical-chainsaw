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

  // Validate token and admin status
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: auth } = await supabase.auth.getUser(token)
  if (!auth?.user) {
    return { isValid: false, reason: 'Invalid authentication token' }
  }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('role, is_active, last_login_ip, failed_attempts')
    .eq('user_id', auth.user.id)
    .single()

  if (!admin || !admin.is_active || admin.role !== 'super_admin') {
    return { isValid: false, reason: 'Insufficient privileges' }
  }

  if (admin.failed_attempts >= 5) {
    return { isValid: false, reason: 'Account temporarily locked' }
  }

  const clientIP = getClientIP(req)

  // Update last login info
  await supabase
    .from('admin_users')
    .update({
      last_login_ip: clientIP,
      last_login_at: new Date().toISOString(),
      failed_attempts: 0
    })
    .eq('user_id', auth.user.id)

  return { isValid: true, userId: auth.user.id }
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIP || req.ip || 'unknown'
}
