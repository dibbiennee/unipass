import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServerComponentClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { categories: data },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    }
  );
}
