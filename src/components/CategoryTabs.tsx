"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { categories, type Category } from "@/data/products";

export function CategoryTabs() {
  const t = useTranslations("products");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = (searchParams.get("category") as Category) || "all";

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("need");
    router.push(`${pathname}?${params.toString()}`);
  }

  const tabs: { key: string; iconEmoji: string }[] = [
    { key: "all", iconEmoji: "🏪" },
    ...categories.filter((c) => c.key !== "brands"),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = tab.key === currentCategory;
        return (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              isActive
                ? "bg-green-700 text-white border-green-700 shadow-sm"
                : "bg-white text-text-secondary border-olive-border/40 hover:border-green-700/30 hover:text-green-800 hover:bg-green-50"
            }`}
          >
            <span>{tab.iconEmoji}</span>
            <span>{tab.key === "all" ? t("allProducts") : t(`cat_${tab.key}`)}</span>
          </button>
        );
      })}
      {/* Markalar → ayrı sayfaya yönlendir */}
      <Link
        href="/brands"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border bg-white text-text-secondary border-olive-border/40 hover:border-green-700/30 hover:text-green-800 hover:bg-green-50"
      >
        <span>🏷️</span>
        <span>{t("cat_brands")}</span>
      </Link>
    </div>
  );
}
