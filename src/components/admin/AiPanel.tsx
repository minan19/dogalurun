"use client";

import { useState } from "react";
import { products } from "@/data/products";

const featuredProducts = [
  { id: "p1", name: "B-12 Vitamin Sprey",  category: "Enerji & Zindelik",    desc: "Enerji ve zindelik kategorisinde ön plana çıkan ürün.", score: 94 },
  { id: "p2", name: "Probiyotik Kompleks", category: "Sindirim & Bağırsak",  desc: "Sindirim desteği için öne çıkan probiyotik tablet.",     score: 88 },
  { id: "p3", name: "Omega-3 Balık Yağı", category: "Genel Sağlık",          desc: "Kalp ve beyin sağlığı için yüksek EPA/DHA içerir.",     score: 91 },
];

const improvementProducts = [
  { id: "p4", name: "Çinko & C Vitamini",     category: "Bağışıklık", desc: "Piyasada rakiplere göre fiyat-içerik dengesi zayıf." },
  { id: "p5", name: "Multivitamin Kapsülleri", category: "Genel",     desc: "İçerik güncellenmeli, B vitamini eksik formülde." },
];

// Gerçek stok verilerinden düşük / tükenmiş ürünler
const stockAlerts = products
  .filter((p) => {
    const threshold = p.lowStockThreshold ?? 10;
    return (p.stock ?? 0) <= threshold;
  })
  .map((p) => ({
    id: p.id,
    name: p.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    stock: p.stock ?? 0,
    total: 100,
    status: (p.stock ?? 0) === 0 ? ("critical" as const) : ("warning" as const),
  }));

type FeaturedAction = "featured" | "rejected" | null;
type ImprovementAction = "updated" | "rejected" | null;
type StockAction = "ordered" | "campaign" | null;

