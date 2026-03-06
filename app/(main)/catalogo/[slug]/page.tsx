import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase-server";
import { SITE_CONFIG } from "@/lib/constants";
import { ProductDetailClient } from "./product-detail-client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerComponentClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, short_description, preview_image, price")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!product) {
    return { title: "Prodotto non trovato" };
  }

  return {
    title: product.name,
    description: product.short_description,
    openGraph: {
      title: `${product.name} | ${SITE_CONFIG.name}`,
      description: product.short_description,
      images: product.preview_image ? [product.preview_image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerComponentClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: product.preview_image,
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    ...(product.review_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        reviews={reviews || []}
      />
    </>
  );
}
