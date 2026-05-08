import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createProfile } from '../services/profileService'
import { useAppStore } from '../store/useAppStore'

export default function Profile() {
  const navigate = useNavigate()
  const setProfile = useAppStore((s) => s.setProfile)

  const [pseudo, setPseudo] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit =
    pseudo.trim() &&
    ageRange &&
    gender &&
    consent &&
    !loading

  async function saveProfile(profilePayload) {
    setLoading(true)

    const profile = await createProfile(profilePayload)

    setLoading(false)

    if (!profile) {
      setError('Impossible de créer le profil.')
      return
    }

    setProfile(profile)
    navigate('/experiences')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!canSubmit) {
      setError('Merci de compléter le profil.')
      return
    }

    await saveProfile({
      pseudo: pseudo.trim(),
      age_range: ageRange,
      gender,
      research_consent: consent,
    })
  }

  async function handleDevMode() {
    setError('')

    await saveProfile({
      pseudo: `dev-${Date.now()}`,
      age_range: '26-40',
      gender: 'Préfère ne pas répondre',
      research_consent: true,
    })
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <p className="text-slate-500 uppercase tracking-widest text-xs mb-3">
        Profil
      </p>

      <h1 className="text-4xl mb-8 font-light">
        Avant de commencer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <input
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Pseudo"
          className="rounded-2xl bg-slate-900 border border-white/10 p-4 outline-none"
        />

        <button
          type="button"
          onClick={handleDevMode}
          disabled={loading}
          className="rounded-full p-3 bg-white/5 border border-white/10 text-slate-300 text-sm"
        >
          Mode dev : entrer rapidement
        </button>

        <select
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
          className="rounded-2xl bg-slate-900 border border-white/10 p-4 outline-none"
        >
          <option value="">Tranche d’âge</option>
          <option value="12-17">12-17</option>
          <option value="18-25">18-25</option>
          <option value="26-40">26-40</option>
          <option value="41-60">41-60</option>
          <option value="61+">61+</option>
        </select>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="rounded-2xl bg-slate-900 border border-white/10 p-4 outline-none"
        >
          <option value="">Genre</option>
          <option value="Femme">Femme</option>
          <option value="Homme">Homme</option>
          <option value="Non-binaire">Non-binaire</option>
          <option value="Préfère ne pas répondre">
            Préfère ne pas répondre
          </option>
        </select>

        <label className="flex gap-3 text-sm text-slate-400 leading-relaxed">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />

          <span>
            J’accepte que mes réponses anonymisées puissent contribuer à une recherche sur l’écoute et les paysages sonores.
          </span>
        </label>

        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full p-4 mt-4 bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500"
        >
          {loading ? 'Création...' : 'Continuer'}
        </button>
      </form>
    </main>
  )
}
