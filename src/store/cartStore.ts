import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  sizeId: string;
  colorId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, sizeId: string, colorId: string) => void;
  increaseQuantity: (productId: string, sizeId: string, colorId: string) => void;
  decreaseQuantity: (productId: string, sizeId: string, colorId: string) => void;
  clear: () => void;
}

function sameLine(a: CartItem, productId: string, sizeId: string, colorId: string) {
  return a.productId === productId && a.sizeId === sizeId && a.colorId === colorId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((line) => sameLine(line, item.productId, item.sizeId, item.colorId));
          if (existing) {
            return {
              items: state.items.map((line) =>
                sameLine(line, item.productId, item.sizeId, item.colorId)
                  ? { ...line, quantity: line.quantity + 1 }
                  : line,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (productId, sizeId, colorId) =>
        set((state) => ({
          items: state.items.filter((line) => !sameLine(line, productId, sizeId, colorId)),
        })),
      increaseQuantity: (productId, sizeId, colorId) =>
        set((state) => ({
          items: state.items.map((line) =>
            sameLine(line, productId, sizeId, colorId) && line.quantity < 10
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        })),
      decreaseQuantity: (productId, sizeId, colorId) =>
        set((state) => ({
          items: state.items
            .map((line) =>
              sameLine(line, productId, sizeId, colorId) ? { ...line, quantity: line.quantity - 1 } : line,
            )
            .filter((line) => line.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "rcc-cart" },
  ),
);
