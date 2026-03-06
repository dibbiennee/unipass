"use client";

import { useEffect, useState } from "react";
import { Pill } from "@/components/ui";
import { UNIVERSITIES } from "@/lib/constants";
import { Category, ProductFilters } from "@/types";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

export function ProductFiltersBar({ filters, onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const sortOptions = [
    { value: "newest", label: "Più recenti" },
    { value: "price_asc", label: "Prezzo crescente" },
    { value: "price_desc", label: "Prezzo decrescente" },
    { value: "rating", label: "Più votati" },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        <Pill
          label="Tutti"
          selected={!filters.category}
          onClick={() => onFilterChange({ category: undefined })}
        />
        {categories.map((cat) => (
          <Pill
            key={cat.slug}
            label={cat.name}
            selected={filters.category === cat.slug}
            onClick={() =>
              onFilterChange({
                category: filters.category === cat.slug ? undefined : cat.slug,
              })
            }
          />
        ))}
      </div>

      {/* University and sort dropdowns */}
      <div className="flex gap-2">
        <select
          value={filters.university || ""}
          onChange={(e) =>
            onFilterChange({ university: e.target.value || undefined })
          }
          className="flex-1 rounded-brand border border-neutral-200 bg-neutral-100 px-3 py-2 text-body-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tutte le università</option>
          {UNIVERSITIES.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>

        <select
          value={filters.sort || "newest"}
          onChange={(e) =>
            onFilterChange({
              sort: e.target.value as ProductFilters["sort"],
            })
          }
          className="flex-1 rounded-brand border border-neutral-200 bg-neutral-100 px-3 py-2 text-body-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
