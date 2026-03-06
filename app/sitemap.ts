import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase-server";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/catalogo`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/chi-siamo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contatti`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/termini`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createAdminClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true);

    productPages = (products || []).map((product) => ({
      url: `${baseUrl}/catalogo/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available at build time
  }

  return [...staticPages, ...productPages];
}
