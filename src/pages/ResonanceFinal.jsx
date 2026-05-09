import SynthesisPreview from '../components/synthesis/SynthesisPreview'
import Collective from './Collective'

export default function ResonanceFinal() {
  return (
    <main className="min-h-full p-6 pb-24">
      <section className="mb-14">
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          Ma traversée
        </p>

        <h1 className="text-4xl font-light leading-tight mb-4">
          Ma boussole
          <br />
          <span className="italic text-cyan-300">
            personnelle
          </span>
        </h1>

        <p className="text-slate-400 leading-relaxed mb-8">
          Les mots choisis et les liens tissés donnent forme
          à votre traversée personnelle.
        </p>

        <SynthesisPreview />
      </section>

      <section>
        <p className="uppercase tracking-[0.3em] text-xs text-slate-500 mb-3">
          Nos résonances
        </p>

        <h2 className="text-4xl font-light leading-tight mb-4">
          Boussole
          <br />
          <span className="italic text-cyan-300">
            partagée
          </span>
        </h2>

        <p className="text-slate-400 leading-relaxed mb-8">
          Cette boussole montre ce qui revient collectivement
          dans les traversées des paysages sonores.
        </p>

        <Collective embedded />
      </section>
    </main>
  )
}
