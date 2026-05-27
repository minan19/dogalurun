"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useGeoStore } from "@/store/geoStore";
import { getRegionalProfile } from "@/lib/geoData";
import { products } from "@/data/products";

const DISMISS_KEY = "hudai_geo_banner_v1";

export function RegionalHealthBanner() {
  const { countryCode, detected } = useGeoStore();
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!mounted || !detected || dismissed || countryCode === "TR") return null;

  const profile = getRegionalProfile(countryCode);
  const recs = profile.recommendedSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  if (recs.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xl shrink-0">{profile.flag}</span>

          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-green-300 uppercase tracking-wide">
              {profile.region} için öneriler:&nbsp;
            </span>
            <span className="text-xs text-green-100">{profile.tip}</span>
          </div>

          {/* Ürün linkleri */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {recs.map((p) => p && (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="text-[11px] font-semibold bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
              >
                {p.amount}
              </Link>
            ))}
          </div>

          <button
            onClick={() => { sessionStorage.setItem(DISMISS_KEY, "1"); setDismissed(true); }}
            className="shrink-0 text-white/40 hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
