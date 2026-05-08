import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { getExperiences } from '../services/experienceService'
import { getCollectiveTags } from '../services/collectiveService'

export default function Collective({ embedded = false }) {
  const [experiences, setExperiences] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    async function load() {
      const expData = await getExperiences()
      const tagData = await getCollectiveTags()

      setExperiences(expData || [])
      setTags(tagData || [])
    }

    load()
  }, [])

  const visibleExperiences = experiences.slice(0, 10)

  const tagCloud = useMemo(() => {
    const map = {}

    tags.forEach((item) => {
      const label = item.label
      const exp = item.resonance_entries?.experiences

      if (!label || !exp) return

      if (!map[label]) {
        map[label] = {
          label,
          count: 0,
          experiences: [],
        }
      }

      map[label].count += 1

      if (!map[label].experiences.includes(exp.title)) {
        map[label].experiences.push(exp.title)
      }
    })

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)
  }, [tags])

  const topTags = tagCloud.slice(0, 5)

  const center = 170
  const radius = 125
  const size = 340

  function getExpPosition(index, total) {
    const angle = ((Math.PI * 2) / total) * index - Math.PI / 2

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    }
  }

  function getWordPosition(index, total) {
    const angle = ((Math.PI * 2) / total) * index - Math.PI / 2
    const wordRadius = 70

    return {
      x: center + Math.cos(angle) * wordRadius,
      y: center + Math.sin(angle) * wordRadius,
    }
  }

  const Wrapper = embedded ? 'section' : 'main'

  return (
    <Wrapper className={embedded ? 'p-6 pb-20' : 'min-h-screen bg-black text-white p-6'}>
      <section className="max-w-md mx-auto">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          Synthèse collective
        </p>

        <h1 className="text-4xl font-light leading-tight mb-4">
          Qu’est-ce qui a traversé
          <br />
          <span className="italic text-cyan-300">
            nos paysages ?
          </span>
        </h1>

        <p className="text-slate-400 leading-relaxed mb-8">
          Cette carte montre les mots qui reviennent dans les traversées.
          Elle ne mesure pas des personnes : elle laisse apparaître des courants de résonance.
        </p>

        <div className="relative flex justify-center mb-10">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="rgba(255,255,255,0.015)"
              stroke="rgba(255,255,255,0.10)"
            />

            <circle
              cx={center}
              cy={center}
              r="48"
              fill="rgba(34,211,238,0.06)"
              stroke="rgba(34,211,238,0.22)"
            />

            <text
              x={center}
              y={center - 5}
              textAnchor="middle"
              fill="#67e8f9"
              fontSize="11"
            >
              corps
            </text>

            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              fill="#67e8f9"
              fontSize="11"
            >
              relationnel
            </text>

            {visibleExperiences.map((exp, i) => {
              const pos = getExpPosition(i, visibleExperiences.length)

              return (
                <g key={exp.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="18"
                    fill={exp.color || '#22d3ee'}
                    fillOpacity="0.20"
                    stroke={exp.color || '#22d3ee'}
                    strokeOpacity="0.65"
                  />

                  <text
                    x={pos.x}
                    y={pos.y + 32}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="7"
                  >
                    {exp.title.slice(0, 12)}
                  </text>
                </g>
              )
            })}

            {tagCloud.map((tag, i) => {
              const pos = getWordPosition(i, tagCloud.length)

              return (
                <motion.g
                  key={tag.label}
                  animate={{
                    x: [0, 3, -2, 0],
                    y: [0, -2, 3, 0],
                    opacity: [0.65, 1, 0.65],
                  }}
                  transition={{
                    duration: 6 + i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={9 + Math.min(tag.count, 5)}
                    fill="rgba(34,211,238,0.12)"
                    stroke="rgba(34,211,238,0.35)"
                  />

                  <text
                    x={pos.x}
                    y={pos.y + 3}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                  >
                    {tag.label.slice(0, 9)}
                  </text>
                </motion.g>
              )
            })}
          </svg>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-4">
            Ce qui semble circuler
          </p>

          {topTags.length === 0 ? (
            <p className="text-slate-500 text-sm">
              La carte collective se formera avec les prochaines traversées.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <div
                  key={tag.label}
                  className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"
                >
                  {tag.label}
                  <span className="text-slate-500 ml-2">
                    ×{tag.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 mb-6">
          <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-4">
            Lecture sensible
          </p>

          <div className="text-slate-400 leading-relaxed text-sm flex flex-col gap-3">
            <p>
              Les mots les plus présents indiquent les courants qui reviennent
              d’une traversée à l’autre.
            </p>

            <p>
              Ils ne disent pas seulement ce que chacun ressent. Ils montrent
              ce qui semble voyager à travers les paysages sonores.
            </p>

            <p>
              Plus un mot revient, plus il devient une trace collective :
              un passage partagé dans le corps relationnel du sonore vivant.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
          <p className="uppercase tracking-[0.25em] text-xs text-cyan-300 mb-4">
            À retenir
          </p>

          <p className="text-cyan-50 leading-relaxed text-sm">
            Cette synthèse n’est pas une moyenne émotionnelle.
            C’est une météo lente des résonances :
            elle aide à voir ce qui a traversé les paysages,
            ce qui s’est déposé, et ce qui a commencé à faire lien.
          </p>
        </section>
      </section>
    </Wrapper>
  )
}
