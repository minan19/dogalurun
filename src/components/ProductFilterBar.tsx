"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, {
  all: string;
  expert: string;
  bestseller: string;
  newBadge: string;
  inStock: string;
  discounted: string;
}> = {
  tr: {
    all: "Tümü",
    expert: "✓ Uzman Seçimi",
    bestseller: "🔥 Çok Satan",
    newBadge: "✨ Yeni",
    inStock: "Stokta Olanlar",
    discounted: "İndirimli",
  },
  en: {
    all: "All",
    expert: "✓ Expert Pick",
    bestseller: "🔥 Bestseller",
    newBadge: "✨ New",
    inStock: "In Stock Only",
    discounted: "On Sale",
  },
  ar: {
    all: "الكل",
    expert: "✓ اختيار الخبير",
    bestseller: "🔥 الأكثر مبيعًا",
    newBadge: "✨ جديد",
    inStock: "المتوفر فقط",
    discounted: "تخفيضات",
  },
  ru: {
    all: "Все",
    expert: "✓ Выбор эксперта",
    bestseller: "🔥 Хит продаж",
    newBadge: "✨ Новинка",
    inStock: "Только в наличии",
    discounted: "Со скидкой",
  },
};

interface Props {
  badge?: string;
  inStock?: string;
  discounted?: string;
}

export function ProductFilterBar({ badge, inStock, discounted }: Props) {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const badgePills = [
    { key: undefined, label: l.all },
    { key: "expert", label: l.expert },
    { key: "bestseller", label: l.bestseller },
    { key: "new", label: l.newBadge },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Badge pills */}
      {badgePills.map((p) => {
        const active = badge === p.key || (!badge && !p.key);
        return (
          <button
            key={p.key ?? "all"}
            onClick={() => navigate({ badge: p.key })}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              active
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-text-secondary border-olive-border/40 hover:border-green-700/40"
            }`}
          >
            {p.label}
          </button>
        );
      })}

      {/* Divider */}
      <span className="h-5 w-px bg-olive-border/30 mx-1" />

      {/* Stock toggle */}
      <button
        onClick={() => navigate({ inStock: inStock ? undefined : "1" })}
        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
          inStock
            ? "bg-green-700 text-white border-green-700"
            : "bg-white text-text-secondary border-olive-border/40 hover:border-green-700/40"
        }`}
      >
        {l.inStock}
      </button>

      {/* Discounted toggle */}
      <button
        onClick={() => navigate({ discounted: discounted ? undefined : "1" })}
        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
          discounted
            ? "bg-red-500 text-white border-red-500"
            : "bg-white text-text-secondary border-olive-border/40 hover:border-red-400/40"
        }`}
      >
        {l.discounted}
      </button>
    </div>
  );
}
