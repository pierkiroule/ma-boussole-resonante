import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Experiences() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/experience')
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-slate-500">
        Chargement des paysages sonores...
      </p>
    </main>
  )
}
