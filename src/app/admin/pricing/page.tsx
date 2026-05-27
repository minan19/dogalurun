"use client";

import { useState, useMemo } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useProductStore } from "@/store/productStore";
import { useCampaignStore } from "@/store/campaignStore";
import type { Product } from "@/data/products";

// ── Tipleri ──────────────────────────────────────────────────────────────────
type CampaignType =
  | "percent"   // Yüzdelik indirim
  | "fixed"     // Sabit indirim
  | "threshold" // Sepet eşiği indirimi
  | "bogo"      // 2 al 1 öde
  | "bundle"    // Paket fırsatı
  | "freeship"; // Ücretsiz kargo

type CustomerSegment =
  | "all"        // Tüm müşteriler
  | "new"        // Yeni müşteriler (ilk alışveriş)
  | "returning"  // Tekrar alışveriş yapanlar
  | "vip"        // VIP / Altın üyeler
  | "silver"     // Gümüş üyeler
  | "inactive";  // Pasif müşteriler (90+ gün sipariş yok)

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  value: number;            // % veya ₺
  threshold?: number;       // sepet eşiği
  products: string[];       // product ids — boş = tümü
  targetSegment: CustomerSegment;
  couponCode?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  usageCount: number;
}

interface PricingRow {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice?: number;
  cost: number;
  margin: number;
  calculatedPrice: number;
  selected: boolean;
}

