"use client";

import { useState, useEffect } from "react";
import { useCompareStore } from "@/store/compareStore";
import { useTranslations, useLocale } from "next-intl";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/store/toastStore";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, {
  title: string;
  empty: string;
  emptyDesc: string;
  browse: string;
  remove: string;
  addToCart: string;
  outOfStock: string;
  price: string;
  brand: string;
  amount: string;
  rating: string;
  category: string;
  stock: string;
  description: string;
  viewDetails: string;
  inStock: string;
  stockOut: string;
  reviews: string;
  addMore: string;
  addedToCart: string;
}> = {
  tr: {
    title: "Ürün Karşılaştırma",
    empty: "Karşılaştırma listeniz boş",
    emptyDesc: "Ürün kartlarından 'Karşılaştır' butonuna tıklayarak ürünleri ekleyin.",
    browse: "Ürünlere Göz At",
    remove: "Kaldır",
    addToCart: "Sepete Ekle",
    outOfStock: "Tükendi",
    price: "Fiyat",
    brand: "Marka",
    amount: "Miktar",
    rating: "Puan",
    category: "Kategori",
    stock: "Stok Durumu",
    description: "Açıklama",
    viewDetails: "Detayları Gör",
    inStock: "Stokta var",
    stockOut: "Tükendi",
    reviews: "değerlendirme",
    addMore: "+ Ürün Ekle",
    addedToCart: "Sepete eklendi!",
  },
  en: {
    title: "Product Comparison",
    empty: "Your comparison list is empty",
    emptyDesc: "Click 'Compare' on product cards to add products.",
    browse: "Browse Products",
    remove: "Remove",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    price: "Price",
    brand: "Brand",
    amount: "Amount",
    rating: "Rating",
    category: "Category",
    stock: "Stock",
    description: "Description",
    viewDetails: "View Details",
    inStock: "In stock",
    stockOut: "Out of stock",
    reviews: "reviews",
    addMore: "+ Add Product",
    addedToCart: "Added to cart!",
  },
  ar: {
    title: "مقارنة المنتجات",
    empty: "قائمة المقارنة فارغة",
    emptyDesc: "انقر على 'قارن' في بطاقات المنتجات لإضافة منتجات.",
    browse: "تصفح المنتجات",
    remove: "إزالة",
    addToCart: "أضف للسلة",
    outOfStock: "نفد المخزون",
    price: "السعر",
    brand: "العلامة التجارية",
    amount: "الكمية",
    rating: "التقييم",
    category: "الفئة",
    stock: "حالة المخزون",
    description: "الوصف",
    viewDetails: "عرض التفاصيل",
    inStock: "متوفر",
    stockOut: "غير متوفر",
    reviews: "مراجعات",
    addMore: "+ إضافة منتج",
    addedToCart: "أُضيف للسلة!",
  },
  ru: {
    title: "Сравнение товаров",
    empty: "Список сравнения пуст",
    emptyDesc: "Нажмите 'Сравнить' на карточках товаров, чтобы добавить.",
    browse: "Просмотр товаров",
    remove: "Удалить",
    addToCart: "В корзину",
    outOfStock: "Нет в наличии",
    price: "Цена",
    brand: "Бренд",
    amount: "Количество",
    rating: "Рейтинг",
    category: "Категория",
    stock: "Наличие",
    description: "Описание",
    viewDetails: "Подробнее",
    inStock: "В наличии",
    stockOut: "Нет в наличии",
    reviews: "отзывов",
    addMore: "+ Добавить товар",
    addedToCart: "Добавлено в корзину!",
  },
};

