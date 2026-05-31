"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/store/toastStore";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";

interface ProductDetailActionsProps {
  product: Product;
  addToCartLabel: string;
}

export function ProductDetailActions({ product, addToCartLabel }: ProductDetailActionsProps) {
  const { addItem, openCart } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const t = useTranslations("products");
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  useEffect(() => { setMounted(true); }, []);

  const inWishlist = mounted && has(product.id);
  const isOutOfStock = !product.inStock || product.stock === 0;
  const isLowStock = product.inStock && product.stock > 0 && product.stock <= 10;

  function handleAdd() {
    if (isOutOfStock) return;
    addItem(product, qty);
    toast.success(t("addedToCart"));
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1800);
  }

  const maxQty = Math.min(product.stock, 10);

  return (
    <div className="bg-white border border-olive-border/30 rounded-2xl p-5 flex flex-col gap-4">
      {/* Fiyat */}
      <div>
        <span className="text-2xl font-bold text-green-800">
          {product.price.toLocaleString("tr-TR")} ₺
        </span>
        {product.originalPrice && (
          <span className="ml-2 text-sm text-text-secondary/50 line-through">
            {product.originalPrice.toLocaleString("tr-TR")} ₺
          </span>
        )}
        <p className="text-xs text-text-secondary/60 mt-0.5">{t("vatIncluded")}</p>
      </div>

      {/* Miktar seçici + Sepet + Favori */}
      <div className="flex items-center gap-2">
        {/* Miktar - / n / + */}
        {!isOutOfStock && (
          <div className="flex items-center border border-olive-border/40 rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="px-3 py-3 text-green-800 hover:bg-green-50 disabled:opacity-30 transition-colors"
              aria-label="-"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-green-900 w-7 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              disabled={qty >= maxQty}
              className="px-3 py-3 text-green-800 hover:bg-green-50 disabled:opacity-30 transition-colors"
              aria-label="+"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        )}

        {/* Sepete ekle */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`flex-1 font-semibold py-3 px-5 rounded-xl transition-all text-sm ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : added
              ? "bg-green-600 text-white scale-95"
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {isOutOfStock ? t("outOfStock") : added ? t("addedToCart") : addToCartLabel}
        </button>

        {/* Wishlist kalp */}
        <button
          onClick={() => toggle(product.id)}
          aria-label={t("wishlistAriaLabel")}
          className={`p-2.5 rounded-xl border transition-all shrink-0 ${
            inWishlist
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-olive-border/40 bg-cream-50 text-text-secondary/50 hover:text-red-400 hover:border-red-200"
          }`}
        >
          <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>

      {isLowStock && (
        <p className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          ⚠ {t("lowStock", { count: product.stock })}
        </p>
      )}

      {/* WhatsApp ile sipariş */}
      {!isOutOfStock && (
        <a
          href={`https://wa.me/905001234567?text=${encodeURIComponent(t("whatsappOrderMessage", { name: t(`name_${product.nameKey}` as Parameters<typeof t>[0]), price: product.price.toLocaleString("tr-TR") }))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[#25D366]/40 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#16a34a] font-medium text-sm transition-all"
        >
          <svg className="w-4 h-4 shrink-0 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.532 5.856L0 24l6.335-1.611A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.641-.519-5.145-1.42l-.368-.219-3.766.958.999-3.668-.24-.38A9.946 9.946 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
          </svg>
          {t("whatsappOrder")}
        </a>
      )}
    </div>
  );
}
