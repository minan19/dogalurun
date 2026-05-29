import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

// Valid coupon codes: code → discount percentage
const COUPONS: Record<string, number> = {
  HOSGELDIN: 10,
  SIFA15: 15,
  SIFA20: 20,
};

export function validateCoupon(code: string): number | null {
  return COUPONS[code.toUpperCase()] ?? null;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: number;
  couponCode: string | null;
  couponDiscount: number; // percentage 0-100
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: () => number;
  discountAmount: () => number;
  finalTotal: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAdded: 0,
      couponCode: null,
      couponDiscount: 0,

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              lastAdded: Date.now(),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }], lastAdded: Date.now() };
        });
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: qty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code) => {
        const discount = validateCoupon(code);
        if (discount !== null) {
          set({ couponCode: code.toUpperCase(), couponDiscount: discount });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      discountAmount: () => {
        const { couponDiscount } = get();
        if (!couponDiscount) return 0;
        return Math.round(get().total() * couponDiscount / 100);
      },

      finalTotal: () => get().total() - get().discountAmount(),

      count: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "hudai-cart" }
  )
);
