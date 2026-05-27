"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { exportCsv } from "@/lib/exportCsv";
import { useAdminStore } from "@/store/adminStore";
import { mockOrders, filterByPeriod, type Order, type OrderStatus, type CargoCompany } from "@/data/orders";

const cargoConfig: Record<Exclude<CargoCompany, "">, { label: string; color: string; trackUrl: (no: string) => string }> = {
  aras:    { label: "Aras Kargo",    color: "text-orange-600", trackUrl: (n) => `https://kargotakip.araskargo.com.tr/mainpage.aspx?code=${n}` },
  yurtici: { label: "Yurtiçi Kargo", color: "text-red-600",    trackUrl: (n) => `https://www.yurticikargo.com/tr/online-islemler/gonderi-sorgula?code=${n}` },
  mng:     { label: "MNG Kargo",     color: "text-blue-600",   trackUrl: (n) => `https://www.mngkargo.com.tr/tr/gonderitakip?code=${n}` },
  ptt:     { label: "PTT Kargo",     color: "text-yellow-700", trackUrl: (n) => `https://www.ptt.gov.tr/tr-TR/pages/kargo-takip?barcode=${n}` },
  surat:   { label: "Sürat Kargo",   color: "text-green-700",  trackUrl: (n) => `https://www.suratkargo.com.tr/kargo-takip?trackingNumber=${n}` },
};

