"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { Button, Skeleton } from "@/components/ui";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=4&sort=rating")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16">
      <div className="container-app">
        <h2 className="text-display-md text-center mb-2">
          I più richiesti
        </h2>
        <p className="text-body-sm text-neutral-400 text-center mb-8">
          Gli appunti più scaricati dai nostri studenti
        </p>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-brand overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/catalogo">
            <Button variant="secondary" size="lg">
              Vedi tutti gli appunti
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
