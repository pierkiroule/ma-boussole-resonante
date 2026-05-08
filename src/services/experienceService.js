import { supabase } from './supabaseClient'

export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true })

  if (error) {
    console.error('Erreur getExperiences:', error)
    return []
  }

  return data || []
}
