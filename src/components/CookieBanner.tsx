"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const COOKIE_KEY = "hudai_cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

const texts: Record<string, { title: string; desc: string; accept: string; reject: string; settings: string; detail: string }> = {
  tr: {
    title: "Çerez Tercihleriniz",
    desc: "Sitemizi geliştirmek ve size kişiselleştirilmiş deneyim sunmak için çerezler kullanıyoruz. Zorunlu çerezler her zaman aktiftir.",
    accept: "Tümünü Kabul Et",
    reject: "Yalnızca Zorunlu",
    settings: "Detaylar",
    detail: "Gizlilik Politikası",
  },
  en: {
    title: "Cookie Preferences",
    desc: "We use cookies to improve our site and offer you a personalized experience. Essential cookies are always active.",
    accept: "Accept All",
    reject: "Essential Only",
    settings: "Details",
    detail: "Privacy Policy",
  },
  ar: {
    title: "تفضيلات ملفات تعريف الارتباط",
    desc: "نستخدم ملفات تعريف الارتباط لتحسين موقعنا وتقديم تجربة مخصصة لك.",
    accept: "قبول الكل",
    reject: "الضروري فقط",
    settings: "التفاصيل",
    detail: "سياسة الخصوصية",
  },
  ru: {
    title: "Настройки файлов cookie",
    desc: "Мы используем файлы cookie для улучшения сайта и персонализации вашего опыта.",
    accept: "Принять все",
    reject: "Только необходимые",
    settings: "Подробнее",
    detail: "Политика конфиденциальности",
  },
};

export function CookieBanner() {
  const params = useParams();
  const locale = (params?.locale as string) || "tr";
  const t = texts[locale] ?? texts.tr;

  const [consent, setConsent] = useState<ConsentState | "loading">("loading");

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY) as ConsentState | null;
    setConsent(saved);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setConsent("accepted");
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setConsent("rejected");
  };

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-0 right-0 z-[9990] px-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-olive-border/30 p-4 sm:p-5 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0 mt-0.5">🍪</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-green-900 mb-1">{t.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {t.desc}{" "}
                <Link href="/privacy" className="text-green-700 underline underline-offset-2 hover:text-green-800">
                  {t.detail}
                </Link>
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-xl hover:bg-green-800 transition-colors"
                >
                  {t.accept}
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-cream-100 text-green-800 text-xs font-semibold rounded-xl border border-olive-border/40 hover:bg-green-50 transition-colors"
                >
                  {t.reject}
                </button>
              </div>
            </div>
            <button
              onClick={handleReject}
              className="text-text-secondary/30 hover:text-text-secondary/60 transition-colors shrink-0"
              aria-label="Kapat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
