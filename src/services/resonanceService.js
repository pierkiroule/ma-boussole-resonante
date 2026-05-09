import { supabase } from './supabaseClient'

export async function createResonanceEntry(payload) {
  const { data, error } = await supabase
    .from('resonance_entries')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('createResonanceEntry error:', error)
    return null
  }

  return data
}

export async function replaceEntryTags(entryId, tagsByAxis) {
  if (!entryId) return false

  const { error: deleteError } = await supabase
    .from('entry_tags')
    .delete()
    .eq('entry_id', entryId)

  if (deleteError) {
    console.error('delete entry_tags error:', deleteError)
    return false
  }

  const rows = []

  Object.entries(tagsByAxis || {}).forEach(([axis, tags]) => {
    ;(tags || []).forEach((label) => {
      rows.push({
        entry_id: entryId,
        axis,
        label,
      })
    })
  })

  if (rows.length === 0) return true

  const { error } = await supabase
    .from('entry_tags')
    .insert(rows)

  if (error) {
    console.error('replaceEntryTags error:', error)
    return false
  }

  return true
}

export async function replaceEntryConnections(entryId, connections) {
  if (!entryId) return false

  const { error: deleteError } = await supabase
    .from('entry_connections')
    .delete()
    .eq('entry_id', entryId)

  if (deleteError) {
    console.error('delete entry_connections error:', deleteError)
    return false
  }

  const rows = (connections || []).map((connection) => ({
    entry_id: entryId,
    from_tag: connection.from,
    to_tag: connection.to,
    from_axis: connection.from_axis,
    to_axis: connection.to_axis,
  }))

  if (rows.length === 0) return true

  const { error } = await supabase
    .from('entry_connections')
    .insert(rows)

  if (error) {
    console.error('replaceEntryConnections error:', error)
    return false
  }

  return true
}
