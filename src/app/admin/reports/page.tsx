"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { exportCsv } from "@/lib/exportCsv";
import { useOrderStore } from "@/store/orderStore";
import { ZONE_CONFIG, type ShippingZone } from "@/lib/geoData";
import Link from "next/link";

// ── Mini grafikler ────────────────────────────────────────────────────────────

function MiniDonut({ slices, size = 100 }: {
  slices: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;
  let cumAngle = -Math.PI / 2;
  const paths = slices.map((sl) => {
    const angle = (sl.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: sl.color, label: sl.label, pct: Math.round((sl.value / total) * 100) };
  });
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="2" />)}
        <circle cx={cx} cy={cy} r={r * 0.52} fill="white" />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2F3B1A">{total}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="6" fill="#5A5E52">sipariş</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {paths.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
            <span className="text-[#5A5E52] truncate max-w-[80px]">{p.label}</span>
            <span className="font-bold text-[#2F3B1A] ml-1">%{p.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ZONE_COLORS: Record<ShippingZone, string> = { zone1: "#2F3B1A", zone2: "#556B2F", zone3: "#C49A3C", zone4: "#8A9E6A" };

// ── Veri ────────────────────────────────────────────────────────────────────

const monthlySales = [
  { month: "Eki", revenue: 8200,  orders: 42, cancelled: 3, newCustomers: 8  },
  { month: "Kas", revenue: 11400, orders: 58, cancelled: 4, newCustomers: 12 },
  { month: "Ara", revenue: 18900, orders: 97, cancelled: 5, newCustomers: 21 },
  { month: "Oca", revenue: 14300, orders: 73, cancelled: 3, newCustomers: 15 },
  { month: "Şub", revenue: 16700, orders: 85, cancelled: 4, newCustomers: 18 },
  { month: "Mar", revenue: 21500, orders: 110,cancelled: 4, newCustomers: 24 },
];

const topProducts = [
  { name: "Omega-3 Balık Yağı",     revenue: 12420, units: 36, category: "Takviye",  growth: +18 },
  { name: "B-12 Vitamin Sprey",      revenue: 9870,  units: 55, category: "Takviye",  growth: +31 },
  { name: "Organik Ham Bal",          revenue: 8730,  units: 35, category: "Organik",  growth: +5  },
  { name: "Probiyotik 50 Milyar CFU", revenue: 7980,  units: 20, category: "Takviye",  growth: +12 },
  { name: "Vitamin D3 + K2",          revenue: 6950,  units: 24, category: "Takviye",  growth: -4  },
  { name: "Magnezyum Bisglinat",      revenue: 6430,  units: 32, category: "Takviye",  growth: +22 },
  { name: "Organik Chia Tohumu",      revenue: 5680,  units: 44, category: "Organik",  growth: +8  },
  { name: "Saf Argan Yağı",           revenue: 4890,  units: 26, category: "Bakım",    growth: +15 },
  { name: "Kolajen Serum",            revenue: 4410,  units: 23, category: "Bakım",    growth: +28 },
  { name: "C Vitamini 1000mg",        revenue: 3810,  units: 24, category: "Takviye",  growth: -2  },
];

const categoryData = [
  { name: "Takviye Edici",     revenue: 47460, units: 191, color: "bg-green-600",   pct: 51 },
  { name: "Organik Gıda",      revenue: 14410, units: 79,  color: "bg-emerald-500", pct: 16 },
  { name: "Kişisel Bakım",     revenue: 9300,  units: 49,  color: "bg-teal-500",    pct: 10 },
  { name: "Paket / Özel",      revenue: 12830, units: 42,  color: "bg-amber-500",   pct: 14 },
  { name: "Diğer",             revenue: 7000,  units: 35,  color: "bg-slate-400",   pct: 9  },
];

const segmentData = [
  { segment: "VIP",    icon: "👑", customers: 2,  revenue: 14230, avgOrder: 7115, color: "border-amber-200 bg-amber-50 text-amber-700" },
  { segment: "Gümüş", icon: "🥈", customers: 3,  revenue: 7178,  avgOrder: 2393, color: "border-slate-200 bg-slate-50 text-slate-700" },
  { segment: "Sadık",  icon: "🔁", customers: 1,  revenue: 780,   avgOrder: 780,  color: "border-blue-200 bg-blue-50 text-blue-700" },
  { segment: "Yeni",   icon: "🌱", customers: 3,  revenue: 638,   avgOrder: 213,  color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { segment: "Pasif",  icon: "💤", customers: 1,  revenue: 520,   avgOrder: 520,  color: "border-red-200 bg-red-50 text-red-700" },
];

type Tab = "satis" | "urun" | "kategori" | "musteri" | "bolge";

const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue));

