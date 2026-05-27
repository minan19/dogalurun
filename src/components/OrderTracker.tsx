"use client";

import { useState } from "react";

type Status = "preparing" | "shipped" | "out_for_delivery" | "delivered";

interface OrderInfo {
  id: string;
  date: string;
  status: Status;
  customer: string;
  city: string;
  items: { name: string; qty: number; price: number }[];
  cargo: { company: string; trackNo: string };
  estimatedDate: string;
  events: { date: string; time: string; desc: string; done: boolean }[];
}

// Mock veri — Supabase bağlandığında gerçek veri çekilecek
const mockOrders: Record<string, OrderInfo> = {
  "HS-2026-10841": {
    id: "HS-2026-10841", date: "20 Mar 2026",
    status: "shipped", customer: "Ayşe Kaya", city: "İstanbul",
    items: [
      { name: "Omega-3 Balık Yağı (90 Kapsül)", qty: 2, price: 690 },
      { name: "Vitamin D3+K2 (60 Kapsül)",       qty: 1, price: 289 },
    ],
    cargo: { company: "Yurtiçi Kargo", trackNo: "YK8273649201" },
    estimatedDate: "22 Mar 2026",
    events: [
      { date: "20 Mar", time: "14:32", desc: "Sipariş alındı",               done: true },
      { date: "20 Mar", time: "16:10", desc: "Ödeme onaylandı",              done: true },
      { date: "21 Mar", time: "09:45", desc: "Paketlendi ve kargoya verildi",done: true },
      { date: "21 Mar", time: "18:00", desc: "Transfer merkezinde",          done: true },
      { date: "22 Mar", time: "—",     desc: "Dağıtım aracında",             done: false },
      { date: "22 Mar", time: "—",     desc: "Teslim edildi",                done: false },
    ],
  },
  "HS-2026-10839": {
    id: "HS-2026-10839", date: "19 Mar 2026",
    status: "delivered", customer: "Fatma Demir", city: "İzmir",
    items: [{ name: "Magnezyum Bisglinat (120 Tablet)", qty: 2, price: 398 }],
    cargo: { company: "Aras Kargo", trackNo: "AR9910283746" },
    estimatedDate: "21 Mar 2026",
    events: [
      { date: "19 Mar", time: "10:15", desc: "Sipariş alındı",               done: true },
      { date: "19 Mar", time: "11:30", desc: "Ödeme onaylandı",              done: true },
      { date: "19 Mar", time: "15:00", desc: "Paketlendi ve kargoya verildi",done: true },
      { date: "20 Mar", time: "08:20", desc: "Transfer merkezinde",          done: true },
      { date: "21 Mar", time: "11:40", desc: "Dağıtım aracında",             done: true },
      { date: "21 Mar", time: "14:55", desc: "Teslim edildi",                done: true },
    ],
  },
};

const statusSteps: { key: Status; label: string; icon: string }[] = [
  { key: "preparing",        label: "Hazırlanıyor", icon: "📦" },
  { key: "shipped",          label: "Kargoda",      icon: "🚚" },
  { key: "out_for_delivery", label: "Dağıtımda",    icon: "🛵" },
  { key: "delivered",        label: "Teslim Edildi",icon: "✅" },
];

const statusIndex: Record<Status, number> = {
  preparing: 0, shipped: 1, out_for_delivery: 2, delivered: 3,
};

function formatOrderInput(raw: string): string {
  // Remove everything except alphanumeric
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // Format: XX-YYYY-NNNNN  (2 letters, dash, 4 digits, dash, rest)
  if (clean.length <= 2) return clean;
  if (clean.length <= 6) return clean.slice(0, 2) + "-" + clean.slice(2);
  return clean.slice(0, 2) + "-" + clean.slice(2, 6) + "-" + clean.slice(6, 11);
}

export function OrderTracker() {
  const [input, setInput] = useState("");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState("");

  function handleInput(value: string) {
    setInput(formatOrderInput(value));
  }

  function search() {
    const found = mockOrders[input.trim()];
    if (found) { setOrder(found); setError(""); }
    else { setOrder(null); setError("Bu sipariş numarasına ait kayıt bulunamadı."); }
  }

  const currentStep = order ? statusIndex[order.status] : -1;

  return (
    <div className="flex flex-col gap-6">
      {/* Arama */}
      <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
        <label className="text-xs font-semibold text-green-800 block mb-2">Sipariş Numarası</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="HS-2026-XXXXX"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            className="flex-1 border border-olive-border/40 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-green-700/50 bg-cream-50 text-text-primary placeholder:text-text-secondary/40"
          />
          <button
            onClick={search}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Sorgula
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        <p className="mt-2 text-[11px] text-text-secondary/50">Örnek: HS-2026-10841 veya HS-2026-10839</p>
      </div>

      {order && (
        <>
          {/* Durum çubuğu */}
          <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-green-900">Sipariş #{order.id}</h2>
              <span className="text-[11px] text-text-secondary">{order.date}</span>
            </div>
            <p className="text-xs text-text-secondary mb-5">
              Tahmini teslimat: <strong className="text-green-800">{order.estimatedDate}</strong>
              {" · "}{order.cargo.company}: <strong className="text-green-800">{order.cargo.trackNo}</strong>
            </p>

            {/* Adım göstergesi */}
            <div className="flex items-center gap-0">
              {statusSteps.map((s, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={s.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        done ? "border-green-700 bg-green-700" : "border-olive-border/40 bg-white"
                      } ${active ? "ring-2 ring-green-700/20 ring-offset-2" : ""}`}>
                        <span className={done ? "grayscale-0" : "grayscale opacity-30"}>{s.icon}</span>
                      </div>
                      <span className={`text-[10px] font-medium text-center leading-tight ${done ? "text-green-700" : "text-text-secondary/40"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStep ? "bg-green-700" : "bg-olive-border/30"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kargo olayları */}
          <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
            <h3 className="text-sm font-bold text-green-900 mb-4">Kargo Hareketleri</h3>
            <ul className="flex flex-col gap-0">
              {order.events.map((ev, i) => (
                <li key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 ${ev.done ? "bg-green-700 border-green-700" : "bg-white border-olive-border/40"}`} />
                    {i < order.events.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${ev.done ? "bg-green-700/30" : "bg-olive-border/20"}`} style={{ minHeight: "24px" }} />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className={`text-sm font-medium leading-snug ${ev.done ? "text-green-900" : "text-text-secondary/40"}`}>
                      {ev.desc}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${ev.done ? "text-text-secondary/60" : "text-text-secondary/30"}`}>
                      {ev.date}{ev.time !== "—" ? ` · ${ev.time}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sipariş özeti */}
          <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
            <h3 className="text-sm font-bold text-green-900 mb-3">Ürünler</h3>
            <ul className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{item.name} <span className="text-text-secondary/50">x{item.qty}</span></span>
                  <span className="font-semibold text-green-800">{item.price.toLocaleString("tr-TR")} ₺</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