// ── Müşteri segmenti config ───────────────────────────────────────────────────
const customerSegments: { key: CustomerSegment; icon: string; label: string; desc: string; color: string }[] = [
  { key: "all",       icon: "👥", label: "Tüm Müşteriler",        desc: "Kayıtlı tüm müşterilere açık",                  color: "border-gray-200 bg-gray-50 text-gray-700" },
  { key: "new",       icon: "🌱", label: "Yeni Müşteriler",       desc: "İlk siparişini verecek üyeler",                  color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { key: "returning", icon: "🔁", label: "Sadık Müşteriler",      desc: "En az 2 sipariş vermiş üyeler",                 color: "border-blue-200 bg-blue-50 text-blue-700" },
  { key: "silver",    icon: "🥈", label: "Gümüş Üyeler",         desc: "1.000–4.999₺ toplam alışveriş yapanlar",        color: "border-slate-200 bg-slate-50 text-slate-700" },
  { key: "vip",       icon: "👑", label: "VIP / Altın Üyeler",    desc: "5.000₺+ toplam alışveriş yapanlar",             color: "border-amber-200 bg-amber-50 text-amber-700" },
  { key: "inactive",  icon: "💤", label: "Pasif Müşteriler",      desc: "90+ gündür sipariş vermeyenler (geri kazan)",   color: "border-red-200 bg-red-50 text-red-700" },
];

const segmentLabel: Record<CustomerSegment, string> = {
  all: "Tüm Müşteriler", new: "Yeni Müşteriler", returning: "Sadık Müşteriler",
  silver: "Gümüş Üyeler", vip: "VIP / Altın Üyeler", inactive: "Pasif Müşteriler",
};

const segmentColor: Record<CustomerSegment, string> = {
  all: "bg-gray-100 text-gray-700 border-gray-200",
  new: "bg-emerald-50 text-emerald-700 border-emerald-200",
  returning: "bg-blue-50 text-blue-700 border-blue-200",
  silver: "bg-slate-100 text-slate-700 border-slate-200",
  vip: "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-red-50 text-red-700 border-red-200",
};

// ── Kampanya tipi config ──────────────────────────────────────────────────────
const campaignTypes: { key: CampaignType; icon: string; label: string; desc: string; color: string }[] = [
  { key: "percent",   icon: "🏷️", label: "Yüzdelik İndirim",    desc: "Seçili ürünlere % indirim uygula",            color: "border-green-200 bg-green-50 text-green-700" },
  { key: "fixed",     icon: "💰", label: "Sabit İndirim",        desc: "Seçili ürünlere sabit ₺ indirim uygula",      color: "border-blue-200 bg-blue-50 text-blue-700" },
  { key: "threshold", icon: "🛒", label: "Sepet Eşiği",          desc: "X₺ üzeri siparişe otomatik indirim",          color: "border-amber-200 bg-amber-50 text-amber-700" },
  { key: "bogo",      icon: "🎁", label: "2 Al 1 Öde",           desc: "3 ürün al, en ucuzunu hediye",                color: "border-purple-200 bg-purple-50 text-purple-700" },
  { key: "bundle",    icon: "📦", label: "Paket Fırsatı",        desc: "Birden fazla ürün birlikte indirimli",        color: "border-orange-200 bg-orange-50 text-orange-700" },
  { key: "freeship",  icon: "🚚", label: "Ücretsiz Kargo",       desc: "Belirli tutar üzeri ücretsiz kargo",          color: "border-cyan-200 bg-cyan-50 text-cyan-700" },
];

// ── Mock kampanyalar ──────────────────────────────────────────────────────────
const mockCampaigns: Campaign[] = [
  {
    id: "c1", name: "Bahar İndirimi — Herkese", type: "percent", value: 15, products: [],
    targetSegment: "all",
    couponCode: "BAHAR15", startDate: "2026-03-20", endDate: "2026-04-20",
    active: true, usageCount: 42,
  },
  {
    id: "c2", name: "Hoş Geldin — İlk Alışveriş", type: "percent", value: 20, products: [],
    targetSegment: "new",
    couponCode: "ILKSIPARIS20", startDate: "2026-01-01", endDate: "2026-12-31",
    active: true, usageCount: 83,
  },
  {
    id: "c3", name: "VIP Özel — Erken Erişim", type: "fixed", value: 100, products: [],
    targetSegment: "vip",
    couponCode: "VIPSEL100", startDate: "2026-03-21", endDate: "2026-04-10",
    active: true, usageCount: 11,
  },
  {
    id: "c4", name: "Sizi Özledik — Geri Dönün", type: "percent", value: 25, products: [],
    targetSegment: "inactive",
    couponCode: "GERIDON25", startDate: "2026-03-01", endDate: "2026-04-30",
    active: true, usageCount: 6,
  },
  {
    id: "c5", name: "Gümüş Üye Avantajı", type: "percent", value: 10, products: [],
    targetSegment: "silver",
    couponCode: "GUMUS10", startDate: "2026-03-01", endDate: "2026-05-31",
    active: true, usageCount: 14,
  },
  {
    id: "c6", name: "Omega-3 Sadık Müşteri", type: "fixed", value: 30, products: ["p2"],
    targetSegment: "returning",
    couponCode: "OMEGA30", startDate: "2026-03-15", endDate: "2026-04-15",
    active: false, usageCount: 7,
  },
];

// ── Yardımcılar ───────────────────────────────────────────────────────────────
function genId() { return "c" + Math.random().toString(36).slice(2, 7); }
function genCode(name: string) {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) + Math.floor(Math.random() * 90 + 10);
}
function calcPrice(cost: number, margin: number) {
  if (cost <= 0 || margin <= 0) return 0;
  return Math.round(cost / (1 - margin / 100));
}

