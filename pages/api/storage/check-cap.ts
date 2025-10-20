// API route to check storage cap for uploads
import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { incoming_bytes = 0 } = req.body as { incoming_bytes?: number }

    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Authorization header required' })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.subscription_tier || 'foundation'

    // Fetch storage limit (in MB) from Supabase feature_limits
    const { data: limitRow, error: limitErr } = await supabase
      .from('feature_limits')
      .select('limit_value')
      .eq('subscription_tier', tier)
      .eq('feature_name', 'storage')
      .eq('limit_type', 'storage_mb')
      .single()
    if (limitErr) {
      console.error('Failed to read storage limit:', limitErr)
      return res.status(500).json({ error: 'Failed to read plan limits' })
    }
    const storageMb = typeof limitRow?.limit_value === 'number' ? limitRow!.limit_value : -1
    const capBytes = storageMb === -1 ? -1 : storageMb * 1024 * 1024
    if (capBytes === -1) {
      return res.status(200).json({ allowed: true, remaining_bytes: -1 })
    }

    // Sum existing evidence sizes for images and audio
    const { data: sumRes, error: sumErr } = await supabase
      .from('evidence_files')
      .select('file_size')
      .eq('user_id', user.id)

    if (sumErr) {
      console.error('Failed to fetch storage usage:', sumErr)
      return res.status(500).json({ error: 'Failed to verify storage usage' })
    }

    const used = (sumRes || [])
      .filter((r: any) => typeof r.file_size === 'number')
      .reduce((acc: number, r: any) => acc + (r.file_size || 0), 0)

    const remaining = Math.max(0, capBytes - used)

    if (incoming_bytes > remaining) {
      return res.status(429).json({
        allowed: false,
        error: 'Storage limit exceeded for your plan',
        cap_bytes: capBytes,
        used_bytes: used,
        remaining_bytes: remaining,
        upgrade_required: true,
      })
    }

    return res.status(200).json({
      allowed: true,
      cap_bytes: capBytes,
      used_bytes: used,
      remaining_bytes: remaining,
    })
  } catch (error) {
    console.error('check-cap error:', error)
    return res.status(500).json({ error: 'Storage cap check failed' })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
