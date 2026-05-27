"use client";

import { useTranslations } from "next-intl";

export function ExpertNote() {
  const t = useTranslations("footer");

  return (
    <section className="py-12 bg-gold-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm sm:text-base text-green-800 font-medium">
          {t("expertNote")}
        </p>
      </div>
    </section>
  );
}
