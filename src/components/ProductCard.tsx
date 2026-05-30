"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "@/store/toastStore";
import { useState, useEffect } from "react";
import { ProductQuickView } from "@/components/ProductQuickView";

function categoryGradient(cat?: string) {
  const map: Record<string, string> = {
    vitamin:     "bg-gradient-to-br from-amber-50 to-yellow-100",
    mineral:     "bg-gradient-to-br from-sky-50 to-blue-100",
    herbal:      "bg-gradient-to-br from-green-50 to-emerald-100",
    omega:       "bg-gradient-to-br from-blue-50 to-cyan-100",
    probiotic:   "bg-gradient-to-br from-purple-50 to-violet-100",
    protein:     "bg-gradient-to-br from-orange-50 to-red-100",
    antioxidant: "bg-gradient-to-br from-rose-50 to-pink-100",
    collagen:    "bg-gradient-to-br from-pink-50 to-fuchsia-100",
  };
  return map[cat ?? ""] ?? "bg-gradient-to-br from-green-50 to-teal-100";
}

function categoryEmoji(cat?: string) {
  const map: Record<string, string> = {
    vitamin:     "💊",
    mineral:     "💎",
    herbal:      "🌿",
    omega:       "🐟",
    probiotic:   "🦠",
    protein:     "💪",
    antioxidant: "🍇",
    collagen:    "✨",
  };
  return map[cat ?? ""] ?? "🌱";
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const inWishlist = mounted && has(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const hasRealImage = !imgError && product.image && product.image.startsWith("http");

  const badgeConfig = {
    expert: { label: t("badgeExpert"), cls: "bg-green-700 text-white" },
    bestseller: { label: t("badgeBestseller"), cls: "bg-gold-400 text-white" },
    new: { label: t("badgeNew"), cls: "bg-green-600 text-white" },
  };

  const stockBadge = (() => {
    if (product.stock === 0) return { label: t("outOfStock"), cls: "bg-red-500 text-white" };
    if (product.stock <= 5) return { label: t("lowStock", { count: product.stock }), cls: "bg-orange-500 text-white" };
    if (product.stock <= 10) return { label: t("stockLimited"), cls: "bg-yellow-500 text-white" };
    return null;
  })();

  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-olive-border/30 overflow-hidden hover:border-green-700/30 hover:shadow-lg hover:shadow-green-700/8 transition-all hover:-translate-y-0.5"
    >
      {/* Görsel alanı */}
      <div className="relative aspect-square overflow-hidden">
        {hasRealImage ? (
          <Image
            src={product.image}
            alt={product.brand}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          /* Kategori bazlı gradient placeholder */
          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${categoryGradient(product.category)}`}>
            <span className="text-5xl">{categoryEmoji(product.category)}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-green-800/40">{product.brand}</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeConfig[product.badge].cls}`}
          >
            {badgeConfig[product.badge].label}
          </span>
        )}

        {/* İndirim oranı */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-[11px] font-bold bg-red-500 text-white px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Stok durumu badge */}
        {stockBadge && (
          <span
            className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full ${stockBadge.cls}`}
          >
            {stockBadge.label}
          </span>
        )}

        {/* Kalp / Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          aria-label={t("wishlistAdd")}
          className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-all ${
            inWishlist ? "text-red-500 bg-white/90" : "text-text-secondary/30 bg-white/70 opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>

        {/* Quick View */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowQuickView(true); }}
          aria-label={t("quickView")}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-green-700 opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

      {/* Quick View Modal */}
      {mounted && showQuickView && (
        <ProductQuickView product={product} onClose={() => setShowQuickView(false)} />
      )}

      {/* Bilgi alanı */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Miktar */}
        <span className="text-xs text-text-secondary/60">{product.amount} · {product.brand}</span>

        {/* Ürün adı */}
        <h3 className="text-sm font-semibold text-green-900 leading-snug group-hover:text-green-700 transition-colors">
          {t(`name_${product.nameKey}`)}
        </h3>

        {/* Kısa açıklama */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {t(`desc_${product.descriptionKey}`)}
        </p>

        {/* Uzman notu */}
        {product.expertNoteKey && (
          <div className="mt-1 flex items-start gap-1.5 bg-green-50 rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5 text-green-700 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" />
            </svg>
            <span className="text-[11px] text-green-800 italic line-clamp-2">
              {t(`expert_${product.expertNoteKey}`)}
            </span>
          </div>
        )}

        {/* Puan */}
        <div className="flex items-center gap-1.5 mt-auto pt-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= Math.round(product.rating) ? "text-gold-400" : "text-text-secondary/20"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-text-secondary/60">({product.reviewCount})</span>
        </div>

        {/* Fiyat + Sepet */}
        <div className="flex items-center justify-between pt-2 border-t border-olive-border/20">
          <div className="flex flex-col">
            <span className="text-base font-bold text-green-800">
              {product.price.toLocaleString("tr-TR")} ₺
            </span>
            {product.originalPrice && (
              <span className="text-xs text-text-secondary/50 line-through">
                {product.originalPrice.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isOutOfStock) return;
              addItem(product);
              toast.success(t("addedToCart"));
            }}
            disabled={isOutOfStock}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {isOutOfStock ? t("outOfStock") : t("addToCart")}
          </button>
        </div>
      </div>
    </Link>
  );
}
