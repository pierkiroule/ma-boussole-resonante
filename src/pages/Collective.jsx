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
      }
    })

    tags.forEach((item) => {
      const expId = item.resonance_entries?.experience_id
      const axis = item.axis

      if (!map[expId]) return
      if (!map[expId].axes[axis]) map[expId].axes[axis] = 0

      map[expId].axes[axis] += 1
    })

    return Object.values(map)
  }, [visibleExperiences, tags])

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
      .slice(0, 12)
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
          Synthèse collective
        </p>

        <h1 className="text-4xl font-light leading-tight mb-4">
          Boussole des
          <br />
          <span className="italic text-cyan-300">
            résonances partagées
          </span>
        </h1>

        <p className="text-slate-400 leading-relaxed mb-8">
          Cette page rassemble les traces déposées après les écoutes.
          Elle montre les axes dominants, les mots fréquents
          et les liens qui reviennent entre les vécus.
        </p>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-5">
            Dominantes par paysage
          </p>

          <div className="flex flex-col gap-5">
            {axisByExperience.map((item, index) => {
              const values = Object.entries(item.axes)
              const max = Math.max(...values.map(([, value]) => value), 1)

              const dominant = values
                .sort((a, b) => b[1] - a[1])
                .filter(([, value]) => value > 0)
                .slice(0, 2)

              return (
                <div
                  key={item.experience.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs border"
                      style={{
                        borderColor: item.experience.color || '#22d3ee',
                        color: item.experience.color || '#22d3ee',
                        background: `${item.experience.color || '#22d3ee'}18`,
                      }}
                    >
                      {index + 1}
                    </span>

                    <div>
                      <p className="text-slate-100 text-sm">
                        {item.experience.title}
                      </p>

                      <p className="text-slate-500 text-xs">
                        {dominant.length > 0
                          ? `Traversé surtout par : ${dominant
                              .map(([axis]) => axisLabels[axis])
                              .join(' · ')}`
                          : 'Pas encore assez de traces'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {Object.entries(item.axes).map(([axis, value]) => (
                      <div key={axis}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: axisColors[axis] }}>
                            {axisLabels[axis]}
                          </span>

                          <span className="text-slate-500">
                            {value}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(value / max) * 100}%`,
                              background: axisColors[axis],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
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
