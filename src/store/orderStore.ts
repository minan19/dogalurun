import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockOrders, type Order } from "@/data/orders";
import { getFlagEmoji, ZONE_CONFIG, type ShippingZone } from "@/lib/geoData";

export interface OrderLocation {
  countryCode: string;
  countryName: string;
  city: string;
  zone: ShippingZone;
}

export interface EnrichedOrder extends Order {
  location: OrderLocation;
}

// ── Bölgesel analitik tipleri ─────────────────────────────────────────────────
export interface RegionalStat {
  countryCode: string;
  countryName: string;
  flag: string;
  zone: string;
  zoneName: string;
  orderCount: number;
  revenue: number;
  avgOrder: number;
  topProducts: Array<{ name: string; count: number }>;
}

export interface ZoneStat {
  zone: ShippingZone;
  zoneName: string;
  orderCount: number;
  revenue: number;
  pct: number;
}

// ── Demo lokasyon verisi ──────────────────────────────────────────────────────
const DEMO_LOCATIONS: Record<string, OrderLocation> = {
  "HS-2026-10841": { countryCode: "TR", countryName: "Türkiye",          city: "İstanbul",  zone: "zone1" },
  "HS-2026-10840": { countryCode: "TR", countryName: "Türkiye",          city: "Ankara",    zone: "zone1" },
  "HS-2026-10839": { countryCode: "DE", countryName: "Almanya",          city: "Berlin",    zone: "zone2" },
  "HS-2026-10838": { countryCode: "TR", countryName: "Türkiye",          city: "İzmir",     zone: "zone1" },
  "HS-2026-10837": { countryCode: "SA", countryName: "Suudi Arabistan",  city: "Riyad",     zone: "zone3" },
  "HS-2026-10836": { countryCode: "TR", countryName: "Türkiye",          city: "Bursa",     zone: "zone1" },
  "HS-2026-10835": { countryCode: "AE", countryName: "BAE",              city: "Dubai",     zone: "zone3" },
  "HS-2026-10834": { countryCode: "TR", countryName: "Türkiye",          city: "Antalya",   zone: "zone1" },
  "HS-2026-10833": { countryCode: "RU", countryName: "Rusya",            city: "Moskova",   zone: "zone2" },
  "HS-2026-10832": { countryCode: "TR", countryName: "Türkiye",          city: "Konya",     zone: "zone1" },
  "HS-2026-10831": { countryCode: "GB", countryName: "İngiltere",        city: "Londra",    zone: "zone2" },
};

const DEFAULT_LOCATION: OrderLocation = {
  countryCode: "TR", countryName: "Türkiye", city: "", zone: "zone1",
};

interface OrderStore {
  orders: EnrichedOrder[];
  addOrder: (order: EnrichedOrder) => void;
  // Analytics — O(n) tek geçiş
  getRegionalStats: () => RegionalStat[];
  getZoneStats: () => ZoneStat[];
  // Müşteri listesi ülkeye göre
  getCustomersByCountry: (countryCode?: string) => Array<{
    name: string; email: string; orders: number; total: number; lastOrder: string; countryCode: string; city: string;
  }>;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: mockOrders.map((o) => ({
        ...o,
        location: DEMO_LOCATIONS[o.id] ?? DEFAULT_LOCATION,
      })),

      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),

      // O(n) tek geçiş ile tüm bölgesel istatistikler
      getRegionalStats: () => {
        const statsMap = new Map<string, RegionalStat>();
        const productMap = new Map<string, Map<string, number>>();

        for (const order of get().orders) {
          const loc = order.location;
          const key = loc.countryCode;

          if (!statsMap.has(key)) {
            statsMap.set(key, {
              countryCode: key,
              countryName: loc.countryName,
              flag: getFlagEmoji(key),
              zone: loc.zone,
              zoneName: ZONE_CONFIG[loc.zone].name,
              orderCount: 0,
              revenue: 0,
              avgOrder: 0,
              topProducts: [],
            });
            productMap.set(key, new Map());
          }

          const stat = statsMap.get(key)!;
          stat.orderCount++;
          stat.revenue += order.total;

          const pMap = productMap.get(key)!;
          for (const item of order.items) {
            pMap.set(item.name, (pMap.get(item.name) ?? 0) + item.qty);
          }
        }

        // avgOrder hesapla + top ürünleri ekle
        for (const [code, stat] of statsMap) {
          stat.avgOrder = stat.orderCount > 0 ? Math.round(stat.revenue / stat.orderCount) : 0;
          const pMap = productMap.get(code)!;
          stat.topProducts = [...pMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));
        }

        return [...statsMap.values()].sort((a, b) => b.revenue - a.revenue);
      },

      getZoneStats: () => {
        const totals: Record<string, { count: number; revenue: number }> = {
          zone1: { count: 0, revenue: 0 },
          zone2: { count: 0, revenue: 0 },
          zone3: { count: 0, revenue: 0 },
          zone4: { count: 0, revenue: 0 },
        };
        const totalOrders = get().orders.length;

        for (const order of get().orders) {
          const z = order.location.zone;
          totals[z].count++;
          totals[z].revenue += order.total;
        }

        return (Object.keys(totals) as ShippingZone[]).map((zone) => ({
          zone,
          zoneName: ZONE_CONFIG[zone].name,
          orderCount: totals[zone].count,
          revenue: totals[zone].revenue,
          pct: totalOrders > 0 ? Math.round((totals[zone].count / totalOrders) * 100) : 0,
        }));
      },

      // Müşteri listesi — ülkeye göre filtrelenebilir
      getCustomersByCountry: (countryCode) => {
        const customerMap = new Map<string, {
          name: string; email: string; orders: number; total: number;
          lastOrder: string; countryCode: string; city: string;
        }>();

        for (const order of get().orders) {
          if (countryCode && order.location.countryCode !== countryCode) continue;

          const key = order.email;
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              name: order.customer,
              email: order.email,
              orders: 0,
              total: 0,
              lastOrder: order.dateISO,
              countryCode: order.location.countryCode,
              city: order.location.city,
            });
          }
          const c = customerMap.get(key)!;
          c.orders++;
          c.total += order.total;
          if (order.dateISO > c.lastOrder) c.lastOrder = order.dateISO;
        }

        return [...customerMap.values()].sort((a, b) => b.total - a.total);
      },
    }),
    { name: "hudai-orders-v2" }
  )
);
