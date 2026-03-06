"use client";

import { ProductDetail } from "@/components/product/product-detail";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { Product, Review } from "@/types";

interface Props {
  product: Product;
  reviews: Review[];
}

export function ProductDetailClient({ product, reviews }: Props) {
  return (
    <div className="container-app py-6 pb-28 space-y-10">
      <ProductDetail product={product} />
      <ProductReviews reviews={reviews} productId={product.id} />
      <RelatedProducts
        categorySlug={product.category?.slug}
        currentProductId={product.id}
      />
    </div>
  );
}
