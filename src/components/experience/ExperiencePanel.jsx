import { motion } from 'framer-motion'
import { useState } from 'react'

import { useAppStore } from '../../store/useAppStore'
import { compassAxes } from '../../data/compassAxes'
import SynthesisPreview from '../synthesis/SynthesisPreview'

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

  const [firstTag, setFirstTag] = useState(null)
  const [customTag, setCustomTag] = useState('')
  const [customAxis, setCustomAxis] = useState('north')

  const allTags = Object.entries(selectedTags || {}).flatMap(
    ([axis, tags]) =>
      tags.map((label) => ({
        label,
        axis,
      }))
  )

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

  function addCustomTag() {
    const tag = customTag.trim()

    if (!tag) return

    const current = selectedTags?.[customAxis] || []

    if (!current.includes(tag)) {
      setSelectedTags({
        ...selectedTags,
        [customAxis]: [...current, tag],
      })
    }

    setCustomTag('')
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

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="w-44 h-44 rounded-full mx-auto mb-8"
          style={{
            background: `${experience.color || '#22d3ee'}55`,
            boxShadow: `0 0 60px ${experience.color || '#22d3ee'}44`,
          }}
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
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mt-8">
          <h3 className="text-xl mb-4">
            Ajouter un mot personnel
          </h3>

          <select
            value={customAxis}
            onChange={(e) =>
              setCustomAxis(e.target.value)
            }
            className="w-full mb-4 rounded-2xl bg-black/40 border border-white/10 p-4"
          >
            {compassAxes.map((axis) => (
              <option key={axis.id} value={axis.id}>
                {axis.label}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <input
              value={customTag}
              onChange={(e) =>
                setCustomTag(e.target.value)
              }
              placeholder="Ajouter un mot"
              className="flex-1 rounded-2xl bg-black/40 border border-white/10 p-4"
            />

            <button
              onClick={addCustomTag}
              className="rounded-2xl bg-cyan-500 text-black px-5"
            >
              +
            </button>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 3 · TISSAGE */}
      {/* ================================================= */}

      <section className="mb-20">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          3 · Tissage
        </p>

        <h2 className="text-3xl font-light mb-4">
          Relier mes résonances
        </h2>

        <p className="text-slate-400 mb-8">
          Touchez deux mots pour créer une connexion.
        </p>

        {firstTag && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 mb-6">
            <p className="text-cyan-300">
              Mot sélectionné : {firstTag.label}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          {allTags.map((tag) => (
            <button
              key={`${tag.axis}-${tag.label}`}
              onClick={() => connectTag(tag)}
              className="rounded-full px-4 py-2 border transition-all"
              style={{
                color: axisColors[tag.axis],
                borderColor: axisColors[tag.axis],
                background:
                  firstTag?.label === tag.label
                    ? `${axisColors[tag.axis]}44`
                    : `${axisColors[tag.axis]}18`,
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          {connections.length === 0 && (
            <p className="text-slate-500">
              Aucun lien créé.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {connections.map((connection, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <span className="text-cyan-300">
                  {connection.from}
                </span>

                <span className="mx-3 text-slate-500">
                  →
                </span>

                <span className="text-fuchsia-300">
                  {connection.to}
                </span>
              </div>
            ))}
          </div>
        </div>
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
              Ma carte de résonance
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
      </section>
    </article>
  )
}
