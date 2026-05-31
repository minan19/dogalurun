"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Product } from "@/data/products";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, {
  heading: string;
  total: string;
  addAll: string;
  added: string;
  selected: string;
}> = {
  tr: { heading: "Sık Birlikte Alınan Ürünler", total: "Toplam", addAll: "Tümünü Sepete Ekle", added: "Sepete Eklendi ✓", selected: "seçili ürün" },
  en: { heading: "Frequently Bought Together", total: "Total", addAll: "Add All to Cart", added: "Added to Cart ✓", selected: "selected items" },
  ar: { heading: "يُشترى معاً بشكل متكرر", total: "المجموع", addAll: "أضف الكل للسلة", added: "أُضيف للسلة ✓", selected: "منتجات محددة" },
  ru: { heading: "Часто покупают вместе", total: "Итого", addAll: "Добавить всё в корзину", added: "Добавлено в корзину ✓", selected: "выбранных товаров" },
};

interface Props {
  mainProduct: Product;
  bundleProducts: Product[];
  productNames: Record<string, string>;
}

export function FrequentlyBoughtTogether({ mainProduct, bundleProducts, productNames }: Props) {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const { addItem, openCart } = useCartStore();
  const { show } = useToastStore();

  const allItems = [mainProduct, ...bundleProducts].slice(0, 3);
  const [selected, setSelected] = useState<Set<string>>(new Set(allItems.map(p => p.id)));
  const [addedAll, setAddedAll] = useState(false);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const selectedItems = allItems.filter(p => selected.has(p.id));
  const totalPrice = selectedItems.reduce((sum, p) => sum + p.price, 0);
  const originalTotal = selectedItems.reduce((sum, p) => sum + (p.originalPrice ?? p.price), 0);
  const bundleSaving = originalTotal - totalPrice;

  function handleAddAll() {
    selectedItems.forEach(p => addItem(p, 1));
    show(l.added, "success");
    setAddedAll(true);
    openCart();
    setTimeout(() => setAddedAll(false), 3000);
  }

  if (bundleProducts.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-olive-border/30 bg-cream-50 p-5">
      <h3 className="text-sm font-bold text-green-900 mb-4">{l.heading}</h3>

      {/* Products row */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {allItems.map((product, idx) => (
          <div key={product.id} className="flex items-center gap-2">
            {idx > 0 && (
              <span className="text-green-600 font-bold text-lg leading-none shrink-0">+</span>
            )}
            <label className="flex flex-col items-center cursor-pointer group">
              <div className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                selected.has(product.id)
                  ? "border-green-600"
                  : "border-olive-border/30 opacity-50"
              }`}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={productNames[product.id] ?? product.brand}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-green-50 flex items-center justify-center">
                    <span className="text-xl opacity-20">🌿</span>
                  </div>
                )}
                {/* Checkmark overlay */}
                {selected.has(product.id) && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                )}
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-700/80 text-white text-[9px] font-bold text-center py-0.5">
                    Bu ürün
                  </div>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={selected.has(product.id)}
                onChange={() => toggle(product.id)}
                disabled={product.id === mainProduct.id}
              />
              <span className="text-[10px] text-text-secondary mt-1 text-center max-w-16 line-clamp-1">
                {product.amount}
              </span>
              <span className="text-[11px] font-semibold text-green-800">
                {product.price.toLocaleString("tr-TR")} ₺
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Summary + CTA */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-text-secondary">
            {selected.size} {l.selected}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-bold text-green-800">
              {l.total}: {totalPrice.toLocaleString("tr-TR")} ₺
            </span>
            {bundleSaving > 0 && (
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                -{bundleSaving.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddAll}
          disabled={addedAll}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            addedAll
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {addedAll ? l.added : l.addAll}
        </button>
      </div>
    </div>
  );
}
