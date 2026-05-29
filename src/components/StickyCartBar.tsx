"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/store/toastStore";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";

interface StickyCartBarProps {
  product: Product;
  /** ID of the main actions element to watch — bar shows when it scrolls out of view */
  watchId: string;
}

export function StickyCartBar({ product, watchId }: StickyCartBarProps) {
  const { addItem } = useCartStore();
  const t = useTranslations("products");
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isOutOfStock = !product.inStock || product.stock === 0;

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [watchId]);

  function handleAdd() {
    if (isOutOfStock) return;
    addItem(product);
    toast.success(t("addedToCart"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (!visible) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-white border-t border-olive-border/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        {/* Ürün bilgisi */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <p className="text-sm font-semibold text-green-900 truncate">
            {t(`name_${product.nameKey}` as Parameters<typeof t>[0])}
          </p>
          <p className="text-xs text-text-secondary/60">{product.amount} · {product.brand}</p>
        </div>

        {/* Fiyat */}
        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-lg font-bold text-green-800">
            {product.price.toLocaleString("tr-TR")} ₺
          </span>
          {product.originalPrice && (
            <span className="text-xs text-text-secondary/50 line-through">
              {product.originalPrice.toLocaleString("tr-TR")} ₺
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Buton */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`shrink-0 font-semibold py-2.5 px-6 rounded-xl transition-all text-sm ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : added
              ? "bg-green-600 text-white scale-95"
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {isOutOfStock ? t("outOfStock") : added ? t("addedToCart") : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
