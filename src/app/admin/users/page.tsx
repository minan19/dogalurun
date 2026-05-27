"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { exportCsv } from "@/lib/exportCsv";

type Segment = "Yeni" | "Sadık" | "Gümüş" | "VIP" | "Pasif";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  total: number;
  joined: string;
  lastOrder: string;
  segment: Segment;
  points: number;
}

const users: User[] = [
  { id: 1,  name: "Ayşe Kaya",        email: "ayse@mail.com",     phone: "0532 111 22 33", orders: 12, total: 5840,  joined: "Oca 2026", lastOrder: "18 Mar 2026", segment: "VIP",   points: 584 },
  { id: 2,  name: "Mehmet Yılmaz",    email: "mehmet@mail.com",   phone: "0541 234 56 78", orders: 4,  total: 1628,  joined: "Şub 2026", lastOrder: "15 Mar 2026", segment: "Gümüş", points: 163 },
  { id: 3,  name: "Fatma Demir",      email: "fatma@mail.com",    phone: "0555 987 65 43", orders: 18, total: 8390,  joined: "Ara 2025", lastOrder: "20 Mar 2026", segment: "VIP",   points: 839 },
  { id: 4,  name: "Ali Çelik",        email: "ali@mail.com",      phone: "0506 321 09 87", orders: 1,  total: 289,   joined: "Mar 2026", lastOrder: "21 Mar 2026", segment: "Yeni",  points: 28  },
  { id: 5,  name: "Zeynep Arslan",    email: "zeynep@mail.com",   phone: "0530 444 55 66", orders: 6,  total: 2340,  joined: "Oca 2026", lastOrder: "10 Mar 2026", segment: "Gümüş", points: 234 },
  { id: 6,  name: "Hasan Şahin",      email: "hasan@mail.com",    phone: "0542 778 99 00", orders: 2,  total: 520,   joined: "Kas 2025", lastOrder: "10 Oca 2026", segment: "Pasif", points: 52  },
  { id: 7,  name: "Merve Koç",        email: "merve@mail.com",    phone: "0551 112 33 44", orders: 3,  total: 780,   joined: "Şub 2026", lastOrder: "05 Mar 2026", segment: "Sadık", points: 78  },
  { id: 8,  name: "Emre Güneş",       email: "emre@mail.com",     phone: "0533 556 77 88", orders: 1,  total: 349,   joined: "Mar 2026", lastOrder: "19 Mar 2026", segment: "Yeni",  points: 34  },
  { id: 9,  name: "Selin Özkan",      email: "selin@mail.com",    phone: "0546 223 44 55", orders: 7,  total: 3210,  joined: "Eki 2025", lastOrder: "17 Mar 2026", segment: "Gümüş", points: 321 },
  { id: 10, name: "Burak Aydın",      email: "burak@mail.com",    phone: "0538 667 88 99", orders: 0,  total: 0,     joined: "Mar 2026", lastOrder: "—",           segment: "Yeni",  points: 0   },
];

const segmentConfig: Record<Segment, { color: string; icon: string; desc: string }> = {
  Yeni:   { color: "bg-emerald-50 text-emerald-700 border-emerald-200",  icon: "🌱", desc: "İlk siparişini bekleyenler" },
  Sadık:  { color: "bg-blue-50 text-blue-700 border-blue-200",           icon: "🔁", desc: "2+ sipariş vermiş" },
  Gümüş: { color: "bg-slate-100 text-slate-700 border-slate-200",       icon: "🥈", desc: "1.000–4.999₺ toplam" },
  VIP:    { color: "bg-amber-50 text-amber-700 border-amber-200",        icon: "👑", desc: "5.000₺+ toplam" },
  Pasif:  { color: "bg-red-50 text-red-600 border-red-200",             icon: "💤", desc: "90+ gün sipariş yok" },
};

const allSegments: (Segment | "Tümü")[] = ["Tümü", "Yeni", "Sadık", "Gümüş", "VIP", "Pasif"];

// Mock kampanyalar (fiyat&kampanya sayfasındaki ile aynı)
const mockCampaigns = [
  { id: "c1", name: "Bahar İndirimi — Herkese",   code: "BAHAR15",      value: "%15",  segment: "Tüm Müşteriler", active: true },
  { id: "c2", name: "Hoş Geldin — İlk Alışveriş", code: "ILKSIPARIS20", value: "%20",  segment: "Yeni Müşteriler", active: true },
  { id: "c3", name: "VIP Özel — Erken Erişim",    code: "VIPSEL100",    value: "100₺", segment: "VIP / Altın Üyeler", active: true },
  { id: "c4", name: "Sizi Özledik — Geri Dönün",  code: "GERIDON25",    value: "%25",  segment: "Pasif Müşteriler", active: true },
  { id: "c5", name: "Gümüş Üye Avantajı",         code: "GUMUS10",      value: "%10",  segment: "Gümüş Üyeler", active: true },
];

interface CampaignModal { userId: number; userName: string; userEmail: string }

