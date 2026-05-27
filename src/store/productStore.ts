import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts, type Product } from "@/data/products";

interface ProductStore {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefault: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts,

      addProduct: (p) =>
        set((s) => ({ products: [p, ...s.products] })),

      updateProduct: (id, updates) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      resetToDefault: () => set({ products: initialProducts }),
    }),
    { name: "hudai-products" }
  )
);
