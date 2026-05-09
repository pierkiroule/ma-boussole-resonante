import { supabase } from './supabaseClient'

export async function createProfile(payload) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('createProfile error:', error)
    return null
  }

  return data
}
