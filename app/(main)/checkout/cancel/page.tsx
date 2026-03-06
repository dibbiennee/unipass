import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui";

export default function CheckoutCancelPage() {
  return (
    <div className="container-app py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-6">
        <XCircle size={32} className="text-neutral-500" />
      </div>

      <h1 className="text-display-sm mb-3">Pagamento annullato</h1>

      <p className="text-body-md text-neutral-500 mb-8 max-w-sm mx-auto">
        Il pagamento è stato annullato. I prodotti nel tuo carrello sono
        ancora disponibili.
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/checkout">
          <Button className="w-full">Torna al carrello</Button>
        </Link>
        <Link href="/catalogo">
          <Button variant="ghost" className="w-full">
            Continua a sfogliare
          </Button>
        </Link>
      </div>
    </div>
  );
}
