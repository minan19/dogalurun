"use client";

import { useState, useMemo } from "react";
import { exportCsv } from "@/lib/exportCsv";

// Müşteri segmenti (pasif artık ayrı durum, tier değil)
type Tier = "vip" | "loyal" | "new";

const mockSubscribers = [
  { id: 1, email: "ayse.kaya@gmail.com",   date: "2026-03-20", source: "footer",   active: true,  totalOrders: 0,  totalSpent: 0,    optedOut: false },
  { id: 2, email: "mehmet.t@hotmail.com",  date: "2026-03-19", source: "footer",   active: true,  totalOrders: 0,  totalSpent: 0,    optedOut: true  }, // mail istemedi
  { id: 3, email: "fatma.d@gmail.com",     date: "2026-03-18", source: "checkout", active: true,  totalOrders: 2,  totalSpent: 680,  optedOut: false },
  { id: 4, email: "emre.yilmaz@gmail.com", date: "2026-03-17", source: "footer",   active: false, totalOrders: 0,  totalSpent: 0,    optedOut: false },
  { id: 5, email: "zeynep.a@icloud.com",   date: "2026-03-15", source: "footer",   active: true,  totalOrders: 0,  totalSpent: 0,    optedOut: false },
  { id: 6, email: "ali.k@gmail.com",       date: "2026-03-12", source: "checkout", active: true,  totalOrders: 7,  totalSpent: 3200, optedOut: false },
  { id: 7, email: "selin.m@yahoo.com",     date: "2026-03-10", source: "footer",   active: true,  totalOrders: 1,  totalSpent: 290,  optedOut: true  }, // mail istemedi
  { id: 8, email: "kemal.d@gmail.com",     date: "2026-03-08", source: "footer",   active: false, totalOrders: 3,  totalSpent: 950,  optedOut: false },
];

function getTier(s: typeof mockSubscribers[0]): Tier | null {
  if (!s.active) return null;
  if (s.totalSpent >= 2000 || s.totalOrders >= 5) return "vip";
  if (s.totalOrders >= 2) return "loyal";
  return "new";
}

