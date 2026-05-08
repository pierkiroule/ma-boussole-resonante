import { supabase } from './supabaseClient'

export async function createListeningSession(
  profileId,
  experienceId
) {
  const { data, error } = await supabase
    .from('listening_sessions')
    .insert({
      profile_id: profileId,
      experience_id: experienceId,
    })
    .select()
    .single()

  if (error) {
    console.error('createListeningSession error:', error)
    return null
  }

  return data
}

export async function completeListeningSession(
  sessionId,
  durationSeconds = 0
) {
  const { error } = await supabase
    .from('listening_sessions')
    .update({
      completed_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
    })
    .eq('id', sessionId)

  if (error) {
    console.error('completeListeningSession error:', error)
    return false
  }

  return true
}
