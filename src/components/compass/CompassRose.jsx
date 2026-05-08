import { motion } from 'framer-motion'

const positions = {
  north: {
    top: '4%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  east: {
    top: '50%',
    right: '4%',
    transform: 'translateY(-50%)',
  },
  south: {
    bottom: '4%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  west: {
    top: '50%',
    left: '4%',
    transform: 'translateY(-50%)',
  },
}

const labels = {
  north: 'OUVRIR',
  south: 'RÉVEILLER',
  east: 'RELIER',
  west: 'RESSENTIR',
}

export default function CompassRose({
  currentAxis,
  selectedTags,
  onSelectAxis,
  axes,
}) {
  return (
    <div className="relative w-full flex justify-center mb-10">
      <div className="relative w-72 h-72 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/30 flex items-center justify-center text-center"
          style={{
            background: 'radial-gradient(circle, #3b82f633, transparent)',
            boxShadow: '0 0 40px #3b82f633',
          }}
        >
          <span className="text-xs text-blue-200 leading-4">
            noyau
            <br />
            sensible
          </span>
        </motion.div>

        {axes.map((axis) => {
          const count = selectedTags[axis.id]?.length || 0
          const active = currentAxis === axis.id

          return (
            <motion.button
              key={axis.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectAxis(axis.id)}
              className="absolute rounded-full px-3 py-2 border text-xs tracking-widest"
              style={{
                ...positions[axis.id],
                color: active ? axis.color : '#94a3b8',
                borderColor: active ? axis.color : 'rgba(255,255,255,0.12)',
                background: active ? `${axis.color}22` : 'rgba(255,255,255,0.04)',
                boxShadow: active ? `0 0 24px ${axis.color}55` : 'none',
              }}
            >
              <div>{axis.label}</div>
              <div className="text-[10px] opacity-70">
                {labels[axis.id]}
              </div>
              {count > 0 && (
                <div className="mt-1 text-[10px]">
                  {count} mot{count > 1 ? 's' : ''}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
