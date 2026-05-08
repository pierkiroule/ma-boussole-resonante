import { useAppStore } from '../../store/useAppStore'
import SynthesisPreview from '../synthesis/SynthesisPreview'

export default function SaveStep() {
  const synthesisTitle = useAppStore((s) => s.synthesisTitle)
  const setSynthesisTitle = useAppStore((s) => s.setSynthesisTitle)

  const comment = useAppStore((s) => s.comment)
  const setComment = useAppStore((s) => s.setComment)

  return (
    <section className="min-h-full p-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-light mb-4">
          Ma synthèse
        </h2>

        <p className="text-slate-400 leading-relaxed mb-8">
          Donnez un titre à votre expérience
          et ajoutez votre commentaire personnel.
        </p>

        <div className="flex flex-col gap-5 mb-10">
          <input
            value={synthesisTitle}
            onChange={(e) =>
              setSynthesisTitle(e.target.value)
            }
            placeholder="Titre de ma carte"
            className="rounded-2xl bg-white/5 border border-white/10 p-5 outline-none"
          />

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Mon commentaire"
            rows={6}
            className="rounded-2xl bg-white/5 border border-white/10 p-5 outline-none resize-none"
          />
        </div>

        <SynthesisPreview />

        <div className="mt-10">
          <button className="w-full rounded-full p-5 bg-cyan-400 text-black font-medium">
            Voir les résonances collectives
          </button>
        </div>
      </div>
    </section>
  )
}
