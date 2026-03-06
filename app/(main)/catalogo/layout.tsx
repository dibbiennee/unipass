import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Sfoglia tutti gli appunti e riassunti universitari verificati. Filtra per università, materia e ordina per prezzo o valutazione.",
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
