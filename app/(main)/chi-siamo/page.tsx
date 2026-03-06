import { Metadata } from "next";
import { BookOpen, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "UniPass nasce per aiutare gli studenti universitari a studiare meglio con appunti verificati.",
};

export default function ChiSiamoPage() {
  return (
    <div className="container-app py-10">
      <h1 className="text-display-md mb-6">Chi siamo</h1>

      <div className="space-y-6 text-body-md text-neutral-700 leading-relaxed">
        <p>
          <strong className="text-neutral-900">UniPass</strong> nasce da
          un&apos;idea semplice: rendere lo studio universitario più
          efficiente. Sappiamo quanto sia difficile preparare un esame
          partendo da zero, con centinaia di pagine da leggere e poco tempo
          a disposizione.
        </p>

        <p>
          Per questo abbiamo creato una piattaforma dove gli studenti possono
          trovare appunti e riassunti verificati, scritti da chi ha già
          superato l&apos;esame con successo. Ogni materiale viene controllato
          per garantire qualità, completezza e chiarezza.
        </p>

        <div className="grid grid-cols-1 gap-4 py-4">
          {[
            {
              icon: BookOpen,
              title: "Qualità garantita",
              desc: "Ogni appunto è verificato prima della pubblicazione per garantire completezza e accuratezza.",
            },
            {
              icon: Users,
              title: "Da studenti, per studenti",
              desc: "Il nostro team è composto da universitari che capiscono le esigenze di chi studia.",
            },
            {
              icon: Heart,
              title: "Missione",
              desc: "Vogliamo che ogni studente possa accedere a materiale di studio di qualità a prezzi accessibili.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-4 rounded-brand bg-neutral-50 border border-neutral-200"
            >
              <item.icon
                size={24}
                className="text-primary-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-body-md font-bold text-neutral-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-body-sm text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p>
          Se hai appunti di qualità e vuoi aiutare altri studenti (guadagnando),
          scrivici a{" "}
          <a
            href="mailto:info@unipass.it"
            className="text-primary-400 hover:underline"
          >
            info@unipass.it
          </a>
          .
        </p>
      </div>
    </div>
  );
}
