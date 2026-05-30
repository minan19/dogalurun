"use client";

import { useState, useEffect } from "react";
import { useLoyaltyStore, type LoyaltyTier } from "@/store/loyaltyStore";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

const tierConfig: Record<LoyaltyTier, { label: Record<Locale, string>; color: string; icon: string }> = {
  member:   { label: { tr: "Üye", en: "Member", ar: "عضو", ru: "Участник" }, color: "text-slate-600 bg-slate-100", icon: "⭐" },
  silver:   { label: { tr: "Gümüş", en: "Silver", ar: "فضي", ru: "Серебро" }, color: "text-slate-500 bg-slate-50 border border-slate-200", icon: "🥈" },
  gold:     { label: { tr: "Altın", en: "Gold", ar: "ذهبي", ru: "Золото" }, color: "text-amber-700 bg-amber-50 border border-amber-200", icon: "🥇" },
  platinum: { label: { tr: "Platin", en: "Platinum", ar: "بلاتيني", ru: "Платина" }, color: "text-purple-700 bg-purple-50 border border-purple-200", icon: "💎" },
};

const labels: Record<Locale, {
  earn: string;
  points: string;
  total: string;
  nextTier: string;
  more: string;
  maxTier: string;
  info: string;
}> = {
  tr: {
    earn: "Bu alışverişten kazanacaksınız",
    points: "puan",
    total: "Toplam puanınız",
    nextTier: "kademeye",
    more: "puan kaldı",
    maxTier: "En yüksek kademede",
    info: "1 ₺ = 1 puan · Biriken puanlar ile alışveriş yapabilirsiniz",
  },
  en: {
    earn: "You'll earn from this purchase",
    points: "points",
    total: "Your total points",
    nextTier: "to reach",
    more: "points away",
    maxTier: "Highest tier reached",
    info: "1 ₺ = 1 point · Redeem points on future purchases",
  },
  ar: {
    earn: "ستكسب من هذا الشراء",
    points: "نقطة",
    total: "مجموع نقاطك",
    nextTier: "للوصول إلى",
    more: "نقطة متبقية",
    maxTier: "أعلى مستوى",
    info: "1 ₺ = 1 نقطة · يمكنك استخدام النقاط في مشترياتك القادمة",
  },
  ru: {
    earn: "Вы заработаете за эту покупку",
    points: "баллов",
    total: "Ваши баллы",
    nextTier: "до уровня",
    more: "баллов осталось",
    maxTier: "Максимальный уровень",
    info: "1 ₺ = 1 балл · Используйте баллы при следующих покупках",
  },
};

interface Props {
  price: number;
  qty?: number;
}

export function LoyaltyPointsBadge({ price, qty = 1 }: Props) {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const [mounted, setMounted] = useState(false);
  const { points, tier, nextTierPoints, nextTierName } = useLoyaltyStore();
  useEffect(() => { setMounted(true); }, []);

  const earnPoints = Math.round(price * qty);
  const currentTier = mounted ? tier() : "member";
  const tCfg = tierConfig[currentTier];
  const next = mounted ? nextTierName() : null;
  const remaining = mounted ? nextTierPoints() : 0;
  const totalAfter = (mounted ? points : 0) + earnPoints;

  const tierOrder: LoyaltyTier[] = ["member", "silver", "gold", "platinum"];
  const tierIdx = tierOrder.indexOf(currentTier);
  const progressPct = (() => {
    if (!next) return 100;
    const prevMin = tierIdx > 0 ? [0, 500, 1000, 2000][tierIdx] : 0;
    const nextMin = [0, 500, 1000, 2000][tierIdx + 1];
    return Math.min(100, Math.round(((mounted ? points : 0) - prevMin) / (nextMin - prevMin) * 100));
  })();

  return (
    <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-yellow-50 px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-amber-800">{l.earn}:</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tCfg.color}`}>
          {tCfg.icon} {tCfg.label[locale]}
        </span>
      </div>

      {/* Earn display */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl font-black text-amber-700">+{earnPoints}</span>
        <span className="text-sm font-semibold text-amber-600">{l.points}</span>
        {mounted && (
          <span className="text-xs text-amber-500/80 ml-1">
            ({l.total}: {totalAfter.toLocaleString("tr-TR")})
          </span>
        )}
      </div>

      {/* Progress to next tier */}
      {next && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-amber-600/80">
              {remaining} {l.points} {l.more} · {tierConfig[next].icon} {tierConfig[next].label[locale]} {l.nextTier}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-amber-200/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
      {!next && mounted && (
        <p className="text-[11px] text-purple-600 font-semibold mb-1">💎 {l.maxTier}</p>
      )}

      {/* Info */}
      <p className="text-[10px] text-amber-600/70 mt-1">{l.info}</p>
    </div>
  );
}
