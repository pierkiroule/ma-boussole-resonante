import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { createProfile } from '../services/profileService'
import { useAppStore } from '../store/useAppStore'

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
      setError('Entre un pseudo pour commencer.')
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
          <div className="w-28 h-28 mx-auto rounded-full border border-cyan-400/30 bg-cyan-500/10 flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20">
            <span className="text-5xl">
              🧭
            </span>
          </div>

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
            Explorez des paysages sonores et notez ici les mots qui décrivent et résonnent au plus juste avec vos ressentis du moment.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-5">
          <h2 className="text-2xl font-light mb-4">
            Comment naviguer ?
          </h2>

          <div className="flex flex-col gap-4 text-slate-300 leading-relaxed">
            <p>
              <span className="text-cyan-300">↔ Glisser horizontalement</span>
              <br />
              pour découvrir les différents paysages sonores.
            </p>

            <p>
              <span className="text-cyan-300">↕ Scroller verticalement</span>
              <br />
              pour sélectionner et relier vos mots qui résonnent.
            </p>

            <ol className="list-decimal pl-5 text-slate-400">
              <li>écouter</li>
              <li>choisir des tags</li>
              <li>relier les mots</li>
              <li>voir la synthèse vivante</li>
            </ol>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 mb-5">
          <h2 className="text-2xl font-light mb-5">
            Entrer dans l’expérience
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
