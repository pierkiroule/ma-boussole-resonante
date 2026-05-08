import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAppStore } from '../store/useAppStore'
import { createListeningSession } from '../services/sessionService'

export default function Listening() {
  const navigate = useNavigate()

  const profile =
    useAppStore((s) => s.profile)

  const currentExperience =
    useAppStore((s) => s.currentExperience)

  const setCurrentSession =
    useAppStore((s) => s.setCurrentSession)

  useEffect(() => {
    startSession()
  }, [])

  async function startSession() {
    if (!profile || !currentExperience) return

    const session = await createListeningSession(
      profile.id,
      currentExperience.id
    )

    if (session) {
      setCurrentSession(session)
    }
  }

  function openExperience() {
    if (!currentExperience?.external_player_url) return

    window.open(
      currentExperience.external_player_url,
      '_blank'
    )
  }

  if (!currentExperience) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        Aucune expérience sélectionnée.
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute w-72 h-72 rounded-full blur-3xl"
        style={{
          background: `${currentExperience.color}40`,
        }}
      />

      <div className="relative z-10 text-center max-w-md">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="w-40 h-40 rounded-full mx-auto mb-10 border border-white/10 flex items-center justify-center backdrop-blur-xl"
          style={{
            background: `${currentExperience.color}30`,
          }}
        >
          <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
        </motion.div>

        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          Écoute
        </p>

        <h1 className="text-4xl font-thin mb-4">
          {currentExperience.title}
        </h1>

        <p className="text-slate-400 mb-10 leading-relaxed">
          {currentExperience.subtitle}
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={openExperience}
            className="rounded-full p-4 bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 backdrop-blur-xl"
          >
            Ouvrir le paysage sonore
          </button>

          <button
            onClick={() => navigate('/compass')}
            className="rounded-full p-4 bg-white/5 border border-white/10 text-white"
          >
            J’ai terminé l’écoute
          </button>
        </div>
      </div>
    </main>
  )
}
