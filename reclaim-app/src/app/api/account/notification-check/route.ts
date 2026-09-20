import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import {
  createNotification,
  notifyJournalStreak,
} from '@/lib/notifications'

const DAY_MS = 24 * 60 * 60 * 1000

async function getMarker(supabase: any, userId: string, key: string): Promise<string | null> {
  const { data } = await supabase
    .from('notification_markers')
    .select('marker_value')
    .eq('user_id', userId)
    .eq('marker_key', key)
    .maybeSingle()
  return data?.marker_value ?? null
}

async function setMarker(supabase: any, userId: string, key: string, value: string) {
  await supabase.from('notification_markers').upsert(
    { user_id: userId, marker_key: key, marker_value: value },
    { onConflict: 'user_id,marker_key' }
  )
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

/**
 * Compute the current consecutive-day journaling streak from entry timestamps.
 * Uses UTC calendar dates; a streak counts only if today or yesterday has an entry.
 */
function computeStreak(entryTimestamps: string[]): number {
  const seen = new Set<string>()
  for (const ts of entryTimestamps) {
    seen.add(new Date(ts).toISOString().slice(0, 10))
  }
  const dates = [...seen].sort().reverse()
  if (dates.length === 0) return 0

  const today = startOfUtcDay(new Date()).toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10)

  let cursor: string
  if (dates[0] === today) cursor = today
  else if (dates[0] === yesterday) cursor = yesterday
  else return 0

  let streak = 0
  for (const d of dates) {
    if (d === cursor) {
      streak += 1
      const prev = new Date(new Date(cursor + 'T00:00:00Z').getTime() - DAY_MS)
        .toISOString()
        .slice(0, 10)
      cursor = prev
    } else {
      break
    }
  }
  return streak
}

