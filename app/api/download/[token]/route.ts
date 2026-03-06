import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { DOWNLOAD_CONFIG } from "@/lib/constants";

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = createAdminClient();

  // Find download token
  const { data: tokenRecord, error } = await supabase
    .from("download_tokens")
    .select("*, product:products(file_path, name)")
    .eq("token", params.token)
    .single();

  if (error || !tokenRecord) {
    return NextResponse.json(
      { error: "Link di download non valido" },
      { status: 404 }
    );
  }

  // Check expiry
  if (new Date(tokenRecord.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Il link di download è scaduto" },
      { status: 410 }
    );
  }

  // Check download count
  if (tokenRecord.download_count >= tokenRecord.max_downloads) {
    return NextResponse.json(
      {
        error: `Hai raggiunto il limite massimo di ${DOWNLOAD_CONFIG.maxDownloads} download`,
      },
      { status: 429 }
    );
  }

  const filePath = tokenRecord.product?.file_path;
  if (!filePath) {
    return NextResponse.json(
      { error: "File non trovato" },
      { status: 404 }
    );
  }

  // Increment download count
  await supabase
    .from("download_tokens")
    .update({ download_count: tokenRecord.download_count + 1 })
    .eq("id", tokenRecord.id);

  // Generate signed URL (60 seconds)
  const { data: signedUrl, error: urlError } = await supabase.storage
    .from("products")
    .createSignedUrl(filePath, DOWNLOAD_CONFIG.signedUrlDurationSeconds);

  if (urlError || !signedUrl) {
    return NextResponse.json(
      { error: "Impossibile generare il link di download" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}
