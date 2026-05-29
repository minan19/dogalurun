"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { useTranslations } from "next-intl";
import { useState } from "react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export function FeaturedProducts() {
  const addItem = useCartStore((s) => s.addItem);
  const allProducts = useProductStore((s) => s.products);
  const featured = allProducts.filter((p) => p.badge === "bestseller" || p.badge === "expert").slice(0, 4);
  const [added, setAdded] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const tf = useTranslations("featured");
  const tp = useTranslations("products");

  function handleAdd(p: (typeof featured)[0]) {
    addItem(p);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1800);
  }

  return (
    <section className="py-16 sm:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="flex items-end justify-between mb-10">
          <div className="animate-fade-in-up">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">{tf("label")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800">{tf("heading")}</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900 transition-colors">
            {tf("viewAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Ürün grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((p, i) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl border border-olive-border/30 overflow-hidden hover:shadow-md hover:shadow-green-700/10 hover:-translate-y-0.5 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Görsel alanı */}
              <Link href={`/products/${p.slug}`}>
                <div className="relative aspect-square bg-cream-100 overflow-hidden">
                  {p.image && !imgErrors[p.id] ? (
                    <Image
                      src={p.image}
                      alt={p.brand}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                      onError={() => setImgErrors((prev) => ({ ...prev, [p.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-30">
                        {p.category === "supplements" ? "💊" :
                         p.category === "organic-food" ? "🌿" : "🧴"}
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  {p.badge && (
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.badge === "bestseller" ? "bg-amber-100 text-amber-700" :
                      p.badge === "expert"     ? "bg-green-100 text-green-700" :
                                                 "bg-blue-100 text-blue-700"
                    }`}>
                      {p.badge === "bestseller" ? `🔥 ${tf("bestseller")}` :
                       p.badge === "expert"     ? `⭐ ${tf("expertChoice")}` :
                                                  `🆕 ${tf("badgeNew")}`}
                    </span>
                  )}

                  {/* İndirim rozeti */}
                  {p.originalPrice && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                      -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </Link>

              {/* İçerik */}
              <div className="p-3.5">
                <p className="text-[11px] text-green-600 font-semibold mb-1 truncate">{p.brand}</p>
                <Link href={`/products/${p.slug}`}>
                  <h3 className="text-xs font-bold text-green-800 leading-tight mb-1.5 group-hover:text-green-700 transition-colors line-clamp-2">
                    {tp(`name_${p.nameKey}` as Parameters<typeof tp>[0])}
                  </h3>
                </Link>

                <div className="flex items-center gap-1.5 mb-3">
                  <StarRating rating={p.rating} />
                  <span className="text-[10px] text-text-secondary">({p.reviewCount})</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-base font-bold text-green-800">{p.price} ₺</p>
                    {p.originalPrice && (
                      <p className="text-[11px] text-text-secondary line-through">{p.originalPrice} ₺</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(p)}
                    disabled={added === p.id}
                    className={`text-[11px] font-semibold px-3 py-2 rounded-xl transition-all shrink-0 ${
                      added === p.id
                        ? "bg-green-100 text-green-700"
                        : "bg-green-700 hover:bg-green-800 text-white"
                    }`}
                  >
                    {added === p.id ? tf("added") : tf("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobil "Tümünü Gör" */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 border border-green-700/30 px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors">
            {tf("viewAllMobile")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
