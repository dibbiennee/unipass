import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id richiesto" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, customer_email, total, status, created_at, order_items(product_name, price)")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    email: order.customer_email,
    total: order.total,
    status: order.status,
    created_at: order.created_at,
    items: order.order_items,
  });
}
