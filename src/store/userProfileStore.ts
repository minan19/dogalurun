import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
  id: string;
  label: string; // "Ev", "İş", "Diğer" vs.
  name: string;
  surname: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  invoiceType: "individual" | "corporate";
  companyName?: string;
  taxId?: string;
}

export interface SavedCard {
  number: string;
  name: string;
  expiry: string;
  // CVV is intentionally NOT saved for security
}

interface UserProfileStore {
  isLoggedIn: boolean;
  email: string;
  displayName: string;
  phone: string;
  savedAddresses: SavedAddress[];
  defaultAddressId: string | null;
  savedCard: SavedCard | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (data: { displayName?: string; email?: string; phone?: string }) => void;
  addAddress: (addr: Omit<SavedAddress, "id">) => string;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateAddress: (id: string, addr: Partial<Omit<SavedAddress, "id">>) => void;
  saveCard: (card: SavedCard) => void;
  clearCard: () => void;
  // legacy compat — maps to addAddress / update defaultAddress
  saveAddress: (addr: Omit<SavedAddress, "id" | "label"> & { label?: string }) => void;
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      email: "",
      displayName: "",
      phone: "",
      savedAddresses: [],
      defaultAddressId: null,
      savedCard: null,

      login: (email, displayName) =>
        set({ isLoggedIn: true, email, displayName }),

      updateProfile: ({ displayName, email, phone }) =>
        set((s) => ({
          displayName: displayName !== undefined ? displayName : s.displayName,
          email: email !== undefined ? email : s.email,
          phone: phone !== undefined ? phone : s.phone,
        })),

      logout: () =>
        set({
          isLoggedIn: false,
          email: "",
          displayName: "",
          phone: "",
          savedAddresses: [],
          defaultAddressId: null,
          savedCard: null,
        }),

      addAddress: (addr) => {
        const id = Date.now().toString();
        set((s) => ({
          savedAddresses: [...s.savedAddresses, { ...addr, id }],
          defaultAddressId: s.defaultAddressId ?? id,
        }));
        return id;
      },

      removeAddress: (id) =>
        set((s) => {
          const next = s.savedAddresses.filter((a) => a.id !== id);
          return {
            savedAddresses: next,
            defaultAddressId:
              s.defaultAddressId === id ? (next[0]?.id ?? null) : s.defaultAddressId,
          };
        }),

      setDefaultAddress: (id) => set({ defaultAddressId: id }),

      updateAddress: (id, partial) =>
        set((s) => ({
          savedAddresses: s.savedAddresses.map((a) =>
            a.id === id ? { ...a, ...partial } : a
          ),
        })),

      // Legacy compat: called from CheckoutForm after completing an order.
      // Upserts by matching city+address to avoid duplicates.
      saveAddress: (addr) => {
        const { savedAddresses, defaultAddressId } = get();
        const label = addr.label ?? addr.city ?? "Adresim";
        const existing = savedAddresses.find(
          (a) => a.city === addr.city && a.address === addr.address
        );
        if (existing) {
          // update it
          set((s) => ({
            savedAddresses: s.savedAddresses.map((a) =>
              a.id === existing.id ? { ...a, ...addr, label } : a
            ),
          }));
        } else {
          const id = Date.now().toString();
          set((s) => ({
            savedAddresses: [...s.savedAddresses, { ...addr, id, label }],
            defaultAddressId: defaultAddressId ?? id,
          }));
        }
      },

      saveCard: (savedCard) => set({ savedCard }),
      clearCard: () => set({ savedCard: null }),
    }),
    {
      name: "hudai-user-profile",
      version: 1,
      partialize: (state: UserProfileStore) => {
        const { saveCard, clearCard, savedCard, ...rest } = state;
        void saveCard; void clearCard; void savedCard;
        return rest;
      },
      // v0 → v1: migrate single savedAddress → savedAddresses array
      migrate: (raw: unknown) => {
        const s = raw as Record<string, unknown>;
        if (
          s.savedAddress &&
          (!Array.isArray(s.savedAddresses) || (s.savedAddresses as unknown[]).length === 0)
        ) {
          const old = s.savedAddress as Omit<SavedAddress, "id" | "label">;
          const id = Date.now().toString();
          s.savedAddresses = [{ ...old, id, label: (old.city as string) || "Adresim" }];
          s.defaultAddressId = id;
          delete s.savedAddress;
        }
        return s;
      },
    }
  )
);

// Helper: get the current default address
export function getDefaultAddress(store: Pick<UserProfileStore, "savedAddresses" | "defaultAddressId">): SavedAddress | null {
  if (!store.savedAddresses.length) return null;
  return store.savedAddresses.find((a) => a.id === store.defaultAddressId) ?? store.savedAddresses[0];
}
