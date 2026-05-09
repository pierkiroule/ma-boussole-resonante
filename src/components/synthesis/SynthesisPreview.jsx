import { useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'

const axisColors = {
  north: '#4ade80',
  south: '#60a5fa',
  east: '#f59e0b',
  west: '#f472b6',
}

const axisLabels = {
  north: 'Ouverture',
  south: 'Mémoire',
  east: 'Milieu',
  west: 'Corps',
}

const SIZE = 330
const CENTER = SIZE / 2

export default function SynthesisPreview() {
  const selectedTags = useAppStore((s) => s.selectedTags)
  const connections = useAppStore((s) => s.connections)
  const currentExperience = useAppStore((s) => s.currentExperience)

  const allTags = useMemo(() => {
    return Object.entries(selectedTags || {}).flatMap(([axis, tags]) =>
      tags.map((label) => ({
        id: `${axis}-${label}`,
        label,
        axis,
        color: axisColors[axis],
      }))
    )
  }, [selectedTags])

  function getTagPosition(tag) {
    const sameAxisTags = allTags.filter((t) => t.axis === tag.axis)
    const axisIndex = sameAxisTags.findIndex((t) => t.id === tag.id)
    const total = sameAxisTags.length
    const spread = total <= 1 ? 0 : (axisIndex - (total - 1) / 2) * 22
    const rowOffset = total <= 1 ? 0 : ((axisIndex % 2) - 0.5) * 14

    if (tag.axis === 'north') {
      return { x: CENTER + spread, y: 62 + rowOffset }
    }

    if (tag.axis === 'south') {
      return { x: CENTER + spread, y: SIZE - 54 + rowOffset }
    }

    if (tag.axis === 'east') {
      return { x: SIZE - 58 + rowOffset, y: CENTER + spread }
    }

    return { x: 58 + rowOffset, y: CENTER + spread }
  }

  function findTag(label, axis) {
    if (axis) {
      return allTags.find((tag) => tag.label === label && tag.axis === axis)
    }

    return allTags.find((tag) => tag.label === label)
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
      <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-5">
        Ma boussole synthétique perso
      </p>

      {allTags.length === 0 ? (
        <p className="text-slate-600 text-sm">
          Aucun mot sélectionné.
        </p>
      ) : (
        <div className="flex justify-center mb-6">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="overflow-visible"
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r="135"
              fill="rgba(255,255,255,0.015)"
              stroke="rgba(255,255,255,0.08)"
            />

            <line
              x1={CENTER}
              y1="30"
              x2={CENTER}
              y2={SIZE - 30}
              stroke="rgba(255,255,255,0.10)"
            />

            <line
              x1="30"
              y1={CENTER}
              x2={SIZE - 30}
              y2={CENTER}
              stroke="rgba(255,255,255,0.10)"
            />

            <text
              x={CENTER}
              y="24"
              textAnchor="middle"
              fill={axisColors.north}
              fontSize="10"
            >
              {axisLabels.north}
            </text>

            <text
              x={CENTER}
              y={SIZE - 14}
              textAnchor="middle"
              fill={axisColors.south}
              fontSize="10"
            >
              {axisLabels.south}
            </text>

            <text
              x={SIZE - 16}
              y={CENTER + 4}
              textAnchor="end"
              fill={axisColors.east}
              fontSize="10"
            >
              {axisLabels.east}
            </text>

            <text
              x="16"
              y={CENTER + 4}
              textAnchor="start"
              fill={axisColors.west}
              fontSize="10"
            >
              {axisLabels.west}
            </text>

            <circle
              cx={CENTER}
              cy={CENTER}
              r="38"
              fill="rgba(34,211,238,0.04)"
              stroke="rgba(34,211,238,0.14)"
            />

            <text
              x={CENTER}
              y={CENTER - 2}
              textAnchor="middle"
              fill="#67e8f9"
              fontSize="9"
            >
              {currentExperience?.title?.slice(0, 16) || 'expérience'}
            </text>

            <text
              x={CENTER}
              y={CENTER + 12}
              textAnchor="middle"
              fill="#67e8f9"
              fontSize="8"
              opacity="0.65"
            >
              traversée
            </text>

            {connections.map((connection, index) => {
              const fromTag = findTag(connection.from, connection.from_axis)
              const toTag = findTag(connection.to, connection.to_axis)

              if (!fromTag || !toTag) return null

              const from = getTagPosition(fromTag)
              const to = getTagPosition(toTag)

              return (
                <line
                  key={index}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(34,211,238,0.55)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )
            })}

            {allTags.map((tag) => {
              const pos = getTagPosition(tag)

              return (
                <text
                  key={tag.id}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  fill={tag.color}
                  fontSize="11"
                  fontWeight="500"
                  opacity="0.95"
                >
                  {tag.label}
                </text>
              )
            })}
          </svg>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
          Lecture
        </p>

        <p className="text-slate-400 text-sm leading-relaxed">
          Cette boussole place vos mots selon leurs axes de résonance.
          Les fils montrent les vécus que vous avez reliés entre eux.
          Elle donne une forme visible à ce qui a circulé dans votre traversée.
        </p>
      </section>
    </section>
  )
}
