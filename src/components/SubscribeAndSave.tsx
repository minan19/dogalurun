"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

const DISCOUNT_PCT = 10;

const labels: Record<Locale, {
  heading: string;
  oneTime: string;
  subscribe: string;
  saveBadge: string;
  frequency: string;
  freqOptions: string[];
  benefit1: string;
  benefit2: string;
  benefit3: string;
  cancelNote: string;
}> = {
  tr: {
    heading: "Satın alma seçeneği",
    oneTime: "Tek seferlik",
    subscribe: "Abone Ol ve Tasarruf Et",
    saveBadge: `%${DISCOUNT_PCT} tasarruf`,
    frequency: "Gönderim sıklığı",
    freqOptions: ["Her 1 ayda bir", "Her 2 ayda bir", "Her 3 ayda bir"],
    benefit1: "İstediğin zaman iptal et",
    benefit2: "Ücretsiz kargo",
    benefit3: "Her gönderide fatura",
    cancelNote: "Aboneliği istediğiniz zaman hesabınızdan iptal edebilirsiniz.",
  },
  en: {
    heading: "Purchase option",
    oneTime: "One-time purchase",
    subscribe: "Subscribe & Save",
    saveBadge: `${DISCOUNT_PCT}% off`,
    frequency: "Delivery frequency",
    freqOptions: ["Every 1 month", "Every 2 months", "Every 3 months"],
    benefit1: "Cancel anytime",
    benefit2: "Free shipping",
    benefit3: "Invoice with every delivery",
    cancelNote: "Cancel or pause your subscription at any time from your account.",
  },
  ar: {
    heading: "خيار الشراء",
    oneTime: "شراء مرة واحدة",
    subscribe: "اشترك ووفّر",
    saveBadge: `خصم ${DISCOUNT_PCT}٪`,
    frequency: "تكرار التوصيل",
    freqOptions: ["كل شهر", "كل شهرين", "كل 3 أشهر"],
    benefit1: "إلغاء في أي وقت",
    benefit2: "شحن مجاني",
    benefit3: "فاتورة مع كل توصيل",
    cancelNote: "يمكنك إلغاء اشتراكك أو إيقافه مؤقتاً في أي وقت.",
  },
  ru: {
    heading: "Вариант покупки",
    oneTime: "Разовая покупка",
    subscribe: "Подписка со скидкой",
    saveBadge: `скидка ${DISCOUNT_PCT}%`,
    frequency: "Частота доставки",
    freqOptions: ["Каждый месяц", "Каждые 2 месяца", "Каждые 3 месяца"],
    benefit1: "Отмена в любое время",
    benefit2: "Бесплатная доставка",
    benefit3: "Счёт с каждой доставкой",
    cancelNote: "Вы можете отменить или приостановить подписку в любое время.",
  },
};

interface Props {
  price: number;
  onModeChange?: (mode: "one-time" | "subscribe", discountedPrice: number) => void;
}

export function SubscribeAndSave({ price, onModeChange }: Props) {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const [mode, setMode] = useState<"one-time" | "subscribe">("one-time");
  const [freqIdx, setFreqIdx] = useState(0);

  const discountedPrice = Math.round(price * (1 - DISCOUNT_PCT / 100));

  function handleMode(m: "one-time" | "subscribe") {
    setMode(m);
    onModeChange?.(m, m === "subscribe" ? discountedPrice : price);
  }

  return (
    <div className="rounded-2xl border border-olive-border/30 overflow-hidden text-sm">
      {/* One-time */}
      <label className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${mode === "one-time" ? "bg-green-50" : "bg-white hover:bg-cream-50"}`}>
        <input
          type="radio"
          name="purchase-mode"
          checked={mode === "one-time"}
          onChange={() => handleMode("one-time")}
          className="w-4 h-4 accent-green-700"
        />
        <div className="flex-1">
          <span className="font-semibold text-green-900">{l.oneTime}</span>
        </div>
        <span className="font-bold text-green-800">{price.toLocaleString("tr-TR")} ₺</span>
      </label>

      <div className="border-t border-olive-border/20" />

      {/* Subscribe */}
      <label className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${mode === "subscribe" ? "bg-green-50" : "bg-white hover:bg-cream-50"}`}>
        <input
          type="radio"
          name="purchase-mode"
          checked={mode === "subscribe"}
          onChange={() => handleMode("subscribe")}
          className="w-4 h-4 accent-green-700 mt-0.5"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-green-900">{l.subscribe}</span>
            <span className="text-[11px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
              {l.saveBadge}
            </span>
          </div>

          {mode === "subscribe" && (
            <div className="mt-2.5 space-y-2.5">
              {/* Frequency selector */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-text-secondary/70">{l.frequency}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {l.freqOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFreqIdx(i)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        freqIdx === i
                          ? "border-green-600 bg-green-100 text-green-800 font-semibold"
                          : "border-olive-border/40 text-text-secondary hover:border-green-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-1">
                {[l.benefit1, l.benefit2, l.benefit3].map((b, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-[11px] text-green-700">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <p className="text-[10px] text-text-secondary/60 leading-relaxed">{l.cancelNote}</p>
            </div>
          )}
        </div>

        <div className="text-right shrink-0">
          <span className="font-bold text-green-800">{discountedPrice.toLocaleString("tr-TR")} ₺</span>
          <p className="text-[10px] text-text-secondary/60 line-through">{price.toLocaleString("tr-TR")} ₺</p>
        </div>
      </label>
    </div>
  );
}
