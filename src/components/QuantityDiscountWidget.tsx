"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/store/toastStore";
import type { Product } from "@/data/products";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, {
  title: string;
  unit: string;
  save: string;
  total: string;
  add: string;
  added: string;
  bestValue: string;
  dir: string;
}> = {
  tr: {
    title: "Çok Al, Çok Kazan",
    unit: "adet",
    save: "tasarruf",
    total: "Toplam",
    add: "Sepete Ekle",
    added: "Eklendi ✓",
    bestValue: "En Avantajlı",
    dir: "ltr",
  },
  en: {
    title: "Buy More, Save More",
    unit: "pcs",
    save: "save",
    total: "Total",
    add: "Add to Cart",
    added: "Added ✓",
    bestValue: "Best Value",
    dir: "ltr",
  },
  ar: {
    title: "اشترِ أكثر، وفّر أكثر",
    unit: "قطعة",
    save: "وفّر",
    total: "المجموع",
    add: "أضف إلى السلة",
    added: "تمت الإضافة ✓",
    bestValue: "الأفضل قيمة",
    dir: "rtl",
  },
  ru: {
    title: "Больше покупаешь — больше экономишь",
    unit: "шт.",
    save: "экономия",
    total: "Итого",
    add: "В корзину",
    added: "Добавлено ✓",
    bestValue: "Лучшая цена",
    dir: "ltr",
  },
};

const TIERS = [
  { qty: 1, pct: 0 },
  { qty: 2, pct: 10 },
  { qty: 3, pct: 20 },
];

interface Props {
  product: Product;
}

export function QuantityDiscountWidget({ product }: Props) {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const { addItem, openCart } = useCartStore();
  const [selected, setSelected] = useState(1);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (!product.inStock || product.stock === 0) return null;

  const maxQty = Math.min(product.stock, 10);
  if (maxQty < 2) return null;

  function discountedPrice(pct: number) {
    return product.price * (1 - pct / 100);
  }

  function handleAdd() {
    const tier = TIERS.find((t) => t.qty === selected)!;
    const effectivePrice = discountedPrice(tier.pct);
    for (let i = 0; i < tier.qty; i++) {
      addItem({ ...product, price: Math.round(effectivePrice) }, 1);
    }
    toast.success(l.added.replace(" ✓", ""));
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="border border-olive-border/30 rounded-2xl overflow-hidden" dir={l.dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-olive-border/20 flex items-center gap-2">
        <span className="text-base">🏷️</span>
        <span className="text-sm font-bold text-amber-800">{l.title}</span>
      </div>

      {/* Tier seçenekleri */}
      <div className="divide-y divide-olive-border/15">
        {TIERS.filter((t) => t.qty <= maxQty).map((tier) => {
          const unit = discountedPrice(tier.pct);
          const total = unit * tier.qty;
          const savings = (product.price - unit) * tier.qty;
          const isSelected = selected === tier.qty;
          const isBest = tier.pct === Math.max(...TIERS.map((t) => t.pct));

          return (
            <button
              key={tier.qty}
              onClick={() => setSelected(tier.qty)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                isSelected ? "bg-green-50" : "bg-white hover:bg-cream-50"
              }`}
            >
              {/* Radyo */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? "border-green-600" : "border-gray-300"
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-green-600" />}
              </div>

              {/* Adet */}
              <div className={`text-sm font-bold w-12 shrink-0 ${isSelected ? "text-green-800" : "text-text-secondary"}`}>
                {tier.qty} {l.unit}
              </div>

              {/* Birim fiyat */}
              <div className="flex-1">
                <span className={`text-sm ${isSelected ? "text-green-900 font-semibold" : "text-text-secondary"}`}>
                  {Math.round(unit).toLocaleString("tr-TR")} ₺ / {l.unit}
                </span>
                {tier.pct > 0 && (
                  <span className="ml-1.5 text-xs text-red-500 line-through">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </span>
                )}
              </div>

              {/* Sağ: toplam + badge */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-sm font-bold ${isSelected ? "text-green-700" : "text-text-secondary/70"}`}>
                  {Math.round(total).toLocaleString("tr-TR")} ₺
                </span>
                {tier.pct > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isBest
                      ? "bg-amber-400 text-amber-900"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {isBest ? l.bestValue : `-%${tier.pct}`}
                  </span>
                )}
                {tier.pct > 0 && (
                  <span className="text-[10px] text-green-600 font-medium">
                    {Math.round(savings).toLocaleString("tr-TR")} ₺ {l.save}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sepete Ekle */}
      <div className="px-4 py-3 bg-white border-t border-olive-border/15">
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
            added
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {added ? l.added : `${selected} ${l.unit} ${l.add}`}
        </button>
      </div>
    </div>
  );
}
