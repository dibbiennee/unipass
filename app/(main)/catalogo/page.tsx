"use client";

import { Suspense } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFiltersBar } from "@/components/product/product-filters";
import { useProducts } from "@/hooks/use-products";
import { useSearch } from "@/hooks/use-search";

function CatalogoContent() {
  const { products, loading, filters, page, totalPages, updateFilters } = useProducts();
  const { query, setQuery } = useSearch();

  const handleSearch = (value: string) => {
    setQuery(value);
    updateFilters({ search: value || undefined });
  };

  return (
    <div className="container-app py-6 overflow-x-hidden">
      <h1 className="text-display-md mb-6">Catalogo</h1>

      <Input
        placeholder="Cerca appunti..."
        icon={<Search size={18} />}
        value={query || filters.search || ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4"
      />

      <ProductFiltersBar filters={filters} onFilterChange={updateFilters} />

      <ProductGrid products={products} loading={loading} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => updateFilters({ page: page - 1 })}
          >
            <ChevronLeft size={18} />
            Precedente
          </Button>
          <span className="text-body-sm text-neutral-500">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => updateFilters({ page: page + 1 })}
          >
            Successiva
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense>
      <CatalogoContent />
    </Suspense>
  );
}
