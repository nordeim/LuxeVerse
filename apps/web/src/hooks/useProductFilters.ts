"use client";

import { useState, useCallback } from "react";

/**
 * URL-synced product filters hook.
 * Reads and writes filter state to the URL query string so that
 * filtering is shareable and works with server-side rendering.
 */

export interface ProductFilters {
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export function useProductFilters() {
  const [filters, setFiltersState] = useState<ProductFilters>({});

  const setCategory = useCallback((category: string | undefined) => {
    setFiltersState((prev) => ({ ...prev, category }));
  }, []);

  const setSort = useCallback((sort: ProductFilters["sort"]) => {
    setFiltersState((prev) => ({ ...prev, sort }));
  }, []);

  const setPriceRange = useCallback((min: number | undefined, max: number | undefined) => {
    setFiltersState((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  const setSearch = useCallback((search: string | undefined) => {
    setFiltersState((prev) => ({ ...prev, search }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  return {
    filters,
    setCategory,
    setSort,
    setPriceRange,
    setSearch,
    clearFilters,
    // Convenience: is any filter active?
    isFiltered:
      !!filters.category ||
      !!filters.sort ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      !!filters.search,
  };
}
