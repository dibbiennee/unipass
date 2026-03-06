import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sulla privacy di UniPass.",
};

export default function PrivacyPage() {
  return (
    <div className="container-app py-10">
      <h1 className="text-display-md mb-6">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-body-sm text-neutral-700 leading-relaxed">
        <p>
          <em>Ultimo aggiornamento: marzo 2026</em>
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          1. Titolare del trattamento
        </h2>
        <p>
          Il titolare del trattamento dei dati è {SITE_CONFIG.name}, contattabile
          all&apos;indirizzo email{" "}
          <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-400">
            {SITE_CONFIG.email}
          </a>
          .
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          2. Dati raccolti
        </h2>
        <p>Raccogliamo i seguenti dati:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Email:</strong> fornita al momento dell&apos;acquisto per
            l&apos;invio dei link di download e della conferma d&apos;ordine.
          </li>
          <li>
            <strong>Dati di pagamento:</strong> gestiti interamente da Stripe.
            Non memorizziamo numeri di carta di credito.
          </li>
          <li>
            <strong>Dati di navigazione:</strong> cookie tecnici necessari al
            funzionamento del sito.
          </li>
        </ul>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          3. Finalità del trattamento
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Evasione degli ordini e invio dei prodotti digitali acquistati</li>
          <li>Comunicazioni relative agli ordini</li>
          <li>Adempimento di obblighi di legge</li>
        </ul>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          4. Base giuridica
        </h2>
        <p>
          Il trattamento dei dati è basato sull&apos;esecuzione del contratto
          di vendita (art. 6.1.b GDPR) e sull&apos;adempimento di obblighi
          legali (art. 6.1.c GDPR).
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          5. Conservazione dei dati
        </h2>
        <p>
          I dati personali vengono conservati per il tempo necessario
          all&apos;esecuzione del contratto e per i periodi previsti dalla legge
          per la conservazione dei documenti fiscali.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          6. Diritti dell&apos;interessato
        </h2>
        <p>
          Ai sensi del GDPR (artt. 15-22), hai diritto di: accedere ai tuoi
          dati, rettificarli, cancellarli, limitarne il trattamento, opporti
          al trattamento e richiederne la portabilità. Per esercitare i tuoi
          diritti, scrivi a{" "}
          <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary-400">
            {SITE_CONFIG.email}
          </a>
          .
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          7. Cookie
        </h2>
        <p>
          Utilizziamo esclusivamente cookie tecnici necessari al funzionamento
          del sito (sessione, carrello). Non utilizziamo cookie di
          profilazione.
        </p>

        <h2 className="text-body-lg font-bold text-neutral-900 mt-8">
          8. Servizi di terze parti
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Stripe:</strong> per l&apos;elaborazione dei pagamenti.{" "}
            <a href="https://stripe.com/privacy" className="text-primary-400">
              Privacy Policy di Stripe
            </a>
          </li>
          <li>
            <strong>Supabase:</strong> per l&apos;archiviazione dei dati.
          </li>
          <li>
            <strong>Vercel:</strong> per l&apos;hosting del sito web.
          </li>
        </ul>
      </div>
    </div>
  );
}
