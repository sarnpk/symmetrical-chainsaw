#!/usr/bin/env node

/**
 * Script to fix stuck transcriptions by checking Gladia API status
 * and updating the database accordingly.
 * 
 * Usage: node scripts/fix-stuck-transcriptions.js
 */

const { createClient } = require('@supabase/supabase-js')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GLADIA_API_KEY = process.env.GLADIA_API_KEY

if (!SUPABASE_URL) {
  console.error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
  process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

if (!GLADIA_API_KEY) {
  console.error('GLADIA_API_KEY environment variable is required')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Extract transcription text from Gladia response - ROBUST VERSION
function extractTranscriptionText(result) {
  console.log('Extracting transcription from result:', JSON.stringify(result, null, 2))
  
  // Try v2 format first
  if (result.transcription) {
    const t = result.transcription
    
    // Priority 1: full_transcript (most reliable)
    if (t.full_transcript && typeof t.full_transcript === 'string' && t.full_transcript.trim()) {
      const transcript = t.full_transcript.trim()
      console.log('Found full_transcript:', transcript)
      return transcript
    }
    
    // Priority 2: utterances (fallback)
    if (t.utterances && Array.isArray(t.utterances) && t.utterances.length > 0) {
      const transcript = t.utterances
        .map(u => (u.text || '').trim())
        .filter(text => text.length > 0)
        .join(' ')
        .trim()
      
      if (transcript) {
        console.log('Found utterances transcript:', transcript)
        return transcript
      }
    }
  }
  
  // Try v1 format (legacy)
  if (result.prediction && Array.isArray(result.prediction) && result.prediction.length > 0) {
    const prediction = result.prediction[0]
    if (prediction.transcription && typeof prediction.transcription === 'string' && prediction.transcription.trim()) {
      const transcript = prediction.transcription.trim()
      console.log('Found v1 prediction transcript:', transcript)
      return transcript
    }
  }
  
  console.warn('No transcription text found in result')
  return null
}

async function checkGladiaStatus(jobId) {
  try {
    console.log(`Checking Gladia status for job ${jobId}`)
    
    const response = await fetch(`https://api.gladia.io/v2/transcription/${jobId}`, {
      headers: { 'x-gladia-key': GLADIA_API_KEY },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get transcription status: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log(`Gladia API response for job ${jobId}:`, JSON.stringify(result, null, 2))

    // Check if completed
    if (result.status === 'done' || (result.transcription && result.status !== 'processing' && result.status !== 'queued')) {
      const transcript = extractTranscriptionText(result)
      
      if (transcript) {
        const lang = result.transcription?.languages?.[0] || 
                    result.transcription?.utterances?.[0]?.language || 
                    result.prediction?.[0]?.language || 'unknown'
        
        let confidence = 0
        if (result.transcription?.utterances && result.transcription.utterances.length > 0) {
          const vals = result.transcription.utterances.map(u => typeof u.confidence === 'number' ? u.confidence : 0)
          confidence = vals.reduce((a, b) => a + b, 0) / vals.length
        } else if (result.prediction?.[0]?.confidence) {
          confidence = result.prediction[0].confidence
        }
        
        const duration = result.metadata?.audio_duration ?? 
                        (result.prediction?.[0] ? result.prediction[0].time_end - result.prediction[0].time_begin : undefined)
        
        return {
          status: 'completed',
          transcription: transcript,
          language: lang,
          confidence: confidence || 0,
          duration: typeof duration === 'number' ? duration : undefined,
          words: result.transcription?.utterances?.flatMap(u => (u.words || []).map(w => ({
            word: w.word,
            start_time: w.start ?? 0,
            end_time: w.end ?? 0,
            confidence: w.confidence ?? 0,
          }))) || result.prediction?.[0]?.words?.map(word => ({
            word: word.word,
            start_time: word.time_begin,
            end_time: word.time_end,
            confidence: word.confidence,
          }))
        }
      } else {
        console.warn(`Job ${jobId} marked as done but no transcription text found`)
        return {
          status: 'failed',
          error: 'Transcription completed but no text was extracted'
        }
      }
    }

    if (result.status === 'error') {
      return {
        status: 'failed',
        error: result.error || 'Transcription failed'
      }
    }

    // Still processing
    return {
      status: 'processing'
    }
  } catch (error) {
    console.error(`Error checking Gladia status for job ${jobId}:`, error.message)
    return {
      status: 'error',
      error: error.message
    }
  }
}

async function recordTranscriptionUsage(userId, result) {
  const currentPeriodStart = new Date()
  currentPeriodStart.setDate(1) // First day of month

  const currentPeriodEnd = new Date(currentPeriodStart)
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
  currentPeriodEnd.setDate(0) // Last day of month

  await supabase
    .from('usage_tracking')
    .insert({
      user_id: userId,
      feature_name: 'ai_interactions',
      usage_type: 'monthly_count',
      usage_count: 1,
      usage_metadata: {
        feature: 'audio_transcription',
        duration: result.duration,
        language: result.language,
        confidence: result.confidence
      },
      billing_period_start: currentPeriodStart.toISOString().split('T')[0],
      billing_period_end: currentPeriodEnd.toISOString().split('T')[0]
    })
}

async function fixStuckTranscriptions() {
  console.log('🔍 Looking for stuck transcriptions...')
  
  try {
    // Find evidence files that are stuck in processing state
    const { data: stuckFiles, error } = await supabase
      .from('evidence_files')
      .select('*')
      .eq('transcription_status', 'processing')
      .not('metadata->transcription_job_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50) // Process up to 50 at a time
    
    if (error) {
      throw error
    }
    
    if (!stuckFiles || stuckFiles.length === 0) {
      console.log('✅ No stuck transcriptions found!')
      return
    }
    
    console.log(`📋 Found ${stuckFiles.length} potentially stuck transcriptions`)
    
    let fixed = 0
    let stillProcessing = 0
    let failed = 0
    
    for (const file of stuckFiles) {
      const jobId = file.metadata?.transcription_job_id
      if (!jobId) {
        console.log(`⚠️  File ${file.id} has no job ID, skipping`)
        continue
      }
      
      console.log(`🔄 Checking file ${file.id} (job: ${jobId})...`)
      
      const status = await checkGladiaStatus(jobId)
      
      if (status.status === 'completed') {
        console.log(`✅ Transcription completed for file ${file.id}: "${status.transcription}"`)
        
        // Update the database
        const { error: updateError } = await supabase
          .from('evidence_files')
          .update({
            transcription: status.transcription,
            transcription_status: 'completed',
            processing_status: 'completed',
            processed_at: new Date().toISOString(),
            metadata: {
              ...file.metadata,
              transcription_language: status.language,
              transcription_confidence: status.confidence,
              transcription_duration: status.duration,
              transcription_completed_at: new Date().toISOString(),
              word_timestamps: status.words
            }
          })
          .eq('id', file.id)
        
        if (updateError) {
          console.error(`❌ Failed to update file ${file.id}:`, updateError.message)
        } else {
          // Record usage
          try {
            await recordTranscriptionUsage(file.user_id, status)
            console.log(`📊 Recorded usage for user ${file.user_id}`)
          } catch (usageError) {
            console.error(`⚠️  Failed to record usage:`, usageError.message)
          }
          fixed++
        }
      } else if (status.status === 'failed') {
        console.log(`❌ Transcription failed for file ${file.id}: ${status.error}`)
        
        // Update the database with failed status
        const { error: updateError } = await supabase
          .from('evidence_files')
          .update({
            transcription_status: 'failed',
            processing_status: 'failed',
            processed_at: new Date().toISOString(),
            metadata: {
              ...file.metadata,
              transcription_error: status.error,
              transcription_failed_at: new Date().toISOString()
            }
          })
          .eq('id', file.id)
        
        if (updateError) {
          console.error(`❌ Failed to update failed file ${file.id}:`, updateError.message)
        } else {
          failed++
        }
      } else if (status.status === 'processing') {
        console.log(`⏳ File ${file.id} is still processing`)
        stillProcessing++
      } else {
        console.log(`⚠️  File ${file.id} has unknown status: ${status.status}`)
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n📊 Summary:')
    console.log(`✅ Fixed: ${fixed}`)
    console.log(`⏳ Still processing: ${stillProcessing}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📋 Total checked: ${stuckFiles.length}`)
    
  } catch (error) {
    console.error('❌ Error fixing stuck transcriptions:', error.message)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  fixStuckTranscriptions()
    .then(() => {
      console.log('\n🎉 Script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error.message)
      process.exit(1)
    })
}

module.exports = { fixStuckTranscriptions, checkGladiaStatus }