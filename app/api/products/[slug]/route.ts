import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createServerComponentClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    return NextResponse.json(
      { error: "Prodotto non trovato" },
      { status: 404 }
    );
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    product,
    reviews: reviews || [],
  });
}
