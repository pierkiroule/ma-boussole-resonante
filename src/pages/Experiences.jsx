import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getExperiences } from '../services/experienceService'
import { useAppStore } from '../store/useAppStore'

export default function Experiences() {
  const navigate = useNavigate()

  const setCurrentExperience = useAppStore(
    (s) => s.setCurrentExperience
  )

  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getExperiences()
      setExperiences(data || [])
      setLoading(false)
    }

    load()
  }, [])

  function handleSelect(exp) {
    setCurrentExperience(exp)
    navigate('/listening')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl mb-6">
        Expériences sonores
      </h1>

      <div className="flex flex-col gap-4">
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => handleSelect(exp)}
            className="rounded-3xl p-6 border border-white/10 text-left"
            style={{
              background: `linear-gradient(135deg, ${exp.color}30, #111827)`
            }}
          >
            <h2 className="text-2xl mb-1">
              {exp.title}
            </h2>

            <p className="text-slate-400">
              {exp.subtitle}
            </p>
          </button>
        ))}
      </div>
    </main>
  )
}
