"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/store/toastStore";
import type { Product } from "@/data/products";

interface ProductDetailActionsProps {
  product: Product;
  addToCartLabel: string;
}

export function ProductDetailActions({ product, addToCartLabel }: ProductDetailActionsProps) {
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const inWishlist = mounted && has(product.id);

  function handleAdd() {
    addItem(product);
    toast.success("Sepete eklendi ✓");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="bg-white border border-olive-border/30 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div>
        <span className="text-2xl font-bold text-green-800">
          {product.price.toLocaleString("tr-TR")} ₺
        </span>
        {product.originalPrice && (
          <span className="ml-2 text-sm text-text-secondary/50 line-through">
            {product.originalPrice.toLocaleString("tr-TR")} ₺
          </span>
        )}
        <p className="text-xs text-text-secondary/60 mt-0.5">KDV dahil</p>
      </div>
      <div className="flex items-center gap-2">
        {/* Wishlist kalp */}
        <button
          onClick={() => toggle(product.id)}
          aria-label="İstek listesine ekle"
          className={`p-2.5 rounded-xl border transition-all ${
            inWishlist
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-olive-border/40 bg-cream-50 text-text-secondary/50 hover:text-red-400 hover:border-red-200"
          }`}
        >
          <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
        {/* Sepete ekle */}
        <button
          onClick={handleAdd}
          className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all text-sm ${
            added
              ? "bg-green-600 text-white scale-95"
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {added ? "✓ Eklendi" : addToCartLabel}
        </button>
      </div>
    </div>
  );
}
