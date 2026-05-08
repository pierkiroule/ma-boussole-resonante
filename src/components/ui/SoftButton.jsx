import { motion } from 'framer-motion'

export default function SoftButton({
  children,
  onClick,
  disabled = false,
  className = '',
  color = '#3b82f6',
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full p-4 text-white transition-all ${className}`}
      style={{
        background: disabled
          ? 'rgba(51,65,85,0.8)'
          : `linear-gradient(135deg, ${color}, ${color}99)`,
        boxShadow: disabled
          ? 'none'
          : `0 0 28px ${color}55`,
      }}
    >
      {children}
    </motion.button>
  )
}
