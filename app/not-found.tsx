import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="container-app text-center py-16">
        <p className="text-6xl font-bold text-primary-500 mb-4">404</p>
        <h1 className="text-display-sm mb-3">Pagina non trovata</h1>
        <p className="text-body-md text-neutral-500 mb-8">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center px-6 py-3 rounded-brand bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors"
          >
            Vai al catalogo
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-brand text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
