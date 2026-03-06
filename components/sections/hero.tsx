import Link from "next/link";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white" />
      <div className="container-app relative z-10 text-center pt-8 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 border border-primary-200 text-caption text-primary-700 mb-3">
          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse-slow" />
          Appunti verificati da studenti come te
        </div>

        <h1 className="text-display-lg md:text-[3.5rem] leading-tight mb-4">
          Studia{" "}
          <span className="text-gradient">smart</span>,{" "}
          <br />
          passa gli esami.
        </h1>

        <p className="text-body-lg text-neutral-500 max-w-sm mx-auto mb-8">
          Appunti e riassunti universitari verificati. Risparmia tempo,
          migliora i tuoi voti.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/catalogo">
            <Button size="lg" className="w-full sm:w-auto">
              Sfoglia il catalogo
            </Button>
          </Link>
          <Link href="/#come-funziona">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Come funziona
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
