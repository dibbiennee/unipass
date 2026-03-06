"use client";

import { Product } from "@/types";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui";
import { BookOpen } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-brand overflow-hidden">
            <Skeleton className="aspect-[4/3]" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen size={48} className="mx-auto text-neutral-400 mb-4" />
        <h3 className="text-body-lg font-bold text-neutral-700 mb-2">
          Nessun risultato
        </h3>
        <p className="text-body-sm text-neutral-400">
          Prova a modificare i filtri o cerca qualcos&apos;altro.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 2} />
      ))}
    </div>
  );
}
