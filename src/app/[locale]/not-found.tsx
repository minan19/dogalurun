"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-7xl sm:text-8xl font-bold text-green-700/20 mb-4">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3">
            {t("title")}
          </h1>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            {t("description")}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 hover:-translate-y-0.5 transition-all"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
