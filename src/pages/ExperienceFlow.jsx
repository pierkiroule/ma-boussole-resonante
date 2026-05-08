import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { getExperiences } from '../services/experienceService'
import ExperiencePanel from '../components/experience/ExperiencePanel'

export default function ExperienceFlow() {
  const [experiences, setExperiences] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    async function load() {
      const data = await getExperiences()
      setExperiences(data || [])
    }

    load()
  }, [])

  function goTo(nextIndex) {
    if (nextIndex < 0) return
    if (nextIndex >= experiences.length) return
    setIndex(nextIndex)
  }

  function handleDragEnd(event, info) {
    if (info.offset.x < -80) goTo(index + 1)
    if (info.offset.x > 80) goTo(index - 1)
  }

  const current = experiences[index]

  if (!current) {
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
          Paysage sonore
        </p>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-light">
            {current.title}
          </h1>

          <p className="text-sm text-slate-500">
            {index + 1}/{experiences.length}
          </p>
        </div>

        <div className="flex gap-2">
          {experiences.map((exp, i) => (
            <button
              key={exp.id}
              onClick={() => goTo(i)}
              className="flex-1 h-2 rounded-full overflow-hidden bg-white/10"
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: i <= index ? '100%' : '0%',
                  background: i <= index ? '#22d3ee' : 'transparent',
                }}
              />
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Swipe horizontal = changer de paysage · Scroll vertical = explorer
        </p>
      </header>

      <section className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 overflow-y-auto"
          >
            <ExperiencePanel experience={current} />
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  )
}
