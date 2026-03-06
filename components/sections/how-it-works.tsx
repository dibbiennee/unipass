import { Search, CreditCard, Download } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Cerca",
    description:
      "Trova gli appunti per il tuo esame filtrando per università, materia o professore.",
  },
  {
    icon: CreditCard,
    title: "2. Acquista",
    description:
      "Pagamento sicuro con carta di credito o debito tramite Stripe. Nessun abbonamento.",
  },
  {
    icon: Download,
    title: "3. Scarica",
    description:
      "Ricevi subito il link di download via email. Disponibile per 48 ore, fino a 5 download.",
  },
];

export function HowItWorks() {
  return (
    <section id="come-funziona" className="py-16">
      <div className="container-app">
        <h2 className="text-display-md text-center mb-10">
          Come funziona
        </h2>

        <div className="flex flex-col gap-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex gap-4 items-start p-4 rounded-brand bg-neutral-50 border border-neutral-200"
            >
              <div className="p-3 rounded-brand gradient-primary flex-shrink-0">
                <step.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-body-lg font-bold mb-1">{step.title}</h3>
                <p className="text-body-sm text-neutral-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
