import { Product } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";

export function getProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description,
    image: product.preview_image,
    brand: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_CONFIG.url}/catalogo/${product.slug}`,
    },
    ...(product.review_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    logo: `${SITE_CONFIG.url}/images/brand/logo.svg`,
  };
}
