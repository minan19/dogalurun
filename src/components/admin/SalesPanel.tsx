"use client";

import { useAdminStore } from "@/store/adminStore";
import { mockOrders, filterByPeriod, parseDateISO, TODAY, type Order } from "@/data/orders";

// Ürün adına göre kategori tahmini
function guessCategory(name: string): "Takviye" | "Organik" | "Bakım" {
  const n = name.toLowerCase();
  if (n.includes("kolajen") || n.includes("argan") || n.includes("serum") || n.includes("hyalüronik")) return "Bakım";
  if (n.includes("kefir") || n.includes("chia") || n.includes("bal") || n.includes("zerdeçal") || n.includes("spirulina")) return "Organik";
  return "Takviye";
}

function revenueOf(o: Order) {
  return o.status !== "cancelled" ? o.total : 0;
}

// Çubuk grafik için dönem bazlı gruplama
type BarBucket = { label: string; revenue: number; orders: number };

function buildBuckets(periodOrders: Order[], period: string): BarBucket[] {
  if (period === "7") {
    // Son 7 gün — 1 gün / çubuk
    const DAY_LABELS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(TODAY);
      d.setDate(d.getDate() - (6 - i));
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const dayOrders = periodOrders.filter(o => o.dateISO === iso);
      return {
        label: DAY_LABELS[d.getDay()],
        revenue: dayOrders.reduce((s, o) => s + revenueOf(o), 0),
        orders: dayOrders.length,
      };
    });
  }

  if (period === "20") {
    // Son 20 gün — 4 grup x 5 gün
    return Array.from({ length: 4 }, (_, i) => {
      const endOffset = 19 - i * 5;
      const startOffset = endOffset - 4;
      const start = new Date(TODAY); start.setDate(start.getDate() - endOffset);
      const end = new Date(TODAY); end.setDate(end.getDate() - startOffset);
      const groupOrders = periodOrders.filter(o => {
        const t = parseDateISO(o.dateISO).getTime();
        return t >= start.getTime() && t <= end.getTime();
      });
      return {
        label: `${start.getDate()}/${start.getMonth() + 1}`,
        revenue: groupOrders.reduce((s, o) => s + revenueOf(o), 0),
        orders: groupOrders.length,
      };
    });
  }

  if (period === "30") {
    // Bu ay — 4 hafta
    return Array.from({ length: 4 }, (_, i) => {
      const endOffset = 29 - i * 7;
      const startOffset = Math.min(endOffset + 6, 29);
      const start = new Date(TODAY); start.setDate(start.getDate() - startOffset);
      const end = new Date(TODAY); end.setDate(end.getDate() - endOffset);
      const groupOrders = periodOrders.filter(o => {
        const t = parseDateISO(o.dateISO).getTime();
        return t >= start.getTime() && t <= end.getTime();
      });
      return {
        label: `H${4 - i}`,
        revenue: groupOrders.reduce((s, o) => s + revenueOf(o), 0),
        orders: groupOrders.length,
      };
    });
  }

  // "all" — son 3 ay
  const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - (2 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const groupOrders = periodOrders.filter(o => {
      const pd = parseDateISO(o.dateISO);
      return pd.getMonth() === m && pd.getFullYear() === y;
    });
    return {
      label: MONTHS[m],
      revenue: groupOrders.reduce((s, o) => s + revenueOf(o), 0),
      orders: groupOrders.length,
    };
  });
}

// Dönemin bir önceki eşdeğer aralığı (karşılaştırma için)
function prevPeriodOrders(period: string): Order[] {
  if (period === "all") return [];
  const days = parseInt(period);
  return mockOrders.filter(o => {
    const diff = (TODAY.getTime() - parseDateISO(o.dateISO).getTime()) / 86400000;
    return diff > days && diff <= days * 2;
  });
}

const PERIOD_LABELS: Record<string, string> = {
  "7": "Son 7 Gün",
  "20": "Son 20 Gün",
  "30": "Bu Ay",
  "all": "Tüm Zamanlar",
};

