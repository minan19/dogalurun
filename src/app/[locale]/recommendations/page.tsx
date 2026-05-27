import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Size Özel Ürün Önerisi | Hüda-i Şifa",
  description: "6 kısa soruyla ihtiyacınıza en uygun doğal takviye ürünlerini bulun. Uzman onaylı öneriler.",
  openGraph: { title: "Size Özel Ürün Önerisi | Hüda-i Şifa", images: [{ url: "/logo.png" }] },
};
import { Footer } from "@/components/Footer";
import { RecommendationWizard } from "@/components/RecommendationWizard";

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Başlık */}
          <div className="text-center mb-10">
            <span className="inline-block text-3xl mb-3">🌿</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
              Size Özel Ürün Önerisi
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
              6 kısa soruyla ihtiyacınıza en uygun doğal ürünleri bulalım.
            </p>
          </div>

          <RecommendationWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
