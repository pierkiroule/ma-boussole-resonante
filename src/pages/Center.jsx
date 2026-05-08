import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageShell from '../components/layout/PageShell'

import { useResonanceStore } from '../store/useResonanceStore'

import { updateResonanceEntry } from '../services/resonanceService'

const WEATHER_OPTIONS = [
  {
    id: 'lumineux',
    emoji: '☀️',
    color: '#facc15',
  },
  {
    id: 'apaisé',
    emoji: '🌤',
    color: '#60a5fa',
  },
  {
    id: 'émotionnel',
    emoji: '🌧',
    color: '#818cf8',
  },
  {
    id: 'profond',
    emoji: '🌊',
    color: '#0ea5e9',
  },
  {
    id: 'flou',
    emoji: '🌫',
    color: '#94a3b8',
  },
  {
    id: 'léger',
    emoji: '🍃',
    color: '#4ade80',
  },
]

export default function Center() {
  const navigate = useNavigate()

  const entryId = useResonanceStore((s) => s.entryId)

  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [weather, setWeather] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setError('')

    if (!title.trim()) {
      setError('Donne un titre à ta synthèse.')
      return
    }

    if (!entryId) {
      setError('Entrée introuvable.')
      return
    }

    setLoading(true)

    const ok = await updateResonanceEntry(entryId, {
      synthesis_title: title,
      user_comment: comment,
      weather,
    })

    setLoading(false)

    if (!ok) {
      setError('Impossible de sauvegarder.')
      return
    }

    navigate('/synthesis')
  }

  return (
    <PageShell accent="#818cf8">
      <p className="text-slate-500 uppercase tracking-widest text-xs mb-3">
        Synthèse
      </p>

      <h1 className="text-4xl leading-tight mb-8 font-light">
        Donne un titre
        <br />
        <span className="italic text-indigo-300">
          à ta traversée
        </span>
      </h1>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-6">
        <label className="block text-sm text-slate-400 mb-3">
          Titre de la synthèse
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex : Retrouver le calme intérieur"
          className="w-full rounded-2xl bg-black/30 border border-white/10 p-4 text-white outline-none"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-6">
        <label className="block text-sm text-slate-400 mb-3">
          Mon commentaire
        </label>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Quelques mots sur l’expérience..."
          className="w-full rounded-2xl bg-black/30 border border-white/10 p-4 text-white outline-none resize-none"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 mb-8">
        <p className="text-sm text-slate-400 mb-4">
          Météo émotionnelle
        </p>

        <div className="flex flex-wrap gap-3">
          {WEATHER_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setWeather(option.id)}
              className="rounded-full px-4 py-2 border transition-all"
              style={{
                borderColor:
                  weather === option.id
                    ? option.color
                    : 'rgba(255,255,255,0.12)',

                background:
                  weather === option.id
                    ? `${option.color}22`
                    : 'rgba(255,255,255,0.03)',

                color:
                  weather === option.id
                    ? option.color
                    : '#94a3b8',
              }}
            >
              {option.emoji} {option.id}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <p className="text-red-400 text-sm mb-6">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full rounded-full bg-indigo-500 p-4 disabled:bg-slate-700"
      >
        {loading ? 'Sauvegarde...' : 'Voir ma synthèse'}
      </button>
    </PageShell>
  )
}
