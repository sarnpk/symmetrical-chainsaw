'use client'

// Shared Web Speech API (dictation) helper.
//
// Problem: webkitSpeechRecognition.start() silently fails with a
// `not-allowed` error and shows NO permission popup when the browser has
// no stored microphone decision (or a cached denial). This makes voice
// dictation appear broken on every page.
//
// Fix: explicitly request microphone access via navigator.mediaDevices
// .getUserMedia() before starting recognition. This always shows the
// browser permission prompt when no decision exists, and once granted the
// origin-level mic permission also satisfies SpeechRecognition.

export type SpeechRecognitionLike = any

let micStream: MediaStream | null = null

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  )
}

export function createSpeechRecognition(): SpeechRecognitionLike | null {
  if (!isSpeechRecognitionSupported()) return null
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  const recognition = new SR()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'en-US'
  return recognition
}

/**
 * Request microphone permission. Resolves once permission is granted and
 * keeps a lightweight stream open (some browsers require an active audio
 * track for SpeechRecognition to work reliably). Always call this from a
 * user gesture (button click) so the permission prompt can appear.
 */
export async function ensureMicrophonePermission(): Promise<{
  granted: boolean
  error?: string
}> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return {
      granted: false,
      error: 'Voice input is not supported in this browser. Try Chrome, Edge, or Safari.',
    }
  }

  try {
    // Reuse an existing live stream if we already have permission.
    if (micStream && micStream.getAudioTracks().some((t) => t.readyState === 'live')) {
      return { granted: true }
    }

    micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return { granted: true }
  } catch (err: any) {
    return { granted: false, error: micErrorMessage(err) }
  }
}

/** Release the microphone stream (call when dictation stops). */
export function releaseMicrophonePermission(): void {
  if (micStream) {
    micStream.getTracks().forEach((t) => t.stop())
    micStream = null
  }
}

/** Map getUserMedia / SpeechRecognition errors to friendly messages. */
export function micErrorMessage(err: any): string {
  const name = err?.name || err?.error || ''
  const code = err?.error || err?.name || ''

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || code === 'not-allowed') {
    return 'Microphone access is blocked. Click the mic/lock icon in your browser address bar, set Microphone to "Allow", then try again.'
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || code === 'audio-capture') {
    return 'No microphone was found. Connect a microphone and try again.'
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Your microphone is in use by another app. Close other apps using the mic and try again.'
  }
  if (name === 'OverconstrainedError') {
    return 'Your microphone does not meet the required audio settings.'
  }
  if (code === 'no-speech') {
    return 'No speech detected. Please speak clearly into the microphone and try again.'
  }
  if (code === 'network') {
    return 'The speech service is unreachable. Check your internet connection and try again.'
  }
  if (code === 'service-not-allowed') {
    return 'Speech recognition is blocked by the browser. Use Chrome, Edge, or Safari over HTTPS.'
  }
  if (code === 'aborted') {
    return ''
  }
  return err?.message || 'Voice input failed. Please try again.'
}
