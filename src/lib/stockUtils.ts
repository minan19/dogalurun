import { products, type Product } from "@/data/products";

export const DEFAULT_THRESHOLD = 10;

export type StockStatus = "out" | "critical" | "low" | "ok";

export function getStockStatus(p: Product): StockStatus {
  const threshold = p.lowStockThreshold ?? DEFAULT_THRESHOLD;
  if (p.stock === 0 || !p.inStock) return "out";
  if (p.stock <= threshold) return "critical";
  if (p.stock <= threshold * 2) return "low";
  return "ok";
}

export function getStockPercentage(p: Product): number {
  const max = Math.max(p.stock, (p.lowStockThreshold ?? DEFAULT_THRESHOLD) * 4);
  return Math.min(100, Math.round((p.stock / max) * 100));
}

export function getLowStockProducts() {
  return products.filter((p) => {
    const status = getStockStatus(p);
    return status === "out" || status === "critical" || status === "low";
  });
}

export function getCriticalCount(): number {
  return products.filter((p) => {
    const s = getStockStatus(p);
    return s === "out" || s === "critical";
  }).length;
}

export const statusConfig: Record<StockStatus, { label: string; color: string; bg: string; dot: string; border: string }> = {
  out:      { label: "Tükendi",    color: "text-red-700",    bg: "bg-red-50",    dot: "bg-red-500",    border: "border-red-200" },
  critical: { label: "Kritik",     color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500", border: "border-orange-200" },
  low:      { label: "Azalıyor",   color: "text-amber-700",  bg: "bg-amber-50",  dot: "bg-amber-400",  border: "border-amber-200" },
  ok:       { label: "Normal",     color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-500",  border: "border-green-200" },
};
