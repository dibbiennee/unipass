"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
}

export function RelatedProducts({
  categorySlug,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!categorySlug) return;
    fetch(`/api/products?category=${categorySlug}&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.products || []).filter(
          (p: Product) => p.id !== currentProductId
        );
        setProducts(filtered.slice(0, 4));
      })
      .catch(() => {});
  }, [categorySlug, currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-body-lg font-bold">Prodotti correlati</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[160px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
