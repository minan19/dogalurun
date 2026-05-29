"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { products } from "@/data/products";

const STORAGE_KEY = "hudaisifa_recently_viewed";
const MAX_ITEMS = 6;

interface Props {
  productId: string;
  locale: string;
  productNames?: Record<string, string>;
}

export function RecentlyViewedTracker({ productId, locale, productNames = {} }: Props) {
  const t = useTranslations("products");
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      // Mevcut ürünü listenin başına ekle, tekrarı kaldır, max 6
      const updated = [productId, ...stored.filter(id => id !== productId)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Mevcut ürün hariç göster
      setRecentIds(updated.filter(id => id !== productId).slice(0, 4));
    } catch {
      // localStorage erişim hatası
    }
  }, [productId]);

  if (recentIds.length === 0) return null;

  const recentProducts = recentIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as typeof products;

  if (recentProducts.length === 0) return null;

  return (
    <section className="mt-12 pt-10 border-t border-olive-border/20">
      <h2 className="text-xl font-bold text-green-900 mb-6">{t("recentlyViewed")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recentProducts.map(p => {
          const pDiscount = p.originalPrice
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;
          return (
            <Link
              key={p.id}
              href={`/${locale}/products/${p.slug}`}
              className="group bg-white rounded-2xl border border-olive-border/30 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="relative aspect-square bg-green-50 flex items-center justify-center">
                <span className="text-4xl opacity-20">🌿</span>
                {pDiscount > 0 && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    -{pDiscount}%
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[11px] text-text-secondary/70 mb-0.5">{p.amount} · {p.brand}</p>
                <p className="text-sm font-semibold text-green-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                  {productNames[p.id] ?? p.nameKey}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-green-800">{p.price.toLocaleString("tr-TR")} ₺</span>
                  {p.originalPrice && (
                    <span className="text-[11px] text-text-secondary/60 line-through">
                      {p.originalPrice.toLocaleString("tr-TR")} ₺
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
