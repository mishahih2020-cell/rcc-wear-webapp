import type { ProductColor } from "./types";

export const COLOR_LIBRARY: Record<string, ProductColor> = {
  black: { id: "black", name: "Черный", hex: "#111111" },
  gray: { id: "gray", name: "Серый", hex: "#9a9a9a" },
  white: { id: "white", name: "Белый", hex: "#ffffff" },
  milk: { id: "milk", name: "Молочный", hex: "#f3ead9" },
  olive: { id: "olive", name: "Оливковый", hex: "#5c5c3d" },
  red: { id: "red", name: "Красный", hex: "#f5222d" },
};

export const ALL_COLORS = Object.values(COLOR_LIBRARY);
