"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const ui: Record<LocaleKey, { viewing: (n: number) => string; dir: string }> = {
  tr: { dir: "ltr", viewing: (n) => `${n} kişi şu an bu ürünü inceliyor` },
  en: { dir: "ltr", viewing: (n) => `${n} people are viewing this right now` },
  ar: { dir: "rtl", viewing: (n) => `${n} أشخاص يشاهدون هذا المنتج الآن` },
  ru: { dir: "ltr", viewing: (n) => `${n} человек сейчас смотрят этот товар` },
};

interface Props {
  productId: string;
}

export function SocialProofBadge({ productId }: Props) {
  const params = useParams();
  const locale = (params?.locale as LocaleKey) ?? "tr";
  const t = ui[locale] ?? ui.tr;

  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Seed a consistent-ish number per product, then nudge it slightly
    const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const base = 6 + (seed % 17); // 6–22
    setCount(base);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === null) return base;
        const delta = Math.random() < 0.4 ? (Math.random() < 0.5 ? 1 : -1) : 0;
        return Math.max(3, Math.min(30, prev + delta));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [productId]);

  if (count === null) return null;

  return (
    <div dir={t.dir} className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/60 rounded-lg px-3 py-1.5">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      {t.viewing(count)}
    </div>
  );
}
