import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GarmentType = "tshirts" | "shorts" | "trousers" | "hoodies" | "outerwear";

export const GARMENT_LABELS: Record<GarmentType, string> = {
  tshirts: "Футболки",
  shorts: "Шорты",
  trousers: "Брюки",
  hoodies: "Худи",
  outerwear: "Верхняя одежда",
};

interface SizesState {
  savedSizes: Partial<Record<GarmentType, string>>;
  setSize: (garment: GarmentType, size: string) => void;
}

export const useSizesStore = create<SizesState>()(
  persist(
    (set) => ({
      savedSizes: {},
      setSize: (garment, size) =>
        set((state) => ({ savedSizes: { ...state.savedSizes, [garment]: size } })),
    }),
    { name: "rcc-sizes" },
  ),
);
