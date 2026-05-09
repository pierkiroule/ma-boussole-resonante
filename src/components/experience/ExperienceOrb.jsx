import { motion } from 'framer-motion'

const orbPresets = {
  AMPHIBIUS: {
    icon: '🌿',
    duration: 5,
    drift: 8,
    particles: 5,
  },
  AQUAPHONIE: {
    icon: '💧',
    duration: 4,
    drift: 5,
    particles: 8,
  },
  SILENCE: {
    icon: '·',
    duration: 8,
    drift: 2,
    particles: 2,
  },
  'LA GRANDE SYMPHONIE DU VIVANT': {
    icon: '🌱',
    duration: 6,
    drift: 10,
    particles: 10,
  },
  'AVES MELODIA': {
    icon: '🪽',
    duration: 4.5,
    drift: 12,
    particles: 7,
  },
  'CE QUE DIT LE VENT': {
    icon: '〰',
    duration: 3.8,
    drift: 16,
    particles: 6,
  },
  'DES BRUITS DANS LA NUIT': {
    icon: '✦',
    duration: 7,
    drift: 4,
    particles: 9,
  },
  'LA VAGUE': {
    icon: '≈',
    duration: 4.2,
    drift: 14,
    particles: 6,
  },
  PROFONDEURS: {
    icon: '◌',
    duration: 9,
    drift: 3,
    particles: 5,
  },
  'MARÉE BASSE': {
    icon: '⌁',
    duration: 6.5,
    drift: 9,
    particles: 4,
  },
}

export default function ExperienceOrb({
  title,
  color = '#22d3ee',
}) {
  const preset = orbPresets[title] || {
    icon: '🧭',
    duration: 5,
    drift: 6,
    particles: 5,
  }

  return (
    <div className="relative w-48 h-48 mx-auto mb-8">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: preset.duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${color}88, ${color}33, transparent 72%)`,
          border: `1px solid ${color}55`,
          boxShadow: `0 0 70px ${color}55, inset 0 0 40px ${color}22`,
        }}
      />

      <motion.div
        animate={{
          scale: [0.8, 1.25, 0.8],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: preset.duration * 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-4 rounded-full blur-xl"
        style={{
          background: `${color}33`,
        }}
      />

            <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            opacity: [0.45, 1, 0.45],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: preset.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-5xl"
        >
          {preset.icon}
        </motion.div>
      </div>
    </div>
  )
}
