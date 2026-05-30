"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/store/toastStore";
import { useTranslations } from "next-intl";

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: Props) {
  const t = useTranslations("products");
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const inWishlist = has(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = !product.inStock || product.stock === 0;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-text-secondary hover:text-green-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full h-56 bg-green-50 shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={t(`name_${product.nameKey}`)}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">🌿</span>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 flex flex-col gap-3">
          <div>
            <p className="text-xs text-text-secondary/60 mb-0.5">{product.amount} · {product.brand}</p>
            <h2 className="text-lg font-bold text-green-900 leading-snug">
              {t(`name_${product.nameKey}`)}
            </h2>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-text-secondary/60">({product.reviewCount})</span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            {t(`desc_${product.descriptionKey}`)}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-800">
              {product.price.toLocaleString("tr-TR")} ₺
            </span>
            {product.originalPrice && (
              <span className="text-sm text-text-secondary/50 line-through">
                {product.originalPrice.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                if (isOutOfStock) return;
                addItem(product);
                toast.success(t("addedToCart"));
                onClose();
              }}
              disabled={isOutOfStock}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800 text-white"
              }`}
            >
              {isOutOfStock ? t("outOfStock") : t("addToCart")}
            </button>

            <button
              onClick={() => toggle(product.id)}
              className={`w-12 rounded-xl border transition-colors flex items-center justify-center ${
                inWishlist ? "border-red-300 bg-red-50 text-red-500" : "border-olive-border/40 text-text-secondary hover:border-red-300 hover:text-red-400"
              }`}
            >
              <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>

          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="text-center text-sm text-green-700 hover:text-green-900 hover:underline font-medium transition-colors"
          >
            {t("viewDetails")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
