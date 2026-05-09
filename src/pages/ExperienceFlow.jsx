import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { getExperiences } from '../services/experienceService'
import ExperiencePanel from '../components/experience/ExperiencePanel'
import ResonanceFinal from './ResonanceFinal'
import ErrorBoundary from '../components/ErrorBoundary'

export default function ExperienceFlow() {
  const navigate = useNavigate()

  const [experiences, setExperiences] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      try {
        const data = await getExperiences()

        console.log('EXPERIENCES LOADED', data)

        setExperiences(data || [])
      } catch (err) {
        console.error('LOAD EXPERIENCES ERROR', err)

        setError(String(err?.message || err))
      }

      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <p className="text-slate-400">
          Chargement des paysages...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <p className="text-red-400 mb-4">
          Erreur de chargement
        </p>

        <pre className="whitespace-pre-wrap text-xs bg-white/5 border border-white/10 rounded-2xl p-4">
          {error}
        </pre>
      </main>
    )
  }

  if (experiences.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <p className="text-slate-400">
          Aucun paysage sonore actif trouvé.
        </p>
      </main>
    )
  }

  const totalSlides = experiences.length + 1

  const isCollective = index === experiences.length

  const current = experiences[index]

  function goTo(nextIndex) {
    if (nextIndex < 0) return
    if (nextIndex >= totalSlides) return

    setIndex(nextIndex)
  }

  function handleDragEnd(event, info) {
    if (info.offset.x < -80) {
      goTo(index + 1)
    }

    if (info.offset.x > 80) {
      goTo(index - 1)
    }
  }

  return (
    <main className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <header className="shrink-0 p-5 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">
          {isCollective
            ? 'Boussole partagée'
            : 'Paysage sonore'}
        </p>

        <div className="flex items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-light leading-tight">
            {isCollective
              ? 'Résonances partagées'
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
          >
            🏠
          </button>

          <div className="flex flex-1 gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex-1 h-7 rounded-full border border-white/10 bg-white/5 text-[10px] text-slate-300"
              >
                {i === experiences.length
                  ? '∞'
                  : i + 1}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isCollective ? 'collective' : current.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 overflow-y-auto"
          >
            <ErrorBoundary>
              {isCollective ? (
                <ResonanceFinal />
              ) : (
                <ExperiencePanel experience={current} />
              )}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  )
}