import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "checkout" });

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-green-900 mb-8">{t("pageTitle")}</h1>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
