import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TelegramProfile {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
}

interface UserState {
  telegramProfile: TelegramProfile | null;
  bonuses: number;
  statusName: string;
  statusThreshold: number;
  statusProgress: number;
  nextStatusName: string;
  setTelegramProfile: (profile: TelegramProfile | null) => void;
  spendBonuses: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      telegramProfile: null,
      bonuses: 1240,
      statusName: "Серебро",
      nextStatusName: "Золото",
      statusThreshold: 10000,
      statusProgress: 6240,
      setTelegramProfile: (profile) => set({ telegramProfile: profile }),
      spendBonuses: (amount) => set((state) => ({ bonuses: Math.max(0, state.bonuses - amount) })),
    }),
    { name: "rcc-user", partialize: (state) => ({ bonuses: state.bonuses, statusProgress: state.statusProgress }) },
  ),
);
