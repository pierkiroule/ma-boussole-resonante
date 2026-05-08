import { supabase } from './supabaseClient'

export async function createResonanceEntry(profileId, experienceId) {
  const { data, error } = await supabase
    .from('resonance_entries')
    .insert({
      profile_id: profileId,
      experience_id: experienceId,
    })
    .select()
    .single()

  if (error) {
    console.error('createResonanceEntry error:', error)
    return null
  }

  return data
}

export async function saveEntryTags(entryId, selectedTags) {
  const rows = []

  Object.entries(selectedTags).forEach(([axis, tags]) => {
    tags.forEach((tag) => {
      rows.push({
        entry_id: entryId,
        axis,
        label: tag,
      })
    })
  })

  if (rows.length === 0) return true

  const { error } = await supabase
    .from('entry_tags')
    .insert(rows)

  if (error) {
    console.error('saveEntryTags error:', error)
    return false
  }

  return true
}

export async function updateResonanceEntry(entryId, values) {
  const { error } = await supabase
    .from('resonance_entries')
    .update(values)
    .eq('id', entryId)

  if (error) {
    console.error('updateResonanceEntry error:', error)
    return false
  }

  return true
}

export async function saveEntryConnection(connection) {
  const { data, error } = await supabase
    .from('entry_connections')
    .insert(connection)
    .select()
    .single()

  if (error) {
    console.error('saveEntryConnection error:', error)
    return null
  }

  return data
}
