import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentQueries: string[];
  addQuery: (query: string) => void;
  clearRecent: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentQueries: [],
      addQuery: (query) =>
        set((state) => ({
          recentQueries: [query, ...state.recentQueries.filter((q) => q !== query)].slice(0, 8),
        })),
      clearRecent: () => set({ recentQueries: [] }),
    }),
    { name: "rcc-search" },
  ),
);

export const POPULAR_QUERIES = ["Шорты", "Худи", "Рашгард", "Архангел Михаил", "Тайтсы"];
