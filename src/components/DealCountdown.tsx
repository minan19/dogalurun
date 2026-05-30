"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface Props {
  productId: string;
  discount: number;
}

const labels: Record<string, { title: string; hours: string; mins: string; secs: string; dir: string }> = {
  tr: { title: "Bu indirim sona eriyor!", hours: "sa", mins: "dk", secs: "sn", dir: "ltr" },
  en: { title: "Deal ends soon!", hours: "h", mins: "m", secs: "s", dir: "ltr" },
  ar: { title: "ينتهي العرض قريبًا!", hours: "س", mins: "د", secs: "ث", dir: "rtl" },
  ru: { title: "Акция заканчивается!", hours: "ч", mins: "м", secs: "с", dir: "ltr" },
};

function seedEnd(productId: string): number {
  const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hoursLeft = 4 + (seed % 9);
  const now = Date.now();
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 0);
  const endFromNow = now + hoursLeft * 3600 * 1000;
  return Math.min(endFromNow, todayEnd.getTime());
}

export function DealCountdown({ productId, discount }: Props) {
  const locale = useLocale();
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [endTs] = useState(() => seedEnd(productId));

  useEffect(() => {
    function compute() {
      const diff = Math.max(0, Math.floor((endTs - Date.now()) / 1000));
      if (diff === 0) return null;
      return {
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      };
    }

    setTimeLeft(compute());
    const id = setInterval(() => {
      const t = compute();
      setTimeLeft(t);
      if (!t) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endTs]);

  if (!timeLeft || discount <= 0) return null;

  const { title, hours, mins, secs, dir } = labels[locale] ?? labels.tr;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3" dir={dir}>
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-semibold text-red-700 mb-1">{title}</p>
        <div className="flex items-center gap-1.5">
          {[
            { v: timeLeft.h, u: hours },
            { v: timeLeft.m, u: mins },
            { v: timeLeft.s, u: secs },
          ].map(({ v, u }, i) => (
            <span key={i} className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-red-800 tabular-nums bg-red-100 px-1.5 py-0.5 rounded">
                {pad(v)}
              </span>
              <span className="text-[10px] text-red-500">{u}</span>
              {i < 2 && <span className="text-red-400 font-bold text-xs">:</span>}
            </span>
          ))}
        </div>
      </div>
      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg shrink-0">
        %{discount}
      </span>
    </div>
  );
}
