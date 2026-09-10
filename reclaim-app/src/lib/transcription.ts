import { supabase } from './supabase'

export type TranscriptionStatus = 'processing' | 'completed'

export async function getAccessToken(): Promise<string | undefined> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export async function pollTranscriptionStatus(
  evidenceFileId: string,
  jobId?: string,
): Promise<{ success: boolean; status: TranscriptionStatus; job_id: string }>{
  const token = await getAccessToken()
  if (!token) throw new Error('User not authenticated')

  const res = await fetch('/api/evidence/transcribe/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ evidence_file_id: evidenceFileId, job_id: jobId }),
  })

  if (!res.ok) {
    let msg = `Status check failed: ${res.status}`
    try {
      const err = await res.json()
      msg = err?.error || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export async function waitForTranscription(
  evidenceFileId: string,
  jobId?: string,
  opts: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<{ job_id: string }>{
  const intervalMs = opts.intervalMs ?? 5000
  const timeoutMs = opts.timeoutMs ?? 300000 // 5 minutes

  const started = Date.now()
  let lastJobId = jobId
  // First immediate attempt (fast path)
  let data = await pollTranscriptionStatus(evidenceFileId, lastJobId)
  lastJobId = data.job_id
  if (data.status === 'completed') return { job_id: lastJobId }

  while (Date.now() - started < timeoutMs) {
    await new Promise((r) => setTimeout(r, intervalMs))
    data = await pollTranscriptionStatus(evidenceFileId, lastJobId)
    lastJobId = data.job_id
    if (data.status === 'completed') return { job_id: lastJobId }
  }
  throw new Error('Transcription timed out')
}

/*
Usage example in a component/flow after starting transcription:

// after you POST /api/evidence/transcribe and receive { status: 'processing', job_id }
const { job_id } = await waitForTranscription(evidenceFileId, startJobId)
// then re-fetch the evidence_file row via Supabase to get `transcription` and updated statuses
*/
