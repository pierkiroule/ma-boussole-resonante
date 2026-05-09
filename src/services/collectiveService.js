import { supabase } from './supabaseClient'

export async function getCollectiveTags() {
  const { data, error } = await supabase
    .from('entry_tags')
    .select(`
      label,
      axis,
      resonance_entries (
        experience_id,
        experiences (
          id,
          title,
          color
        )
      )
    `)

  if (error) {
    console.error('getCollectiveTags error:', error)
    return []
  }

  return data || []
}

export async function getCollectiveConnections() {
  const { data, error } = await supabase
    .from('entry_connections')
    .select(`
      from_tag,
      to_tag,
      from_axis,
      to_axis,
      resonance_entries (
        experience_id,
        experiences (
          id,
          title,
          color
        )
      )
    `)

  if (error) {
    console.error('getCollectiveConnections error:', error)
    return []
  }

  return data || []
}
