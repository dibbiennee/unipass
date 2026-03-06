"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-app py-16 text-center">
      <p className="text-5xl font-bold text-red-500 mb-4">Oops</p>
      <h1 className="text-display-sm mb-3">Qualcosa è andato storto</h1>
      <p className="text-body-md text-neutral-500 mb-8">
        Si è verificato un errore imprevisto. Riprova tra qualche istante.
      </p>
      <Button onClick={reset}>Riprova</Button>
    </div>
  );
}