const typeLabel: Record<CampaignType, string> = {
  percent: "Yüzdelik İndirim", fixed: "Sabit İndirim", threshold: "Sepet Eşiği",
  bogo: "2 Al 1 Öde", bundle: "Paket Fırsatı", freeship: "Ücretsiz Kargo",
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPricingPage() {
  const [tab, setTab] = useState<"pricing" | "create" | "campaigns">("pricing");
  const { products: storeProducts, updateProduct } = useProductStore();

  // ── Fiyat yönetimi state ───────────────────────────────────────────────────
  const [rows, setRows] = useState<PricingRow[]>(() =>
    storeProducts.map((p) => ({
      id: p.id,
      name: p.nameKey,
      currentPrice: p.price,
      originalPrice: p.originalPrice,
      cost: p.costPrice ?? Math.round(p.price * 0.45),
      margin: p.marginPct ?? 55,
      calculatedPrice: p.price,
      selected: false,
    }))
  );
  const [bulkMargin, setBulkMargin] = useState(55);
  const [bulkApplied, setBulkApplied] = useState(false);
  const [priceToast, setPriceToast] = useState("");

  const selectedRows = rows.filter((r) => r.selected);

  function updateRow(id: string, field: keyof PricingRow, value: number | boolean) {
    setRows((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };
        updated.calculatedPrice = calcPrice(updated.cost, updated.margin);
        return updated;
      })
    );
  }

  function applyBulkMargin() {
    setRows((rs) =>
      rs.map((r) => {
        if (!r.selected) return r;
        const cp = calcPrice(r.cost, bulkMargin);
        return { ...r, margin: bulkMargin, calculatedPrice: cp };
      })
    );
    setBulkApplied(true);
    setTimeout(() => setBulkApplied(false), 2500);
  }

  function applyPrices() {
    const toUpdate = rows.filter((r) => r.selected && r.calculatedPrice > 0);
    // Persist to productStore so customer pages see updated prices
    toUpdate.forEach((r) => updateProduct(r.id, { price: r.calculatedPrice }));
    setPriceToast(`${toUpdate.length} ürünün satış fiyatı güncellendi.`);
    setTimeout(() => setPriceToast(""), 3000);
    setRows((rs) => rs.map((r) => r.selected && r.calculatedPrice > 0
      ? { ...r, currentPrice: r.calculatedPrice, selected: false } : r));
  }

  function toggleAll(val: boolean) {
    setRows((rs) => rs.map((r) => ({ ...r, selected: val })));
  }

  // ── Kampanya oluştur state ─────────────────────────────────────────────────
  const [selType, setSelType] = useState<CampaignType | null>(null);
  const [form, setForm] = useState({
    name: "", value: "", threshold: "", startDate: "2026-03-21", endDate: "",
    couponCode: "", autoCode: true, productScope: "all" as "all" | "select",
    selectedProducts: [] as string[],
    targetSegment: "all" as CustomerSegment,
  });
  const { campaigns, addCampaign, toggleCampaign: storToggleCampaign, deleteCampaign: storeDeleteCampaign } = useCampaignStore();
  const [createDone, setCreateDone] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | "all">("all");

  function setF(key: keyof typeof form, val: string | boolean | string[]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleProductInForm(id: string) {
    setForm((f) => ({
      ...f,
      selectedProducts: f.selectedProducts.includes(id)
        ? f.selectedProducts.filter((x) => x !== id)
        : [...f.selectedProducts, id],
    }));
  }

  function createCampaign() {
    if (!selType || !form.name || !form.value || !form.endDate) return;
    const code = form.autoCode ? genCode(form.name) : form.couponCode;
    const c: Campaign = {
      id: genId(),
      name: form.name,
      type: selType,
      value: parseFloat(form.value),
      threshold: form.threshold ? parseFloat(form.threshold) : undefined,
      products: form.productScope === "all" ? [] : form.selectedProducts,
      targetSegment: form.targetSegment,
      couponCode: code,
      startDate: form.startDate,
      endDate: form.endDate,
      active: true,
      usageCount: 0,
    };
    addCampaign(c);
    setCreateDone(true);
    setTimeout(() => { setCreateDone(false); setSelType(null); setForm({ name: "", value: "", threshold: "", startDate: "2026-03-21", endDate: "", couponCode: "", autoCode: true, productScope: "all", selectedProducts: [], targetSegment: "all" }); }, 2200);
  }

  function toggleCampaign(id: string) {
    storToggleCampaign(id);
  }
  function deleteCampaign(id: string) {
    storeDeleteCampaign(id);
  }

  const activeCnt = useMemo(() => campaigns.filter((c) => c.active).length, [campaigns]);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">

        {/* Toast */}
        {priceToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#2F3B1A] text-white text-sm px-5 py-3 rounded-2xl shadow-lg z-50 animate-fade-in">
            ✓ {priceToast}
          </div>
        )}
        {createDone && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#2F3B1A] text-white text-sm px-5 py-3 rounded-2xl shadow-lg z-50">
            ✓ Kampanya oluşturuldu ve yayına alındı!
          </div>
        )}

        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#2F3B1A]">Fiyatlandırma & Kampanya</h1>
            <p className="text-sm text-[#5A5E52]">Maliyet, satış fiyatı ve kampanyaları yönet</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-[#EAF0DC] text-[#556B2F] px-3 py-1.5 rounded-full font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {activeCnt} Aktif Kampanya
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#EAF0DC] rounded-2xl p-1 mb-6 w-fit">
          {([
            { key: "pricing",   label: "Fiyat Yönetimi" },
            { key: "create",    label: "Kampanya Oluştur" },
            { key: "campaigns", label: `Kampanyalar (${campaigns.length})` },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? "bg-white text-[#2F3B1A] shadow-sm" : "text-[#5A5E52]"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: Fiyat Yönetimi ─────────────────────────────────────────── */}
        {tab === "pricing" && (
          <div className="flex flex-col gap-5">
            {/* Toplu marj araçları */}
            <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5">
              <h2 className="text-sm font-bold text-[#2F3B1A] mb-4">Maliyet + Marj → Satış Fiyatı</h2>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">Toplu Kar Marjı (%)</label>
                  <input type="number" value={bulkMargin} min={1} max={99}
                    onChange={(e) => setBulkMargin(Number(e.target.value))}
                    className="w-28 border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50" />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <p className="text-xs text-[#5A5E52]">
                    {selectedRows.length > 0
                      ? `${selectedRows.length} ürün seçili — %${bulkMargin} marj ile fiyatlar hesaplanacak.`
                      : "Ürünleri seçip toplu fiyat hesaplamak için sol kutucuklara tıklayın."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={applyBulkMargin} disabled={selectedRows.length === 0}
                    className="bg-[#EAF0DC] hover:bg-[#d8e4c8] text-[#2F3B1A] text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-40">
                    {bulkApplied ? "✓ Hesaplandı" : "Hesapla"}
                  </button>
                  <button onClick={applyPrices} disabled={selectedRows.length === 0}
                    className="bg-[#556B2F] hover:bg-[#2F3B1A] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-40">
                    Fiyatları Uygula
                  </button>
                </div>
              </div>
            </div>

            {/* Ürün tablosu */}
            <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
              <div className="grid grid-cols-[2rem_1fr_6rem_6rem_6rem_6rem_6rem] text-xs font-semibold text-[#5A5E52] px-4 py-3 border-b border-[#d8e4c8] bg-[#FAFAF5]">
                <input type="checkbox" className="accent-[#556B2F]"
                  checked={rows.every((r) => r.selected)}
                  onChange={(e) => toggleAll(e.target.checked)} />
                <span>Ürün</span>
                <span className="text-center">Mevcut Fiyat</span>
                <span className="text-center">Maliyet (₺)</span>
                <span className="text-center">Marj (%)</span>
                <span className="text-center">Hesaplanan</span>
                <span className="text-center">Fark</span>
              </div>

              {rows.map((row) => {
                const diff = row.calculatedPrice > 0 ? row.calculatedPrice - row.currentPrice : 0;
                return (
                  <div key={row.id} className={`grid grid-cols-[2rem_1fr_6rem_6rem_6rem_6rem_6rem] items-center px-4 py-3 border-b border-[#d8e4c8] last:border-0 hover:bg-[#FAFAF5] ${row.selected ? "bg-[#EAF0DC]/30" : ""}`}>
                    <input type="checkbox" className="accent-[#556B2F]"
                      checked={row.selected}
                      onChange={(e) => updateRow(row.id, "selected", e.target.checked)} />
                    <div>
                      <p className="text-xs font-semibold text-[#2F3B1A] truncate max-w-[180px]">{row.name}</p>
                      <p className="text-[10px] text-[#5A5E52]">ID: {row.id}</p>
                    </div>
                    <p className="text-xs text-center font-semibold text-[#2F3B1A]">{row.currentPrice}₺</p>
                    <div className="flex justify-center">
                      <input type="number" value={row.cost} min={1}
                        onChange={(e) => updateRow(row.id, "cost", Number(e.target.value))}
                        className="w-16 text-xs text-center border border-[#d8e4c8] rounded-lg px-1 py-1 focus:outline-none focus:border-[#556B2F]/50" />
                    </div>
                    <div className="flex justify-center">
                      <input type="number" value={row.margin} min={1} max={99}
                        onChange={(e) => updateRow(row.id, "margin", Number(e.target.value))}
                        className="w-14 text-xs text-center border border-[#d8e4c8] rounded-lg px-1 py-1 focus:outline-none focus:border-[#556B2F]/50" />
                    </div>
                    <p className={`text-xs text-center font-bold ${row.calculatedPrice > 0 ? "text-[#556B2F]" : "text-[#5A5E52]/40"}`}>
                      {row.calculatedPrice > 0 ? `${row.calculatedPrice}₺` : "—"}
                    </p>
                    <p className={`text-xs text-center font-semibold ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-[#5A5E52]/40"}`}>
                      {diff !== 0 ? `${diff > 0 ? "+" : ""}${diff}₺` : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: Kampanya Oluştur ───────────────────────────────────────── */}
        {tab === "create" && (
          <div className="flex flex-col gap-5 max-w-2xl">
            {/* Tip seçimi */}
            <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5">
              <h2 className="text-sm font-bold text-[#2F3B1A] mb-4">Kampanya Tipi Seç</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {campaignTypes.map((ct) => (
                  <button key={ct.key} onClick={() => setSelType(selType === ct.key ? null : ct.key)}
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      selType === ct.key ? ct.color + " border-opacity-100" : "border-[#d8e4c8] hover:border-[#556B2F]/30"
                    }`}>
                    <span className="text-xl mb-1.5 block">{ct.icon}</span>
                    <p className="text-xs font-bold text-[#2F3B1A]">{ct.label}</p>
                    <p className="text-[10px] text-[#5A5E52] leading-tight mt-0.5">{ct.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form — sadece tip seçilince göster */}
            {selType && (
              <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">{campaignTypes.find((t) => t.key === selType)!.icon}</span>
                  <h2 className="text-sm font-bold text-[#2F3B1A]">{typeLabel[selType]} Detayları</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Kampanya adı */}
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">Kampanya Adı *</label>
                    <input type="text" value={form.name} onChange={(e) => setF("name", e.target.value)}
                      placeholder="ör. Ramazan İndirim Kampanyası"
                      className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50" />
                  </div>

                  {/* İndirim değeri */}
                  {selType !== "bogo" && selType !== "freeship" && (
                    <div>
                      <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">
                        {selType === "percent" ? "İndirim Oranı (%)" : selType === "threshold" ? "İndirim Değeri (%)" : "İndirim Tutarı (₺)"} *
                      </label>
                      <input type="number" value={form.value} onChange={(e) => setF("value", e.target.value)}
                        placeholder={selType === "percent" || selType === "threshold" ? "ör. 15" : "ör. 50"}
                        className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50" />
                    </div>
                  )}

                  {/* Eşik tutarı */}
                  {(selType === "threshold" || selType === "freeship") && (
                    <div>
                      <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">
                        {selType === "freeship" ? "Ücretsiz Kargo Eşiği (₺)" : "Minimum Sepet (₺)"} *
                      </label>
                      <input type="number" value={form.threshold} onChange={(e) => setF("threshold", e.target.value)}
                        placeholder="ör. 500"
                        className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50" />
                    </div>
                  )}

                  {/* Tarih aralığı */}
                  <div>
                    <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">Başlangıç Tarihi</label>
                    <input type="date" value={form.startDate} onChange={(e) => setF("startDate", e.target.value)}
                      className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">Bitiş Tarihi *</label>
                    <input type="date" value={form.endDate} onChange={(e) => setF("endDate", e.target.value)}
                      className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50" />
                  </div>

                  {/* Kupon kodu */}
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-[#5A5E52] block mb-2">Kupon Kodu</label>
                    <div className="flex items-center gap-3 mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.autoCode} onChange={(e) => setF("autoCode", e.target.checked)}
                          className="accent-[#556B2F]" />
                        <span className="text-xs text-[#5A5E52]">Otomatik oluştur</span>
                      </label>
                    </div>
                    {!form.autoCode && (
                      <input type="text" value={form.couponCode} onChange={(e) => setF("couponCode", e.target.value.toUpperCase())}
                        placeholder="ör. YENIYIL25"
                        className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-[#556B2F]/50" />
                    )}
                    {form.autoCode && form.name && (
                      <p className="text-xs text-[#556B2F] font-mono bg-[#EAF0DC] px-3 py-2 rounded-xl">
                        Oluşturulacak kod: {genCode(form.name)}
                      </p>
                    )}
                  </div>

                  {/* Hedef müşteri segmenti */}
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-[#5A5E52] block mb-2">
                      Hedef Müşteri Segmenti
                      <span className="ml-2 font-normal text-[#9ca3af]">— Kim görecek?</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {customerSegments.map((seg) => (
                        <button key={seg.key} type="button"
                          onClick={() => setF("targetSegment", seg.key)}
                          className={`rounded-xl border-2 p-3 text-left transition-all ${
                            form.targetSegment === seg.key
                              ? seg.color + " border-opacity-100"
                              : "border-[#d8e4c8] hover:border-[#556B2F]/30"
                          }`}>
                          <span className="text-lg mb-1 block">{seg.icon}</span>
                          <p className="text-[11px] font-bold text-[#2F3B1A] leading-tight">{seg.label}</p>
                          <p className="text-[10px] text-[#5A5E52] leading-tight mt-0.5">{seg.desc}</p>
                        </button>
                      ))}
                    </div>
                    {form.targetSegment !== "all" && (
                      <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        <span className="text-amber-500 text-sm shrink-0">ℹ️</span>
                        <p className="text-[11px] text-amber-700 leading-snug">
                          Bu kampanya yalnızca <b>{segmentLabel[form.targetSegment]}</b> segmentindeki üyeler için geçerli olacak. Sistem, ödeme adımında otomatik doğrulama yapacaktır.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ürün kapsamı */}
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-[#5A5E52] block mb-2">Kampanya Kapsamı</label>
                    <div className="flex gap-3 mb-3">
                      {(["all", "select"] as const).map((scope) => (
                        <label key={scope} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="scope" checked={form.productScope === scope}
                            onChange={() => setF("productScope", scope)} className="accent-[#556B2F]" />
                          <span className="text-xs text-[#5A5E52]">
                            {scope === "all" ? "Tüm ürünler" : "Belirli ürünler"}
                          </span>
                        </label>
                      ))}
                    </div>
                    {form.productScope === "select" && (
                      <div className="border border-[#d8e4c8] rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                        {storeProducts.map((p) => (
                          <label key={p.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#FAFAF5] border-b border-[#d8e4c8] last:border-0 ${form.selectedProducts.includes(p.id) ? "bg-[#EAF0DC]/40" : ""}`}>
                            <input type="checkbox" className="accent-[#556B2F]"
                              checked={form.selectedProducts.includes(p.id)}
                              onChange={() => toggleProductInForm(p.id)} />
                            <span className="text-xs text-[#2F3B1A]">{p.nameKey}</span>
                            <span className="text-xs text-[#5A5E52] ml-auto">{p.price}₺</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Önizleme özeti */}
                {form.name && (form.value || selType === "bogo") && (
                  <div className="mt-4 bg-[#EAF0DC] rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-bold text-[#2F3B1A]">Önizleme</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-white border border-[#d8e4c8] px-2 py-1 rounded-lg text-[#2F3B1A] font-semibold">{form.name}</span>
                      <span className="text-xs bg-white border border-[#d8e4c8] px-2 py-1 rounded-lg text-[#5A5E52]">
                        {selType === "percent" ? `%${form.value} indirim` :
                         selType === "fixed"   ? `${form.value}₺ indirim` :
                         selType === "threshold" ? `${form.threshold}₺ üzeri %${form.value}` :
                         selType === "freeship" ? `${form.threshold}₺ üzeri ücretsiz kargo` :
                         selType === "bogo"   ? "3 ürün al 2 ürün öde" : "Paket fırsatı"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg border font-semibold ${segmentColor[form.targetSegment]}`}>
                        {customerSegments.find(s => s.key === form.targetSegment)!.icon} {segmentLabel[form.targetSegment]}
                      </span>
                      <span className="text-xs bg-white border border-[#d8e4c8] px-2 py-1 rounded-lg text-[#5A5E52]">
                        {form.productScope === "all" ? "Tüm ürünler" : `${form.selectedProducts.length} ürün`}
                      </span>
                      {form.endDate && (
                        <span className="text-xs bg-white border border-[#d8e4c8] px-2 py-1 rounded-lg text-[#5A5E52]">
                          📅 {form.startDate} → {form.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button onClick={createCampaign}
                  disabled={!form.name || (!form.value && selType !== "bogo") || !form.endDate}
                  className="mt-5 w-full bg-[#556B2F] hover:bg-[#2F3B1A] text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-40">
                  Kampanyayı Oluştur ve Yayına Al
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: Kampanyalar ────────────────────────────────────────────── */}
        {tab === "campaigns" && (
          <div className="flex flex-col gap-3">
            {/* Segment filtre */}
            <div className="bg-white rounded-2xl border border-[#d8e4c8] p-4">
              <p className="text-xs font-semibold text-[#5A5E52] mb-2">Müşteri Segmentine Göre Filtrele</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSegmentFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all ${segmentFilter === "all" ? "bg-[#556B2F] text-white border-[#556B2F]" : "border-[#d8e4c8] text-[#5A5E52] hover:border-[#556B2F]/40"}`}>
                  Tümü ({campaigns.length})
                </button>
                {customerSegments.filter(s => s.key !== "all").map((seg) => {
                  const cnt = campaigns.filter(c => c.targetSegment === seg.key).length;
                  if (cnt === 0) return null;
                  return (
                    <button key={seg.key} onClick={() => setSegmentFilter(seg.key)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1.5 ${segmentFilter === seg.key ? seg.color + " border-opacity-100" : "border-[#d8e4c8] text-[#5A5E52] hover:border-[#556B2F]/40"}`}>
                      {seg.icon} {seg.label} <span className="opacity-60">({cnt})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {campaigns.filter(c => segmentFilter === "all" || c.targetSegment === segmentFilter).length === 0 && (
              <div className="bg-white rounded-2xl border border-[#d8e4c8] p-10 text-center">
                <p className="text-[#5A5E52] text-sm">Bu segmente ait kampanya yok.</p>
                <button onClick={() => setTab("create")}
                  className="mt-3 text-[#556B2F] text-sm font-semibold hover:underline">
                  Yeni kampanya oluştur →
                </button>
              </div>
            )}
            {campaigns.filter(c => segmentFilter === "all" || c.targetSegment === segmentFilter).map((c) => {
              const ct = campaignTypes.find((t) => t.key === c.type)!;
              const isExpired = new Date(c.endDate) < new Date("2026-03-21");
              return (
                <div key={c.id} className={`bg-white rounded-2xl border p-5 ${c.active && !isExpired ? "border-[#d8e4c8]" : "border-gray-100 opacity-60"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{ct.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold text-[#2F3B1A]">{c.name}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ct.color}`}>{typeLabel[c.type]}</span>
                        {isExpired && <span className="text-[10px] text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Süresi Doldu</span>}
                        {c.active && !isExpired && <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Aktif</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#5A5E52] mt-1">
                        <span>
                          {c.type === "percent" ? `%${c.value} indirim` :
                           c.type === "fixed"   ? `${c.value}₺ indirim` :
                           c.type === "threshold" ? `${c.threshold}₺ üzeri %${c.value}` :
                           c.type === "freeship" ? `${c.threshold}₺ üzeri ücretsiz kargo` :
                           c.type === "bogo"   ? "3 al 2 öde" : "Paket"}
                        </span>
                        <span className={`font-semibold px-2 py-0.5 rounded-full border text-[10px] ${segmentColor[c.targetSegment]}`}>
                          {customerSegments.find(s => s.key === c.targetSegment)!.icon} {segmentLabel[c.targetSegment]}
                        </span>
                        <span>📅 {c.startDate} → {c.endDate}</span>
                        <span>🛍️ {c.usageCount} kullanım</span>
                        {c.couponCode && <span className="font-mono font-bold text-[#556B2F] bg-[#EAF0DC] px-2 py-0.5 rounded">🏷 {c.couponCode}</span>}
                        <span>{c.products.length === 0 ? "Tüm ürünler" : `${c.products.length} ürün`}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle */}
                      <button onClick={() => toggleCampaign(c.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${c.active ? "bg-[#556B2F]" : "bg-gray-200"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${c.active ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                      <button onClick={() => deleteCampaign(c.id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
