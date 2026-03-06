"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductFilters, ProductListResponse, Product } from "@/types";

export function useProducts(initialData?: ProductListResponse) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<ProductListResponse>(
    initialData || { products: [], total: 0, page: 1, totalPages: 0 }
  );
  const [loading, setLoading] = useState(!initialData);

  const getFiltersFromParams = useCallback((): ProductFilters => {
    return {
      category: searchParams.get("category") || undefined,
      university: searchParams.get("university") || undefined,
      search: searchParams.get("search") || undefined,
      sort: (searchParams.get("sort") as ProductFilters["sort"]) || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: 12,
    };
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters = getFiltersFromParams();
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.university) params.set("university", filters.university);
      if (filters.search) params.set("search", filters.search);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [getFiltersFromParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const current = getFiltersFromParams();
      const merged = { ...current, ...newFilters, page: newFilters.page || 1 };
      const params = new URLSearchParams();
      if (merged.category) params.set("category", merged.category);
      if (merged.university) params.set("university", merged.university);
      if (merged.search) params.set("search", merged.search);
      if (merged.sort) params.set("sort", merged.sort);
      if (merged.page && merged.page > 1) params.set("page", String(merged.page));

      router.push(`/catalogo?${params.toString()}`, { scroll: false });
    },
    [getFiltersFromParams, router]
  );

  return {
    products: data.products,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    loading,
    filters: getFiltersFromParams(),
    updateFilters,
    refetch: fetchProducts,
  };
}