const statusConfig: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  preparing: { label: "Hazırlanıyor", cls: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-400" },
  shipped:   { label: "Kargoda",      cls: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-400" },
  delivered: { label: "Teslim Edildi",cls: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
  cancelled: { label: "İptal",        cls: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-400" },
};

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  preparing: ["shipped", "cancelled"],
  shipped:   ["delivered"],
  delivered: [],
  cancelled: [],
};

const transitionLabels: Partial<Record<OrderStatus, string>> = {
  shipped:   "Kargoya Ver",
  delivered: "Teslim Edildi",
  cancelled: "İptal Et",
};

type Tab = "all" | "preparing" | "tracking";

export function AdminOrdersTable() {
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user") ?? "";

  const [tab, setTab] = useState<Tab>("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState(userParam);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // URL'deki ?user= değişirse search'i güncelle
  useEffect(() => {
    if (userParam) setSearch(userParam);
  }, [userParam]);

  const { period, search: globalSearch } = useAdminStore();

  const periodFiltered = filterByPeriod(orders, period);

  const [cargoModal, setCargoModal] = useState<{ orderId: string; company: CargoCompany; no: string } | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifDone, setNotifDone] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const stats = {
    total:     periodFiltered.length,
    preparing: periodFiltered.filter(o => o.status === "preparing").length,
    shipped:   periodFiltered.filter(o => o.status === "shipped").length,
    delivered: periodFiltered.filter(o => o.status === "delivered").length,
    cancelled: periodFiltered.filter(o => o.status === "cancelled").length,
    revenue:   periodFiltered.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
  };

  const preparingOrders = periodFiltered.filter(o => o.status === "preparing");

  // Birleşik arama: local + global
  const combinedSearch = globalSearch || search;

  const filtered = periodFiltered.filter(o => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchSearch = !combinedSearch ||
      o.id.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      o.city.toLowerCase().includes(combinedSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  function updateStatus(id: string, status: OrderStatus) {
    if (status === "shipped") {
      const order = orders.find(o => o.id === id)!;
      setCargoModal({ orderId: id, company: order.cargoCompany, no: order.trackingNo });
      return;
    }
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  }

  function confirmShipping() {
    if (!cargoModal) return;
    setOrders(os => os.map(o =>
      o.id === cargoModal.orderId
        ? { ...o, status: "shipped", cargoCompany: cargoModal.company, trackingNo: cargoModal.no }
        : o
    ));
    setCargoModal(null);
  }

  async function notifyWarehouse(orderIds?: string[]) {
    const ids = orderIds ?? preparingOrders.map(o => o.id);
    setNotifLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setOrders(os => os.map(o => ids.includes(o.id) ? { ...o, notifiedWarehouse: true } : o));
    setNotifDone(prev => { const n = new Set(prev); ids.forEach(id => n.add(id)); return n; });
    setNotifLoading(false);
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function printPickList() {
    const toPrint = preparingOrders.filter(o => selected.size === 0 || selected.has(o.id));
    const html = `<html><head><title>Hazırlık Listesi — ${new Date().toLocaleDateString("tr-TR")}</title>
    <style>body{font-family:sans-serif;padding:24px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;padding:8px;text-align:left} th{background:#f0f0f0} h2{color:#2d5016}</style></head>
    <body><h2>Hüda-i Şifa — Hazırlık Listesi</h2><p>${new Date().toLocaleDateString("tr-TR")}</p>
    <table><thead><tr><th>Sipariş No</th><th>Müşteri</th><th>Şehir</th><th>Ürünler</th><th>Adres</th><th>Telefon</th></tr></thead><tbody>
    ${toPrint.map(o => `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.city}</td><td>${o.items.map(i => `${i.name} x${i.qty}`).join(", ")}</td><td>${o.address}</td><td>${o.phone}</td></tr>`).join("")}
    </tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  }

  const periodLabels: Record<string, string> = { "7": "Son 7 Gün", "20": "Son 20 Gün", "30": "Bu Ay", "all": "Tüm Zamanlar" };

  const statCards = [
    { key: "all"       as const, label: "Toplam",        value: stats.total,     icon: "📋", color: "bg-white",    text: "text-[#2F3B1A]",   border: "border-[#d8e4c8]" },
    { key: "preparing" as const, label: "Hazırlanıyor",  value: stats.preparing, icon: "📦", color: "bg-amber-50", text: "text-amber-700",    border: "border-amber-200" },
    { key: "shipped"   as const, label: "Kargoda",       value: stats.shipped,   icon: "🚚", color: "bg-blue-50",  text: "text-blue-700",     border: "border-blue-200" },
    { key: "delivered" as const, label: "Teslim Edildi", value: stats.delivered, icon: "✅", color: "bg-green-50", text: "text-green-700",    border: "border-green-200" },
    { key: "cancelled" as const, label: "İptal / İade",  value: stats.cancelled, icon: "↩️", color: "bg-red-50",   text: "text-red-600",      border: "border-red-200" },
    { key: null,                 label: "Gelir",         value: `${stats.revenue.toLocaleString("tr-TR")}₺`, icon: "💰", color: "bg-[#EAF0DC]", text: "text-[#556B2F]", border: "border-[#d8e4c8]" },
  ];

  const tabItems: { key: Tab; label: string; badge?: number }[] = [
    { key: "all",       label: "Tüm Siparişler" },
    { key: "preparing", label: "Hazırlık Listesi", badge: stats.preparing },
    { key: "tracking",  label: "Kargo Takip",      badge: stats.shipped },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2F3B1A]">Siparişler & Kargo</h1>
          <p className="text-sm text-[#5A5E52]">
            {periodFiltered.length} sipariş
            {period !== "all" && <span className="ml-1 text-[#556B2F] font-medium">— {periodLabels[period]}</span>}
          </p>
        </div>
        <button
          onClick={() => exportCsv("siparisler", periodFiltered.map(o => ({
            "Sipariş No": o.id, "Müşteri": o.customer, "E-posta": o.email,
            "Telefon": o.phone, "Tarih": o.date, "Şehir": o.city,
            "Tutar (₺)": o.total, "Durum": statusConfig[o.status].label,
            "Kargo Firması": o.cargoCompany ? cargoConfig[o.cargoCompany].label : "",
            "Takip No": o.trackingNo,
          })))}
          className="flex items-center gap-2 text-sm border border-[#d8e4c8] bg-white text-[#5A5E52] px-3 py-2.5 rounded-xl hover:bg-[#F4F6F3] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Excel İndir
        </button>
      </div>

      {/* Stat kartları — tıklanabilir filtreler */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {statCards.map(s => (
          <button
            key={s.label}
            onClick={() => { if (s.key !== null) { setStatusFilter(s.key); setTab("all"); } }}
            disabled={s.key === null}
            className={`${s.color} rounded-xl border-2 p-3 text-left transition-all ${
              s.key !== null
                ? `cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                    statusFilter === s.key && tab === "all"
                      ? `${s.border} ring-2 ring-offset-1 ring-current/40 shadow-sm`
                      : "border-[#d8e4c8] hover:border-current/40"
                  }`
                : `${s.border} cursor-default`
            }`}
          >
            <span className="text-base">{s.icon}</span>
            <p className={`text-base font-bold mt-1 ${s.text}`}>{s.value}</p>
            <p className="text-[10px] text-[#5A5E52]">{s.label}</p>
            {s.key !== null && (
              <p className={`text-[9px] mt-0.5 font-medium ${s.text} opacity-0 group-hover:opacity-100`}>Filtrele →</p>
            )}
          </button>
        ))}
      </div>

      {/* Tab navigasyonu */}
      <div className="flex gap-2 border-b border-[#d8e4c8]">
        {tabItems.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key ? "border-[#556B2F] text-[#2F3B1A]" : "border-transparent text-[#5A5E52] hover:text-[#2F3B1A]"
            }`}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                t.key === "preparing" ? "bg-amber-400 text-white" : "bg-blue-500 text-white"
              }`}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── TÜM SİPARİŞLER ── */}
      {tab === "all" && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Hızlı durum filtreleri */}
            <div className="flex items-center gap-1 bg-white border border-[#d8e4c8] rounded-xl p-1">
              {([
                ["all", "Tümü", stats.total],
                ["preparing", "Hazırlanıyor", stats.preparing],
                ["shipped", "Kargoda", stats.shipped],
                ["delivered", "Teslim", stats.delivered],
                ["cancelled", "İptal", stats.cancelled],
              ] as const).map(([v, lbl, cnt]) => (
                <button key={v} onClick={() => setStatusFilter(v)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === v ? "bg-[#556B2F] text-white" : "text-[#5A5E52] hover:text-[#2F3B1A]"
                  }`}
                >
                  {lbl}
                  <span className={`text-[10px] font-bold ${statusFilter === v ? "text-white/70" : "text-[#5A5E52]/50"}`}>({cnt})</span>
                </button>
              ))}
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A5E52]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input type="text" placeholder="Sipariş, müşteri, şehir..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-xs bg-white border border-[#d8e4c8] rounded-xl w-52 focus:outline-none focus:border-[#556B2F]/50 text-[#2F3B1A] placeholder:text-[#5A5E52]/40"
              />
            </div>
            {(statusFilter !== "all" || combinedSearch) && (
              <button
                onClick={() => { setStatusFilter("all"); setSearch(""); }}
                className="text-xs text-[#556B2F] underline"
              >Filtreyi Temizle</button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d8e4c8] bg-[#FAFAF7]">
                  {["Sipariş No", "Müşteri", "Tarih", "Şehir", "Tutar", "Kargo", "Durum", "Aksiyon"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const transitions = validTransitions[order.status];
                  return (
                    <tr key={order.id} className={`border-b border-[#d8e4c8]/50 last:border-0 hover:bg-[#EAF0DC]/10 transition-colors ${i % 2 === 1 ? "bg-[#FAFAF7]/40" : "bg-white"}`}>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-semibold text-[#556B2F]">{order.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-[#2F3B1A]">{order.customer}</p>
                        <p className="text-[10px] text-[#5A5E52]/60">{order.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5A5E52]">{order.date}</td>
                      <td className="px-4 py-3 text-xs text-[#5A5E52]">{order.city}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-[#2F3B1A]">{order.total.toLocaleString("tr-TR")} ₺</span>
                        <p className="text-[10px] text-[#5A5E52]/50">{order.items.reduce((s,i) => s+i.qty, 0)} ürün</p>
                      </td>
                      <td className="px-4 py-3">
                        {order.cargoCompany ? (
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-[10px] font-semibold ${cargoConfig[order.cargoCompany].color}`}>
                              {cargoConfig[order.cargoCompany].label}
                            </span>
                            {order.trackingNo && (
                              <a href={cargoConfig[order.cargoCompany].trackUrl(order.trackingNo)} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] font-mono text-blue-600 hover:underline flex items-center gap-0.5">
                                {order.trackingNo}
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#5A5E52]/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border inline-flex items-center gap-1 ${statusConfig[order.status].cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[order.status].dot}`} />
                          {statusConfig[order.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {transitions.length === 0 ? (
                          <span className="text-[10px] text-[#5A5E52]/40">—</span>
                        ) : (
                          <div className="flex gap-1 flex-wrap">
                            {transitions.map(t => (
                              <button
                                key={t}
                                onClick={() => updateStatus(order.id, t)}
                                className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-colors ${
                                  t === "shipped"   ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" :
                                  t === "delivered" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" :
                                  "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                }`}
                              >
                                {transitionLabels[t]}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-[#5A5E52]/50 text-sm">
                Bu dönemde sipariş bulunamadı.
              </div>
            )}
          </div>
        </>
      )}

      {/* ── HAZIRLIK LİSTESİ ── */}
      {tab === "preparing" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <div>
              <p className="text-sm font-bold text-amber-800">{preparingOrders.length} sipariş hazırlanmayı bekliyor</p>
              <p className="text-xs text-amber-600 mt-0.5">Seçim yaparak veya tümünü birden depo ekibine bildirin.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={printPickList}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-amber-300 text-amber-700 bg-white hover:bg-amber-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                </svg>
                Yazdır / PDF
              </button>
              <button
                onClick={() => notifyWarehouse(selected.size > 0 ? [...selected] : undefined)}
                disabled={notifLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-60 transition-colors"
              >
                {notifLoading
                  ? <><span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full inline-block" /> Gönderiliyor...</>
                  : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    {selected.size > 0 ? `${selected.size} Seçiliye Bildir` : "Depoya Bildir"}</>
                }
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {preparingOrders.length === 0 && (
              <div className="text-center py-10 text-[#5A5E52]/50 text-sm">Bu dönemde hazırlanmayı bekleyen sipariş yok.</div>
            )}
            {preparingOrders.map(order => {
              const isSelected = selected.has(order.id);
              const isDone = notifDone.has(order.id) || order.notifiedWarehouse;
              return (
                <div key={order.id} onClick={() => toggleSelect(order.id)}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                    isSelected ? "border-amber-400 bg-amber-50/30" : "border-[#d8e4c8] hover:border-amber-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(order.id)}
                        className="w-4 h-4 accent-amber-500 rounded" onClick={e => e.stopPropagation()} />
                      <div>
                        <span className="text-sm font-mono font-bold text-[#556B2F]">{order.id}</span>
                        <span className="text-[11px] text-[#5A5E52] ml-2">{order.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isDone && (
                        <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                          Depo Bildirildi
                        </span>
                      )}
                      <span className="text-sm font-bold text-[#2F3B1A]">{order.total.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-[#5A5E52] uppercase tracking-wide mb-2">Ürünler</p>
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center justify-between text-xs">
                            <span className="text-[#2F3B1A] font-medium">{item.name}</span>
                            <span className="font-mono text-[#556B2F] font-bold ml-3">×{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#5A5E52] uppercase tracking-wide mb-2">Teslimat</p>
                      <p className="text-xs font-semibold text-[#2F3B1A]">{order.customer}</p>
                      <p className="text-[11px] text-[#5A5E52]">{order.phone}</p>
                      <p className="text-[11px] text-[#5A5E52]">{order.city} — {order.address}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#d8e4c8]/50 flex justify-end">
                    <button
                      onClick={e => { e.stopPropagation(); setCargoModal({ orderId: order.id, company: "", no: "" }); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      Kargoya Ver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── KARGO TAKİP ── */}
      {tab === "tracking" && (
        <div className="flex flex-col gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
            <p className="text-sm font-bold text-blue-800">Kargoda {stats.shipped} sipariş</p>
            <p className="text-xs text-blue-600 mt-0.5">Takip numarasına tıklayarak kargo firmasının sitesinde canlı takip yapabilirsiniz.</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d8e4c8] bg-[#FAFAF7]">
                  {["Sipariş No", "Müşteri", "Şehir", "Kargo Firması", "Takip No", "Canlı Takip", "Durum"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodFiltered.filter(o => o.status === "shipped" || o.status === "delivered").map((order, i) => (
                  <tr key={order.id} className={`border-b border-[#d8e4c8]/50 last:border-0 ${i % 2 ? "bg-[#FAFAF7]/40" : "bg-white"}`}>
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-[#556B2F]">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-[#2F3B1A]">{order.customer}</p>
                      <p className="text-[10px] text-[#5A5E52]/60">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5E52]">{order.city}</td>
                    <td className="px-4 py-3">
                      {order.cargoCompany
                        ? <span className={`text-xs font-semibold ${cargoConfig[order.cargoCompany].color}`}>{cargoConfig[order.cargoCompany].label}</span>
                        : <span className="text-[10px] text-[#5A5E52]/40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-[#5A5E52]">{order.trackingNo || "—"}</td>
                    <td className="px-4 py-3">
                      {order.cargoCompany && order.trackingNo ? (
                        <a href={cargoConfig[order.cargoCompany].trackUrl(order.trackingNo)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          Takip Et
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#5A5E52]/40">Takip no yok</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border inline-flex items-center gap-1 ${statusConfig[order.status].cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[order.status].dot}`} />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── KARGO MODAL ── */}
      {cargoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2F3B1A]">Kargo Bilgisi Gir</h3>
              <button onClick={() => setCargoModal(null)} className="text-[#5A5E52] hover:text-[#2F3B1A]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-[#5A5E52]">Sipariş <strong className="text-[#556B2F]">{cargoModal.orderId}</strong> için kargo bilgilerini girin.</p>
            <div>
              <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">Kargo Firması</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(cargoConfig) as [Exclude<CargoCompany,"">, typeof cargoConfig[keyof typeof cargoConfig]][]).map(([key, cfg]) => (
                  <button key={key} type="button"
                    onClick={() => setCargoModal(m => m ? { ...m, company: key } : m)}
                    className={`text-xs py-2.5 px-2 rounded-xl border-2 font-semibold transition-all text-center ${
                      cargoModal.company === key
                        ? `border-[#556B2F] bg-[#EAF0DC] ${cfg.color}`
                        : "border-[#d8e4c8] text-[#5A5E52] hover:border-[#556B2F]/30"
                    }`}
                  >{cfg.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5A5E52] block mb-1.5">Takip Numarası</label>
              <input type="text" value={cargoModal.no}
                onChange={e => setCargoModal(m => m ? { ...m, no: e.target.value.toUpperCase() } : m)}
                placeholder="ör. ARS2026334455"
                className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF7]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setCargoModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#d8e4c8] text-sm text-[#5A5E52] hover:bg-[#F4F6F3] transition-colors">
                İptal
              </button>
              <button onClick={confirmShipping}
                disabled={!cargoModal.company || !cargoModal.no}
                className="flex-1 py-2.5 rounded-xl bg-[#556B2F] text-white text-sm font-semibold hover:bg-[#2F3B1A] disabled:opacity-50 transition-colors">
                Kargoya Ver ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
