import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { compassAxes } from '../data/compassAxes'

import { useAppStore } from '../store/useAppStore'

import TagBubble from '../components/compass/TagBubble'
import CompassRose from '../components/compass/CompassRose'
import PageShell from '../components/layout/PageShell'

import {
  createResonanceEntry,
  saveEntryTags,
  saveEntryConnections,
} from '../services/resonanceService'

export default function Compass() {
  const navigate = useNavigate()

  const profile = useAppStore((s) => s.profile)
  const currentExperience = useAppStore((s) => s.currentExperience)
  const setCurrentEntry = useAppStore((s) => s.setCurrentEntry)
  const selectedTags = useAppStore((s) => s.selectedTags)
  const connections = useAppStore((s) => s.connections)
  const setSelectedTags = useAppStore((s) => s.setSelectedTags)

  const [currentAxis, setCurrentAxis] = useState('north')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = compassAxes.find((axis) => axis.id === currentAxis)

  const hasTags = Object.values(selectedTags).some(
    (tags) => tags.length > 0
  )

  function toggleTag(axis, tag) {
    const currentTags = selectedTags[axis] || []
    const exists = currentTags.includes(tag)

    setSelectedTags({
      ...selectedTags,
      [axis]: exists
        ? currentTags.filter((item) => item !== tag)
        : [...currentTags, tag],
    })
  }

  async function handleContinue() {
    setError('')

    if (!profile?.id || !currentExperience?.id) {
      setError('Il manque votre profil ou l’expérience sélectionnée.')
      return
    }

    if (!hasTags) {
      setError('Choisissez au moins un mot qui vous parle.')
      return
    }

    setLoading(true)

    const entry = await createResonanceEntry(
      profile.id,
      currentExperience.id
    )

    if (!entry) {
      setLoading(false)
      setError('Nous n’avons pas pu enregistrer votre réponse pour le moment.')
      return
    }

    const saved = await saveEntryTags(entry.id, selectedTags)

    await saveEntryConnections(entry.id, connections)

    if (!saved) {
      setLoading(false)
      setError('Nous n’avons pas pu enregistrer les mots choisis.')
      return
    }

    setCurrentEntry(entry)
    setLoading(false)

    navigate('/weaving')
  }

  return (
    <PageShell
      accent={current?.color || '#3b82f6'}
      className="text-white"
    >
      <p className="text-slate-500 uppercase tracking-widest text-xs mb-3">
        Boussole de résonance
      </p>

      <h1 className="text-4xl leading-tight mb-8 font-light">
        Après cette écoute,
        <br />
        <span
          className="italic"
          style={{ color: current?.color }}
        >
          qu’est-ce qui résonne le plus pour vous ?
        </span>
      </h1>

      <CompassRose
        currentAxis={currentAxis}
        selectedTags={selectedTags}
        onSelectAxis={setCurrentAxis}
        axes={compassAxes}
      />

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-8">
        <p
          className="uppercase tracking-widest text-xs mb-2"
          style={{ color: current.color }}
        >
          {current.label}
        </p>

        <h2 className="text-2xl mb-5 font-light">
          {current.question}
        </h2>

        <div className="flex flex-wrap gap-3">
          {current.tags.map((tag) => (
            <TagBubble
              key={tag}
              tag={tag}
              color={current.color}
              selected={selectedTags[current.id].includes(tag)}
              onClick={() => toggleTag(current.id, tag)}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-4 gap-2 mb-8">
        {compassAxes.map((axis) => (
          <button
            key={axis.id}
            onClick={() => setCurrentAxis(axis.id)}
            className="rounded-2xl border border-white/10 p-3 text-xs"
            style={{
              color:
                currentAxis === axis.id
                  ? axis.color
                  : '#64748b',

              background:
                currentAxis === axis.id
                  ? `${axis.color}22`
                  : 'rgba(255,255,255,0.03)',
            }}
          >
            {axis.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-6">
          {error}
        </p>
      )}

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full rounded-full bg-blue-500 p-4 disabled:bg-slate-700"
      >
        {loading ? 'Enregistrement...' : 'Continuer'}
      </button>
    </PageShell>
  )
}
