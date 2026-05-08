import { motion } from 'framer-motion'

export default function AmbientBg({ accent = '#3b82f6' }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050810]">
      <motion.div
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent}55, transparent 70%)`,
        }}
      />

      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accent}44, transparent 70%)`,
        }}
      />

      {[...Array(7)].map((_, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -18, 0],
            x: [0, 8, -4, 0],
            opacity: [0.08, 0.24, 0.08],
          }}
          transition={{
            duration: 7 + index * 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.8,
          }}
          className="absolute rounded-full border blur-sm"
          style={{
            width: 24 + index * 16,
            height: 24 + index * 16,
            left: `${8 + index * 14}%`,
            top: `${14 + (index % 4) * 19}%`,
            borderColor: `${accent}33`,
            background: `radial-gradient(circle, ${accent}22, transparent)`,
          }}
        />
      ))}
    </div>
  )
}
