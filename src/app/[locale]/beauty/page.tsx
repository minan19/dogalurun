import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductsGrid } from "@/components/ProductsGrid";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: `${t("cat_beauty")} | Hüda-i Şifa`,
    description: t("beautyMetaDesc"),
    openGraph: { title: `${t("cat_beauty")} | Hüda-i Şifa`, images: [{ url: "/logo.png" }] },
  };
}

export default async function BeautyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-rose-800 via-pink-700 to-rose-600 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-5xl mb-4">💆</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{t("beautyHeroTitle")}</h1>
            <p className="text-lg sm:text-xl text-rose-100 max-w-2xl mx-auto">{t("beautyHeroSubtitle")}</p>
          </div>
        </section>
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8"><h2 className="text-2xl sm:text-3xl font-bold text-green-800">{t("cat_beauty")}</h2></div>
            <Suspense fallback={<div className="text-center py-20 text-text-secondary">{t("loading")}</div>}>
              <ProductsGrid category="beauty" noProductsText={t("noProducts") as string} productsCountLabel={t("productsCount") as string} />
            </Suspense>
          </div>
        </section>
        <section className="bg-gradient-to-br from-rose-700 to-pink-800 py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("beautyCtaTitle")}</h2>
            <p className="text-rose-100 mb-8">{t("beautyCtaSubtitle")}</p>
            <a href="/recommendations" className="inline-block bg-white text-rose-700 font-semibold px-8 py-3 rounded-xl hover:bg-rose-50 transition-colors">{t("beautyCtaButton")}</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
