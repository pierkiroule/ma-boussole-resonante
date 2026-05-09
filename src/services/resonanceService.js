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

export async function saveEntryTags(entryId, tagsByAxis) {
  if (!entryId || !tagsByAxis) return true

  const rows = []

  Object.entries(tagsByAxis).forEach(([axis, tags]) => {
    tags.forEach((label) => {
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
    console.error('saveEntryTags error:', error)
    return false
  }

  return true
}

export async function saveEntryConnections(entryId, connections) {
  if (!entryId || !connections?.length) return true

  const rows = connections.map((connection) => ({
    entry_id: entryId,
    from_tag: connection.from,
    to_tag: connection.to,
    from_axis: connection.from_axis,
    to_axis: connection.to_axis,
  }))

  const { error } = await supabase
    .from('entry_connections')
    .insert(rows)

  if (error) {
    console.error('saveEntryConnections error:', error)
    return false
  }

  return true
}
