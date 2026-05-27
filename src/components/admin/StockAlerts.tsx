"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import {
  getStockStatus,
  getStockPercentage,
  statusConfig,
  DEFAULT_THRESHOLD,
  type StockStatus,
} from "@/lib/stockUtils";

// Ürün başına kritik stok eşiği (local state — gerçek projede DB'ye yazılır)
type ThresholdMap = Record<string, number>;

const STATUS_ORDER: StockStatus[] = ["out", "critical", "low", "ok"];

export function StockAlerts() {
  const router = useRouter();
  const [thresholds, setThresholds] = useState<ThresholdMap>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.lowStockThreshold ?? DEFAULT_THRESHOLD]))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Ürünlere dinamik threshold uygula
  const enriched = useMemo(() =>
    products.map((p) => ({
      ...p,
      lowStockThreshold: thresholds[p.id] ?? DEFAULT_THRESHOLD,
    })),
    [thresholds]
  );

  const byStatus = useMemo(() => {
    const map: Partial<Record<StockStatus, typeof enriched>> = {};
    for (const p of enriched) {
      const s = getStockStatus(p);
      if (!map[s]) map[s] = [];
      map[s]!.push(p);
    }
    return map;
  }, [enriched]);

  const criticalCount = (byStatus.out?.length ?? 0) + (byStatus.critical?.length ?? 0);
  const lowCount = byStatus.low?.length ?? 0;
  const okCount = byStatus.ok?.length ?? 0;

  const alertProducts = [
    ...(byStatus.out ?? []),
    ...(byStatus.critical ?? []),
    ...(byStatus.low ?? []),
  ];
  const displayedAlerts = showAll ? alertProducts : alertProducts.slice(0, 5);

  function startEdit(id: string, current: number) {
    setEditingId(id);
    setEditVal(String(current));
  }

  function saveEdit(id: string) {
    const val = parseInt(editVal);
    if (!isNaN(val) && val >= 1 && val <= 999) {
      setThresholds((t) => ({ ...t, [id]: val }));
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    }
    setEditingId(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#d8e4c8] bg-[#FAFAF7]">
        <div className="flex items-center gap-2.5">
          <span className="text-base">📦</span>
          <div>
            <h2 className="text-sm font-bold text-[#2F3B1A]">Stok Durumu</h2>
            <p className="text-[11px] text-[#5A5E52]">{products.length} ürün takip ediliyor</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
            🚨 {criticalCount} kritik ürün
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">

        {/* Özet kartlar */}
        <div className="grid grid-cols-4 gap-2">
          {(["out", "critical", "low", "ok"] as StockStatus[]).map((s) => {
            const cfg = statusConfig[s];
            const count = byStatus[s]?.length ?? 0;
            return (
              <div key={s} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3 text-center`}>
                <span className={`w-2 h-2 rounded-full ${cfg.dot} mx-auto block mb-1.5`} />
                <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
                <p className={`text-[10px] font-semibold ${cfg.color} opacity-80`}>{cfg.label}</p>
              </div>
            );
          })}
        </div>

        {/* Uyarı listesi */}
        {alertProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="text-3xl">✅</span>
            <p className="text-sm font-semibold text-green-700">Tüm stoklar yeterli seviyede</p>
            <p className="text-xs text-[#5A5E52]">{okCount} ürün normal stok durumunda</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-[#5A5E52] uppercase tracking-wide">Uyarı Gerektiren Ürünler</p>
              <p className="text-[10px] text-[#5A5E52]">Eşiği tıklayarak düzenleyin</p>
            </div>

            {displayedAlerts.map((p) => {
              const status = getStockStatus(p);
              const cfg = statusConfig[status];
              const pct = getStockPercentage(p);
              const threshold = thresholds[p.id] ?? DEFAULT_THRESHOLD;
              const isEditing = editingId === p.id;

              return (
                <div key={p.id} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        <p className="text-xs font-bold text-[#2F3B1A] truncate">{p.nameKey}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${cfg.border} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5A5E52] mt-0.5 ps-3.5">{p.brand} · {p.amount}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-base font-bold ${cfg.color}`}>{p.stock}</p>
                      <p className="text-[10px] text-[#5A5E52]">adet</p>
                    </div>
                  </div>

                  {/* Stok çubuğu */}
                  <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === "out" ? "bg-red-500" :
                        status === "critical" ? "bg-orange-500" : "bg-amber-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Eşik ayarı */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#5A5E52]">Kritik eşik:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1} max={999}
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(p.id); if (e.key === "Escape") setEditingId(null); }}
                          autoFocus
                          className="w-16 text-xs text-center border border-[#556B2F] rounded-lg px-2 py-1 focus:outline-none"
                        />
                        <button onClick={() => saveEdit(p.id)}
                          className="text-[10px] bg-[#556B2F] text-white px-2 py-1 rounded-lg font-semibold hover:bg-[#2F3B1A] transition-colors">
                          Kaydet
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="text-[10px] text-[#5A5E52] px-1.5 py-1 hover:text-[#2F3B1A]">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(p.id, threshold)}
                        className={`text-[10px] font-bold underline-offset-2 hover:underline transition-colors ${cfg.color}`}
                        title="Kritik stok eşiğini düzenle"
                      >
                        {savedId === p.id ? "✓ Kaydedildi" : `${threshold} adet`}
                      </button>
                    )}
                    <span className="ms-auto text-[10px] text-[#5A5E52]">
                      {p.stock === 0 ? "⚠️ Sipariş ver!" : `${threshold - p.stock > 0 ? threshold - p.stock + " adet eksik" : "Sipariş önerilir"}`}
                    </span>
                  </div>
                </div>
              );
            })}

            {alertProducts.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-[#556B2F] font-semibold hover:text-[#2F3B1A] transition-colors text-center py-1"
              >
                {showAll ? "Daha az göster ↑" : `${alertProducts.length - 5} ürün daha göster ↓`}
              </button>
            )}
          </div>
        )}

        {/* Eylemler */}
        <div className="flex items-center justify-between pt-2 border-t border-[#d8e4c8]/60">
          <button
            onClick={() => router.push("/admin/products")}
            className="text-xs text-[#556B2F] font-semibold hover:text-[#2F3B1A] transition-colors flex items-center gap-1"
          >
            Tüm ürünleri yönet →
          </button>
          {criticalCount > 0 && (
            <span className="text-[10px] text-red-600 font-medium">
              {criticalCount} ürün için tedarik gerekli
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
