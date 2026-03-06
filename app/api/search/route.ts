import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }

  const supabase = createServerComponentClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, original_price, preview_image, university")
    .eq("is_active", true)
    .textSearch("search_vector", q.trim(), {
      type: "plain",
      config: "italian",
    })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data || [] });
}
