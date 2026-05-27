"use client";

import { useTranslations } from "next-intl";

export function StatsStrip() {
  const t = useTranslations("stats");

  const stats = [
    { value: "12.000+", label: t("customers") },
    { value: "150+",    label: t("products") },
    { value: "%98",     label: t("satisfaction") },
    { value: "8",       label: t("brands") },
  ];

  return (
    <section className="bg-green-800 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <p className="text-3xl sm:text-4xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
