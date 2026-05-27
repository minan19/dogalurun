import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CampaignType =
  | "percent"
  | "fixed"
  | "threshold"
  | "bogo"
  | "bundle"
  | "freeship";

export type CustomerSegment =
  | "all"
  | "new"
  | "returning"
  | "vip"
  | "silver"
  | "inactive";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  value: number;
  threshold?: number;
  products: string[];
  targetSegment: CustomerSegment;
  couponCode?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  usageCount: number;
}

const defaultCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Bahar İndirimi — Herkese",
    type: "percent",
    value: 15,
    products: [],
    targetSegment: "all",
    couponCode: "BAHAR15",
    startDate: "2026-03-20",
    endDate: "2026-04-20",
    active: true,
    usageCount: 42,
  },
  {
    id: "c2",
    name: "Hoş Geldin — İlk Alışveriş",
    type: "percent",
    value: 20,
    products: [],
    targetSegment: "new",
    couponCode: "ILKSIPARIS20",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: true,
    usageCount: 83,
  },
  {
    id: "c3",
    name: "VIP Özel — Erken Erişim",
    type: "fixed",
    value: 100,
    products: [],
    targetSegment: "vip",
    couponCode: "VIPSEL100",
    startDate: "2026-03-21",
    endDate: "2026-04-10",
    active: true,
    usageCount: 11,
  },
  {
    id: "c4",
    name: "Sizi Özledik — Geri Dönün",
    type: "percent",
    value: 25,
    products: [],
    targetSegment: "inactive",
    couponCode: "GERIDON25",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    active: true,
    usageCount: 6,
  },
  {
    id: "c5",
    name: "Gümüş Üye Avantajı",
    type: "percent",
    value: 10,
    products: [],
    targetSegment: "silver",
    couponCode: "GUMUS10",
    startDate: "2026-03-01",
    endDate: "2026-05-31",
    active: true,
    usageCount: 14,
  },
  {
    id: "c6",
    name: "Omega-3 Sadık Müşteri",
    type: "fixed",
    value: 30,
    products: ["p2"],
    targetSegment: "returning",
    couponCode: "OMEGA30",
    startDate: "2026-03-15",
    endDate: "2026-04-15",
    active: false,
    usageCount: 7,
  },
];

interface CampaignStore {
  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  toggleCampaign: (id: string) => void;
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set) => ({
      campaigns: defaultCampaigns,

      addCampaign: (c) =>
        set((s) => ({ campaigns: [c, ...s.campaigns] })),

      updateCampaign: (id, updates) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCampaign: (id) =>
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),

      toggleCampaign: (id) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, active: !c.active } : c
          ),
        })),
    }),
    { name: "hudai-campaigns" }
  )
);
