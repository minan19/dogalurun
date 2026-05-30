"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

const messages: Record<string, { text: string; dir: string }[]> = {
  tr: [
    { text: "🚚 500 ₺ üzeri siparişlerde ücretsiz kargo!", dir: "ltr" },
    { text: "🌿 Uzman onaylı doğal ürünler — güvenle alışveriş yapın", dir: "ltr" },
    { text: "💊 Günlük kullanım için doğal takviyeler", dir: "ltr" },
  ],
  en: [
    { text: "🚚 Free shipping on orders over 500 ₺!", dir: "ltr" },
    { text: "🌿 Expert-approved natural products — shop with confidence", dir: "ltr" },
    { text: "💊 Natural supplements for daily wellness", dir: "ltr" },
  ],
  ar: [
    { text: "🚚 شحن مجاني للطلبات التي تزيد عن 500 ₺!", dir: "rtl" },
    { text: "🌿 منتجات طبيعية معتمدة من خبراء — تسوق بثقة", dir: "rtl" },
    { text: "💊 مكملات طبيعية للصحة اليومية", dir: "rtl" },
  ],
  ru: [
    { text: "🚚 Бесплатная доставка при заказе от 500 ₺!", dir: "ltr" },
    { text: "🌿 Натуральные продукты с экспертным одобрением", dir: "ltr" },
    { text: "💊 Натуральные добавки для ежедневного здоровья", dir: "ltr" },
  ],
};

export function AnnouncementBar() {
  const locale = useLocale();
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);
  const list = messages[locale] ?? messages.tr;

  if (dismissed) return null;

  const { text, dir } = list[idx % list.length];

  return (
    <div className="bg-green-800 text-white text-xs py-2 px-4 relative" dir={dir}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <button
          onClick={() => setIdx((i) => (i - 1 + list.length) % list.length)}
          aria-label="Önceki"
          className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-medium text-center">{text}</span>
        <button
          onClick={() => setIdx((i) => (i + 1) % list.length)}
          aria-label="Sonraki"
          className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Kapat"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
