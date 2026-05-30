import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductsGrid } from "@/components/ProductsGrid";
import { Suspense } from "react";
import { SortSelect } from "@/components/SortSelect";
import { PriceFilter } from "@/components/PriceFilter";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: `${t("pageTitle")} | Hüda-i Şifa`,
    description: "Uzman onaylı doğal takviye ve organik gıda ürünleri. 150+ ürün, güvenli kargo.",
    openGraph: { title: `${t("pageTitle")} | Hüda-i Şifa`, images: [{ url: "/logo.png" }] },
  };
}

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; need?: string; sort?: string; priceMin?: string; priceMax?: string }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const { category, need, sort, priceMin, priceMax } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sayfa başlığı */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
              {need ? t("needTitle") : t("pageTitle")}
            </h1>
            {need && (
              <p className="mt-1 text-text-secondary text-sm">
                {t("showingForNeed")}
              </p>
            )}
          </div>

          {/* Kategori sekmeleri */}
          <div className="mb-6">
            <Suspense>
              <CategoryTabs />
            </Suspense>
          </div>

          {/* Fiyat filtresi + Sıralama */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <Suspense>
              <PriceFilter
                priceMin={priceMin}
                priceMax={priceMax}
                allLabel={t("filterAll")}
              />
            </Suspense>
            <SortSelect
              value={sort || ""}
              category={category}
              need={need}
              priceMin={priceMin}
              priceMax={priceMax}
              labels={{
                default: t("sortDefault"),
                priceAsc: t("sortPriceAsc"),
                priceDesc: t("sortPriceDesc"),
                rating: t("sortRating"),
              }}
            />
          </div>

          {/* Ürün grid */}
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductsGrid
              category={category}
              need={need}
              sort={sort}
              priceMin={priceMin}
              priceMax={priceMax}
              noProductsText={t("noProducts") as string}
              productsCountLabel={t("productsCount") as string}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