export default function AdminUsersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [segFilter, setSegFilter] = useState<Segment | "Tümü">("Tümü");
  const [sortBy, setSortBy] = useState<"name" | "total" | "orders" | "joined">("total");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [campaignModal, setCampaignModal] = useState<CampaignModal | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [campaignSent, setCampaignSent] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase();
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchSeg = segFilter === "Tümü" || u.segment === segFilter;
      return matchQ && matchSeg;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "name")   return a.name.localeCompare(b.name, "tr");
      if (sortBy === "total")  return b.total - a.total;
      if (sortBy === "orders") return b.orders - a.orders;
      return 0;
    });
    return list;
  }, [search, segFilter, sortBy]);

  const stats = useMemo(() => ({
    total: users.length,
    vip: users.filter(u => u.segment === "VIP").length,
    new: users.filter(u => u.segment === "Yeni").length,
    passive: users.filter(u => u.segment === "Pasif").length,
    totalRevenue: users.reduce((s, u) => s + u.total, 0),
  }), []);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-5">

          {/* Başlık */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#2F3B1A]">Kullanıcılar</h1>
              <p className="text-sm text-[#5A5E52]">{users.length} kayıtlı üye</p>
            </div>
            <button
              onClick={() => exportCsv("kullanicilar", filtered.map((u) => ({
                "Ad Soyad": u.name,
                "E-posta": u.email,
                "Telefon": u.phone,
                "Sipariş Sayısı": u.orders,
                "Toplam Harcama (₺)": u.total,
                "Puan": u.points,
                "Segment": u.segment,
                "Kayıt Tarihi": u.joined,
                "Son Sipariş": u.lastOrder,
              })))}
              className="flex items-center gap-2 text-sm border border-[#d8e4c8] bg-white text-[#5A5E52] px-3 py-2.5 rounded-xl hover:bg-[#F4F6F3] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Excel İndir
            </button>
          </div>

          {/* KPI şeridi */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Toplam Üye",     value: stats.total,                              color: "text-[#2F3B1A]" },
              { label: "👑 VIP",          value: stats.vip,                                color: "text-amber-600" },
              { label: "🌱 Yeni",         value: stats.new,                                color: "text-emerald-600" },
              { label: "💤 Pasif",        value: stats.passive,                            color: "text-red-500" },
              { label: "Toplam Ciro",    value: stats.totalRevenue.toLocaleString("tr-TR") + " ₺", color: "text-[#556B2F]" },
            ].map((k) => (
              <div key={k.label} className="bg-white rounded-xl border border-[#d8e4c8] p-4 text-center">
                <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-[11px] text-[#5A5E52] mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Segment filtre */}
          <div className="flex flex-wrap gap-2">
            {allSegments.map((seg) => {
              const cnt = seg === "Tümü" ? users.length : users.filter(u => u.segment === seg).length;
              const cfg = seg !== "Tümü" ? segmentConfig[seg] : null;
              return (
                <button key={seg} onClick={() => setSegFilter(seg)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1.5 ${
                    segFilter === seg
                      ? seg === "Tümü" ? "bg-[#556B2F] text-white border-[#556B2F]" : cfg!.color + " border-opacity-100"
                      : "border-[#d8e4c8] text-[#5A5E52] hover:border-[#556B2F]/40"
                  }`}>
                  {cfg ? cfg.icon + " " : ""}{seg} <span className="opacity-60">({cnt})</span>
                </button>
              );
            })}
          </div>

          {/* Arama + sıralama */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input type="text" placeholder="Ad veya e-posta ara..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#d8e4c8] rounded-xl focus:outline-none focus:border-[#556B2F]/50 bg-white" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-[#d8e4c8] rounded-xl px-4 py-2.5 bg-white text-[#5A5E52] focus:outline-none focus:border-[#556B2F]/50">
              <option value="total">Harcamaya göre</option>
              <option value="orders">Sipariş sayısına göre</option>
              <option value="name">İsme göre</option>
            </select>
          </div>

          {/* Tablo */}
          <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide px-4 py-3 border-b border-[#d8e4c8] bg-[#FAFAF7]">
              <span>Üye</span>
              <span>E-posta</span>
              <span className="text-center">Sipariş</span>
              <span className="text-center">Harcama</span>
              <span className="text-center">Puan</span>
              <span className="text-center">Segment</span>
            </div>

            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-[#5A5E52]">Sonuç bulunamadı.</div>
            )}

            {filtered.map((u) => {
              const cfg = segmentConfig[u.segment];
              const isExpanded = expandedId === u.id;
              return (
                <div key={u.id} className="border-b border-[#d8e4c8]/50 last:border-0">
                  <div
                    className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center px-4 py-3 hover:bg-[#EAF0DC]/10 cursor-pointer transition-colors ${isExpanded ? "bg-[#EAF0DC]/20" : ""}`}
                    onClick={() => setExpandedId(isExpanded ? null : u.id)}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#556B2F] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#2F3B1A]">{u.name}</p>
                        <p className="text-[10px] text-[#5A5E52]">{u.joined}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#5A5E52]">{u.email}</p>
                    <p className="text-xs text-center font-semibold text-[#2F3B1A]">{u.orders}</p>
                    <p className="text-xs text-center font-bold text-[#556B2F]">{u.total > 0 ? u.total.toLocaleString("tr-TR") + " ₺" : "—"}</p>
                    <p className="text-xs text-center text-[#5A5E52]">{u.points > 0 ? u.points + " P" : "—"}</p>
                    <div className="flex justify-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                        {cfg.icon} {u.segment}
                      </span>
                    </div>
                  </div>

                  {/* Genişletilmiş detay */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-[#EAF0DC]/10 border-t border-[#d8e4c8]/30">
                      <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <p className="text-[10px] text-[#5A5E52] uppercase tracking-wide mb-1">Telefon</p>
                          <p className="text-xs font-semibold text-[#2F3B1A]">{u.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5A5E52] uppercase tracking-wide mb-1">Son Sipariş</p>
                          <p className="text-xs font-semibold text-[#2F3B1A]">{u.lastOrder}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5A5E52] uppercase tracking-wide mb-1">Segment Tanımı</p>
                          <p className="text-xs text-[#5A5E52]">{cfg.desc}</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[10px] text-[#5A5E52] uppercase tracking-wide mb-0.5">İşlemler</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedCampaign(""); setCampaignSent(null); setCampaignModal({ userId: u.id, userName: u.name, userEmail: u.email }); }}
                            className="text-[11px] bg-[#556B2F] text-white px-3 py-1.5 rounded-lg hover:bg-[#2F3B1A] transition-colors font-semibold text-left"
                          >
                            Kampanya Gönder
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders?user=${encodeURIComponent(u.name)}`); }}
                            className="text-[11px] bg-white border border-[#d8e4c8] text-[#5A5E52] px-3 py-1.5 rounded-lg hover:bg-[#FAFAF5] transition-colors font-semibold text-left"
                          >
                            Siparişlerini Gör
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Segment açıklaması */}
          <div className="bg-white rounded-2xl border border-[#d8e4c8] p-4">
            <p className="text-xs font-bold text-[#2F3B1A] mb-3">Segment Tanımları</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.entries(segmentConfig) as [Segment, typeof segmentConfig[Segment]][]).map(([seg, cfg]) => (
                <div key={seg} className={`rounded-xl border px-3 py-2 ${cfg.color}`}>
                  <p className="text-[11px] font-bold">{cfg.icon} {seg}</p>
                  <p className="text-[10px] opacity-80 mt-0.5 leading-tight">{cfg.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Kampanya Gönder Modal */}
      {campaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setCampaignModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            {/* Başlık */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#2F3B1A]">Kampanya Gönder</h2>
                <p className="text-xs text-[#5A5E52] mt-0.5">{campaignModal.userName} · {campaignModal.userEmail}</p>
              </div>
              <button onClick={() => setCampaignModal(null)} className="text-[#9ca3af] hover:text-[#5A5E52] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {campaignSent ? (
              /* Başarı ekranı */
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">✅</div>
                <p className="text-sm font-bold text-[#2F3B1A] text-center">Kampanya başarıyla gönderildi!</p>
                <div className="bg-[#EAF0DC] rounded-xl px-4 py-2 text-center">
                  <p className="text-xs font-semibold text-[#556B2F]">{campaignSent}</p>
                  <p className="text-[10px] text-[#5A5E52] mt-0.5">→ {campaignModal.userEmail}</p>
                </div>
                <button onClick={() => setCampaignModal(null)} className="mt-2 text-xs bg-[#556B2F] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#2F3B1A] transition-colors">
                  Kapat
                </button>
              </div>
            ) : (
              <>
                {/* Kampanya listesi */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Aktif Kampanyalar</p>
                  {mockCampaigns.map((c) => (
                    <label key={c.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedCampaign === c.id
                          ? "border-[#556B2F] bg-[#EAF0DC]/50"
                          : "border-[#d8e4c8] hover:border-[#556B2F]/40"
                      }`}
                    >
                      <input type="radio" name="campaign" value={c.id} checked={selectedCampaign === c.id}
                        onChange={() => setSelectedCampaign(c.id)} className="mt-0.5 accent-[#556B2F]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#2F3B1A] leading-tight">{c.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-[#EAF0DC] text-[#556B2F] px-1.5 py-0.5 rounded font-bold">{c.value} indirim</span>
                          <span className="text-[10px] font-mono text-[#5A5E52] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">{c.code}</span>
                        </div>
                        <p className="text-[10px] text-[#5A5E52]/70 mt-0.5">{c.segment}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Gönder butonu */}
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setCampaignModal(null)}
                    className="flex-1 text-sm border border-[#d8e4c8] text-[#5A5E52] py-2.5 rounded-xl hover:bg-[#FAFAF5] transition-colors font-medium">
                    İptal
                  </button>
                  <button
                    disabled={!selectedCampaign}
                    onClick={() => {
                      const camp = mockCampaigns.find(c => c.id === selectedCampaign);
                      if (camp) setCampaignSent(`${camp.name} (${camp.code})`);
                    }}
                    className="flex-1 text-sm bg-[#556B2F] disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl hover:bg-[#2F3B1A] transition-colors font-semibold"
                  >
                    Gönder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
