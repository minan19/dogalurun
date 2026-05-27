import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Coupon {
  code: string;
  label: string;
  discount: number;
  type: "pct" | "flat";
  minCart: number;
  userEmail?: string; // null/undefined = herkese açık
  maxUses?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
}

const defaultCoupons: Coupon[] = [
  {
    code: "HISIFA10",
    label: "Hüda-i Şifa %10 İndirim",
    discount: 10,
    type: "pct",
    minCart: 0,
    usedCount: 0,
    active: true,
  },
  {
    code: "HOSGELDIN10",
    label: "Hoş Geldin %10",
    discount: 10,
    type: "pct",
    minCart: 0,
    usedCount: 0,
    active: true,
  },
  {
    code: "SAGLIK50",
    label: "Sağlık 50₺ İndirim",
    discount: 50,
    type: "flat",
    minCart: 200,
    usedCount: 0,
    active: true,
  },
  {
    code: "YENI20",
    label: "Yeni Müşteri %20",
    discount: 20,
    type: "pct",
    minCart: 300,
    usedCount: 0,
    active: true,
  },
  {
    code: "BAHAR15",
    label: "Bahar İndirimi %15",
    discount: 15,
    type: "pct",
    minCart: 0,
    usedCount: 42,
    active: true,
  },
  {
    code: "ILKSIPARIS20",
    label: "İlk Sipariş %20",
    discount: 20,
    type: "pct",
    minCart: 0,
    usedCount: 83,
    active: true,
  },
  {
    code: "VIPSEL100",
    label: "VIP 100₺ İndirim",
    discount: 100,
    type: "flat",
    minCart: 500,
    usedCount: 11,
    active: true,
  },
  {
    code: "GERIDON25",
    label: "Geri Dön %25",
    discount: 25,
    type: "pct",
    minCart: 0,
    usedCount: 6,
    active: true,
  },
  {
    code: "GUMUS10",
    label: "Gümüş Üye %10",
    discount: 10,
    type: "pct",
    minCart: 0,
    usedCount: 14,
    active: true,
  },
];

interface CouponStore {
  coupons: Coupon[];
  addCoupon: (c: Omit<Coupon, "usedCount">) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  toggleCoupon: (code: string) => void;
  validateCoupon: (
    code: string,
    cartTotal: number,
    userEmail?: string
  ) =>
    | { valid: true; discount: number; type: "pct" | "flat"; pct: number }
    | { valid: false; error: string };
  useCoupon: (code: string) => void;
}

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: defaultCoupons,

      addCoupon: (c) =>
        set((s) => ({ coupons: [{ ...c, usedCount: 0 }, ...s.coupons] })),

      updateCoupon: (code, updates) =>
        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.code === code.toUpperCase() ? { ...c, ...updates } : c
          ),
        })),

      deleteCoupon: (code) =>
        set((s) => ({
          coupons: s.coupons.filter((c) => c.code !== code.toUpperCase()),
        })),

      toggleCoupon: (code) =>
        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.code === code.toUpperCase() ? { ...c, active: !c.active } : c
          ),
        })),

      validateCoupon: (code, cartTotal, userEmail) => {
        const trimmed = code.trim().toUpperCase();
        const coupon = get().coupons.find(
          (c) => c.code === trimmed && c.active
        );

        if (!coupon)
          return { valid: false, error: "Kupon kodu bulunamadı veya geçersiz." };

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
          return { valid: false, error: "Bu kuponun süresi dolmuş." };

        if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses)
          return { valid: false, error: "Bu kupon kullanım limitine ulaşmış." };

        if (cartTotal < coupon.minCart)
          return {
            valid: false,
            error: `Bu kupon için minimum sepet tutarı ${coupon.minCart} ₺'dir.`,
          };

        if (coupon.userEmail && coupon.userEmail !== userEmail)
          return {
            valid: false,
            error: "Bu kupon kodunu kullanma yetkiniz bulunmuyor.",
          };

        const discountAmount =
          coupon.type === "pct"
            ? Math.round((cartTotal * coupon.discount) / 100)
            : Math.min(coupon.discount, cartTotal);

        return {
          valid: true,
          discount: discountAmount,
          type: coupon.type,
          pct: coupon.discount,
        };
      },

      useCoupon: (code) =>
        set((s) => ({
          coupons: s.coupons.map((c) =>
            c.code === code.toUpperCase()
              ? { ...c, usedCount: c.usedCount + 1 }
              : c
          ),
        })),
    }),
    {
      name: "hudai-coupons",
      version: 3,
      migrate: (persistedState, version) => {
        const s = persistedState as Partial<CouponStore>;
        if (version < 2 || !s.coupons || s.coupons.length === 0) {
          return { coupons: defaultCoupons };
        }
        // Add any new default coupons not yet in persisted list
        const existingCodes = new Set(s.coupons.map((c) => c.code));
        const newDefaults = defaultCoupons.filter((c) => !existingCodes.has(c.code));
        return { ...s, coupons: [...(s.coupons ?? []), ...newDefaults] };
      },
    }
  )
);
