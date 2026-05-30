"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/config";

const STORAGE_KEY = "hudaisifa_recently_viewed";

const labels: Record<string, { title: string; dir: string }> = {
  tr: { title: "Son Görüntüledikleriniz", dir: "ltr" },
  en: { title: "Recently Viewed", dir: "ltr" },
  ar: { title: "شاهدته مؤخرًا", dir: "rtl" },
  ru: { title: "Недавно просмотренные", dir: "ltr" },
};

export function RecentlyViewedSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("products");
  const [ids, setIds] = useState<string[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setIds(stored.slice(0, 6));
    } catch {
      // localStorage unavailable
    }
  }, []);

  const recentProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (recentProducts.length === 0) return null;

  const { title, dir } = labels[locale] ?? labels.tr;

  return (
    <section className="py-12 bg-white border-t border-olive-border/20" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-green-900 mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {recentProducts.map((p) => {
            const nameKey = `name_${p.nameKey}` as Parameters<typeof t>[0];
            const discount = p.originalPrice
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;
            const hasImg = !imgErrors[p.id] && p.image?.startsWith("http");

            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group flex-none w-36 sm:w-44 snap-start"
              >
                <div className="relative aspect-square rounded-xl bg-green-50 overflow-hidden border border-olive-border/20 group-hover:border-green-700/30 group-hover:shadow-md transition-all">
                  {hasImg ? (
                    <Image
                      src={p.image!}
                      alt={t(nameKey)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                      onError={() => setImgErrors((e) => ({ ...e, [p.id]: true }))}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">🌿</span>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="mt-2 px-0.5">
                  <p className="text-[11px] text-text-secondary/60 truncate">{p.brand}</p>
                  <p className="text-sm font-medium text-green-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                    {t(nameKey)}
                  </p>
                  <p className="text-sm font-bold text-green-800 mt-1">
                    {p.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