export function CompareContent() {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const t = useTranslations("products");
  const { ids, remove } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const compareProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  if (compareProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-900 mb-2">{l.empty}</h2>
        <p className="text-sm text-text-secondary mb-8 max-w-sm">{l.emptyDesc}</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {l.browse}
        </Link>
      </div>
    );
  }

  type RowDef = { key: string; label: string; render: (p: Product) => React.ReactNode };

  const rows: RowDef[] = [
    {
      key: "price",
      label: l.price,
      render: (p) => (
        <div>
          <span className="font-bold text-green-800 text-base">
            {p.price.toLocaleString("tr-TR")} ₺
          </span>
          {p.originalPrice && (
            <span className="block text-xs text-text-secondary/50 line-through mt-0.5">
              {p.originalPrice.toLocaleString("tr-TR")} ₺
            </span>
          )}
        </div>
      ),
    },
    {
      key: "brand",
      label: l.brand,
      render: (p) => <span className="text-sm text-text-secondary">{p.brand}</span>,
    },
    {
      key: "amount",
      label: l.amount,
      render: (p) => <span className="text-sm text-text-secondary">{p.amount}</span>,
    },
    {
      key: "rating",
      label: l.rating,
      render: (p) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`w-3 h-3 ${s <= Math.round(p.rating) ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-text-secondary/60">
            {p.rating} ({p.reviewCount} {l.reviews})
          </span>
        </div>
      ),
    },
    {
      key: "stock",
      label: l.stock,
      render: (p) => {
        const ok = p.inStock && p.stock > 0;
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${ok ? "text-green-600" : "text-red-500"}`}>
            {ok ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
            {ok ? l.inStock : l.stockOut}
          </span>
        );
      },
    },
    {
      key: "description",
      label: l.description,
      render: (p) => (
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {t(`desc_${p.descriptionKey}` as Parameters<typeof t>[0])}
        </p>
      ),
    },
  ];

  const emptySlots = 3 - compareProducts.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-900 mb-8">{l.title}</h1>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[640px] px-4 sm:px-0">
          {/* Product header cards */}
          <div className="grid gap-4 mb-0" style={{ gridTemplateColumns: `160px repeat(3, 1fr)` }}>
            <div /> {/* Label column spacer */}
            {compareProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-olive-border/30 overflow-hidden">
                <div className="relative aspect-square bg-green-50">
                  {p.image ? (
                    <Image src={p.image} alt={p.brand} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-20">🌿</span>
                    </div>
                  )}
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                      -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-text-secondary/60 mb-0.5">{p.amount} · {p.brand}</p>
                  <p className="text-sm font-bold text-green-900 leading-snug mb-2 line-clamp-2">
                    {t(`name_${p.nameKey}` as Parameters<typeof t>[0])}
                  </p>
                  <p className="text-base font-bold text-green-800 mb-3">
                    {p.price.toLocaleString("tr-TR")} ₺
                  </p>
                  <button
                    onClick={() => {
                      if (!p.inStock || p.stock === 0) return;
                      addItem(p);
                      toast.success(l.addedToCart);
                    }}
                    disabled={!p.inStock || p.stock === 0}
                    className={`w-full py-2 rounded-lg text-xs font-bold mb-2 transition-colors ${
                      p.inStock && p.stock > 0
                        ? "bg-green-700 hover:bg-green-800 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {p.inStock && p.stock > 0 ? l.addToCart : l.outOfStock}
                  </button>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-xs text-green-700 hover:underline truncate"
                    >
                      {l.viewDetails} →
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-[11px] text-text-secondary/40 hover:text-red-500 transition-colors shrink-0"
                    >
                      {l.remove}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <Link
                key={i}
                href="/products"
                className="flex flex-col items-center justify-center min-h-[240px] border-2 border-dashed border-olive-border/30 rounded-2xl text-center hover:border-green-400 hover:bg-green-50/50 transition-all gap-2 group"
              >
                <svg className="w-8 h-8 text-text-secondary/20 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-xs text-text-secondary/40 group-hover:text-green-600 transition-colors">
                  {l.addMore}
                </span>
              </Link>
            ))}
          </div>

          {/* Comparison rows */}
          <div className="mt-4 rounded-2xl border border-olive-border/20 overflow-hidden">
            {rows.map((row, ri) => (
              <div
                key={row.key}
                className={`grid items-start ${ri < rows.length - 1 ? "border-b border-olive-border/15" : ""}`}
                style={{ gridTemplateColumns: `160px repeat(3, 1fr)` }}
              >
                {/* Row label */}
                <div className={`px-4 py-4 ${ri % 2 === 0 ? "bg-cream-100" : "bg-cream-50"} border-r border-olive-border/20`}>
                  <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">
                    {row.label}
                  </span>
                </div>
                {/* Values */}
                {compareProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`px-4 py-4 border-r border-olive-border/10 last:border-0 ${ri % 2 === 0 ? "bg-white" : "bg-cream-50/30"}`}
                  >
                    {row.render(p)}
                  </div>
                ))}
                {/* Empty column spacers */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div
                    key={i}
                    className={`px-4 py-4 ${ri % 2 === 0 ? "bg-white/60" : "bg-cream-50/20"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
