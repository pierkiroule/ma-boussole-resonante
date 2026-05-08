import { supabase } from './supabaseClient'

export async function createProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data
}
