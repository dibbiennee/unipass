import { Metadata } from "next";
import { Mail, Clock, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Contattaci per domande, supporto o collaborazioni.",
};

export default function ContattiPage() {
  return (
    <div className="container-app py-10">
      <h1 className="text-display-md mb-4">Contatti</h1>
      <p className="text-body-md text-neutral-500 mb-8">
        Hai domande o bisogno di aiuto? Siamo qui per te.
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 p-4 rounded-brand bg-neutral-50 border border-neutral-200">
          <Mail size={22} className="text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-body-md font-bold text-neutral-900 mb-1">
              Email
            </h3>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-body-sm text-primary-400 hover:underline"
            >
              {SITE_CONFIG.email}
            </a>
            <p className="text-caption text-neutral-400 mt-1">
              Per domande, supporto ordini e collaborazioni
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-brand bg-neutral-50 border border-neutral-200">
          <Clock size={22} className="text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-body-md font-bold text-neutral-900 mb-1">
              Tempi di risposta
            </h3>
            <p className="text-body-sm text-neutral-500">
              Rispondiamo entro 24 ore, dal lunedì al venerdì.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-brand bg-neutral-50 border border-neutral-200">
          <MessageSquare
            size={22}
            className="text-primary-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <h3 className="text-body-md font-bold text-neutral-900 mb-1">
              Social
            </h3>
            <p className="text-body-sm text-neutral-500">
              Seguici su TikTok per consigli di studio e novità.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
