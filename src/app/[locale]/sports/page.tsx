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
    title: `${t("cat_sports")} | Hüda-i Şifa`,
    description: "Sporcular için uzman onaylı doğal takviyeler.",
    openGraph: { title: `${t("cat_sports")} | Hüda-i Şifa`, images: [{ url: "/logo.png" }] },
  };
}

export default async function SportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-olive-900 via-green-900 to-green-800 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-5xl mb-4">🏋️</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Sporculara Özel Doğal Ürünler</h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">Performansınızı doğal takviyelerle destekleyin. Kreatin, BCAA, Whey Protein ve daha fazlası.</p>
          </div>
        </section>
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8"><h2 className="text-2xl sm:text-3xl font-bold text-green-800">{t("cat_sports")}</h2></div>
            <Suspense fallback={<div className="text-center py-20 text-text-secondary">Yükleniyor...</div>}>
              <ProductsGrid category="sports" noProductsText={t("noProducts") as string} productsCountLabel={t("productsCount") as string} />
            </Suspense>
          </div>
        </section>
        <section className="bg-gradient-to-br from-green-800 to-olive-900 py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Doğru Takviye, Daha İyi Performans</h2>
            <p className="text-green-100 mb-8">Uzman diyetisyen ve spor beslenme danışmanlarımız ihtiyacınıza uygun ürünleri seçmenize yardımcı olur.</p>
            <a href="/recommendations" className="inline-block bg-white text-green-800 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors">Ücretsiz Danışmanlık Al</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
