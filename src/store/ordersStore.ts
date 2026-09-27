import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cartStore";

export type OrderStatus = "Оформлен" | "Доставляется" | "Получен";

export interface Order {
  id: string;
  number: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  address: string;
  deliveryMethod: "СДЭК" | "Самовывоз";
  createdAt: string;
}

interface OrdersState {
  orders: Order[];
  lastOrderNumber: number;
  createOrder: (input: Omit<Order, "id" | "number" | "status" | "createdAt">) => Order;
}

const SEED_ORDERS: Order[] = [
  {
    id: "seed-2458",
    number: "RCC2458",
    items: [],
    total: 10480,
    status: "Оформлен",
    address: "СДЭК",
    deliveryMethod: "СДЭК",
    createdAt: "2026-09-22",
  },
  {
    id: "seed-2391",
    number: "RCC2391",
    items: [],
    total: 7500,
    status: "Доставляется",
    address: "СДЭК",
    deliveryMethod: "СДЭК",
    createdAt: "2026-09-10",
  },
  {
    id: "seed-2288",
    number: "RCC2288",
    items: [],
    total: 15000,
    status: "Получен",
    address: "RCC WEAR Екатеринбург, ул. Радищева, 25",
    deliveryMethod: "Самовывоз",
    createdAt: "2026-08-14",
  },
];

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,
      lastOrderNumber: 2458,
      createOrder: (input) => {
        const nextNumber = get().lastOrderNumber + 1;
        const order: Order = {
          ...input,
          id: `order-${nextNumber}`,
          number: `RCC${nextNumber}`,
          status: "Оформлен",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [order, ...state.orders], lastOrderNumber: nextNumber }));
        return order;
      },
    }),
    { name: "rcc-orders" },
  ),
);
