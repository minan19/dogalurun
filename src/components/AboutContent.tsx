"use client";

import { useTranslations } from "next-intl";

const values = [
  { key: "value1", icon: "🛡" },
  { key: "value2", icon: "🌿" },
  { key: "value3", icon: "🔍" },
] as const;

export function AboutContent() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-cream-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 animate-fade-in-up"
          >
            {t("title")}
          </h1>
          <p
            className="mt-4 text-lg text-text-secondary animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-text-secondary leading-relaxed text-center">
            {t("story")}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8">
            <div
              className="bg-white rounded-2xl p-8 border border-olive-border/30 animate-fade-in-up"
            >
              <h2 className="text-xl font-bold text-green-800 mb-3">{t("mission")}</h2>
              <p className="text-text-secondary leading-relaxed">{t("missionText")}</p>
            </div>
            <div
              className="bg-white rounded-2xl p-8 border border-olive-border/30 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-xl font-bold text-green-800 mb-3">{t("vision")}</h2>
              <p className="text-text-secondary leading-relaxed">{t("visionText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-12">
            {t("values")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={v.key}
                className="text-center p-8 rounded-2xl border border-olive-border/30 bg-white animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  {t(`${v.key}Title`)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`${v.key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
