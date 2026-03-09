import { NextResponse } from "next/server";

// Legacy endpoint — checkout now uses direct Stripe Payment Links.
// This route exists to prevent 500 errors from cached client bundles.
export async function POST() {
  return NextResponse.json(
    { error: "Il checkout diretto non è più disponibile. Acquista dal catalogo." },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Il checkout diretto non è più disponibile. Acquista dal catalogo." },
    { status: 410 }
  );
}