// ── Ana Sayfa ────────────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  const { getRegionalStats, getZoneStats } = useOrderStore();
  const [tab, setTab] = useState<Tab>("satis");
  const [selectedMonth, setSelectedMonth] = useState<typeof monthlySales[0] | null>(null);
  const [productSort, setProductSort] = useState<"revenue" | "units" | "growth">("revenue");

  const sortedProducts = [...topProducts].sort((a, b) => {
    if (productSort === "revenue") return b.revenue - a.revenue;
    if (productSort === "units")   return b.units - a.units;
    return b.growth - a.growth;
  });

  function handleExport() {
    if (tab === "satis") {
      exportCsv("aylik-satis-raporu", monthlySales.map((m) => ({
        "Ay": m.month, "Gelir (₺)": m.revenue, "Sipariş": m.orders,
        "İptal": m.cancelled, "Yeni Müşteri": m.newCustomers,
        "Ort. Sepet (₺)": Math.round(m.revenue / m.orders),
      })));
    } else if (tab === "urun") {
      exportCsv("urun-performans-raporu", sortedProducts.map((p) => ({
        "Ürün": p.name, "Kategori": p.category, "Gelir (₺)": p.revenue,
        "Adet": p.units, "Büyüme %": p.growth,
      })));
    } else if (tab === "kategori") {
      exportCsv("kategori-raporu", categoryData.map((c) => ({
        "Kategori": c.name, "Gelir (₺)": c.revenue, "Adet": c.units, "Pay %": c.pct,
      })));
    } else {
      exportCsv("musteri-segment-raporu", segmentData.map((s) => ({
        "Segment": s.segment, "Müşteri Sayısı": s.customers,
        "Toplam Gelir (₺)": s.revenue, "Ort. Sipariş (₺)": s.avgOrder,
      })));
    }
  }

  const totalRevenue = monthlySales.reduce((s, m) => s + m.revenue, 0);
  const totalOrders  = monthlySales.reduce((s, m) => s + m.orders, 0);
  const avgBasket    = Math.round(totalRevenue / totalOrders);
  const cancelRate   = ((monthlySales.reduce((s, m) => s + m.cancelled, 0) / totalOrders) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-5">

          {/* Başlık */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#2F3B1A]">Raporlar</h1>
              <p className="text-sm text-[#5A5E52]">Son 6 aylık performans özeti</p>
            </div>
            <button onClick={handleExport}
              className="flex items-center gap-2 text-sm border border-[#d8e4c8] bg-white text-[#5A5E52] px-3 py-2.5 rounded-xl hover:bg-[#F4F6F3] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Rapor İndir
            </button>
          </div>

          {/* KPI şeridi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Toplam Gelir",   value: totalRevenue.toLocaleString("tr-TR") + " ₺", change: "+18%", up: true },
              { label: "Toplam Sipariş", value: String(totalOrders),                          change: "+22%", up: true },
              { label: "Ort. Sepet",     value: avgBasket + " ₺",                             change: "+5%",  up: true },
              { label: "İptal Oranı",    value: "%" + cancelRate,                             change: "-1.1%",up: true },
            ].map((k) => (
              <div key={k.label} className="bg-white rounded-xl border border-[#d8e4c8] p-4">
                <p className="text-2xl font-bold text-[#2F3B1A]">{k.value}</p>
                <p className="text-[11px] text-[#5A5E52] mt-0.5">{k.label}</p>
                <span className="text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                  {k.change}
                </span>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-[#F4F6F3] rounded-xl p-1 border border-[#d8e4c8] w-fit">
            {([
              { key: "satis",    label: "📈 Satışlar" },
              { key: "urun",     label: "📦 Ürün Performansı" },
              { key: "kategori", label: "🏷️ Kategori" },
              { key: "musteri",  label: "👥 Müşteri Segmenti" },
              { key: "bolge",    label: "🌍 Bölge" },
            ] as { key: Tab; label: string }[]).map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key); setSelectedMonth(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  tab === t.key ? "bg-[#556B2F] text-white shadow-sm" : "text-[#5A5E52] hover:text-[#2F3B1A]"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── SATIŞ TAБИ ─────────────────────────────────────────── */}
          {tab === "satis" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Grafik */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-[#d8e4c8] p-5">
                <h3 className="text-sm font-bold text-[#2F3B1A] mb-1">Aylık Gelir</h3>
                <p className="text-[11px] text-[#5A5E52] mb-5">Çubuğa tıklayarak ay detayını görün</p>
                <div className="flex items-end gap-2 sm:gap-3 h-36">
                  {monthlySales.map((m) => {
                    const isSelected = selectedMonth?.month === m.month;
                    return (
                      <button key={m.month} onClick={() => setSelectedMonth(isSelected ? null : m)}
                        className="flex flex-col items-center gap-1.5 flex-1 group focus:outline-none">
                        <span className={`text-[9px] sm:text-[10px] font-semibold transition-colors ${isSelected ? "text-[#2F3B1A]" : "text-[#556B2F]"}`}>
                          {(m.revenue / 1000).toFixed(1)}k
                        </span>
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            isSelected ? "bg-[#2F3B1A] ring-2 ring-[#556B2F] ring-offset-1" : "bg-[#556B2F] group-hover:bg-[#2F3B1A]"
                          }`}
                          style={{ height: `${(m.revenue / maxRevenue) * 100}px` }}
                        />
                        <span className="text-[9px] sm:text-[10px] text-[#5A5E52]/60">{m.month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detay paneli */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#d8e4c8] p-5 flex flex-col gap-3">
                {selectedMonth ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#2F3B1A]">{selectedMonth.month} — Detay</h3>
                      <button onClick={() => setSelectedMonth(null)} className="text-[#9ca3af] hover:text-[#5A5E52] text-xs">✕ Kapat</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Gelir",          value: selectedMonth.revenue.toLocaleString("tr-TR") + " ₺", icon: "💰" },
                        { label: "Sipariş",        value: String(selectedMonth.orders),                          icon: "📦" },
                        { label: "İptal",          value: String(selectedMonth.cancelled),                       icon: "❌" },
                        { label: "Yeni Müşteri",   value: String(selectedMonth.newCustomers),                    icon: "🌱" },
                        { label: "Ort. Sepet",     value: Math.round(selectedMonth.revenue / selectedMonth.orders) + " ₺", icon: "🛒" },
                        { label: "İptal Oranı",    value: "%" + ((selectedMonth.cancelled / selectedMonth.orders) * 100).toFixed(1), icon: "📉" },
                      ].map((item) => (
                        <div key={item.label} className="bg-[#FAFAF7] rounded-xl border border-[#d8e4c8] p-3">
                          <span className="text-base">{item.icon}</span>
                          <p className="text-sm font-bold text-[#2F3B1A] mt-1">{item.value}</p>
                          <p className="text-[10px] text-[#5A5E52]">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => exportCsv(`${selectedMonth.month}-detay`, [{
                        "Ay": selectedMonth.month,
                        "Gelir (₺)": selectedMonth.revenue,
                        "Sipariş": selectedMonth.orders,
                        "İptal": selectedMonth.cancelled,
                        "Yeni Müşteri": selectedMonth.newCustomers,
                        "Ort. Sepet (₺)": Math.round(selectedMonth.revenue / selectedMonth.orders),
                      }])}
                      className="text-xs text-[#556B2F] font-semibold hover:text-[#2F3B1A] border border-[#d8e4c8] rounded-lg py-2 hover:bg-[#F4F6F3] transition-colors"
                    >
                      Bu ayı dışa aktar
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-[#2F3B1A]">Aylık Özet Tablosu</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="border-b border-[#d8e4c8] text-[#5A5E52] uppercase tracking-wide">
                            <th className="text-left pb-2">Ay</th>
                            <th className="text-right pb-2">Gelir</th>
                            <th className="text-right pb-2">Sipariş</th>
                            <th className="text-right pb-2">Ort.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlySales.map((m) => (
                            <tr key={m.month}
                              onClick={() => setSelectedMonth(m)}
                              className="border-b border-[#d8e4c8]/50 hover:bg-[#EAF0DC]/20 cursor-pointer transition-colors">
                              <td className="py-1.5 font-semibold text-[#2F3B1A]">{m.month}</td>
                              <td className="py-1.5 text-right font-bold text-[#556B2F]">{(m.revenue / 1000).toFixed(1)}k ₺</td>
                              <td className="py-1.5 text-right text-[#5A5E52]">{m.orders}</td>
                              <td className="py-1.5 text-right text-[#5A5E52]">{Math.round(m.revenue / m.orders)} ₺</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-[#5A5E52] text-center">Satıra veya çubuğa tıklayın</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ÜRÜN PERFORMANS TABİ ─────────────────────────────── */}
          {tab === "urun" && (
            <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
              {/* Sıralama */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#d8e4c8] bg-[#FAFAF7]">
                <h3 className="text-sm font-bold text-[#2F3B1A]">Ürün Performansı — Top {topProducts.length}</h3>
                <div className="flex gap-1">
                  {([
                    { key: "revenue", label: "Gelir" },
                    { key: "units",   label: "Adet" },
                    { key: "growth",  label: "Büyüme" },
                  ] as { key: typeof productSort; label: string }[]).map((s) => (
                    <button key={s.key} onClick={() => setProductSort(s.key)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        productSort === s.key ? "bg-[#556B2F] text-white" : "text-[#5A5E52] hover:bg-[#EAF0DC]"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-[#d8e4c8]/50">
                {sortedProducts.map((p, i) => {
                  const pct = (p.revenue / sortedProducts[0].revenue) * 100;
                  return (
                    <div key={p.name} className="flex items-center gap-3 px-5 py-3 hover:bg-[#EAF0DC]/10 transition-colors group">
                      <span className="w-6 h-6 bg-[#EAF0DC] text-[#556B2F] text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-[#2F3B1A] truncate">{p.name}</p>
                          <span className="text-[9px] bg-[#EAF0DC] text-[#556B2F] px-1.5 py-0.5 rounded-full font-medium shrink-0">{p.category}</span>
                        </div>
                        <div className="h-1.5 bg-[#EAF0DC] rounded-full overflow-hidden">
                          <div className="h-full bg-[#556B2F] rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-right">
                        <div>
                          <p className="text-xs font-bold text-[#2F3B1A]">{p.revenue.toLocaleString("tr-TR")} ₺</p>
                          <p className="text-[10px] text-[#5A5E52]">{p.units} adet</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.growth > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                        }`}>
                          {p.growth > 0 ? "+" : ""}{p.growth}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── KATEGORİ TABİ ───────────────────────────────────── */}
          {tab === "kategori" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Pasta görsel */}
              <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5">
                <h3 className="text-sm font-bold text-[#2F3B1A] mb-4">Kategori Dağılımı</h3>
                <div className="flex flex-col gap-3">
                  {categoryData.map((c) => (
                    <div key={c.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#2F3B1A]">{c.name}</span>
                        <span className="text-xs text-[#5A5E52]">{c.pct}%</span>
                      </div>
                      <div className="h-3 bg-[#EAF0DC] rounded-full overflow-hidden">
                        <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablo */}
              <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-[10px] font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3 border-b border-[#d8e4c8] bg-[#FAFAF7]">
                  <span>Kategori</span>
                  <span className="text-right">Gelir</span>
                  <span className="text-right">Adet</span>
                  <span className="text-right">Pay</span>
                </div>
                {categoryData.map((c) => (
                  <div key={c.name} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-5 py-3 border-b border-[#d8e4c8]/50 last:border-0 hover:bg-[#EAF0DC]/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span className="text-xs font-semibold text-[#2F3B1A]">{c.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#556B2F] text-right">{c.revenue.toLocaleString("tr-TR")} ₺</span>
                    <span className="text-xs text-[#5A5E52] text-right">{c.units}</span>
                    <span className="text-xs font-semibold text-[#2F3B1A] text-right">%{c.pct}</span>
                  </div>
                ))}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-5 py-3 bg-[#EAF0DC]/30 border-t border-[#d8e4c8]">
                  <span className="text-xs font-bold text-[#2F3B1A]">Toplam</span>
                  <span className="text-xs font-bold text-[#556B2F] text-right">{categoryData.reduce((s,c)=>s+c.revenue,0).toLocaleString("tr-TR")} ₺</span>
                  <span className="text-xs font-bold text-[#2F3B1A] text-right">{categoryData.reduce((s,c)=>s+c.units,0)}</span>
                  <span className="text-xs font-bold text-[#2F3B1A] text-right">%100</span>
                </div>
              </div>
            </div>
          )}

          {/* ── MÜŞTERİ SEGMENT TABİ ────────────────────────────── */}
          {tab === "musteri" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {segmentData.map((s) => (
                  <div key={s.segment} className={`rounded-2xl border p-5 ${s.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p className="text-sm font-bold">{s.segment} Üyeler</p>
                        <p className="text-[11px] opacity-70">{s.customers} müşteri</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className="text-xs opacity-60">Toplam Gelir</p>
                        <p className="text-base font-bold">{s.revenue.toLocaleString("tr-TR")} ₺</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-60">Ort. Sipariş</p>
                        <p className="text-base font-bold">{s.avgOrder.toLocaleString("tr-TR")} ₺</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-white/40 rounded-full overflow-hidden">
                      <div className="h-full bg-current opacity-60 rounded-full"
                        style={{ width: `${(s.revenue / segmentData[0].revenue) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Özet tablo */}
              <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
                <div className="grid grid-cols-5 text-[10px] font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3 border-b border-[#d8e4c8] bg-[#FAFAF7]">
                  <span>Segment</span>
                  <span className="text-center">Müşteri</span>
                  <span className="text-right">Toplam Gelir</span>
                  <span className="text-right">Ort. Sipariş</span>
                  <span className="text-right">Gelir Payı</span>
                </div>
                {segmentData.map((s) => {
                  const totalRev = segmentData.reduce((acc, x) => acc + x.revenue, 0);
                  const share = ((s.revenue / totalRev) * 100).toFixed(1);
                  return (
                    <div key={s.segment} className="grid grid-cols-5 items-center px-5 py-3 border-b border-[#d8e4c8]/50 last:border-0 hover:bg-[#EAF0DC]/10 transition-colors">
                      <span className="text-xs font-bold text-[#2F3B1A]">{s.icon} {s.segment}</span>
                      <span className="text-xs text-center text-[#5A5E52]">{s.customers}</span>
                      <span className="text-xs font-bold text-[#556B2F] text-right">{s.revenue.toLocaleString("tr-TR")} ₺</span>
                      <span className="text-xs text-[#5A5E52] text-right">{s.avgOrder.toLocaleString("tr-TR")} ₺</span>
                      <span className="text-xs font-semibold text-[#2F3B1A] text-right">%{share}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── BÖLGE TABİ ──────────────────────────────────────── */}
          {tab === "bolge" && (() => {
            const regionalStats = getRegionalStats();
            const zoneStats = getZoneStats();
            const totalRevBolge = zoneStats.reduce((s, z) => s + z.revenue, 0);

            // Donut slices
            const donutSlices = (Object.keys(ZONE_COLORS) as ShippingZone[]).map((zk) => {
              const cfg = ZONE_CONFIG[zk];
              const zs = zoneStats.find((z) => z.zone === zk);
              return { label: cfg.name, value: zs?.orderCount ?? 0, color: ZONE_COLORS[zk] };
            });

            // Top 7 ülke
            const topCountries = [...regionalStats]
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 7);

            return (
              <div className="flex flex-col gap-5">
                {/* 4 Bölge KPI kartı */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(ZONE_COLORS) as ShippingZone[]).map((zk) => {
                    const cfg = ZONE_CONFIG[zk];
                    const zs = zoneStats.find((z) => z.zone === zk);
                    const pct = totalRevBolge > 0 ? Math.round(((zs?.revenue ?? 0) / totalRevBolge) * 100) : 0;
                    return (
                      <div key={zk} className="bg-white rounded-xl border border-[#d8e4c8] p-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ZONE_COLORS[zk] }} />
                          <p className="text-[11px] font-semibold text-[#5A5E52] truncate">{cfg.name}</p>
                        </div>
                        <p className="text-xl font-bold text-[#2F3B1A]">{(zs?.revenue ?? 0).toLocaleString("tr-TR")} ₺</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[11px] text-[#5A5E52]">{zs?.orderCount ?? 0} sipariş</p>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#EAF0DC] text-[#556B2F]">%{pct}</span>
                        </div>
                        <div className="mt-2 h-1 bg-[#EAF0DC] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ZONE_COLORS[zk] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grafik + Tablo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Donut */}
                  <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5">
                    <h3 className="text-sm font-bold text-[#2F3B1A] mb-4">Bölge Dağılımı</h3>
                    <MiniDonut slices={donutSlices} size={110} />
                  </div>

                  {/* Top ülkeler */}
                  <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[#d8e4c8] bg-[#FAFAF7]">
                      <h3 className="text-sm font-bold text-[#2F3B1A]">En Çok Sipariş Gelen Ülkeler</h3>
                    </div>
                    <div className="divide-y divide-[#d8e4c8]/50">
                      {topCountries.length === 0 ? (
                        <p className="text-xs text-[#5A5E52] px-5 py-4">Henüz sipariş yok.</p>
                      ) : topCountries.map((c, i) => (
                        <div key={c.countryCode} className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#EAF0DC]/10 transition-colors">
                          <span className="text-[11px] font-bold text-[#5A5E52] w-4">{i + 1}</span>
                          <span className="text-base">{c.flag}</span>
                          <span className="flex-1 text-xs font-semibold text-[#2F3B1A] truncate">{c.countryName}</span>
                          <span className="text-xs font-bold text-[#556B2F]">{c.revenue.toLocaleString("tr-TR")} ₺</span>
                          <span className="text-[10px] text-[#5A5E52] w-14 text-right">{c.orderCount} sipariş</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Link to full page */}
                <Link
                  href="/admin/regions"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#d8e4c8] bg-white text-sm font-semibold text-[#556B2F] hover:bg-[#EAF0DC]/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  Detaylı Bölgesel Analitik →
                </Link>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
