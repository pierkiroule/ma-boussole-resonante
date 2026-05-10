import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { createProfile } from '../services/profileService'
import { useAppStore } from '../store/useAppStore'
import { compassAxes } from '../data/compassAxes'


const axisPositions = {
  north: 'top-[-2.4rem] left-1/2 -translate-x-1/2',
  south: 'bottom-[-2.4rem] left-1/2 -translate-x-1/2',
  east: 'right-[-3.8rem] top-1/2 -translate-y-1/2 text-left',
  west: 'left-[-3.8rem] top-1/2 -translate-y-1/2 text-right',
}

export default function Welcome() {
  if (window.location.search.includes('reset=1')) {
    localStorage.clear()
    window.location.href = '/'
  }
  const navigate = useNavigate()

  const setProfile = useAppStore((s) => s.setProfile)

  const [pseudo, setPseudo] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEnter() {
    setError('')

    if (!pseudo.trim()) {
      setError('Indiquez un pseudo pour commencer.')
      return
    }

    setLoading(true)

    const profile = await createProfile({
      pseudo: pseudo.trim(),
      age_range: ageRange || null,
      gender: gender || null,
      research_consent: true,
    })

    setLoading(false)

    if (!profile) {
      setError('Impossible de créer le profil.')
      return
    }

    setProfile(profile)

    navigate('/experience')
  }

  async function handleDevMode() {
    setError('')
    setLoading(true)

    const profile = await createProfile({
      pseudo: `dev-${Date.now()}`,
      age_range: 'dev',
      gender: 'dev',
      research_consent: true,
    })

    setLoading(false)

    if (!profile) {
      setError('Impossible de créer le profil dev.')
      return
    }

    setProfile(profile)
    navigate('/experience')
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <section className="relative z-10 min-h-screen max-w-md mx-auto flex flex-col justify-center">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-cyan-300/30"
            />

            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-3 rounded-full border border-cyan-400/40"
            />

            <div className="absolute inset-0 rounded-full bg-cyan-500/10 shadow-2xl shadow-cyan-500/30 backdrop-blur-sm" />

            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <line x1="50" y1="14" x2="50" y2="86" stroke="rgba(165,243,252,0.25)" strokeWidth="1.6" />
              <line x1="14" y1="50" x2="86" y2="50" stroke="rgba(165,243,252,0.18)" strokeWidth="1.2" />
              <polygon points="50,18 58,50 50,82 42,50" fill="rgba(34,211,238,0.9)" />
              <polygon points="50,26 55,50 50,74 45,50" fill="rgba(207,250,254,0.95)" />
              <circle cx="50" cy="50" r="3.4" fill="rgba(8,47,73,0.95)" />
              <circle cx="50" cy="50" r="1.6" fill="rgba(165,243,252,0.9)" />
            </motion.svg>

            <motion.span
              animate={{ y: [-1, -5, -1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.25em] text-cyan-200/80"
            >
              N
            </motion.span>

            {compassAxes.map((axis, index) => (
              <motion.div
                key={axis.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.98, 1, 0.98] }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: 'easeInOut',
                }}
                className={`absolute ${axisPositions[axis.id]} w-24 pointer-events-none`}
              >
                <p
                  className="text-[10px] font-light uppercase tracking-[0.07em]"
                  style={{ color: `${axis.color}CC` }}
                >
                  {axis.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
            Bienvenue
          </p>

          <h1 className="text-5xl font-thin leading-tight mb-5">
            Boussole
            <br />
            <span className="italic text-cyan-300">
            des Résonances
            </span>
          </h1>

          <p className="text-slate-400 leading-relaxed">
            Écoutez un paysage sonore, puis choisissez les mots qui décrivent le mieux ce que vous ressentez.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-5">
          <h2 className="text-2xl font-light mb-4">
            Comment ça marche ?
          </h2>

          <div className="flex flex-col gap-4 text-slate-300 leading-relaxed">
            <p>
              <span className="text-cyan-300">↔ Faites glisser à gauche ou à droite</span>
              <br />
              pour découvrir les paysages sonores.
            </p>

            <p>
              <span className="text-cyan-300">↕ Faites défiler vers le bas</span>
              <br />
              pour choisir vos mots et les relier.
            </p>

            <ol className="list-decimal pl-5 text-slate-400">
              <li>Écoutez</li>
              <li>Choisissez des mots</li>
              <li>Reliez les mots entre eux</li>
              <li>Découvrez votre synthèse</li>
            </ol>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 mb-5">
          <h2 className="text-2xl font-light mb-5">
            Commencer l’expérience
          </h2>

          <label className="block text-sm text-cyan-100 mb-2">
            Pseudo
          </label>

          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Ex : Pier"
            className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 outline-none mb-4"
          />

          <label className="block text-sm text-cyan-100 mb-2">
            Tranche d’âge
          </label>

          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 mb-4"
          >
            <option value="">
              Non précisé
            </option>

            <option value="moins-18">
              -18 ans
            </option>

            <option value="18-30">
              18-30 ans
            </option>

            <option value="31-50">
              31-50 ans
            </option>

            <option value="51-70">
              51-70 ans
            </option>

            <option value="70-plus">
              70+ ans
            </option>
          </select>

          <label className="block text-sm text-cyan-100 mb-2">
            Genre
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 mb-4"
          >
            <option value="">
              Non précisé
            </option>

            <option value="femme">
              Femme
            </option>

            <option value="homme">
              Homme
            </option>

            <option value="autre">
              Autre
            </option>
          </select>

          {error && (
            <p className="text-red-400 text-sm mb-3">
              {error}
            </p>
          )}

          <button
            onClick={handleEnter}
            disabled={loading}
            className="w-full rounded-full p-5 bg-cyan-400 text-black font-semibold shadow-2xl shadow-cyan-500/20 disabled:opacity-40"
          >
            {loading ? 'Entrée...' : 'Entrer dans les paysages'}
          </button>

          <button
            onClick={handleDevMode}
            disabled={loading}
            className="w-full rounded-full p-3 mt-3 bg-white/5 border border-white/10 text-slate-400 text-sm"
          >
            Mode dev · entrer rapidement
          </button>
        </div>
      </section>
    </main>
  )
}
