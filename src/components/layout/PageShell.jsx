import { motion } from 'framer-motion'
import AmbientBg from './AmbientBg'

export default function PageShell({
  children,
  accent = '#3b82f6',
  className = '',
}) {
  return (
    <main className="min-h-screen bg-[#050810] text-white relative overflow-hidden">
      <AmbientBg accent={accent} />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`relative z-10 min-h-screen max-w-[430px] mx-auto p-6 overflow-y-auto ${className}`}
      >
        {children}
      </motion.div>
    </main>
  )
}
