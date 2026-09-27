import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
  id: string;
  label: string;
  city: string;
  street: string;
}

interface AddressState {
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, { ...address, id: `addr-${Date.now()}` }] })),
      removeAddress: (id) => set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
    }),
    { name: "rcc-addresses" },
  ),
);
