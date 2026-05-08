import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createProfile } from '../services/profileService'
import { useProfileStore } from '../store/useProfileStore'

export default function ProfileSetup() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((s) => s.setProfile)

  const [pseudo, setPseudo] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = pseudo.trim() && ageRange && gender && consent && !loading

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!canSubmit) {
      setError('Merci de remplir le pseudo, la tranche d’âge, le genre et le consentement.')
      return
    }

    setLoading(true)

    const profile = await createProfile({
      pseudo: pseudo.trim(),
      age_range: ageRange,
      gender,
      research_consent: consent,
    })

    setLoading(false)

    if (!profile) {
      setError('Impossible de créer le profil. Vérifie la table profiles dans Supabase.')
      return
    }

    setProfile(profile)
    navigate('/experiences')
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl mb-6">
        Mon profil
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Pseudo"
          className="bg-slate-900 border border-white/10 rounded-2xl p-4"
        />

        <select
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-2xl p-4"
        >
          <option value="">Tranche d'âge</option>
          <option value="12-17">12-17</option>
          <option value="18-25">18-25</option>
          <option value="26-40">26-40</option>
          <option value="41-60">41-60</option>
          <option value="61+">61+</option>
        </select>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-2xl p-4"
        >
          <option value="">Genre</option>
          <option value="Femme">Femme</option>
          <option value="Homme">Homme</option>
          <option value="Non-binaire">Non-binaire</option>
          <option value="Préfère ne pas répondre">Préfère ne pas répondre</option>
        </select>

        <label className="flex gap-3 items-start text-sm text-slate-400">
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
          className={`rounded-full p-4 mt-4 ${
            canSubmit
              ? 'bg-blue-500 text-white'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          {loading ? 'Création...' : 'Continuer'}
        </button>
      </form>
    </main>
  )
}
