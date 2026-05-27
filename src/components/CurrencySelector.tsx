"use client";

import { useState, useRef, useEffect } from "react";
import { useGeoStore } from "@/store/geoStore";
import { CURRENCIES, type CurrencyCode } from "@/lib/geoData";

const CURRENCY_LIST: CurrencyCode[] = ["TRY", "USD", "EUR", "SAR", "RUB"];

export function CurrencySelector() {
  const { currency, setCurrency } = useGeoStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = CURRENCIES[currency];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm text-text-secondary hover:text-green-800 transition-colors px-1.5 py-1 rounded-md hover:bg-green-50"
        aria-label="Para birimi seç"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-medium text-xs hidden sm:inline">{currency}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-olive-border/20 overflow-hidden z-50 py-1">
          {CURRENCY_LIST.map((code) => {
            const c = CURRENCIES[code];
            const active = currency === code;
            return (
              <button
                key={code}
                onClick={() => { setCurrency(code); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-green-50 text-green-800 font-semibold"
                    : "text-text-secondary hover:bg-cream-100"
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-mono font-semibold w-8 text-xs">{code}</span>
                <span className="text-xs text-text-secondary/70 truncate flex-1 text-left">{c.name}</span>
                {active && (
                  <svg className="w-3.5 h-3.5 text-green-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
          <div className="border-t border-olive-border/10 mt-1 px-3 py-2">
            <p className="text-[10px] text-text-secondary/50 leading-tight">
              Ödeme ₺ üzerinden alınır. Para birimi yalnızca gösterim amaçlıdır.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