const tierConfig: Record<Tier, { label: string; color: string; bg: string; border: string; desc: string }> = {
  vip:   { label: "VIP",          color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300", desc: "5+ sipariş veya 2000₺+" },
  loyal: { label: "Sadık Müşteri",color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", desc: "2–4 sipariş" },
  new:   { label: "Yeni Abone",   color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   desc: "Henüz alışveriş yapmadı" },
};

const sourceLabels: Record<string, string> = { footer: "Footer", checkout: "Sipariş Sonrası", all: "Tümü" };

const templates = [
  { id: "welcome",  label: "Hoşgeldin",  subject: "Hüda-i Şifa'ya Hoş Geldiniz! 🌿" },
  { id: "promo",    label: "Kampanya",   subject: "Özel İndirim: %20 Fırsat Sizi Bekliyor" },
  { id: "new_prod", label: "Yeni Ürün",  subject: "Yeni Ürünlerimiz Geldi! ✨" },
  { id: "blog",     label: "Blog Özeti", subject: "Bu Ay Sağlık Rehberiniz" },
  { id: "custom",   label: "Özel Mesaj", subject: "" },
];

type ListFilter = "all" | "active" | "passive" | "optedOut" | "thisMonth" | Tier;
type SendMode = "segment" | "manual";

export default function NewsletterPage() {
  const [tab, setTab] = useState<"list" | "send">("list");
  const [search, setSearch] = useState("");
  const [listFilter, setListFilter] = useState<ListFilter>("all");

  const [sendMode, setSendMode] = useState<SendMode>("segment");
  const [segTier, setSegTier] = useState<Tier | "all">("all");
  const [segSource, setSegSource] = useState<"all" | "footer" | "checkout">("all");
  const [segDateRange, setSegDateRange] = useState<"all" | "7" | "30">("all");
  const [manualSelected, setManualSelected] = useState<Set<number>>(new Set());

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    subject: string; body: string; template: string; reason: string;
  } | null>(null);

  const now = new Date("2026-03-21");

  const enriched = mockSubscribers.map(s => ({ ...s, tier: getTier(s) }));

  // Abone listesi filtresi
  const filteredList = useMemo(() => enriched.filter(s => {
    if (search && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (listFilter === "active") return s.active && !s.optedOut;
    if (listFilter === "passive") return !s.active;
    if (listFilter === "optedOut") return s.optedOut;
    if (listFilter === "thisMonth") return (now.getTime() - new Date(s.date).getTime()) / 86400000 <= 31;
    if (listFilter === "vip" || listFilter === "loyal" || listFilter === "new") return s.tier === listFilter;
    return true;
  }), [search, listFilter]);

  // Segment (mail gönder) filtresi — opt-out olanlar otomatik hariç
  const segmentFiltered = useMemo(() => enriched.filter(s => {
    if (s.optedOut) return false; // Her zaman hariç
    if (!s.active) return false;
    if (segTier !== "all" && s.tier !== segTier) return false;
    if (segSource !== "all" && s.source !== segSource) return false;
    if (segDateRange !== "all") {
      const diffDays = (now.getTime() - new Date(s.date).getTime()) / 86400000;
      if (diffDays > parseInt(segDateRange)) return false;
    }
    return true;
  }), [segTier, segSource, segDateRange]);

  // Manuel seçimde opt-out olanlar gösterilir ama seçilemez
  const recipients = sendMode === "manual"
    ? enriched.filter(s => manualSelected.has(s.id) && !s.optedOut)
    : segmentFiltered;

  const stats = {
    total: enriched.length,
    active: enriched.filter(s => s.active && !s.optedOut).length,
    passive: enriched.filter(s => !s.active).length,
    optedOut: enriched.filter(s => s.optedOut).length,
    thisMonth: enriched.filter(s => (now.getTime() - new Date(s.date).getTime()) / 86400000 <= 31).length,
    vip: enriched.filter(s => s.tier === "vip").length,
    loyal: enriched.filter(s => s.tier === "loyal").length,
    new: enriched.filter(s => s.tier === "new").length,
  };

  function handleKpiClick(f: ListFilter) {
    setListFilter(f);
    setTab("list");
    setSearch("");
  }

  function handleTemplateChange(id: string) {
    const t = templates.find(t => t.id === id)!;
    setSelectedTemplate(t);
    setSubject(t.subject);
    setAiSuggestion(null);
    setSent(false);
  }

  function toggleManual(id: number) {
    const s = enriched.find(s => s.id === id);
    if (s?.optedOut) return; // opt-out olanlar seçilemiyor
    setManualSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (recipients.length === 0) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  }

  async function handleAISuggest() {
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await fetch("/api/newsletter/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment: { tier: segTier, source: segSource, dateRange: segDateRange, count: recipients.length, buyerCount: recipients.filter(s => s.totalOrders > 0).length } }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data);
        setSubject(data.subject);
        setBody(data.body);
        const match = templates.find(t => t.id === data.template);
        if (match) setSelectedTemplate(match);
      }
    } catch { /* ignore */ }
    setAiLoading(false);
  }

  function segmentLabel() {
    const parts: string[] = [];
    if (segTier !== "all") parts.push(tierConfig[segTier].label);
    if (segSource !== "all") parts.push(sourceLabels[segSource]);
    if (segDateRange !== "all") parts.push(`Son ${segDateRange} gün`);
    return parts.length ? parts.join(" · ") : "Tüm Aktif Aboneler";
  }

  const activeFilterLabel: Record<ListFilter, string> = {
    all: "Tümü", active: "Aktif", passive: "Pasif", optedOut: "İzin Vermedi",
    thisMonth: "Bu Ay Yeni", vip: "VIP", loyal: "Sadık Müşteri", new: "Yeni Abone",
  };

  // Liste seçiminde seçilebilir olanlar (opt-out hariç)
  const selectableInList = filteredList.filter(s => !s.optedOut);
  const allSelectableSelected = selectableInList.length > 0 && selectableInList.every(s => manualSelected.has(s.id));

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-green-900">Bülten Yönetimi</h1>
        <p className="text-sm text-text-secondary mt-1">Segment ve müşteri sınıfına göre hedefli kampanya gönderin.</p>
      </div>

      {/* ── ÖZET KARTLARI ── */}
      {/* Satır 1: Durum bazlı */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {[
          { f: "all"       as ListFilter, label: "Toplam Abone",   value: stats.total,     color: "text-green-700",  active_bg: "bg-green-50 ring-green-600" },
          { f: "active"    as ListFilter, label: "Aktif",           value: stats.active,    color: "text-green-700",  active_bg: "bg-green-50 ring-green-600" },
          { f: "passive"   as ListFilter, label: "Pasif",           value: stats.passive,   color: "text-gray-500",   active_bg: "bg-gray-50 ring-gray-400" },
          { f: "optedOut"  as ListFilter, label: "İzin Vermedi",    value: stats.optedOut,  color: "text-red-500",    active_bg: "bg-red-50 ring-red-400" },
        ].map(k => (
          <button key={k.f} onClick={() => handleKpiClick(k.f)}
            className={`rounded-xl border p-4 text-left transition-all group hover:shadow-md hover:-translate-y-0.5 ${
              listFilter === k.f && tab === "list"
                ? `${k.active_bg} ring-2 ring-offset-1`
                : "bg-white border-olive-border/30 hover:border-green-600/30"
            }`}
          >
            <p className="text-xs text-text-secondary mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-green-600/0 group-hover:text-green-600 transition-colors mt-0.5">Görüntüle →</p>
          </button>
        ))}
      </div>

      {/* Satır 2: Müşteri sınıfı */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { f: "thisMonth" as ListFilter, label: "Bu Ay Yeni",    value: stats.thisMonth, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   desc: "Son 31 gün" },
          { f: "vip"       as ListFilter, label: "VIP",           value: stats.vip,       color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300", desc: "5+ sipariş / 2000₺+" },
          { f: "loyal"     as ListFilter, label: "Sadık Müşteri", value: stats.loyal,     color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", desc: "2–4 sipariş" },
          { f: "new"       as ListFilter, label: "Yeni Abone",    value: stats.new,       color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   desc: "Henüz alışveriş yok" },
        ].map(k => (
          <button key={k.f} onClick={() => handleKpiClick(k.f)}
            className={`rounded-xl border p-3 text-left transition-all group hover:shadow-md hover:-translate-y-0.5 ${
              listFilter === k.f && tab === "list"
                ? `${k.bg} ${k.border} ring-2 ring-offset-1 ring-current/50`
                : `${k.bg} ${k.border} hover:shadow-sm`
            }`}
          >
            <p className={`text-[11px] font-semibold mb-0.5 ${k.color}`}>{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-text-secondary/60 mt-0.5">{k.desc}</p>
          </button>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 mb-5">
        {([["list", "Abone Listesi"], ["send", "Mail Gönder"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === key ? "bg-green-700 text-white" : "bg-white border border-olive-border/30 text-text-secondary hover:bg-cream-100"
            }`}
          >{label}</button>
        ))}
      </div>

      {/* ── ABONE LİSTESİ ── */}
      {tab === "list" && (
        <div className="relative">
          {/* İzin bilgilendirme */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3 text-xs text-amber-700">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span><strong>İzin vermeyenler</strong> (kırmızı kilit) seçilemez ve hiçbir zaman gönderime dahil edilmez. Bu KVKK uyumunuzu korur.</span>
          </div>

          <div className="bg-white rounded-2xl border border-olive-border/30 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-olive-border/20 flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input type="checkbox" className="w-4 h-4 accent-green-700 rounded"
                  checked={allSelectableSelected}
                  onChange={e => {
                    if (e.target.checked) {
                      setManualSelected(prev => { const n = new Set(prev); selectableInList.forEach(s => n.add(s.id)); return n; });
                    } else {
                      setManualSelected(prev => { const n = new Set(prev); selectableInList.forEach(s => n.delete(s.id)); return n; });
                    }
                  }}
                />
                <span className="text-xs text-text-secondary font-medium">Tümünü Seç</span>
              </label>
              <div className="w-px h-5 bg-olive-border/30" />
              <input type="text" placeholder="E-posta ara..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 min-w-36 border border-olive-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50"
              />
              {listFilter !== "all" && (
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs shrink-0">
                  <span className="text-green-700 font-semibold">{activeFilterLabel[listFilter]}</span>
                  <span className="text-green-600 font-bold">({filteredList.length})</span>
                  <button onClick={() => setListFilter("all")} className="text-green-500 hover:text-green-700 font-bold">✕</button>
                </div>
              )}
              <button
                onClick={() => exportCsv("aboneler", filteredList.map(s => ({
                  "E-posta": s.email,
                  "Kayıt Tarihi": s.date,
                  "Kaynak": sourceLabels[s.source] || s.source,
                  "Sınıf": s.tier ? tierConfig[s.tier].label : "Pasif",
                  "Sipariş Sayısı": s.totalOrders,
                  "Toplam Harcama (₺)": s.totalSpent,
                  "Aktif": s.active ? "Evet" : "Hayır",
                  "İzin Durumu": s.optedOut ? "İzin Vermedi" : s.active ? "Onaylı" : "Pasif",
                })))}
                className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                CSV İndir
              </button>
            </div>

            {/* Tablo */}
            <table className="w-full text-sm">
              <thead className="bg-cream-50 border-b border-olive-border/20">
                <tr>
                  <th className="w-10 px-4 py-3" />
                  {["E-posta", "Tarih", "Kaynak", "Sınıf", "Sipariş", "İzin"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary/70 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-text-secondary/50">Bu filtrede abone bulunamadı.</td></tr>
                )}
                {filteredList.map((s, i) => {
                  const checked = manualSelected.has(s.id);
                  const canSelect = !s.optedOut;
                  return (
                    <tr key={s.id}
                      onClick={() => canSelect && toggleManual(s.id)}
                      title={s.optedOut ? "Bu kişi mail/mesaj almak istemediğini bildirdi." : undefined}
                      className={`border-b border-olive-border/10 transition-colors ${
                        s.optedOut
                          ? "opacity-50 cursor-not-allowed bg-red-50/30"
                          : checked
                          ? "bg-green-50 hover:bg-green-100/70 cursor-pointer"
                          : `cursor-pointer hover:bg-cream-50 ${i % 2 ? "bg-cream-50/40" : ""}`
                      }`}
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        {canSelect ? (
                          <input type="checkbox" checked={checked} onChange={() => toggleManual(s.id)}
                            className="w-4 h-4 accent-green-700 rounded cursor-pointer" />
                        ) : (
                          <span title="İzin vermedi — seçilemiyor">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${s.optedOut ? "text-text-secondary/40 line-through" : "text-green-800"}`}>
                          {s.email}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">{s.date.slice(5)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                          s.source === "checkout" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-green-50 text-green-700 border-green-700/20"
                        }`}>{sourceLabels[s.source]}</span>
                      </td>
                      <td className="px-4 py-3">
                        {s.tier ? (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${tierConfig[s.tier].bg} ${tierConfig[s.tier].color} ${tierConfig[s.tier].border}`}>
                            {tierConfig[s.tier].label}
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-gray-50 text-gray-400 border border-gray-200">Pasif</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">{s.totalOrders > 0 ? `${s.totalOrders} · ${s.totalSpent}₺` : "—"}</td>
                      <td className="px-4 py-3">
                        {s.optedOut ? (
                          <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>
                            İzin Vermedi
                          </span>
                        ) : s.active ? (
                          <span className="flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                            Onaylı
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-medium">Pasif</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Seçim aksiyonu — kayan bar */}
          {manualSelected.size > 0 && (
            <div className="sticky bottom-4 mt-3 flex items-center justify-between bg-green-800 text-white rounded-2xl px-5 py-3.5 shadow-xl shadow-green-900/20 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">{manualSelected.size}</div>
                <div>
                  <p className="text-sm font-semibold">{manualSelected.size} kişi seçildi</p>
                  <p className="text-[11px] text-green-200">
                    {recipients.length < manualSelected.size
                      ? `${manualSelected.size - recipients.length} kişi izin vermediği için hariç — ${recipients.length} kişiye gönderilecek`
                      : [...new Set(enriched.filter(s => manualSelected.has(s.id)).map(s => s.tier ? tierConfig[s.tier].label : "Pasif"))].join(", ")
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setManualSelected(new Set())}
                  className="text-xs text-green-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  Temizle
                </button>
                <button onClick={() => { setSendMode("manual"); setTab("send"); setSent(false); }}
                  className="flex items-center gap-1.5 bg-white text-green-800 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-green-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  {recipients.length} Kişiye Mail Gönder
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MAİL GÖNDER ── */}
      {tab === "send" && (
        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <button onClick={() => { setSendMode("segment"); setSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                sendMode === "segment" ? "bg-green-700 text-white border-green-700" : "bg-white text-text-secondary border-olive-border/30 hover:bg-cream-100"
              }`}>Segmente Göre Gönder</button>
            <button onClick={() => { setSendMode("manual"); setSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                sendMode === "manual" ? "bg-green-700 text-white border-green-700" : "bg-white text-text-secondary border-olive-border/30 hover:bg-cream-100"
              }`}>
              Seçili Kişilere Gönder
              {manualSelected.size > 0 && <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{recipients.length}</span>}
            </button>
          </div>

          {/* Segment filtresi */}
          {sendMode === "segment" && (
            <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-green-900">Hedef Segment</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${recipients.length > 0 ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {recipients.length} kişi
                  </span>
                  {stats.optedOut > 0 && (
                    <span className="text-xs text-red-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>
                      {stats.optedOut} kişi otomatik hariç
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-text-secondary block mb-2">Müşteri Sınıfı</label>
                <div className="flex flex-wrap gap-2">
                  {([["all","Tüm Aktifler"], ["vip","VIP"], ["loyal","Sadık Müşteri"], ["new","Yeni Abone"]] as const).map(([v, lbl]) => {
                    const count = v === "all" ? enriched.filter(s => s.active && !s.optedOut).length : enriched.filter(s => s.tier === v && !s.optedOut).length;
                    return (
                      <button key={v} onClick={() => { setSegTier(v); setSent(false); }}
                        className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                          segTier === v
                            ? v === "all" ? "bg-green-700 text-white border-green-700"
                            : v === "vip" ? "bg-yellow-400 text-yellow-900 border-yellow-400"
                            : v === "loyal" ? "bg-purple-600 text-white border-purple-600"
                            : "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-text-secondary border-olive-border/30 hover:border-olive-border"
                        }`}
                      >{lbl} ({count})</button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Kaynak</label>
                  <div className="flex flex-col gap-1.5">
                    {(["all", "footer", "checkout"] as const).map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="src" checked={segSource === v} onChange={() => { setSegSource(v); setSent(false); }} className="accent-green-700 w-3.5 h-3.5" />
                        <span className="text-xs text-green-900">{sourceLabels[v]}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-secondary block mb-1.5">Kayıt Tarihi</label>
                  <div className="flex flex-col gap-1.5">
                    {([["all","Tüm Zamanlar"], ["7","Son 7 Gün"], ["30","Son 30 Gün"]] as const).map(([v, lbl]) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="dr" checked={segDateRange === v} onChange={() => { setSegDateRange(v); setSent(false); }} className="accent-green-700 w-3.5 h-3.5" />
                        <span className="text-xs text-green-900">{lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-olive-border/20 mt-4 pt-3">
                <button onClick={() => setShowPreview(!showPreview)} className="text-xs text-green-700 font-medium hover:underline flex items-center gap-1">
                  <svg className={`w-3.5 h-3.5 transition-transform ${showPreview ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  {showPreview ? "Gizle" : `${recipients.length} kişiyi önizle`}
                </button>
                {showPreview && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {recipients.length === 0
                      ? <p className="text-xs text-text-secondary/60 italic">Sonuç yok.</p>
                      : recipients.map(s => (
                        <span key={s.id} className="text-[11px] font-mono bg-cream-100 border border-olive-border/30 px-2 py-0.5 rounded-full text-green-800">
                          {s.email}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manuel seçim özeti */}
          {sendMode === "manual" && (
            <div className={`rounded-2xl border p-4 flex items-center justify-between ${recipients.length > 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              <div>
                <p className={`text-sm font-semibold ${recipients.length > 0 ? "text-green-800" : "text-amber-700"}`}>
                  {recipients.length > 0 ? `${recipients.length} kişi seçildi` : "Henüz kişi seçilmedi"}
                </p>
                {manualSelected.size > recipients.length && (
                  <p className="text-xs text-red-500 mt-0.5">{manualSelected.size - recipients.length} kişi izin vermediği için otomatik hariç tutuldu.</p>
                )}
              </div>
              {recipients.length === 0 && (
                <button onClick={() => setTab("list")} className="text-sm text-amber-700 underline font-medium">
                  Abone Listesine Git →
                </button>
              )}
            </div>
          )}

          {/* İçerik formu */}
          <form onSubmit={handleSend} className="bg-white rounded-2xl border border-olive-border/30 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-green-900">İçerik</h2>
              <button type="button" onClick={handleAISuggest} disabled={aiLoading || recipients.length === 0}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 disabled:opacity-50 transition-colors">
                {aiLoading
                  ? <><span className="animate-spin w-3.5 h-3.5 border-2 border-purple-300 border-t-purple-700 rounded-full inline-block" /> Düşünüyor...</>
                  : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> AI ile Öner</>
                }
              </button>
            </div>

            {aiSuggestion && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-purple-800 mb-0.5">✨ AI Önerisi</p>
                    <p className="text-[11px] text-purple-600 italic">{aiSuggestion.reason}</p>
                  </div>
                  <button type="button" onClick={() => setAiSuggestion(null)} className="text-purple-400 hover:text-purple-600 shrink-0">✕</button>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100 text-xs">
                  <p className="font-semibold text-green-900 mb-1">Konu: {aiSuggestion.subject}</p>
                  <p className="text-text-secondary whitespace-pre-line line-clamp-3">{aiSuggestion.body}</p>
                </div>
                <button type="button"
                  onClick={() => { setSubject(aiSuggestion.subject); setBody(aiSuggestion.body); const m = templates.find(t => t.id === aiSuggestion.template); if(m) setSelectedTemplate(m); setAiSuggestion(null); }}
                  className="self-start text-xs bg-purple-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-800 transition-colors">Bu öneriyi kullan</button>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-green-800 block mb-2">Şablon</label>
              <div className="flex flex-wrap gap-2">
                {templates.map(t => (
                  <button key={t.id} type="button" onClick={() => handleTemplateChange(t.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      selectedTemplate.id === t.id ? "bg-green-700 text-white border-green-700" : "border-olive-border/40 text-text-secondary hover:border-green-700/30"
                    }`}>{t.label}</button>
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border ${recipients.length === 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-700/20"}`}>
              <svg className={`w-4 h-4 shrink-0 ${recipients.length === 0 ? "text-red-400" : "text-green-700"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span className={`text-sm font-semibold ${recipients.length === 0 ? "text-red-700" : "text-green-800"}`}>
                {recipients.length === 0 ? "Alıcı seçilmedi" : `${recipients.length} kişiye gönderilecek`}
              </span>
              {recipients.length > 0 && sendMode === "segment" && (
                <span className="text-[11px] text-text-secondary/60 ml-1">— {segmentLabel()}</span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-green-800 block mb-1.5">Konu</label>
              <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="E-posta konusu"
                className="w-full border border-olive-border/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50" />
            </div>

            <div>
              <label className="text-xs font-semibold text-green-800 block mb-1.5">İçerik</label>
              <textarea required value={body} onChange={e => setBody(e.target.value)} rows={8}
                placeholder="E-posta içeriğini yazın veya AI ile oluşturun..."
                className="w-full border border-olive-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50 resize-none" />
            </div>

            {sent ? (
              <div className="bg-green-50 border border-green-700/20 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-green-700">✓ Mail {recipients.length} kişiye gönderildi.</p>
                {sendMode === "segment" && <p className="text-xs text-text-secondary mt-0.5">Segment: {segmentLabel()}</p>}
                <button type="button" onClick={() => { setSent(false); setManualSelected(new Set()); }}
                  className="mt-3 text-xs text-green-700 underline">Yeni kampanya oluştur</button>
              </div>
            ) : (
              <button type="submit" disabled={sending || recipients.length === 0}
                className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                {sending
                  ? <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" /> Gönderiliyor...</>
                  : <>{recipients.length} Kişiye Gönder{sendMode === "segment" ? ` — ${segmentLabel()}` : ""}</>
                }
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
