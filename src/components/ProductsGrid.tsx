"use client";

import { useProductStore } from "@/store/productStore";
import { ProductCard } from "@/components/ProductCard";
import type { Category, NeedTag } from "@/data/products";

interface ProductsGridProps {
  category?: string;
  need?: string;
  sort?: string;
  noProductsText?: string;
  productsCountLabel?: string;
}

export function ProductsGrid({
  category,
  need,
  sort,
  noProductsText = "Ürün bulunamadı.",
  productsCountLabel = "ürün",
}: ProductsGridProps) {
  const allProducts = useProductStore((s) => s.products);

  let filtered = [...allProducts];

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === (category as Category));
  }

  if (need) {
    filtered = filtered.filter((p) =>
      p.needs.includes(need as NeedTag)
    );
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl">🌿</span>
        <p className="mt-4 text-text-secondary">{noProductsText}</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-text-secondary mb-6">
        {filtered.length} {productsCountLabel}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
