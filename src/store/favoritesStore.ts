import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  productIds: string[];
  brandIds: string[];
  toggleProduct: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      productIds: [],
      brandIds: [],
      toggleProduct: (id) =>
        set((state) => ({
          productIds: state.productIds.includes(id)
            ? state.productIds.filter((productId) => productId !== id)
            : [...state.productIds, id],
        })),
      isFavorite: (id) => get().productIds.includes(id),
    }),
    { name: "rcc-favorites" },
  ),
);
