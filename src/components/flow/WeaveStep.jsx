import SynthesisPreview from '../synthesis/SynthesisPreview'

export default function WeaveStep() {
  return (
    <section className="min-h-full p-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-light mb-4">
          Mon tissage
        </h2>

        <p className="text-slate-400 leading-relaxed mb-8">
          Touchez deux mots pour créer une connexion.
          Votre carte évolue en direct.
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 mb-10 min-h-[300px]">
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-3 rounded-full bg-cyan-500/20 border border-cyan-400/30">
              calme
            </div>

            <div className="px-4 py-3 rounded-full bg-white/5 border border-white/10">
              respiration
            </div>

            <div className="px-4 py-3 rounded-full bg-white/5 border border-white/10">
              vivant
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-cyan-400/20 p-10 text-center text-slate-500">
            Réseau vivant des résonances
          </div>
        </div>

        <SynthesisPreview />
      </div>
    </section>
  )
}
