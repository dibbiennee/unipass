import { Shield, FileCheck, Clock, CreditCard } from "lucide-react";

const signals = [
  {
    icon: FileCheck,
    title: "Qualità verificata",
    description: "Ogni appunto è controllato prima della pubblicazione.",
  },
  {
    icon: Shield,
    title: "Pagamento sicuro",
    description: "Transazioni protette da Stripe, leader mondiale nei pagamenti.",
  },
  {
    icon: Clock,
    title: "Download immediato",
    description: "Accesso istantaneo dopo l'acquisto, nessuna attesa.",
  },
  {
    icon: CreditCard,
    title: "Prezzi accessibili",
    description: "Materiale di qualità a prezzi pensati per gli studenti.",
  },
];

export function TrustSignals() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container-app">
        <h2 className="text-display-md text-center mb-10">
          Perché scegliere UniPass
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className="p-4 rounded-brand bg-neutral-50 border border-neutral-200"
            >
              <signal.icon
                size={24}
                className="text-primary-400 mb-3"
              />
              <h3 className="text-body-sm font-bold mb-1">{signal.title}</h3>
              <p className="text-caption text-neutral-400">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
