import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { SITE_CONFIG } from "@/lib/constants";
import { CheckoutRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items, customer_email } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Il carrello è vuoto" },
        { status: 400 }
      );
    }

    if (!customer_email || !customer_email.includes("@")) {
      return NextResponse.json(
        { error: "Email non valida" },
        { status: 400 }
      );
    }

    // Re-verify prices from DB (anti-manipulation)
    const supabase = createAdminClient();
    const productIds = items.map((i) => i.product_id);

    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, name, price, is_active")
      .in("id", productIds);

    if (dbError || !products) {
      return NextResponse.json(
        { error: "Errore nel recupero dei prodotti" },
        { status: 500 }
      );
    }

    // Verify all products exist and are active
    const productMap = new Map(products.map((p) => [p.id, p]));
    const verifiedItems: { product_id: string; name: string; price: number }[] = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.product_id);
      if (!dbProduct || !dbProduct.is_active) {
        return NextResponse.json(
          { error: `Prodotto "${item.name}" non disponibile` },
          { status: 400 }
        );
      }
      verifiedItems.push({
        product_id: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price, // Use DB price, not client price
      });
    }

    const total = verifiedItems.reduce((sum, i) => sum + i.price, 0);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email,
      line_items: verifiedItems.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: 1,
      })),
      success_url: `${SITE_CONFIG.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_CONFIG.url}/checkout/cancel`,
      metadata: {
        product_ids: verifiedItems.map((i) => i.product_id).join(","),
      },
    });

    // Create pending order
    const { error: orderError } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      customer_email,
      total,
      status: "pending",
    });

    if (orderError) {
      console.error("Failed to create order:", orderError);
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Errore durante il checkout" },
      { status: 500 }
    );
  }
}
