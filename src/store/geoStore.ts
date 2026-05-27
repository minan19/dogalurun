import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CurrencyCode, type ShippingZone,
  getZone, getDefaultCurrency, formatCurrency, ZONE_CONFIG,
} from "@/lib/geoData";

export interface GeoState {
  countryCode: string;
  countryName: string;
  city: string;
  detected: boolean;
  currency: CurrencyCode;
  zone: ShippingZone;

  setGeo: (countryCode: string, countryName: string, city: string) => void;
  setCurrency: (currency: CurrencyCode) => void;
  resetDetection: () => void;
  formatPrice: (amountTRY: number) => string;
  getShippingCost: (cartTotalTRY: number) => number;
  isFreeShipping: (cartTotalTRY: number) => boolean;
  freeShippingRemaining: (cartTotalTRY: number) => number;
}

export const useGeoStore = create<GeoState>()(
  persist(
    (set, get) => ({
      countryCode: "TR",
      countryName: "Türkiye",
      city: "",
      detected: false,
      currency: "TRY",
      zone: "zone1",

      setGeo: (countryCode, countryName, city) => {
        const zone = getZone(countryCode);
        // Para birimi: kullanıcı daha önce manuel seçtiyse koru, değilse otomatik ayarla
        const currentCurrency = get().currency;
        const autoDefault = getDefaultCurrency(countryCode);
        const currency = get().detected ? currentCurrency : autoDefault;
        set({ countryCode, countryName, city, zone, currency, detected: true });
      },

      setCurrency: (currency) => set({ currency }),

      resetDetection: () => set({ detected: false }),

      formatPrice: (amountTRY) => formatCurrency(amountTRY, get().currency),

      getShippingCost: (cartTotalTRY) => {
        const cfg = ZONE_CONFIG[get().zone];
        return cartTotalTRY >= cfg.freeThresholdTRY ? 0 : cfg.shippingTRY;
      },

      isFreeShipping: (cartTotalTRY) =>
        cartTotalTRY >= ZONE_CONFIG[get().zone].freeThresholdTRY,

      freeShippingRemaining: (cartTotalTRY) =>
        Math.max(0, ZONE_CONFIG[get().zone].freeThresholdTRY - cartTotalTRY),
    }),
    {
      name: "hudai-geo",
      partialize: (s) => ({
        currency: s.currency,
        countryCode: s.countryCode,
        countryName: s.countryName,
        city: s.city,
        zone: s.zone,
        detected: s.detected,
      }),
    }
  )
);
