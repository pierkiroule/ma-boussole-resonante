import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

export default function ListenStep() {
  const currentExperience = useAppStore(
    (s) => s.currentExperience
  )

  function openPlayer() {
    window.open(
      currentExperience.external_player_url,
      'pcloud-player',
      'popup=yes,width=420,height=760'
    )
  }

  return (
    <section className="min-h-full p-6 flex flex-col justify-center">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="w-40 h-40 rounded-full mx-auto mb-10"
        style={{
          background: `${currentExperience.color}55`,
        }}
      />

      <p className="text-slate-400 leading-relaxed mb-8 text-center">
        Ouvrez le paysage sonore.
        Écoutez.
        Revenez ensuite pour compléter votre boussole.
      </p>

      <button
        onClick={openPlayer}
        className="rounded-full p-5 bg-cyan-500 text-black font-medium"
      >
        🎧 Ouvrir l’écoute
      </button>
    </section>
  )
}
