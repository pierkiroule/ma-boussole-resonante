import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { getExperiences } from '../services/experienceService'
import ExperiencePanel from '../components/experience/ExperiencePanel'
import Collective from './Collective'

export default function ExperienceFlow() {
  const navigate = useNavigate()

  const [experiences, setExperiences] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    async function load() {
      const data = await getExperiences()
      setExperiences(data || [])
    }

    load()
  }, [])

  const totalSlides = experiences.length + 1
  const isCollective = index === experiences.length
  const current = experiences[index]

  function goTo(nextIndex) {
    if (nextIndex < 0) return
    if (nextIndex >= totalSlides) return

    setIndex(nextIndex)
  }

  function handleDragEnd(event, info) {
    if (info.offset.x < -80) goTo(index + 1)
    if (info.offset.x > 80) goTo(index - 1)
  }

  if (experiences.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement...
      </main>
    )
  }

  return (
    <main className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <header className="shrink-0 p-5 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
          {isCollective ? 'Synthèse collective' : 'Paysage sonore'}
        </p>

        <div className="flex items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-light leading-tight">
            {isCollective
              ? 'Ce qui a traversé nos paysages'
              : current?.title}
          </h1>

          <p className="text-sm text-slate-500 shrink-0">
            {index + 1}/{totalSlides}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0"
            aria-label="Retour accueil"
          >
            🏠
          </button>

          <div className="flex flex-1 gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => {
              const active = i === index
              const completed = i <= index
              const isLast = i === experiences.length

              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="flex-1 min-w-0"
                  aria-label={`Aller à la page ${i + 1}`}
                >
                  <div
                    className="h-7 rounded-full border flex items-center justify-center text-[10px] transition-all"
                    style={{
                      borderColor: active
                        ? isLast
                          ? '#a78bfa'
                          : '#22d3ee'
                        : 'rgba(255,255,255,0.10)',

                      background: completed
                        ? isLast
                          ? 'rgba(167,139,250,0.25)'
                          : 'rgba(34,211,238,0.20)'
                        : 'rgba(255,255,255,0.04)',

                      color: active
                        ? '#ffffff'
                        : completed
                          ? '#cbd5e1'
                          : '#64748b',

                      boxShadow: active
                        ? isLast
                          ? '0 0 18px rgba(167,139,250,0.35)'
                          : '0 0 18px rgba(34,211,238,0.35)'
                        : 'none',
                    }}
                  >
                    {isLast ? '∞' : i + 1}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          ↔ Swipe horizontal : changer de paysage · ↕ Scroll vertical : explorer
        </p>
      </header>

      <section className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isCollective ? 'collective' : current.id}
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            onDragEnd={handleDragEnd}
            initial={{
              opacity: 0,
              x: 80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -80,
            }}
            transition={{
              duration: 0.25,
            }}
            className="absolute inset-0 overflow-y-auto"
          >
            {isCollective ? (
              <Collective embedded />
            ) : (
              <ExperiencePanel experience={current} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  )
}
