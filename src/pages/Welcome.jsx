import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <div className="relative z-10 text-center max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full border border-cyan-400/30 bg-cyan-500/10 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
            <span className="text-5xl">
              🧭
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-thin mb-4 tracking-wide"
        >
          Ma Boussole
          <br />
          <span className="text-cyan-300 italic">
            Résonante
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-slate-400 leading-relaxed mb-10"
        >
          Une exploration sensible
          <br />
          des paysages sonores intérieurs
        </motion.p>

        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/profile')}
          className="px-8 py-4 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 backdrop-blur-xl shadow-lg shadow-cyan-500/20"
        >
          Commencer
        </motion.button>
      </div>
    </main>
  )
}
