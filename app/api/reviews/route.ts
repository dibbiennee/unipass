import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, order_id, customer_email, display_name, rating, comment } = body;

    if (!product_id || !order_id || !customer_email || !display_name || !rating) {
      return NextResponse.json(
        { error: "Campi obbligatori mancanti" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Il voto deve essere tra 1 e 5" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify the order is completed and belongs to this customer
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, customer_email")
      .eq("id", order_id)
      .eq("customer_email", customer_email)
      .eq("status", "completed")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Ordine non trovato o non completato" },
        { status: 403 }
      );
    }

    // Verify the product was in this order
    const { data: orderItem } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", order_id)
      .eq("product_id", product_id)
      .single();

    if (!orderItem) {
      return NextResponse.json(
        { error: "Prodotto non presente nell'ordine" },
        { status: 403 }
      );
    }

    // Check for existing review
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", order_id)
      .eq("product_id", product_id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: "Hai già lasciato una recensione per questo prodotto" },
        { status: 409 }
      );
    }

    // Create review (not approved by default)
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        product_id,
        order_id,
        customer_email,
        display_name,
        rating,
        comment: comment || null,
        is_approved: false,
      })
      .select()
      .single();

    if (reviewError) {
      return NextResponse.json(
        { error: "Errore nella creazione della recensione" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Errore del server" },
      { status: 500 }
    );
  }
}
