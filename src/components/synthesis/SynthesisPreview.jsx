import { useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'

export default function SynthesisPreview() {
  const selectedTags = useAppStore((s) => s.selectedTags)
  const connections = useAppStore((s) => s.connections)

  const allTags = useMemo(() => {
    return Object.values(selectedTags || {}).flat()
  }, [selectedTags])

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
      <p className="uppercase tracking-[0.25em] text-xs text-slate-500 mb-5">
        Ma carte de résonance
      </p>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
          Résonances
        </p>

        <div className="flex flex-wrap gap-2">
          {allTags.length === 0 && (
            <p className="text-slate-600 text-sm">
              Aucun mot sélectionné
            </p>
          )}

          {allTags.map((tag) => (
            <div
              key={tag}
              className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
          Tissage
        </p>

        {connections.length === 0 && (
          <p className="text-slate-600 text-sm">
            Aucun lien créé
          </p>
        )}

        <div className="flex flex-col gap-2">
          {connections.map((c, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300"
            >
              {c.from} → {c.to}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