/**
 * GET /api/account/notification-check
 * Idempotent sweep that turns missed "natural moments" into in-app (and
 * where marked, email) notifications. Called by the notification bell on
 * load and on its 60s poll. Each moment is guarded by a notification_markers
 * row so it only fires once.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = user.id
    const emailTo = user.email ?? undefined
    const now = Date.now()
    const summary: Record<string, number> = {}

    // ---- Trial expiry -------------------------------------------------
    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_end_date, subscription_tier, pre_trial_tier')
      .eq('id', userId)
      .maybeSingle()

    if (profile?.trial_end_date) {
      const endMs = new Date(profile.trial_end_date).getTime()
      if (endMs > now && endMs <= now + 3 * DAY_MS) {
        const daysLeft = Math.max(1, Math.ceil((endMs - now) / DAY_MS))
        const marker = await getMarker(supabase, userId, 'trial-expiry-days')
        if (marker !== String(daysLeft)) {
          await createNotification({
            userId,
            type: 'system',
            title: 'Your free trial ends soon',
            body: daysLeft === 1
              ? 'Your free trial ends tomorrow. Upgrade anytime to keep your current features.'
              : `Your free trial ends in ${daysLeft} days. Upgrade anytime to keep your current features.`,
            link: '/pricing',
            emailTo,
          })
          await setMarker(supabase, userId, 'trial-expiry-days', String(daysLeft))
          summary.trialExpiry = (summary.trialExpiry || 0) + 1
        }
      } else if (endMs <= now) {
        const marker = await getMarker(supabase, userId, 'trial-expired')
        if (marker !== profile.trial_end_date) {
          await createNotification({
            userId,
            type: 'system',
            title: 'Your free trial has ended',
            body: 'Upgrade to a paid plan to continue enjoying your upgraded features.',
            link: '/pricing',
            emailTo,
          })
          await setMarker(supabase, userId, 'trial-expired', profile.trial_end_date)
          summary.trialExpired = 1
        }
      }
    }

    // ---- Payment failures / renewals ----------------------------------
    const { data: payments } = await supabase
      .from('payments')
      .select('id, stripe_payment_id, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    for (const payment of payments || []) {
      if (payment.status === 'failed') {
        const marker = await getMarker(supabase, userId, `payment-failed-${payment.stripe_payment_id || payment.id}`)
        if (!marker) {
          await createNotification({
            userId,
            type: 'system',
            title: 'Payment failed',
            body: 'We couldn’t charge your payment method for your subscription. Update your payment details to avoid any interruption.',
            link: '/pricing',
            emailTo,
          })
          await setMarker(supabase, userId, `payment-failed-${payment.stripe_payment_id || payment.id}`, '1')
          summary.paymentFailed = (summary.paymentFailed || 0) + 1
        }
      } else if (payment.status === 'succeeded') {
        const marker = await getMarker(supabase, userId, `payment-renewed-${payment.stripe_payment_id || payment.id}`)
        if (!marker && Date.now() - new Date(payment.created_at).getTime() < 7 * DAY_MS) {
          await createNotification({
            userId,
            type: 'system',
            title: 'Payment received',
            body: 'Thanks for your subscription payment. Your plan is all set.',
            link: '/account',
          })
          await setMarker(supabase, userId, `payment-renewed-${payment.stripe_payment_id || payment.id}`, '1')
          summary.paymentRenewed = (summary.paymentRenewed || 0) + 1
        }
      }
    }

    // ---- Safety plan review overdue ------------------------------------
    const { data: safetyPlan } = await supabase
      .from('safety_plans')
      .select('id, last_reviewed, review_frequency_days')
      .eq('user_id', userId)
      .maybeSingle()

    if (safetyPlan) {
      const freqDays = safetyPlan.review_frequency_days || 0
      const lastReviewed = safetyPlan.last_reviewed || null
      const expected = lastReviewed
        ? new Date(new Date(lastReviewed).getTime() + freqDays * DAY_MS).getTime()
        : null
      const nextMark = lastReviewed || 'unreviewed'
      const marker = await getMarker(supabase, userId, 'safety-review')
      const isOverdue = expected === null || (freqDays > 0 && now > expected)

      if (isOverdue && marker !== nextMark) {
        await createNotification({
          userId,
          type: 'safety',
          title: 'Safety plan review overdue',
          body: lastReviewed
            ? 'It’s been a while since you reviewed your safety plan. Take a few minutes to make sure it still fits your situation.'
            : 'You haven’t marked your safety plan as reviewed yet. Set a cadence and do a quick review.',
          link: '/safety-plan',
          emailTo,
        })
        await setMarker(supabase, userId, 'safety-review', nextMark)
        summary.safetyReview = 1
      }
    }

    // ---- Journal streak milestones ------------------------------------
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(2000)

    const streak = computeStreak((journalEntries || []).map((e: any) => e.created_at))
    const milestones = [3, 5, 7, 14, 21, 30, 60, 90]
    for (const m of milestones) {
      if (streak < m) break
      const marker = await getMarker(supabase, userId, `journal-streak-${m}`)
      if (!marker) {
        await notifyJournalStreak(userId, m)
        await setMarker(supabase, userId, `journal-streak-${m}`, '1')
        summary.journalStreak = (summary.journalStreak || 0) + 1
      }
    }

    // ---- Badges --------------------------------------------------------
    const { data: earnedBadges } = await supabase
      .from('community_user_badges')
      .select('badge_id, earned_at, community_badges(name, icon, description)')
      .eq('user_id', userId)

    for (const badge of earnedBadges || []) {
      const badgeId = badge.badge_id
      const marker = await getMarker(supabase, userId, `badge-${badgeId}`)
      const meta: any = badge.community_badges
      if (!marker) {
        if (badge.earned_at && Date.now() - new Date(badge.earned_at).getTime() < 7 * DAY_MS) {
          await createNotification({
            userId,
            type: 'community',
            title: `${meta?.icon || '🏅'} Badge earned`,
            body: `You earned the "${meta?.name || 'Community'}" badge${meta?.description ? ` — ${meta.description}` : ''}.`,
            link: '/community',
          })
          summary.badges = (summary.badges || 0) + 1
        }
        await setMarker(supabase, userId, `badge-${badgeId}`, '1')
      }
    }

    // ---- Level-ups ------------------------------------------------------
    const { data: stats } = await supabase
      .from('community_user_stats')
      .select('level')
      .eq('user_id', userId)
      .maybeSingle()

    const level = stats?.level || 0
    if (level >= 2) {
      const marker = await getMarker(supabase, userId, `level-${level}`)
      if (!marker) {
        await createNotification({
          userId,
          type: 'community',
          title: `You reached level ${level}`,
          body: `Keep posting and engaging to keep climbing.`,
          link: '/community',
        })
        await setMarker(supabase, userId, `level-${level}`, '1')
        summary.levelUps = (summary.levelUps || 0) + 1
      }
    }

    return NextResponse.json({ created: summary })
  } catch (error: any) {
    console.error('GET /api/account/notification-check error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to check notifications' }, { status: 500 })
  }
}