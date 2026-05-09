import { useEffect, useMemo, useState } from 'react'

import { getExperiences } from '../services/experienceService'
import {
  getCollectiveTags,
  getCollectiveConnections,
} from '../services/collectiveService'

const axisLabels = {
  north: 'Ouverture',
  south: 'Mémoire',
  east: 'Milieu',
  west: 'Corps',
}

const axisColors = {
  north: '#4ade80',
  south: '#60a5fa',
  east: '#f59e0b',
  west: '#f472b6',
}

const SIZE = 330
const CENTER = SIZE / 2
const MAX_RADIUS = 112

function spreadClosePoints(points) {
  return points.map((point, index) => {
    const samePlace = points.filter((other) => {
      const dx = other.x - point.x
      const dy = other.y - point.y
      return Math.sqrt(dx * dx + dy * dy) < 28
    })

    if (samePlace.length <= 1) return point

    const localIndex = samePlace.findIndex(
      (other) => other.experience.id === point.experience.id
    )

    const angle =
      ((Math.PI * 2) / samePlace.length) * localIndex

    const offset = 18

    return {
      ...point,
      x: point.x + Math.cos(angle) * offset,
      y: point.y + Math.sin(angle) * offset,
    }
  })
}

export default function Collective({ embedded = false }) {
  const [experiences, setExperiences] = useState([])
  const [tags, setTags] = useState([])
  const [connections, setConnections] = useState([])

  useEffect(() => {
    async function load() {
      const expData = await getExperiences()
      const tagData = await getCollectiveTags()
      const connectionData = await getCollectiveConnections()

      setExperiences(expData || [])
      setTags(tagData || [])
      setConnections(connectionData || [])
    }

    load()
  }, [])

  const visibleExperiences = experiences.slice(0, 10)

  const axisByExperience = useMemo(() => {
    const map = {}

    visibleExperiences.forEach((exp) => {
      map[exp.id] = {
        experience: exp,
        axes: {
          north: 0,
          south: 0,
          east: 0,
          west: 0,
        },
        total: 0,
      }
    })

    tags.forEach((item) => {
      const expId = item.resonance_entries?.experience_id
      const axis = item.axis

      if (!map[expId]) return
      if (!map[expId].axes[axis]) map[expId].axes[axis] = 0

      map[expId].axes[axis] += 1
      map[expId].total += 1
    })

    return Object.values(map)
  }, [visibleExperiences, tags])

  const plottedExperiences = useMemo(() => {
    const rawPoints = axisByExperience.map((item, index) => {
      const { axes, total } = item

      const xRaw = axes.east - axes.west
      const yRaw = axes.north - axes.south

      const maxAxis = Math.max(
        axes.north,
        axes.south,
        axes.east,
        axes.west,
        1
      )

      const x = total > 0 ? (xRaw / maxAxis) * MAX_RADIUS : 0
      const y = total > 0 ? (yRaw / maxAxis) * MAX_RADIUS : 0

      const dominant = Object.entries(axes)
        .sort((a, b) => b[1] - a[1])
        .filter(([, value]) => value > 0)
        .slice(0, 2)
        .map(([axis]) => axisLabels[axis])

      return {
        ...item,
        index,
        x: CENTER + x,
        y: CENTER - y,
        dominant,
        total,
      }
    })

    return spreadClosePoints(rawPoints)
  }, [axisByExperience])

  const topTags = useMemo(() => {
    const map = {}

    tags.forEach((item) => {
      if (!item.label) return

      const key = item.label.toLowerCase()

      if (!map[key]) {
        map[key] = {
          label: item.label,
          axis: item.axis,
          count: 0,
        }
      }

      map[key].count += 1
    })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [tags])

  const topConnections = useMemo(() => {
    const map = {}

    connections.forEach((item) => {
      if (!item.from_tag || !item.to_tag) return

      const pair = [item.from_tag, item.to_tag].sort()
      const key = pair.join('---')

      if (!map[key]) {
        map[key] = {
          from: pair[0],
          to: pair[1],
          count: 0,
        }
      }

      map[key].count += 1
    })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [connections])

  const Wrapper = embedded ? 'section' : 'main'

  return (
    <Wrapper
      className={
        embedded
          ? 'p-6 pb-20'
          : 'min-h-screen bg-black text-white p-6'
      }
    >
      <section className="max-w-md mx-auto">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          Boussole partagée
        </p>

        <h1 className="text-4xl font-light leading-tight mb-4">
          Boussole des
          <br />
          <span className="italic text-cyan-300">
            résonances partagées
          </span>
        </h1>

        <p className="text-slate-400 leading-relaxed mb-8">
          Chaque paysage sonore est placé selon les mots choisis par les participants.
          Plus deux paysages sont proches, plus leurs résonances se ressemblent.
        </p>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-5">
            Cartographie des paysages
          </p>

          <div className="flex justify-center mb-5">
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="overflow-visible"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r="132"
                fill="rgba(255,255,255,0.012)"
                stroke="rgba(255,255,255,0.08)"
              />

              <line
                x1={CENTER}
                y1="28"
                x2={CENTER}
                y2={SIZE - 28}
                stroke="rgba(255,255,255,0.12)"
              />

              <line
                x1="28"
                y1={CENTER}
                x2={SIZE - 28}
                y2={CENTER}
                stroke="rgba(255,255,255,0.12)"
              />

              <text x={CENTER} y="22" textAnchor="middle" fill={axisColors.north} fontSize="10">
                {axisLabels.north}
              </text>

              <text x={CENTER} y={SIZE - 12} textAnchor="middle" fill={axisColors.south} fontSize="10">
                {axisLabels.south}
              </text>

              <text x={SIZE - 14} y={CENTER + 4} textAnchor="end" fill={axisColors.east} fontSize="10">
                {axisLabels.east}
              </text>

              <text x="14" y={CENTER + 4} textAnchor="start" fill={axisColors.west} fontSize="10">
                {axisLabels.west}
              </text>

              <circle cx={CENTER} cy={CENTER} r="5" fill="rgba(255,255,255,0.25)" />

              {plottedExperiences.map((item) => {
                const active = item.total > 0
                const color = item.experience.color || '#22d3ee'
                const radius = active
                  ? 12 + Math.min(item.total, 6)
                  : 10

                return (
                  <g key={item.experience.id}>
                    <circle
                      cx={item.x}
                      cy={item.y}
                      r={radius}
                      fill={color}
                      fillOpacity={active ? 0.35 : 0.10}
                      stroke={color}
                      strokeOpacity={active ? 0.9 : 0.3}
                    />

                    <text
                      x={item.x}
                      y={item.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="700"
                    >
                      {item.index + 1}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">
            Axe vertical : ouverture ↕ mémoire.
            Axe horizontal : corps ↔ milieu.
            Les points proches ont été légèrement espacés pour rester lisibles.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-5">
            Lecture par paysage
          </p>

          <div className="flex flex-col gap-3">
            {plottedExperiences.map((item) => (
              <div
                key={item.experience.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs border"
                    style={{
                      borderColor: item.experience.color || '#22d3ee',
                      color: item.experience.color || '#22d3ee',
                      background: `${item.experience.color || '#22d3ee'}18`,
                    }}
                  >
                    {item.index + 1}
                  </span>

                  <div>
                    <p className="text-slate-100 text-sm">
                      {item.experience.title}
                    </p>

                    <p className="text-slate-500 text-xs">
                      {item.dominant.length > 0
                        ? `Traversé surtout par : ${item.dominant.join(' · ')}`
                        : 'Pas encore assez de traces'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-4">
            Mots les plus fréquents
          </p>

          {topTags.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Les mots partagés apparaîtront ici.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topTags.map((tag) => (
                <div
                  key={tag.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <span
                    className="text-sm"
                    style={{
                      color: axisColors[tag.axis] || '#e2e8f0',
                    }}
                  >
                    {tag.label}
                  </span>

                  <span className="text-xs text-slate-500">
                    {tag.count} occurrence{tag.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-4">
            Mots souvent reliés
          </p>

          {topConnections.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Les co-occurrences apparaîtront quand des liens auront été tissés.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topConnections.map((connection) => (
                <div
                  key={`${connection.from}-${connection.to}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <span className="text-sm text-cyan-100">
                    {connection.from} ↔ {connection.to}
                  </span>

                  <span className="text-xs text-slate-500">
                    {connection.count} lien{connection.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
          <p className="uppercase tracking-[0.25em] text-xs text-cyan-300 mb-4">
            Lecture simple
          </p>

          <p className="text-cyan-50 leading-relaxed text-sm">
            Cette boussole ne cherche pas à noter les personnes.
            Elle aide à voir ce qui revient dans les traversées :
            les axes qui dominent, les mots qui insistent,
            et les vécus qui semblent résonner ensemble.
          </p>
        </section>
      </section>
    </Wrapper>
  )
}
