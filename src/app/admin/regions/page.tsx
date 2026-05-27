"use client";

import { useState, useRef } from "react";
import { useOrderStore } from "@/store/orderStore";
import { ZONE_CONFIG, type ShippingZone } from "@/lib/geoData";
import { buildReportData, exportExcel, exportPDF, exportDetailedCSV } from "@/lib/reportExport";

function today() { return new Date().toISOString().slice(0, 10); }

// ── Yatay çubuk grafik bileşeni ───────────────────────────────────────────────
function HBarChart({ rows, valueLabel = "₺", maxBarWidth = 200 }: {
  rows: { label: string; value: number; color?: string; flag?: string }[];
  valueLabel?: string;
  maxBarWidth?: number;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => {
        const pct = (r.value / max) * 100;
        return (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-24 truncate text-right text-[#5A5E52] shrink-0 flex items-center justify-end gap-1">
              {r.flag && <span>{r.flag}</span>}
              <span className="truncate">{r.label}</span>
            </div>
            <div className="flex-1 max-w-[200px] h-5 bg-[#EAF0DC] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: r.color ?? "linear-gradient(to right, #2F3B1A, #556B2F)",
                }}
              />
            </div>
            <span className="text-[#556B2F] font-semibold shrink-0 w-24 text-left">
              {r.value.toLocaleString("tr-TR")} {valueLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Pasta grafik (SVG donut) ──────────────────────────────────────────────────
function DonutChart({ slices, size = 120 }: {
  slices: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  const r = size / 2 - 12;
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
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    return { d, color: sl.color, label: sl.label, pct: Math.round((sl.value / total) * 100) };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="2" />
        ))}
        {/* Merkez delik */}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2F3B1A">
          {total.toLocaleString()}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7" fill="#5A5E52">sipariş</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {paths.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} />
            <span className="text-[#5A5E52] truncate max-w-[90px]">{p.label}</span>
            <span className="font-bold text-[#2F3B1A] ml-auto">%{p.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ZONE_COLORS = ["#2F3B1A", "#556B2F", "#C49A3C", "#8A9E6A"];

// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminRegionsPage() {
  const { getRegionalStats, getZoneStats, getCustomersByCountry, orders } = useOrderStore();
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const regionalStats = getRegionalStats();
  const zoneStats = getZoneStats();
  const allCustomers = getCustomersByCountry();

  const totalRevenue = regionalStats.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = regionalStats.reduce((s, r) => s + r.orderCount, 0);

  const filteredStats = selectedZone ? regionalStats.filter((r) => r.zone === selectedZone) : regionalStats;
  const filteredRevenue = filteredStats.reduce((s, r) => s + r.revenue, 0);
  const filteredOrders = filteredStats.reduce((s, r) => s + r.orderCount, 0);
  const filteredCountryCodes = selectedZone ? new Set(filteredStats.map((r) => r.countryCode)) : null;

  const customers = (() => {
    const list = getCustomersByCountry(selectedCountry ?? undefined);
    if (!filteredCountryCodes) return list;
    return list.filter((c) => filteredCountryCodes.has(c.countryCode));
  })();

  const selectedRegion = selectedCountry ? regionalStats.find((r) => r.countryCode === selectedCountry) : null;

  function toggleZone(zone: ShippingZone) {
    setSelectedZone((prev) => (prev === zone ? null : zone));
    setSelectedCountry(null);
  }
  function toggleCountry(code: string) {
    setSelectedCountry((prev) => (prev === code ? null : code));
  }

  // ── Rapor oluştur ──────────────────────────────────────────────────────────
  function getReportData() {
    return buildReportData(orders, zoneStats, regionalStats);
  }

  async function handleExport(format: string) {
    setExporting(format);
    try {
      const data = getReportData();
      const filename = `hudaisifa-bolge-raporu-${today()}`;
      if (format === "excel") await exportExcel(data, filename);
      else if (format === "pdf") await exportPDF(data, filename);
      else if (format === "csv-all") exportDetailedCSV(data, "all");
      else if (format === "csv-countries") exportDetailedCSV(data, "countries");
      else if (format === "csv-products") exportDetailedCSV(data, "products");
      else if (format === "csv-customers") exportDetailedCSV(data, "customers");
      else if (format === "print") handlePrint();
    } finally {
      setExporting(null);
      setShowExportPanel(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  // ── Grafik verileri ───────────────────────────────────────────────────────
  const topCountryBars = [...regionalStats]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
    .map((r) => ({ label: r.countryName, value: r.revenue, flag: r.flag }));

  const topProductBars = (() => {
    const pMap = new Map<string, number>();
    for (const r of regionalStats) {
      for (const p of r.topProducts) {
        pMap.set(p.name, (pMap.get(p.name) ?? 0) + p.count);
      }
    }
    return [...pMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ label: name, value: count }));
  })();

  const donutSlices = zoneStats.map((z, i) => ({
    label: z.zoneName,
    value: z.orderCount,
    color: ZONE_COLORS[i] ?? "#8A9E6A",
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 print:p-2">

      {/* Başlık + Rapor Butonu */}
      <div className="flex items-start justify-between gap-4 flex-wrap print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3B1A]">Bölgesel Analitik</h1>
          <p className="text-sm text-[#5A5E52] mt-1">Ülke ve kargo bölgesi bazında satış performansı</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowExportPanel((v) => !v)}
            className="flex items-center gap-2 bg-[#2F3B1A] hover:bg-[#3d4e22] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Rapor Al
            <svg className={`w-3.5 h-3.5 transition-transform ${showExportPanel ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </button>

          {showExportPanel && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#d8e4c8] z-50 overflow-hidden">
              <div className="px-4 py-3 bg-[#F4F6F3] border-b border-[#d8e4c8]">
                <p className="text-xs font-bold text-[#2F3B1A] uppercase tracking-wide">Rapor Formatı Seç</p>
                <p className="text-[11px] text-[#5A5E52] mt-0.5">Bölge · Ülke · Müşteri · Ürün · Kârlılık</p>
              </div>

              {/* Excel */}
              <div className="p-2">
                <p className="text-[10px] font-semibold text-[#5A5E52] uppercase tracking-wide px-2 py-1">Profesyonel Raporlar</p>
                <ExportBtn icon="📊" label="Excel (.xlsx)" sub="5 sayfa: Özet · Ülkeler · Ürün Kârlılığı · Müşteri Detay · Müşteri Özeti" format="excel" exporting={exporting} onExport={handleExport} highlight />
                <ExportBtn icon="📄" label="PDF (.pdf)" sub="3 sayfalı · Grafikli · Başlıklı · Sayfa numaralı" format="pdf" exporting={exporting} onExport={handleExport} highlight />
                <ExportBtn icon="🖨️" label="Yazdır / PDF Kaydet" sub="Tarayıcı baskı diyaloğu · A4 yatay" format="print" exporting={exporting} onExport={handleExport} />

                <div className="border-t border-[#d8e4c8] my-1.5" />
                <p className="text-[10px] font-semibold text-[#5A5E52] uppercase tracking-wide px-2 py-1">CSV Dosyaları</p>
                <ExportBtn icon="🌍" label="Bölge + Ülke Özeti" sub="Kargo bölgeleri ve ülke satış verileri" format="csv-countries" exporting={exporting} onExport={handleExport} />
                <ExportBtn icon="💊" label="Ürün Kârlılık Raporu" sub="Ciro · Maliyet · Brüt Kâr · Marj" format="csv-products" exporting={exporting} onExport={handleExport} />
                <ExportBtn icon="👥" label="Müşteri — Ürün Detayı" sub="Her satır: 1 müşteri × 1 ürün × sipariş" format="csv-customers" exporting={exporting} onExport={handleExport} />
                <ExportBtn icon="📦" label="Tüm Veriler (4 CSV)" sub="Tüm raporlar tek seferde indirilir" format="csv-all" exporting={exporting} onExport={handleExport} />
              </div>

              <div className="px-4 py-2 bg-[#F4F6F3] border-t border-[#d8e4c8]">
                <p className="text-[10px] text-[#5A5E52]">📅 Dosya adında tarih otomatik eklenir · Excel Türkçe UTF-8 uyumlu</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bölge Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 print:hidden">
        <button onClick={() => { setSelectedZone(null); setSelectedCountry(null); }}
          className={`rounded-xl p-4 text-left transition-all ring-2 ${selectedZone === null ? "bg-[#2F3B1A] text-white ring-[#2F3B1A] shadow-lg scale-[1.02]" : "bg-white text-[#2F3B1A] ring-transparent border border-[#d8e4c8] hover:ring-[#556B2F]/40 hover:shadow-md"}`}>
          <div className="flex items-center gap-2 mb-2"><span className="text-lg">🌐</span><span className="text-sm font-semibold">Tüm Dünya</span></div>
          <p className="text-2xl font-bold">{totalOrders}</p>
          <p className={`text-xs mt-0.5 ${selectedZone === null ? "text-white/60" : "text-[#5A5E52]"}`}>toplam sipariş</p>
          <p className={`text-sm font-semibold mt-1 ${selectedZone === null ? "text-[#C49A3C]" : "text-[#556B2F]"}`}>{totalRevenue.toLocaleString("tr-TR")} ₺</p>
        </button>
        {zoneStats.map((z, i) => {
          const cfg = ZONE_CONFIG[z.zone];
          const isActive = selectedZone === z.zone;
          return (
            <button key={z.zone} onClick={() => toggleZone(z.zone)}
              className={`rounded-xl p-4 text-left transition-all ring-2 ${isActive ? "bg-[#2F3B1A] text-white ring-[#2F3B1A] shadow-lg scale-[1.02]" : "bg-white text-[#2F3B1A] ring-transparent border border-[#d8e4c8] hover:ring-[#556B2F]/40 hover:shadow-md"}`}>
              <div className="flex items-center gap-2 mb-2"><span className="text-lg">{cfg.flag}</span><span className="text-sm font-semibold truncate">{z.zoneName}</span></div>
              <p className="text-2xl font-bold">{z.orderCount}</p>
              <p className={`text-xs mt-0.5 ${isActive ? "text-white/60" : "text-[#5A5E52]"}`}>sipariş · %{z.pct}</p>
              <p className={`text-sm font-semibold mt-1 ${isActive ? "text-[#C49A3C]" : "text-[#556B2F]"}`}>{z.revenue.toLocaleString("tr-TR")} ₺</p>
            </button>
          );
        })}
      </div>

      {/* GRAFİKLER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bölge dağılımı donut */}
        <div className="bg-white rounded-xl border border-[#d8e4c8] p-5">
          <h3 className="text-sm font-semibold text-[#2F3B1A] mb-4">Bölge Dağılımı</h3>
          <DonutChart slices={donutSlices} size={130} />
        </div>

        {/* Ülke bazında ciro */}
        <div className="bg-white rounded-xl border border-[#d8e4c8] p-5">
          <h3 className="text-sm font-semibold text-[#2F3B1A] mb-4">Ülke Bazında Ciro (₺)</h3>
          <HBarChart rows={topCountryBars} valueLabel="₺" />
        </div>

        {/* En çok satan ürünler */}
        <div className="bg-white rounded-xl border border-[#d8e4c8] p-5">
          <h3 className="text-sm font-semibold text-[#2F3B1A] mb-4">En Çok Satan Ürünler (adet)</h3>
          <HBarChart rows={topProductBars} valueLabel="adet" />
        </div>
      </div>

      {/* Ülke Tablosu */}
      <div className="bg-white rounded-xl border border-[#d8e4c8] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#d8e4c8] flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold text-[#2F3B1A]">Ülke Bazında Satışlar</h2>
          <p className="text-xs text-[#5A5E52] print:hidden">Satıra tıklayarak müşteri listesini filtrele</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F6F3]">
              <tr>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Ülke</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Bölge</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Siparişler</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Ciro</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Ort. Sipariş</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">En Çok Satan</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Pay</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((r, i) => {
                const pct = totalRevenue > 0 ? Math.round((r.revenue / totalRevenue) * 100) : 0;
                const isSelected = selectedCountry === r.countryCode;
                return (
                  <tr key={r.countryCode} onClick={() => toggleCountry(r.countryCode)}
                    className={`border-t border-[#d8e4c8]/60 cursor-pointer transition-colors print:cursor-default ${isSelected ? "bg-[#EAF0DC] hover:bg-[#dcebc8]" : i % 2 === 0 ? "bg-white hover:bg-[#F4F6F3]" : "bg-[#FAFAF7] hover:bg-[#F4F6F3]"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{r.flag}</span>
                        <span className="font-medium text-[#2F3B1A]">{r.countryName}</span>
                        <span className="text-[10px] text-[#5A5E52]/60 font-mono">{r.countryCode}</span>
                        {isSelected && <span className="text-[10px] bg-[#556B2F] text-white px-1.5 py-0.5 rounded-full print:hidden">seçili</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5E52]">{r.zoneName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#2F3B1A]">{r.orderCount}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#556B2F]">{r.revenue.toLocaleString("tr-TR")} ₺</td>
                    <td className="px-4 py-3 text-right text-[#5A5E52]">{r.avgOrder.toLocaleString("tr-TR")} ₺</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.topProducts.slice(0, 2).map((p) => (
                          <span key={p.name} className="text-[10px] bg-[#EAF0DC] text-[#2F3B1A] px-1.5 py-0.5 rounded-full whitespace-nowrap">{p.name} ×{p.count}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-[#d8e4c8] rounded-full overflow-hidden print:hidden">
                          <div className="h-full bg-[#556B2F] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#5A5E52] w-6 text-right">%{pct}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#F4F6F3] border-t-2 border-[#d8e4c8]">
              <tr>
                <td className="px-5 py-2.5 text-xs font-bold text-[#2F3B1A]">TOPLAM</td>
                <td className="px-4 py-2.5 text-xs text-[#5A5E52]">{filteredStats.length} ülke</td>
                <td className="px-4 py-2.5 text-right text-xs font-bold text-[#2F3B1A]">{filteredOrders}</td>
                <td className="px-4 py-2.5 text-right text-xs font-bold text-[#556B2F]">{filteredRevenue.toLocaleString("tr-TR")} ₺</td>
                <td className="px-4 py-2.5 text-right text-xs text-[#5A5E52]">{filteredOrders > 0 ? Math.round(filteredRevenue / filteredOrders).toLocaleString("tr-TR") : 0} ₺</td>
                <td colSpan={2} className="px-4 py-2.5 text-right text-xs text-[#5A5E52]">{totalRevenue > 0 ? Math.round((filteredRevenue / totalRevenue) * 100) : 0}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Müşteri Listesi */}
      <div className="bg-white rounded-xl border border-[#d8e4c8] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#d8e4c8] flex items-center gap-2 flex-wrap">
          <h2 className="font-semibold text-[#2F3B1A]">Müşteriler</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedZone && <span className="text-xs bg-[#2F3B1A] text-white px-2 py-0.5 rounded-full font-medium">{ZONE_CONFIG[selectedZone].flag} {ZONE_CONFIG[selectedZone].name}</span>}
            {selectedRegion && <span className="text-xs bg-[#EAF0DC] text-[#556B2F] px-2 py-0.5 rounded-full font-medium">{selectedRegion.flag} {selectedRegion.countryName}</span>}
            {!selectedZone && !selectedRegion && <span className="text-xs text-[#5A5E52]">Tüm ülkeler</span>}
            {(selectedZone || selectedRegion) && (
              <button onClick={() => { setSelectedZone(null); setSelectedCountry(null); }} className="text-xs text-[#5A5E52] hover:text-[#2F3B1A] underline">Tümünü göster</button>
            )}
          </div>
          <span className="ml-auto text-xs text-[#5A5E52]">{customers.length} kayıt</span>
        </div>
        {selectedRegion && (
          <div className="px-5 py-3 bg-[#F4F6F3] border-b border-[#d8e4c8] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><p className="text-[10px] text-[#5A5E52] uppercase tracking-wide">Sipariş</p><p className="text-lg font-bold text-[#2F3B1A]">{selectedRegion.orderCount}</p></div>
            <div><p className="text-[10px] text-[#5A5E52] uppercase tracking-wide">Toplam Ciro</p><p className="text-lg font-bold text-[#556B2F]">{selectedRegion.revenue.toLocaleString("tr-TR")} ₺</p></div>
            <div><p className="text-[10px] text-[#5A5E52] uppercase tracking-wide">Ort. Sepet</p><p className="text-lg font-bold text-[#2F3B1A]">{selectedRegion.avgOrder.toLocaleString("tr-TR")} ₺</p></div>
            <div><p className="text-[10px] text-[#5A5E52] uppercase tracking-wide">En Çok Satan</p><p className="text-sm font-semibold text-[#2F3B1A] truncate">{selectedRegion.topProducts[0]?.name ?? "—"}</p></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F6F3]">
              <tr>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Müşteri</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Konum</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Siparişler</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Toplam Harcama</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Son Sipariş</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 25).map((c, i) => {
                const flag = regionalStats.find((r) => r.countryCode === c.countryCode)?.flag ?? "🌍";
                return (
                  <tr key={c.email} className={`border-t border-[#d8e4c8]/60 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAF7]"}`}>
                    <td className="px-5 py-3 text-xs text-[#5A5E52]">{i + 1}</td>
                    <td className="px-4 py-3"><p className="font-medium text-[#2F3B1A]">{c.name}</p><p className="text-[11px] text-[#5A5E52]/60">{c.email}</p></td>
                    <td className="px-4 py-3 text-sm text-[#5A5E52]"><span className="mr-1">{flag}</span>{c.city ? `${c.city}, ` : ""}{c.countryCode}</td>
                    <td className="px-4 py-3 text-right text-[#2F3B1A] font-medium">{c.orders}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#556B2F]">{c.total.toLocaleString("tr-TR")} ₺</td>
                    <td className="px-4 py-3 text-right text-xs text-[#5A5E52]">{new Date(c.lastOrder).toLocaleDateString("tr-TR")}</td>
                  </tr>
                );
              })}
              {customers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-[#5A5E52] text-sm">Bu filtre için müşteri bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gizli print ref */}
      <div ref={printRef} />
    </div>
  );
}

// ── Export butonu bileşeni ────────────────────────────────────────────────────
function ExportBtn({ icon, label, sub, format, exporting, onExport, highlight = false }: {
  icon: string; label: string; sub: string; format: string;
  exporting: string | null; onExport: (f: string) => void; highlight?: boolean;
}) {
  const loading = exporting === format;
  return (
    <button
      onClick={() => onExport(format)}
      disabled={!!exporting}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors w-full disabled:opacity-50 ${
        highlight ? "hover:bg-[#EAF0DC] border border-[#d8e4c8] mb-1" : "hover:bg-[#F4F6F3]"
      }`}
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${highlight ? "bg-[#556B2F]/15" : "bg-[#EAF0DC]"}`}>
        {loading ? "⏳" : icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-[#2F3B1A] ${highlight ? "font-semibold" : ""}`}>{label}</p>
        <p className="text-[11px] text-[#5A5E52] truncate">{sub}</p>
      </div>
    </button>
  );
}
