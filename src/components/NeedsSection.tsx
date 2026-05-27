"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const needsData = [
  { key: "immunity" as const, emoji: "🛡" },
  { key: "energy" as const, emoji: "⚡" },
  { key: "digestion" as const, emoji: "🌿" },
  { key: "sleep" as const, emoji: "🌙" },
  { key: "stress" as const, emoji: "🧠" },
  { key: "sport" as const, emoji: "💪" },
  { key: "skin" as const, emoji: "✨" },
  { key: "joints" as const, emoji: "🦴" },
];

export function NeedsSection() {
  const t = useTranslations("needs");

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-12 animate-fade-in-up"
        >
          {t("title")}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {needsData.map((need, i) => (
            <div
              key={need.key}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Link
                href={`/products?need=${need.key}`}
                className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl border border-olive-border/40 bg-white hover:bg-green-50 hover:border-green-700/30 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md hover:shadow-green-700/10"
              >
                <span className="text-3xl sm:text-4xl">{need.emoji}</span>
                <span className="text-sm sm:text-base font-semibold text-green-800 text-center">
                  {t(need.key)}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
