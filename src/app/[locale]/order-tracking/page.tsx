import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderTracker } from "@/components/OrderTracker";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "orderTracking" });

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-12 sm:py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-3xl block mb-3">📦</span>
            <h1 className="text-2xl font-bold text-green-900 mb-2">{t("title")}</h1>
            <p className="text-text-secondary text-sm">{t("subtitle")}</p>
          </div>
          <OrderTracker />
        </div>
      </main>
      <Footer />
    </div>
  );
}
