"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Range {
  label: string;
  min?: number;
  max?: number;
}

const RANGES: Range[] = [
  { label: "< 150 ₺", max: 150 },
  { label: "150–300 ₺", min: 150, max: 300 },
  { label: "300–500 ₺", min: 300, max: 500 },
  { label: "> 500 ₺", min: 500 },
];

interface PriceFilterProps {
  priceMin?: string;
  priceMax?: string;
  allLabel: string;
}

export function PriceFilter({ priceMin, priceMax, allLabel }: PriceFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(min?: number, max?: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (min !== undefined) params.set("priceMin", String(min));
    else params.delete("priceMin");
    if (max !== undefined) params.set("priceMax", String(max));
    else params.delete("priceMax");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeMin = priceMin ? Number(priceMin) : undefined;
  const activeMax = priceMax ? Number(priceMax) : undefined;

  const isAll = activeMin === undefined && activeMax === undefined;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => navigate(undefined, undefined)}
        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
          isAll
            ? "bg-green-700 text-white border-green-700"
            : "bg-white text-text-secondary border-olive-border/40 hover:border-green-700/40"
        }`}
      >
        {allLabel}
      </button>
      {RANGES.map((r) => {
        const active = r.min === activeMin && r.max === activeMax;
        return (
          <button
            key={r.label}
            onClick={() => navigate(r.min, r.max)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              active
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-text-secondary border-olive-border/40 hover:border-green-700/40"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
