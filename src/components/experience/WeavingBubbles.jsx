import { useMemo, useState } from 'react'

import { useAppStore } from '../../store/useAppStore'

const axisColors = {
  north: '#4ade80',
  south: '#60a5fa',
  east: '#f59e0b',
  west: '#f472b6',
}

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = 118

export default function WeavingBubbles() {
  const selectedTags = useAppStore((s) => s.selectedTags)
  const connections = useAppStore((s) => s.connections)
  const addConnection = useAppStore((s) => s.addConnection)
  const removeConnection = useAppStore((s) => s.removeConnection)

  const [firstTag, setFirstTag] = useState(null)

  const allTags = useMemo(() => {
    return Object.entries(selectedTags || {}).flatMap(([axis, tags]) =>
      tags.map((label) => ({
        id: `${axis}-${label}`,
        axis,
        label,
        color: axisColors[axis],
      }))
    )
  }, [selectedTags])

  function getPosition(index, total) {
    if (total <= 1) {
      return {
        x: CENTER,
        y: CENTER,
      }
    }

    const angle =
      ((Math.PI * 2) / total) * index -
      Math.PI / 2

    return {
      x: CENTER + Math.cos(angle) * RADIUS,
      y: CENTER + Math.sin(angle) * RADIUS,
    }
  }

  function hasConnection(a, b) {
    return connections.some((connection) => {
      return (
        (connection.from === a && connection.to === b) ||
        (connection.from === b && connection.to === a)
      )
    })
  }

  function toggleLink(tagA, tagB) {
    const exists = hasConnection(tagA.label, tagB.label)

    if (exists) {
      removeConnection(tagA.label, tagB.label)
    } else {
      addConnection({
        from: tagA.label,
        to: tagB.label,
        from_axis: tagA.axis,
        to_axis: tagB.axis,
      })
    }
  }

  function handleTap(tag) {
    if (!firstTag) {
      setFirstTag(tag)
      return
    }

    if (firstTag.label === tag.label) {
      setFirstTag(null)
      return
    }

    toggleLink(firstTag, tag)
    setFirstTag(null)
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-3">
        3 · Tissage
      </p>

      <h2 className="text-3xl font-light mb-4">
        Tisser mes résonances
      </h2>

      <div className="text-slate-400 text-sm leading-relaxed flex flex-col gap-3 mb-8">
        <p>
          Exprimez quels vécus vous semblent fortement reliés
          et résonnent ensemble dans cette expérience.
        </p>

        <p>
          Tapez un premier mot, puis un deuxième mot pour les relier.
          Retapez la même paire pour délier.
        </p>
      </div>

      {firstTag && (
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 mb-6">
          <p className="text-cyan-200 text-sm">
            Mot sélectionné :
            <span className="font-medium ml-2">
              {firstTag.label}
            </span>
          </p>
        </div>
      )}

      {allTags.length === 0 ? (
        <p className="text-slate-600 text-sm">
          Sélectionnez des mots dans la boussole pour commencer.
        </p>
      ) : (
        <div className="flex justify-center">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="rounded-full border border-white/10 bg-black/20"
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r="38"
              fill="rgba(34,211,238,0.04)"
              stroke="rgba(34,211,238,0.12)"
            />

            {connections.map((connection, index) => {
              const fromIndex = allTags.findIndex(
                (tag) => tag.label === connection.from
              )

              const toIndex = allTags.findIndex(
                (tag) => tag.label === connection.to
              )

              if (fromIndex === -1 || toIndex === -1) return null

              const from = getPosition(fromIndex, allTags.length)
              const to = getPosition(toIndex, allTags.length)

              return (
                <line
                  key={index}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(34,211,238,0.55)"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                />
              )
            })}

            {allTags.map((tag, index) => {
              const pos = getPosition(index, allTags.length)
              const selected = firstTag?.label === tag.label

              return (
                <text
                  key={tag.id}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  onClick={() => handleTap(tag)}
                  className="cursor-pointer select-none"
                  fill={tag.color}
                  fontSize={selected ? 14 : 12}
                  fontWeight={selected ? 700 : 500}
                  opacity={selected ? 1 : 0.92}
                  style={{
                    filter: selected
                      ? `drop-shadow(0 0 10px ${tag.color})`
                      : 'none',
                  }}
                >
                  {tag.label}
                </text>
              )
            })}
          </svg>
        </div>
      )}

      {connections.length > 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="uppercase tracking-[0.2em] text-xs text-slate-500 mb-3">
            Liens créés
          </p>

          <div className="flex flex-col gap-2">
            {connections.map((connection, index) => (
              <div
                key={index}
                className="text-sm text-slate-300"
              >
                {connection.from} ↔ {connection.to}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
