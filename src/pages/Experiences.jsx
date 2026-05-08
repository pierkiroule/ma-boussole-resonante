import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { getExperiences } from '../services/experienceService'
import { useAppStore } from '../store/useAppStore'

export default function Experiences() {
  const navigate = useNavigate()

  const setCurrentExperience =
    useAppStore((s) => s.setCurrentExperience)

  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExperiences()
  }, [])

  async function loadExperiences() {
    const data = await getExperiences()

    if (data) {
      setExperiences(data)
    }

    setLoading(false)
  }

  function handleSelect(exp) {
    setCurrentExperience(exp)
    navigate('/listening')
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute top-20 left-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative z-10">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          Exploration
        </p>

        <h1 className="text-5xl font-thin mb-10 leading-tight">
          Paysages
          <br />
          <span className="italic text-cyan-300">
            sonores
          </span>
        </h1>

        {loading && (
          <p className="text-slate-500">
            Chargement...
          </p>
        )}

        <div className="flex flex-col gap-4">
          {experiences.map((exp, index) => (
            <motion.button
              key={exp.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => handleSelect(exp)}
              className="rounded-3xl p-6 border border-white/10 backdrop-blur-xl text-left overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${exp.color}40, #020617)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <h2 className="text-2xl font-light mb-2">
                  {exp.title}
                </h2>

                <p className="text-slate-400 mb-5">
                  {exp.subtitle}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-slate-500">
                    expérience sonore
                  </span>

                  <span className="text-cyan-300">
                    →
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  )
}
