import Link from "next/link";
import { Button } from "@/components/ui";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container-app text-center">
        <div className="p-8 rounded-brand gradient-primary relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-display-md text-white mb-3">
              Pronto a studiare smart?
            </h2>
            <p className="text-body-md text-white/80 mb-6 max-w-sm mx-auto">
              Trova gli appunti per il tuo prossimo esame e risparmia ore di
              studio.
            </p>
            <Link href="/catalogo">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100"
              >
                Vai al catalogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
