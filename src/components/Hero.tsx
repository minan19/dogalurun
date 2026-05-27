"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-cream-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 leading-tight tracking-tight animate-fade-in-up"
          >
            {t("title")}
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl text-text-secondary font-light animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            {t("subtitle")}
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/recommendations"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-green-700 text-white rounded-full text-base font-semibold hover:bg-green-800 transition-colors hover:-translate-y-0.5 shadow-lg shadow-green-700/20"
            >
              {t("ctaRecommend")}
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-green-800 rounded-full text-base font-semibold border-2 border-green-700 hover:bg-green-50 transition-colors hover:-translate-y-0.5"
            >
              {t("ctaBrowse")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
