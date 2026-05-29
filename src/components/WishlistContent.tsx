"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";

function categoryGradient(cat?: string) {
  const map: Record<string, string> = {
    vitamin:"bg-gradient-to-br from-amber-50 to-yellow-100",mineral:"bg-gradient-to-br from-sky-50 to-blue-100",
    herbal:"bg-gradient-to-br from-green-50 to-emerald-100",omega:"bg-gradient-to-br from-blue-50 to-cyan-100",
    probiotic:"bg-gradient-to-br from-purple-50 to-violet-100",protein:"bg-gradient-to-br from-orange-50 to-red-100",
    antioxidant:"bg-gradient-to-br from-rose-50 to-pink-100",collagen:"bg-gradient-to-br from-pink-50 to-fuchsia-100",
  };
  return map[cat ?? ""] ?? "bg-gradient-to-br from-green-50 to-teal-100";
}
function categoryEmoji(cat?: string) {
  const map: Record<string,string> = {vitamin:"💊",mineral:"💎",herbal:"🌿",omega:"🐟",probiotic:"🦠",protein:"💪",antioxidant:"🍇",collagen:"✨"};
  return map[cat ?? ""] ?? "🌱";
}

export function WishlistContent() {
  const { ids, toggle } = useWishlistStore();
  const { addItem } = useCartStore();
  const t = useTranslations("products");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <svg className="w-16 h-16 text-text-secondary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <p className="text-text-secondary text-lg font-medium">{t("wishlistEmpty")}</p>
        <p className="text-text-secondary/60 text-sm">{t("wishlistEmptyHint")}</p>
        <Link
          href="/products"
          className="mt-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          {t("wishlistBrowse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {wishlistProducts.map((product) => {
        const discount = product.originalPrice
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0;

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-olive-border/30 overflow-hidden hover:shadow-lg transition-all group"
          >
            <Link href={`/products/${product.slug}`} className={`block relative aspect-square ${categoryGradient(product.category)}`}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl">{categoryEmoji(product.category)}</span>
              </div>
              {discount > 0 && (
                <span className="absolute top-3 left-3 text-[11px] font-bold bg-red-500 text-white px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              <button
                onClick={(e) => { e.preventDefault(); toggle(product.id); }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-red-500 transition-colors hover:bg-red-50"
                aria-label={t("wishlistRemove")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </Link>

            <div className="p-4 flex flex-col gap-2">
              <span className="text-xs text-text-secondary/60">{product.amount} · {product.brand}</span>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-sm font-semibold text-green-900 leading-snug hover:text-green-700 transition-colors">
                  {t(`name_${product.nameKey}`)}
                </h3>
              </Link>
              <div className="flex items-center justify-between pt-2 border-t border-olive-border/20 mt-auto">
                <div>
                  <span className="text-base font-bold text-green-800">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </span>
                  {product.originalPrice && (
                    <span className="block text-xs text-text-secondary/50 line-through">
                      {product.originalPrice.toLocaleString("tr-TR")} ₺
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {t("addToCart")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
