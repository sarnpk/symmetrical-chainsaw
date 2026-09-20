import { createClient } from '@supabase/supabase-js'
import { sendEmail, notificationEmailHtml } from './email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type NotificationType = 'milestone' | 'community' | 'journal' | 'safety' | 'system' | 'streak' | 'boundary'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  body: string
  link?: string
  /**
   * When provided, also send the notification as an email. Only safe to pass
   * from server code (Resend key is server-side only).
   */
  emailTo?: string
}

/**
 * Create an in-app notification for a user.
 * Uses service role key to bypass RLS for server-side triggers.
 * Optionally emails the user when `emailTo` is set.
 */
export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
  emailTo
}: CreateNotificationParams) {
  // If service role key is not set, fall back to user-context client
  const supabase = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null

  if (!supabase) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set, skipping notification')
    return
  }

  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body,
    link: link || null,
  })

  if (error) {
    console.error('Failed to create notification:', error.message)
    return
  }

  if (emailTo) {
    await sendEmail(
      emailTo,
      title,
      notificationEmailHtml({ title, body, link, cta: link ? 'View in Reclaim' : undefined })
    )
  }
}

/**
 * Notify a user when they hit a no-contact milestone.
 */
export async function notifyMilestone(userId: string, days: number) {
  const milestones: Record<number, string> = {
    1: 'You completed your first day of no contact. Every journey starts with a single step.',
    7: 'One week strong. The hardest part is behind you.',
    14: 'Two weeks of no contact. Your nervous system is beginning to heal.',
    30: '30 days. A full month of choosing yourself. You should be proud.',
    60: '60 days. New patterns are forming. You are rewriting your story.',
    90: '90 days. A major milestone. You have proven your resilience.',
  }

  const message = milestones[days]
  if (!message) return

  await createNotification({
    userId,
    type: 'milestone',
    title: `${days}-Day Milestone`,
    body: message,
    link: '/no-contact-anchor',
  })
}

/**
 * Notify when someone replies to a community post.
 */
export async function notifyCommunityReply(
  userId: string,
  postTitle: string,
  commenterName: string
) {
  await createNotification({
    userId,
    type: 'community',
    title: 'New reply on your post',
    body: `${commenterName} replied to "${postTitle}"`,
    link: '/community',
  })
}

/**
 * Notify about journal streak.
 */
export async function notifyJournalStreak(userId: string, streakDays: number) {
  if (streakDays < 3) return
  await createNotification({
    userId,
    type: 'streak',
    title: `${streakDays}-Day Journal Streak`,
    body: `You've journaled ${streakDays} days in a row. Consistency is key to healing.`,
    link: '/journal',
  })
}

/**
 * System notification (welcome, updates, etc.)
 */
export async function notifySystem(
  userId: string,
  title: string,
  body: string,
  link?: string
) {
  await createNotification({ userId, type: 'system', title, body, link })
}

/**
 * Notify when someone likes your post.
 */
export async function notifyPostLike(
  userId: string,
  postTitle: string,
  likerName: string
) {
  await createNotification({
    userId,
    type: 'community',
    title: 'Your post was liked',
    body: `${likerName} liked "${postTitle}"`,
    link: '/community',
  })
}

/**
 * Notify when someone joins a group chat you're in.
 */
export async function notifyGroupJoin(
  userId: string,
  roomName: string,
  joinerName: string
) {
  await createNotification({
    userId,
    type: 'community',
    title: 'New member in your group',
    body: `${joinerName} joined "${roomName}"`,
    link: '/community',
  })
}

/**
 * Notify that a scheduled boundary review is now due.
 */
export async function notifyBoundaryReviewDue(
  userId: string,
  boundaryId: string,
  boundaryTitle: string
) {
  await createNotification({
    userId,
    type: 'boundary',
    title: 'Boundary Review Due',
    body: `Time to review your boundary: "${boundaryTitle}"`,
    link: `/boundaries/${boundaryId}`,
  })
}

/**
 * Confirmation notification when a boundary review is scheduled.
 */
export async function notifyBoundaryReviewScheduled(
  userId: string,
  boundaryId: string,
  boundaryTitle: string,
  scheduledDate: string
) {
  const when = new Date(scheduledDate).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  await createNotification({
    userId,
    type: 'boundary',
    title: 'Boundary Review Scheduled',
    body: `You scheduled a review for "${boundaryTitle}" on ${when}`,
    link: `/boundaries/${boundaryId}`,
  })
}

/**
 * Notify when your message gets pinned.
 */
export async function notifyMessagePinned(
  userId: string,
  roomName: string,
  pinnerName: string
) {
  await createNotification({
    userId,
    type: 'community',
    title: 'Your message was pinned',
    body: `${pinnerName} pinned your message in "${roomName}"`,
    link: '/community',
  })
}
