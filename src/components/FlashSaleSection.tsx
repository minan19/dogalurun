"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";
import { useLocale } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/store/toastStore";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, { title: string; subtitle: string; add: string; added: string; viewAll: string; dir: string }> = {
  tr: { title: "Fırsat Ürünleri", subtitle: "Sınırlı süre indirim", add: "Sepete Ekle", added: "Eklendi!", viewAll: "Tümünü Gör", dir: "ltr" },
  en: { title: "Flash Deals", subtitle: "Limited time offers", add: "Add to Cart", added: "Added!", viewAll: "View All", dir: "ltr" },
  ar: { title: "عروض خاصة", subtitle: "عروض محدودة الوقت", add: "أضف للسلة", added: "تمت الإضافة!", viewAll: "عرض الكل", dir: "rtl" },
  ru: { title: "Акции", subtitle: "Ограниченные предложения", add: "В корзину", added: "Добавлено!", viewAll: "Смотреть все", dir: "ltr" },
};

const namesByLocale: Record<Locale, Record<string, string>> = {} as Record<Locale, Record<string, string>>;

export function FlashSaleSection() {
  const locale = (useLocale() as Locale) ?? "tr";
  const addItem = useCartStore((s) => s.addItem);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const saleProducts = products
    .filter((p) => p.originalPrice && p.originalPrice > p.price && p.inStock)
    .slice(0, 6);

  if (saleProducts.length === 0) return null;

  const { title, subtitle, add, added, viewAll, dir } = labels[locale] ?? labels.tr;

  function handleAdd(e: React.MouseEvent, product: (typeof products)[0]) {
    e.preventDefault();
    addItem(product);
    toast.success(added);
    setAddedIds((prev) => new Set([...prev, product.id]));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(product.id); return n; }), 1800);
  }

  return (
    <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50 border-y border-red-100/60" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-800">{title}</h2>
              <p className="text-xs text-red-500">{subtitle}</p>
            </div>
          </div>
          <Link href="/products" className="text-sm font-medium text-red-700 hover:text-red-900 transition-colors">
            {viewAll} →
          </Link>
        </div>

        {/* Ürünler */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {saleProducts.map((p) => {
            const discount = p.originalPrice
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;
            const hasImg = !imgErrors[p.id] && p.image?.startsWith("http");
            const isAdded = mounted && addedIds.has(p.id);

            return (
              <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-2xl border border-red-100 overflow-hidden hover:shadow-md hover:border-red-200 transition-all">
                <div className="relative aspect-square bg-red-50 overflow-hidden">
                  {hasImg ? (
                    <Image
                      src={p.image!}
                      alt={p.slug}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                      onError={() => setImgErrors((e) => ({ ...e, [p.id]: true }))}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-20">🌿</span>
                  )}
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] text-text-secondary/60 truncate">{p.brand}</p>
                  <p className="text-xs font-semibold text-green-900 line-clamp-2 leading-snug mt-0.5">{p.amount}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-red-700">{p.price.toLocaleString("tr-TR")} ₺</span>
                    <span className="text-[10px] text-text-secondary/50 line-through">{p.originalPrice!.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <button
                    onClick={(e) => handleAdd(e, p)}
                    className={`mt-2 w-full text-[10px] font-semibold py-1.5 rounded-lg transition-all ${
                      isAdded
                        ? "bg-green-600 text-white scale-95"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {isAdded ? added : add}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
