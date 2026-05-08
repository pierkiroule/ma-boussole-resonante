import SynthesisPreview from '../synthesis/SynthesisPreview'

export default function TagsStep() {
  return (
    <section className="min-h-full p-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-light mb-4">
          Ma boussole
        </h2>

        <p className="text-slate-400 leading-relaxed mb-8">
          Touchez les mots qui résonnent avec votre expérience.
          Vous pouvez aussi ajouter vos propres mots.
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 mb-10">
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-3 rounded-full bg-cyan-500/20 border border-cyan-400/30">
              calme
            </button>

            <button className="px-4 py-3 rounded-full bg-white/5 border border-white/10">
              profondeur
            </button>

            <button className="px-4 py-3 rounded-full bg-white/5 border border-white/10">
              vivant
            </button>

            <button className="px-4 py-3 rounded-full bg-white/5 border border-white/10">
              respiration
            </button>
          </div>

          <input
            placeholder="Ajouter un mot personnel"
            className="w-full mt-5 rounded-2xl bg-black/30 border border-white/10 p-4 outline-none"
          />
        </div>

        <SynthesisPreview />
      </div>
    </section>
  )
}
