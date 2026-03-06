import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Termini e Condizioni",
  description: "Termini e condizioni di utilizzo di UniPass.",
};

export default function TerminiPage() {
  return (
    <div className="container-app py-10">
      <h1 className="text-display-md mb-6">Termini e Condizioni</h1>

      <div className="space-y-6 text-body-sm text-neutral-700 leading-relaxed">
        <p>
          <em>Ultimo aggiornamento: marzo 2026</em>
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          1. Oggetto
        </h2>
        <p>
          I presenti Termini e Condizioni regolano l&apos;acquisto di prodotti
          digitali (appunti e riassunti universitari in formato PDF) tramite il
          sito {SITE_CONFIG.name} ({SITE_CONFIG.url}).
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          2. Prodotti digitali
        </h2>
        <p>
          Tutti i prodotti venduti su {SITE_CONFIG.name} sono contenuti
          digitali in formato PDF. L&apos;acquirente riceve un link di download
          via email dopo il completamento del pagamento.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          3. Download
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ogni link di download è valido per 48 ore dalla data di acquisto.</li>
          <li>È consentito un massimo di 5 download per ogni prodotto acquistato.</li>
          <li>
            In caso di problemi tecnici con il download, contattaci a{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-primary-400"
            >
              {SITE_CONFIG.email}
            </a>
            .
          </li>
        </ul>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          4. Prezzi e pagamento
        </h2>
        <p>
          Tutti i prezzi sono espressi in Euro (EUR) e includono l&apos;IVA ove
          applicabile. Il pagamento avviene tramite Stripe con carta di credito
          o debito.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          5. Diritto di recesso
        </h2>
        <p>
          Ai sensi dell&apos;art. 59 del Codice del Consumo, il diritto di
          recesso non si applica ai contenuti digitali forniti su supporto non
          materiale la cui esecuzione è iniziata con l&apos;accordo espresso
          del consumatore. Procedendo all&apos;acquisto e al download, accetti
          di rinunciare al diritto di recesso.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          6. Proprietà intellettuale
        </h2>
        <p>
          I materiali acquistati sono destinati esclusivamente all&apos;uso
          personale dell&apos;acquirente. È vietata la redistribuzione, la
          rivendita o la condivisione dei materiali acquistati.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          7. Limitazione di responsabilità
        </h2>
        <p>
          {SITE_CONFIG.name} non garantisce il superamento degli esami. I
          materiali sono strumenti di supporto allo studio e non sostituiscono
          la frequenza delle lezioni e lo studio personale.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          8. Contatti
        </h2>
        <p>
          Per qualsiasi domanda relativa ai presenti Termini e Condizioni,
          scrivi a{" "}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-primary-400"
          >
            {SITE_CONFIG.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
