import { create } from "zustand";

export type SortOption = "popular" | "price" | "new";

export interface CatalogFilters {
  sizes: string[];
  colors: string[];
  collections: string[];
  seasons: string[];
  materials: string[];
  priceMin: number;
  priceMax: number;
}

export const PRICE_MIN = 2000;
export const PRICE_MAX = 16000;

const EMPTY_FILTERS: CatalogFilters = {
  sizes: [],
  colors: [],
  collections: [],
  seasons: [],
  materials: [],
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
};

interface FiltersState {
  activeCategory: string;
  sort: SortOption;
  filters: CatalogFilters;
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;
  toggleValue: (key: "sizes" | "colors" | "collections" | "seasons" | "materials", value: string) => void;
  setPriceRange: (min: number, max: number) => void;
  reset: () => void;
  activeCount: () => number;
}

export const useFiltersStore = create<FiltersState>()((set, get) => ({
  activeCategory: "all",
  sort: "popular",
  filters: EMPTY_FILTERS,
  setCategory: (category) => set({ activeCategory: category }),
  setSort: (sort) => set({ sort }),
  toggleValue: (key, value) =>
    set((state) => {
      const current = state.filters[key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { filters: { ...state.filters, [key]: next } };
    }),
  setPriceRange: (min, max) => set((state) => ({ filters: { ...state.filters, priceMin: min, priceMax: max } })),
  reset: () => set({ filters: EMPTY_FILTERS }),
  activeCount: () => {
    const f = get().filters;
    return (
      f.sizes.length +
      f.colors.length +
      f.collections.length +
      f.seasons.length +
      f.materials.length +
      (f.priceMin !== PRICE_MIN || f.priceMax !== PRICE_MAX ? 1 : 0)
    );
  },
}));