export function SalesPanel() {
  const { period } = useAdminStore();

  const periodOrders = filterByPeriod(mockOrders, period);
  const prevOrders   = prevPeriodOrders(period);

  const revenue     = periodOrders.reduce((s, o) => s + revenueOf(o), 0);
  const orderCount  = periodOrders.filter(o => o.status !== "cancelled").length;
  const prevRevenue = prevOrders.reduce((s, o) => s + revenueOf(o), 0);
  const revChange   = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : null;

  const buckets = buildBuckets(periodOrders, period);
  const maxRev  = Math.max(...buckets.map(b => b.revenue), 1);

  // Kategori dağılımı
  const catRevenue: Record<"Takviye" | "Organik" | "Bakım", number> = { Takviye: 0, Organik: 0, Bakım: 0 };
  periodOrders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items.forEach(item => {
      const cat = guessCategory(item.name);
      catRevenue[cat] += item.qty * item.price;
    });
  });
  const totalCatRev = Object.values(catRevenue).reduce((s, v) => s + v, 0) || 1;
  const categories = (Object.entries(catRevenue) as [string, number][])
    .map(([name, rev]) => ({ name, pct: Math.round((rev / totalCatRev) * 100) }))
    .sort((a, b) => b.pct - a.pct);
  const catColors: Record<string, string> = { Takviye: "#556B2F", Organik: "#7a9a40", Bakım: "#C49A3C" };

  // En çok satan ürünler
  const productMap: Record<string, number> = {};
  periodOrders.filter(o => o.status !== "cancelled").forEach(o => {
    o.items.forEach(item => {
      productMap[item.name] = (productMap[item.name] || 0) + item.qty;
    });
  });
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, qty]) => ({ name, qty }));

  // Emoji haritası
  const productEmoji: Record<string, string> = {
    "Omega-3 1000mg": "🐟", "Omega-3": "🐟", "D Vitamini": "☀️", "D3K2": "☀️",
    "Magnezyum B6": "💊", "Magnezyum": "💊", "Probiyotik": "🧫", "Çinko": "💊",
    "Multivitamin": "💊", "B12": "💊", "Kefir": "🥛", "Spirulina": "🌿",
    "Kolajen": "✨", "Hyalüronik Asit": "✨", "Ashwagandha": "🌿",
    "C Vitamini": "🍋",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dönem başlığı */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#2F3B1A]">
          {PERIOD_LABELS[period]} Özeti
        </h3>
        <span className="text-[10px] text-[#5A5E52]/50 bg-[#EAF0DC] px-2 py-0.5 rounded-full">
          canlı
        </span>
      </div>

      {/* Özet metrikler */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#EAF0DC] rounded-xl p-3">
          <p className="text-[10px] text-[#5A5E52] mb-0.5">Sipariş</p>
          <p className="text-xl font-bold text-[#556B2F]">{orderCount}</p>
        </div>
        <div className="bg-[#EAF0DC] rounded-xl p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-[#5A5E52] mb-0.5">Gelir</p>
              <p className="text-base font-bold text-[#2F3B1A] leading-tight">
                {revenue.toLocaleString("tr-TR")}₺
              </p>
            </div>
            {revChange !== null && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${
                revChange >= 0 ? "text-green-700 bg-green-100" : "text-red-600 bg-red-50"
              }`}>
                {revChange >= 0 ? "+" : ""}{revChange}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Satış grafiği */}
      <div>
        <p className="text-[11px] text-[#5A5E52]/60 mb-2.5">Gelir Grafiği</p>
        <div className="flex items-end gap-1 h-20">
          {buckets.map((b, i) => {
            const h = maxRev > 0 ? Math.max((b.revenue / maxRev) * 64, b.revenue > 0 ? 4 : 0) : 0;
            const isLast = i === buckets.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 group relative">
                {/* Tooltip */}
                {b.revenue > 0 && (
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#2F3B1A] text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {b.revenue.toLocaleString("tr-TR")}₺
                  </div>
                )}
                <div
                  className={`w-full rounded-t-sm transition-all ${isLast ? "bg-[#556B2F]" : "bg-[#EAF0DC]"}`}
                  style={{ height: `${h}px`, minHeight: b.revenue > 0 ? "3px" : "0" }}
                />
                <span className="text-[9px] text-[#5A5E52]/50">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#d8e4c8]" />

      {/* Popüler Kategoriler */}
      <div>
        <h3 className="text-sm font-bold text-[#2F3B1A] mb-3">Kategori Dağılımı</h3>
        {totalCatRev === 1 ? (
          <p className="text-[11px] text-[#5A5E52]/50">Bu dönemde satış yok.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {categories.map((c) => (
              <div key={c.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A5E52] font-medium">{c.name}</span>
                  <span className="font-bold text-[#2F3B1A]">{c.pct}%</span>
                </div>
                <div className="h-1.5 bg-[#EAF0DC] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${c.pct}%`, backgroundColor: catColors[c.name] }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#d8e4c8]" />

      {/* En Çok Satanlar */}
      <div>
        <h3 className="text-sm font-bold text-[#2F3B1A] mb-3">En Çok Satanlar</h3>
        {topProducts.length === 0 ? (
          <p className="text-[11px] text-[#5A5E52]/50">Bu dönemde satış yok.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {topProducts.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#EAF0DC] rounded-lg flex items-center justify-center text-base shrink-0">
                  {productEmoji[item.name] ?? "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#2F3B1A] truncate">{item.name}</p>
                </div>
                <span className="text-xs font-bold text-[#556B2F] shrink-0">{item.qty} adet</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#d8e4c8]" />

      {/* Özet notu */}
      <div>
        <h3 className="text-sm font-bold text-[#2F3B1A] mb-2">Dönem Notu</h3>
        <p className="text-[11px] text-[#5A5E52] leading-relaxed">
          {orderCount > 0
            ? `${PERIOD_LABELS[period]} içinde ${orderCount} sipariş tamamlandı, toplam ${revenue.toLocaleString("tr-TR")} ₺ gelir elde edildi.`
            : "Bu dönemde tamamlanan sipariş bulunmuyor."}
          {revChange !== null && revChange > 0 && ` Önceki döneme göre %${revChange} artış var.`}
          {revChange !== null && revChange < 0 && ` Önceki döneme göre %${Math.abs(revChange)} düşüş var.`}
        </p>
      </div>
    </div>
  );
}
