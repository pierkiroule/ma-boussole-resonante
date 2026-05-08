import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAppStore } from '../store/useAppStore'
import { createListeningSession } from '../services/sessionService'

export default function Listening() {
  const navigate = useNavigate()

  const profile = useAppStore((s) => s.profile)
  const currentExperience = useAppStore((s) => s.currentExperience)
  const setCurrentSession = useAppStore((s) => s.setCurrentSession)

  const [hasOpenedPlayer, setHasOpenedPlayer] = useState(false)

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

  function openPlayer() {
    if (!currentExperience?.external_player_url) return

    window.open(
      currentExperience.external_player_url,
      '_blank',
      'noopener,noreferrer'
    )

    setHasOpenedPlayer(true)
  }

  if (!currentExperience) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        Aucune expérience sélectionnée.
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.18, 0.42, 0.18],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="absolute top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `${currentExperience.color || '#38bdf8'}55`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col justify-between max-w-md mx-auto py-8">
        <section>
          <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
            Étape 1 · Écoute
          </p>

          <h1 className="text-4xl font-thin mb-4 leading-tight">
            {currentExperience.title}
          </h1>

          <p className="text-slate-400 leading-relaxed">
            {currentExperience.subtitle}
          </p>
        </section>

        <section className="flex flex-col items-center text-center">
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="w-44 h-44 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-8 backdrop-blur-xl"
          >
            <div
              className="w-24 h-24 rounded-full animate-pulse"
              style={{
                background: `${currentExperience.color || '#38bdf8'}44`,
              }}
            />
          </motion.div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-5 text-left">
            <h2 className="text-xl mb-3 font-light">
              Comment faire ?
            </h2>

            <ol className="text-slate-400 text-sm leading-7 list-decimal pl-5">
              <li>Ouvre le lecteur pCloud dans un nouvel onglet.</li>
              <li>Écoute le paysage sonore.</li>
              <li>Reviens ici quand l’écoute est terminée.</li>
              <li>Remplis ta boussole de résonance.</li>
            </ol>
          </div>

          <button
            onClick={openPlayer}
            className="w-full rounded-full p-4 bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 backdrop-blur-xl mb-4"
          >
            Ouvrir le lecteur d’écoute
          </button>

          {hasOpenedPlayer && (
            <p className="text-xs text-slate-500 mb-4">
              Le lecteur est ouvert dans un autre onglet. Reviens ici après l’écoute.
            </p>
          )}

          <button
            onClick={() => navigate('/compass')}
            className="w-full rounded-full p-4 bg-white text-black font-medium"
          >
            Je suis revenu · remplir ma boussole
          </button>
        </section>
      </div>
    </main>
  )
}
