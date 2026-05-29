import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecommendationWizard } from "@/components/RecommendationWizard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recommendations" });
  const title = `${t("pageTitle")} | Hüda-i Şifa`;
  return { title, description: t("pageDesc"), openGraph: { title, images: [{ url: "/logo.png" }] } };
}

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "recommendations" });

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-3xl mb-3">🌿</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
              {t("pageTitle")}
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
              {t("pageDesc")}
            </p>
          </div>
          <RecommendationWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
