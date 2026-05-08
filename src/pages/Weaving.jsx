import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../store/useAppStore'
import { saveEntryConnection } from '../services/resonanceService'

const axisColors = {
  north: '#4ade80',
  south: '#60a5fa',
  east: '#f59e0b',
  west: '#f472b6',
}

export default function Weaving() {
  const navigate = useNavigate()

  const currentEntry = useAppStore((s) => s.currentEntry)
  const selectedTags = useAppStore((s) => s.selectedTags)
  const connections = useAppStore((s) => s.connections)
  const addConnection = useAppStore((s) => s.addConnection)

  const [firstTag, setFirstTag] = useState(null)
  const [error, setError] = useState('')

  const allTags = Object.entries(selectedTags).flatMap(([axis, tags]) =>
    tags.map((label) => ({
      label,
      axis,
      color: axisColors[axis],
    }))
  )

  const center = 160
  const radius = 120
  const size = 320

  function getPosition(index, total) {
    const angle = ((Math.PI * 2) / total) * index - Math.PI / 2

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    }
  }

  async function handleTagClick(tag) {
    setError('')

    if (!currentEntry?.id) {
      setError('Entrée de résonance manquante.')
      return
    }

    if (!firstTag) {
      setFirstTag(tag)
      return
    }

    if (firstTag.label === tag.label) {
      setFirstTag(null)
      return
    }

    const alreadyExists = connections.some((connection) => {
      return (
        (connection.from_tag === firstTag.label &&
          connection.to_tag === tag.label) ||
        (connection.from_tag === tag.label &&
          connection.to_tag === firstTag.label)
      )
    })

    if (alreadyExists) {
      setFirstTag(null)
      return
    }

    const connection = {
      entry_id: currentEntry.id,
      from_tag: firstTag.label,
      to_tag: tag.label,
      from_axis: firstTag.axis,
      to_axis: tag.axis,
      label: null,
    }

    const saved = await saveEntryConnection(connection)

    if (!saved) {
      setError('Impossible de sauvegarder le lien.')
      setFirstTag(null)
      return
    }

    addConnection(saved)
    setFirstTag(null)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <p className="text-slate-500 uppercase tracking-widest text-xs mb-3">
        Tissage
      </p>

      <h1 className="text-4xl mb-3 font-light">
        Relie tes mots
      </h1>

      <p className="text-slate-400 mb-8">
        Touche un mot, puis un autre. Un fil de résonance sera créé.
      </p>

      {firstTag && (
        <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4 mb-6">
          <p className="text-cyan-300">
            Mot sélectionné : {firstTag.label}
          </p>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <svg
          width={size}
          height={size}
          className="overflow-visible rounded-full border border-white/10 bg-white/[0.03]"
        >
          <circle
            cx={center}
            cy={center}
            r="42"
            fill="#0f172a"
            stroke="#334155"
          />

          <text
            x={center}
            y={center}
            fill="#94a3b8"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
          >
            tissage
          </text>

          {connections.map((connection, index) => {
            const fromIndex = allTags.findIndex(
              (tag) => tag.label === connection.from_tag
            )

            const toIndex = allTags.findIndex(
              (tag) => tag.label === connection.to_tag
            )

            if (fromIndex === -1 || toIndex === -1) return null

            const from = getPosition(fromIndex, allTags.length)
            const to = getPosition(toIndex, allTags.length)

            return (
              <line
                key={connection.id || index}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeOpacity="0.7"
                strokeDasharray="4 4"
              />
            )
          })}

          {allTags.map((tag, index) => {
            const position = getPosition(index, allTags.length)
            const selected = firstTag?.label === tag.label

            return (
              <g
                key={`${tag.axis}-${tag.label}`}
                onClick={() => handleTagClick(tag)}
                className="cursor-pointer"
              >
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={selected ? 31 : 26}
                  fill={tag.color}
                  fillOpacity={selected ? 0.4 : 0.18}
                  stroke={selected ? '#ffffff' : tag.color}
                  strokeWidth={selected ? 2 : 1}
                />

                <text
                  x={position.x}
                  y={position.y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                >
                  {tag.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {connections.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl mb-4 font-light">
            Liens créés
          </h2>

          <div className="flex flex-col gap-3">
            {connections.map((connection, index) => (
              <div
                key={connection.id || index}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span style={{ color: axisColors[connection.from_axis] }}>
                  {connection.from_tag}
                </span>

                <span className="text-slate-500"> — </span>

                <span style={{ color: axisColors[connection.to_axis] }}>
                  {connection.to_tag}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {error && (
        <p className="text-red-400 text-sm mb-6">
          {error}
        </p>
      )}

      <button
        onClick={() => navigate('/center')}
        className="w-full rounded-full bg-cyan-500 p-4"
      >
        Continuer
      </button>
    </main>
  )
}
