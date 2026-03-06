"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/types";

export function useSearch(debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!query.trim() || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.products);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, debounceMs]);

  return { query, setQuery, results, loading };
}