export function AiPanel() {
  // Öne Çıkan: her ürün için aksyon durumu
  const [featuredState, setFeaturedState] = useState<Record<string, FeaturedAction>>({});

  // İyileştirme: her ürün için aksiyon durumu
  const [improvementState, setImprovementState] = useState<Record<string, ImprovementAction>>({});

  // Stok: her ürün için aksiyon durumu
  const [stockState, setStockState] = useState<Record<string, StockAction>>({});

  // Toast bildirimi
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-[#2F3B1A]">AI Öneri Paneli</h1>
        <p className="text-sm text-[#5A5E52] mt-0.5">Aşağıdaki öneriler yalnızca size özeldir.</p>
      </div>

      {/* ── Öne Çıkan Ürünler ── */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8e4c8]">
          <span className="text-base font-bold text-[#2F3B1A]">Öne Çıkan Ürünler</span>
          <span className="text-[10px] text-[#5A5E52]/60 bg-[#EAF0DC] px-2 py-0.5 rounded-full">AI Önerisi</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.map((p) => {
            const state = featuredState[p.id] ?? null;
            return (
              <div key={p.id} className={`flex flex-col gap-3 p-4 rounded-xl border transition-all ${
                state === "featured" ? "bg-[#EAF0DC]/60 border-[#556B2F]/40" :
                state === "rejected" ? "bg-gray-50 border-gray-200 opacity-60" :
                "bg-[#FAFAF7] border-[#d8e4c8]"
              }`}>
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-[#EAF0DC] rounded-xl border border-[#d8e4c8] flex items-center justify-center shrink-0">
                    <span className="text-2xl opacity-40">🌿</span>
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <h3 className="text-sm font-semibold text-[#2F3B1A] leading-snug">{p.name}</h3>
                    <span className="text-[10px] text-[#7a9a40] font-medium">{p.category}</span>
                    <p className="text-[11px] text-[#5A5E52] leading-snug">{p.desc}</p>
                  </div>
                </div>
                {/* AI skoru */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#EAF0DC] rounded-full overflow-hidden">
                    <div className="h-full bg-[#556B2F] rounded-full transition-all" style={{ width: `${p.score}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#556B2F]">{p.score}</span>
                </div>
                {/* Aksiyon */}
                {state === "featured" ? (
                  <div className="flex items-center justify-between bg-[#EAF0DC] rounded-lg px-3 py-2">
                    <span className="text-[11px] text-[#556B2F] font-semibold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                      Ana sayfaya eklendi
                    </span>
                    <button
                      onClick={() => { setFeaturedState(s => ({ ...s, [p.id]: null })); showToast("Geri alındı"); }}
                      className="text-[10px] text-[#5A5E52] hover:text-red-500 underline"
                    >
                      İptal
                    </button>
                  </div>
                ) : state === "rejected" ? (
                  <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                    <span className="text-[11px] text-gray-500 font-medium">Reddedildi</span>
                    <button
                      onClick={() => { setFeaturedState(s => ({ ...s, [p.id]: null })); showToast("Geri alındı"); }}
                      className="text-[10px] text-[#5A5E52] hover:text-[#2F3B1A] underline"
                    >
                      Geri Al
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setFeaturedState(s => ({ ...s, [p.id]: "featured" })); showToast(`"${p.name}" ana sayfaya eklendi`); }}
                      className="flex-1 bg-[#556B2F] hover:bg-[#2F3B1A] text-white text-[11px] font-semibold py-2 rounded-lg transition-colors"
                    >
                      Öne Çıkar →
                    </button>
                    <button
                      onClick={() => { setFeaturedState(s => ({ ...s, [p.id]: "rejected" })); }}
                      className="px-3 py-2 border border-[#d8e4c8] text-[#5A5E52] text-[11px] rounded-lg hover:bg-[#F4F6F3] transition-colors"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── İyileştirme Gereken Ürünler ── */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8e4c8]">
          <span className="text-base font-bold text-[#2F3B1A]">İyileştirme Gereken Ürünler</span>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {improvementProducts.filter(p => !improvementState[p.id]).length} öneri
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvementProducts.filter(p => improvementState[p.id] !== "rejected").map((p) => {
            const state = improvementState[p.id] ?? null;
            return (
              <div key={p.id} className={`flex gap-3 p-4 rounded-xl border transition-all ${
                state === "updated" ? "bg-[#EAF0DC]/60 border-[#556B2F]/40" : "bg-[#FAFAF7] border-[#d8e4c8]"
              }`}>
                <div className="w-12 h-12 bg-amber-50 rounded-xl border border-amber-200/60 flex items-center justify-center shrink-0">
                  <span className="text-xl opacity-50">🌿</span>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <h3 className="text-sm font-semibold text-[#2F3B1A]">{p.name}</h3>
                  <p className="text-[11px] text-[#5A5E52] leading-snug">{p.desc}</p>
                  {state === "updated" ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#556B2F] font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                        Güncelleme isteği oluşturuldu
                      </span>
                      <button
                        onClick={() => setImprovementState(s => ({ ...s, [p.id]: null }))}
                        className="text-[10px] text-[#5A5E52] underline hover:text-red-500"
                      >Geri Al</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => { setImprovementState(s => ({ ...s, [p.id]: "updated" })); showToast(`"${p.name}" için güncelleme isteği oluşturuldu`); }}
                        className="flex items-center gap-1 text-[11px] bg-[#EAF0DC] text-[#556B2F] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#d4e8a8] transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                        </svg>
                        İçeriği Güncelle
                      </button>
                      <button
                        onClick={() => { setImprovementState(s => ({ ...s, [p.id]: "rejected" })); showToast("Öneri reddedildi"); }}
                        className="flex items-center gap-1 text-[11px] border border-[#d8e4c8] text-[#5A5E52] px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {improvementProducts.every(p => improvementState[p.id] === "rejected") && (
            <div className="col-span-2 text-center py-6 text-sm text-[#5A5E52]/50">
              Tüm öneriler işlendi.
              <button onClick={() => setImprovementState({})} className="ml-2 text-[#556B2F] underline text-xs">Sıfırla</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Stok Uyarıları ── */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8e4c8]">
          <span className="text-base font-bold text-[#2F3B1A]">Stok Uyarıları</span>
          <a href="/admin/products?filter=low-stock" className="text-[11px] text-[#556B2F] hover:underline font-medium">
            Tümünü Gör →
          </a>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {stockAlerts.map((p) => {
            const state = stockState[p.id] ?? null;
            return (
              <div key={p.id} className={`flex gap-3 p-4 rounded-xl border ${
                p.status === "critical" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  p.status === "critical" ? "bg-red-100 border border-red-200" : "bg-amber-100 border border-amber-200"
                }`}>
                  <span className="text-xl">🌿</span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#2F3B1A]">{p.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === "critical" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {p.stock} adet
                    </span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden border border-[#d8e4c8]">
                    <div
                      className={`h-full rounded-full ${p.status === "critical" ? "bg-red-500" : "bg-amber-400"}`}
                      style={{ width: `${p.stock}%` }}
                    />
                  </div>
                  {state === "ordered" ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                        Sipariş verildi
                      </span>
                      <button onClick={() => setStockState(s => ({ ...s, [p.id]: null }))} className="text-[10px] text-[#5A5E52] underline hover:text-red-500">İptal</button>
                    </div>
                  ) : state === "campaign" ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                        Kampanya bültene eklendi
                      </span>
                      <button onClick={() => setStockState(s => ({ ...s, [p.id]: null }))} className="text-[10px] text-[#5A5E52] underline hover:text-red-500">İptal</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-0.5">
                      <button
                        onClick={() => { setStockState(s => ({ ...s, [p.id]: "ordered" })); showToast(`"${p.name}" için tedarikçiye sipariş verildi`); }}
                        className="flex items-center gap-1 text-[11px] border border-[#d8e4c8] bg-white text-[#5A5E52] px-3 py-1.5 rounded-lg hover:bg-[#F4F6F3] transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
                        </svg>
                        Sipariş Ver
                      </button>
                      <button
                        onClick={() => { setStockState(s => ({ ...s, [p.id]: "campaign" })); showToast(`"${p.name}" kampanyası bültene eklendi`); }}
                        className="flex items-center gap-1 text-[11px] bg-[#556B2F] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2F3B1A] transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 0 1.126 0l7.108-4.061c.75-.43 1.683.113 1.683.977v7.22c0 .863-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 0-1.126 0l-7.108 4.061C3.933 16.315 3 15.772 3 14.909V8.69Z" />
                        </svg>
                        Kampanya Öner
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#EAF0DC] border border-[#556B2F]/20 rounded-xl shadow-lg text-sm font-semibold text-[#2F3B1A]">
          <svg className="w-4 h-4 text-[#556B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
