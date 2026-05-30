"use client";

import { useState, useEffect } from "react";
import { useCompareStore } from "@/store/compareStore";
import { products } from "@/data/products";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, {
  title: string;
  compare: string;
  clear: string;
  addMore: string;
}> = {
  tr: { title: "Karşılaştırma", compare: "Karşılaştır", clear: "Temizle", addMore: "+ ürün ekle" },
  en: { title: "Compare", compare: "Compare Now", clear: "Clear", addMore: "+ add product" },
  ar: { title: "المقارنة", compare: "قارن الآن", clear: "مسح", addMore: "+ إضافة منتج" },
  ru: { title: "Сравнение", compare: "Сравнить", clear: "Очистить", addMore: "+ товар" },
};

export function CompareBar() {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const { ids, remove, clear } = useCompareStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || ids.length === 0) return null;

  const selectedProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as (typeof products)[0][];

  return (
    <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-olive-border/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        {/* Title */}
        <div className="flex items-center gap-2 shrink-0">
          <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          <span className="text-sm font-semibold text-green-800">{l.title}</span>
        </div>

        {/* Selected products */}
        <div className="flex items-center gap-3 flex-1">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 border border-green-100"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white">
                {p.image ? (
                  <Image src={p.image} alt={p.brand} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">🌿</div>
                )}
              </div>
              <span className="text-xs font-medium text-green-900 max-w-[100px] line-clamp-1">
                {p.brand}
              </span>
              <button
                onClick={() => remove(p.id)}
                aria-label="Kaldır"
                className="ml-1 text-text-secondary/40 hover:text-red-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - selectedProducts.length }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-28 h-12 border-2 border-dashed border-olive-border/30 rounded-xl"
            >
              <span className="text-[10px] text-text-secondary/40">{l.addMore}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-text-secondary/60 hover:text-red-500 transition-colors"
          >
            {l.clear}
          </button>
          <Link
            href="/compare"
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              ids.length >= 2
                ? "bg-green-700 hover:bg-green-800 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
            }`}
          >
            {l.compare} ({ids.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
