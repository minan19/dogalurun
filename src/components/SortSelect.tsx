"use client";

interface SortSelectProps {
  value: string;
  category?: string;
  need?: string;
  priceMin?: string;
  priceMax?: string;
  labels: {
    default: string;
    priceAsc: string;
    priceDesc: string;
    rating: string;
  };
}

export function SortSelect({ value, category, need, priceMin, priceMax, labels }: SortSelectProps) {
  return (
    <form method="get">
      {category && <input type="hidden" name="category" value={category} />}
      {need && <input type="hidden" name="need" value={need} />}
      {priceMin && <input type="hidden" name="priceMin" value={priceMin} />}
      {priceMax && <input type="hidden" name="priceMax" value={priceMax} />}
      <select
        name="sort"
        defaultValue={value}
        onChange={(e) => {
          const form = e.target.closest("form") as HTMLFormElement;
          form?.submit();
        }}
        className="text-sm border border-olive-border/40 rounded-lg px-3 py-2 bg-white text-text-primary focus:outline-none focus:border-green-700/50"
      >
        <option value="">{labels.default}</option>
        <option value="price-asc">{labels.priceAsc}</option>
        <option value="price-desc">{labels.priceDesc}</option>
        <option value="rating">{labels.rating}</option>
      </select>
    </form>
  );
}
