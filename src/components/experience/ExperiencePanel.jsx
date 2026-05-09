import { motion } from 'framer-motion'
import { useState } from 'react'

import { useAppStore } from '../../store/useAppStore'
import { createResonanceEntry, saveEntryTags, saveEntryConnections } from '../../services/resonanceService'
import { compassAxes } from '../../data/compassAxes'
import SynthesisPreview from '../synthesis/SynthesisPreview'
import WeavingBubbles from './WeavingBubbles'
import ExperienceOrb from './ExperienceOrb'

const axisColors = {
  north: '#4ade80',
  south: '#60a5fa',
  east: '#f59e0b',
  west: '#f472b6',
}

export default function ExperiencePanel({ experience }) {
  const selectedTags = useAppStore((s) => s.selectedTags)
  const setSelectedTags = useAppStore((s) => s.setSelectedTags)

  const connections = useAppStore((s) => s.connections)
  const addConnection = useAppStore((s) => s.addConnection)

  const resetJourney = useAppStore((s) => s.resetJourney)
  const profile = useAppStore((s) => s.profile)

  const [firstTag, setFirstTag] = useState(null)

  const allTags = Object.entries(selectedTags || {}).flatMap(
    ([axis, tags]) =>
      tags.map((label) => ({
        label,
        axis,
      }))
  )

  async function saveCurrentResonance() {
    console.log('SAVE DEBUG', {
      profile,
      experience,
      selectedTags,
      connections,
    })

    if (!experience) {
      alert('Expérience manquante.')
      return
    }

    const entry = await createResonanceEntry({
      profile_id: profile?.id || null,
      experience_id: experience.id,
    })

    if (!entry) {
      alert('Impossible de créer la trace de résonance.')
      return
    }

    await saveEntryTags(entry.id, selectedTags)
    await saveEntryConnections(entry.id, connections)

    alert('Résonance sauvegardée.')
  }

  function openPlayer() {
    if (!experience?.external_player_url) return

    window.open(
      experience.external_player_url,
      'pcloud-player',
      'popup=yes,width=420,height=760'
    )
  }

  function toggleTag(axis, tag) {
    const current = selectedTags?.[axis] || []
    const exists = current.includes(tag)

    setSelectedTags({
      ...selectedTags,
      [axis]: exists
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    })
  }

  function addCustomTag(axis) {
    const rawTag = window.prompt(
      'Quel mot souhaitez-vous ajouter à cet axe ?'
    )
    const tag = rawTag?.trim()

    if (!tag) return

    const current = selectedTags?.[axis] || []

    if (!current.includes(tag)) {
      setSelectedTags({
        ...selectedTags,
        [axis]: [...current, tag],
      })
    }
  }

  function connectTag(tag) {
    if (!firstTag) {
      setFirstTag(tag)
      return
    }

    if (firstTag.label === tag.label) {
      setFirstTag(null)
      return
    }

    const exists = connections.some((connection) => {
      return (
        (connection.from === firstTag.label &&
          connection.to === tag.label) ||
        (connection.from === tag.label &&
          connection.to === firstTag.label)
      )
    })

    if (!exists) {
      addConnection({
        from: firstTag.label,
        to: tag.label,
        from_axis: firstTag.axis,
        to_axis: tag.axis,
      })
    }

    setFirstTag(null)
  }

  return (
    <article className="min-h-full p-6 pb-28">
      {/* ================================================= */}
      {/* 1 · ÉCOUTE */}
      {/* ================================================= */}

      <section className="mb-20">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          1 · Écoute
        </p>

        <ExperienceOrb
          title={experience.title}
          color={experience.color || '#22d3ee'}
        />

        <h2 className="text-4xl font-light text-center mb-4">
          {experience.title}
        </h2>

        <p className="text-slate-400 text-center leading-relaxed mb-8">
          {experience.subtitle}
        </p>

        <button
          onClick={openPlayer}
          className="w-full rounded-full p-5 bg-cyan-500 text-black font-medium"
        >
          🎧 Ouvrir l’écoute
        </button>
      </section>

      {/* ================================================= */}
      {/* 2 · BOUSSOLE */}
      {/* ================================================= */}

      <section className="mb-20">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          2 · Boussole tags
        </p>

        <h2 className="text-3xl font-light mb-8">
          Ce qui résonne
        </h2>

        <div className="flex flex-col gap-8">
          {compassAxes.map((axis) => (
            <div
              key={axis.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p
                className="uppercase tracking-[0.2em] text-xs mb-2"
                style={{
                  color: axis.color,
                }}
              >
                {axis.label}
              </p>

              <h3 className="text-xl mb-5">
                {axis.question}
              </h3>

              <div className="flex flex-wrap gap-3">
                {axis.tags.map((tag) => {
                  const selected =
                    selectedTags?.[axis.id]?.includes(tag)

                  return (
                    <button
                      key={tag}
                      onClick={() =>
                        toggleTag(axis.id, tag)
                      }
                      className="rounded-full px-4 py-2 border transition-all"
                      style={{
                        color: selected
                          ? axis.color
                          : '#94a3b8',
                        borderColor: selected
                          ? axis.color
                          : 'rgba(255,255,255,0.12)',
                        background: selected
                          ? `${axis.color}22`
                          : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {tag}
                    </button>
                  )
                })}
                <button
                  onClick={() => addCustomTag(axis.id)}
                  className="rounded-full px-4 py-2 border transition-all text-slate-400 border-white/20 bg-white/[0.03]"
                >
                  Autre
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================= */}
      {/* 3 · TISSAGE */}
      {/* ================================================= */}

      <section className="mb-20">
        <WeavingBubbles />
      </section>

      {/* ================================================= */}
      {/* 4 · SYNTHÈSE */}
      {/* ================================================= */}

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-2">
              4 · Synthèse vivante
            </p>

            <h2 className="text-3xl font-light">
              Ma boussole synthétique perso
            </h2>
          </div>

          <button
            onClick={resetJourney}
            className="text-sm text-slate-500"
          >
            Réinitialiser
          </button>
        </div>

        <SynthesisPreview />

        <button
          onClick={saveCurrentResonance}
          className="w-full mt-6 rounded-full p-5 bg-cyan-400 text-black font-semibold"
        >
          Sauvegarder ma résonance
        </button>
      </section>
    </article>
  )
}
