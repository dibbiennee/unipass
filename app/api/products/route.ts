import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const university = searchParams.get("university");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
  const offset = (page - 1) * limit;

  const supabase = createServerComponentClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("is_active", true);

  if (category) {
    query = query.eq("category.slug", category).not("category", "is", null);
  }

  if (university) {
    query = query.eq("university", university);
  }

  if (search) {
    query = query.textSearch("search_vector", search, {
      type: "plain",
      config: "italian",
    });
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("average_rating", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count || 0;

  return NextResponse.json({
    products: data || [],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
