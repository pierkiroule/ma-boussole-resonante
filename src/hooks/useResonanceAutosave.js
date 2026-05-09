import { useEffect, useState } from 'react'

import {
  createResonanceEntry,
  replaceEntryTags,
  replaceEntryConnections,
} from '../services/resonanceService'

export default function useResonanceAutosave({
  profile,
  experience,
  selectedTags,
  connections,
}) {
  const [entryId, setEntryId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    async function initEntry() {
      if (!experience?.id) return

      setSaveStatus('Préparation...')

      const entry = await createResonanceEntry({
        profile_id: profile?.id || null,
        experience_id: experience.id,
      })

      if (!entry) {
        setSaveStatus('Erreur sauvegarde')
        return
      }

      setEntryId(entry.id)
      setSaveStatus('Trace prête')
    }

    initEntry()
  }, [experience?.id, profile?.id])

  useEffect(() => {
    if (!entryId) return

    const timer = setTimeout(async () => {
      setSaveStatus('Sauvegarde...')

      const tagsOk = await replaceEntryTags(
        entryId,
        selectedTags
      )

      const linksOk = await replaceEntryConnections(
        entryId,
        connections
      )

      if (tagsOk && linksOk) {
        setSaveStatus('Sauvegardé')
      } else {
        setSaveStatus('Erreur sauvegarde')
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [entryId, selectedTags, connections])

  return {
    entryId,
    saveStatus,
  }
}
