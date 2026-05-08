import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import PageShell from '../components/layout/PageShell'
import SoftButton from '../components/ui/SoftButton'

export default function Home() {
  const navigate = useNavigate()

  return (
    <PageShell
      accent="#3b82f6"
      className="flex flex-col items-center justify-center text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 rounded-full mb-10 flex items-center justify-center text-5xl border border-blue-300/30"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #3b82f680, #1e3a5f40, transparent)',
          boxShadow: '0 0 70px #3b82f640',
        }}
      >
        🧭
      </motion.div>

      <h1 className="text-5xl leading-tight mb-4 font-light">
        Ma Boussole
        <br />
        <span className="text-blue-300 italic">
          Résonante
        </span>
      </h1>

      <p className="text-slate-400 leading-7 mb-12 max-w-xs">
        Une navigation sensible pour explorer ce que les paysages sonores éveillent en nous.
      </p>

      <SoftButton
        onClick={() => navigate('/profile')}
      >
        Commencer
      </SoftButton>
    </PageShell>
  )
}
