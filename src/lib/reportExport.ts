/**
 * Hüda-i Şifa — Profesyonel Rapor Export Kütüphanesi
 * Desteklenen formatlar: Excel (.xlsx) · PDF (.pdf) · CSV (.csv)
 */

import type { RegionalStat, ZoneStat, EnrichedOrder } from "@/store/orderStore";
import type { ShippingZone } from "@/lib/geoData";
import { ZONE_CONFIG } from "@/lib/geoData";
import { products } from "@/data/products";

// ── Tip tanımları ─────────────────────────────────────────────────────────────

export interface CustomerProductRow {
  customerName: string;
  email: string;
  countryCode: string;
  city: string;
  zone: ShippingZone;
  zoneName: string;
  orderId: string;
  orderDate: string;
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  costPrice: number;
  grossProfit: number;
  marginPct: number;
  orderStatus: string;
}

export interface ProfitRow {
  productName: string;
  totalQty: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  marginPct: number;
}

export interface ReportData {
  zoneSummary: ZoneStat[];
  countrySummary: RegionalStat[];
  customerProducts: CustomerProductRow[];
  productProfits: ProfitRow[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgMarginPct: number;
  generatedAt: string;
  periodLabel: string;
}

// ── Ürün maliyet lookup (O(1)) ────────────────────────────────────────────────
const _productCostMap = new Map<string, { costPrice: number; marginPct: number }>();
for (const p of products) {
  // Sipariş ürün adları ürün amount'unu içermeyebilir — isim bazlı eşleşme
  const key = p.amount.toLowerCase(); // e.g. "60 kapsül"
  _productCostMap.set(p.brand.toLowerCase() + " " + p.amount.toLowerCase(), {
    costPrice: p.costPrice ?? Math.round(p.price * 0.45),
    marginPct: p.marginPct ?? 55,
  });
}

// Sipariş item adından maliyet tahmini (fallback: %45 maliyet oranı varsayımı)
function getCostForItem(name: string, unitPrice: number): { costPrice: number; marginPct: number } {
  const nameLower = name.toLowerCase();
  for (const [, val] of _productCostMap) {
    if (nameLower.includes(val.costPrice.toString())) continue; // skip number matches
  }
  // products tablosundan isim benzerliği ile eşleştir
  for (const p of products) {
    const pName = p.amount.toLowerCase();
    if (nameLower.includes(pName) || pName.includes(nameLower.split(" ")[0])) {
      return { costPrice: p.costPrice ?? Math.round(unitPrice * 0.45), marginPct: p.marginPct ?? 55 };
    }
  }
  // Fallback: %45 maliyet
  return { costPrice: Math.round(unitPrice * 0.45), marginPct: 55 };
}

function formatDate() {
  return new Date().toLocaleString("tr-TR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Rapor verisi oluştur ──────────────────────────────────────────────────────
export function buildReportData(
  orders: EnrichedOrder[],
  zoneSummary: ZoneStat[],
  countrySummary: RegionalStat[],
  periodLabel = "Tüm Zamanlar"
): ReportData {
  const customerProducts: CustomerProductRow[] = [];
  const productProfitMap = new Map<string, ProfitRow>();

  for (const order of orders) {
    const loc = order.location;
    const zoneName = ZONE_CONFIG[loc.zone]?.name ?? loc.zone;

    for (const item of order.items) {
      const { costPrice, marginPct } = getCostForItem(item.name, item.price);
      const lineTotal = item.qty * item.price;
      const totalCost = item.qty * costPrice;
      const grossProfit = lineTotal - totalCost;

      customerProducts.push({
        customerName: order.customer,
        email: order.email,
        countryCode: loc.countryCode,
        city: loc.city,
        zone: loc.zone,
        zoneName,
        orderId: order.id,
        orderDate: order.dateISO,
        productName: item.name,
        qty: item.qty,
        unitPrice: item.price,
        lineTotal,
        costPrice,
        grossProfit,
        marginPct,
        orderStatus: order.status,
      });

      // Ürün karı topla
      if (!productProfitMap.has(item.name)) {
        productProfitMap.set(item.name, { productName: item.name, totalQty: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0, marginPct });
      }
      const pp = productProfitMap.get(item.name)!;
      pp.totalQty += item.qty;
      pp.totalRevenue += lineTotal;
      pp.totalCost += totalCost;
      pp.totalProfit += grossProfit;
    }
  }

  const productProfits = [...productProfitMap.values()]
    .map((pp) => ({ ...pp, marginPct: pp.totalRevenue > 0 ? Math.round((pp.totalProfit / pp.totalRevenue) * 100) : 0 }))
    .sort((a, b) => b.totalProfit - a.totalProfit);

  const totalRevenue = customerProducts.reduce((s, r) => s + r.lineTotal, 0);
  const totalCost = customerProducts.reduce((s, r) => s + r.costPrice * r.qty, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMarginPct = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  return {
    zoneSummary,
    countrySummary,
    customerProducts,
    productProfits,
    totalRevenue,
    totalCost,
    totalProfit,
    avgMarginPct,
    generatedAt: formatDate(),
    periodLabel,
  };
}

// ── STATUS Türkçe ──────────────────────────────────────────────────────────────
const STATUS_TR: Record<string, string> = {
  preparing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal",
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXCEL EXPORT (.xlsx) — çok sayfalı
// ═══════════════════════════════════════════════════════════════════════════════
export async function exportExcel(data: ReportData, filename = `hudaisifa-rapor-${today()}`) {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();

  // ── Sayfa 1: Genel Özet ──────────────────────────────────────────────────
  const summaryRows = [
    ["Hüda-i Şifa — Bölgesel Rapor"],
    [`Oluşturulma: ${data.generatedAt}`, "", `Dönem: ${data.periodLabel}`],
    [],
    ["METRİK", "DEĞER"],
    ["Toplam Ciro (₺)", data.totalRevenue],
    ["Toplam Maliyet (₺)", data.totalCost],
    ["Brüt Kâr (₺)", data.totalProfit],
    ["Ortalama Kar Marjı (%)", data.avgMarginPct],
    ["Toplam Sipariş", data.customerProducts.length > 0 ? new Set(data.customerProducts.map((r) => r.orderId)).size : 0],
    ["Toplam Müşteri", new Set(data.customerProducts.map((r) => r.email)).size],
    ["Satış Yapılan Ülke", new Set(data.customerProducts.map((r) => r.countryCode)).size],
    [],
    ["BÖLGE", "SİPARİŞ", "CİRO (₺)", "PAY (%)"],
    ...data.zoneSummary.map((z) => [z.zoneName, z.orderCount, z.revenue, z.pct]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
  ws1["!cols"] = [{ wch: 28 }, { wch: 18 }, { wch: 18 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Genel Özet");

  // ── Sayfa 2: Ülke Bazında ────────────────────────────────────────────────
  const countryHeader = ["ÜLKE", "ÜLKE KODU", "BÖLGE", "SİPARİŞ", "CİRO (₺)", "ORT. SİPARİŞ (₺)", "PAY (%)"];
  const countryRows = data.countrySummary.map((r) => [
    r.countryName, r.countryCode, r.zoneName,
    r.orderCount, r.revenue, r.avgOrder,
    data.totalRevenue > 0 ? Math.round((r.revenue / data.totalRevenue) * 100) : 0,
  ]);
  const ws2 = XLSX.utils.aoa_to_sheet([countryHeader, ...countryRows]);
  ws2["!cols"] = [{ wch: 22 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 14 }, { wch: 18 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Ülke Satışları");

  // ── Sayfa 3: Ürün Kârlılığı ──────────────────────────────────────────────
  const profitHeader = ["ÜRÜN", "TOPLAM ADET", "CİRO (₺)", "MALİYET (₺)", "BRÜT KAR (₺)", "KAR MARJI (%)"];
  const profitRows = data.productProfits.map((p) => [
    p.productName, p.totalQty, p.totalRevenue, p.totalCost, p.totalProfit, p.marginPct,
  ]);
  // Toplam satırı
  profitRows.push([
    "TOPLAM",
    data.productProfits.reduce((s, p) => s + p.totalQty, 0),
    data.totalRevenue, data.totalCost, data.totalProfit, data.avgMarginPct,
  ]);
  const ws3 = XLSX.utils.aoa_to_sheet([profitHeader, ...profitRows]);
  ws3["!cols"] = [{ wch: 26 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Ürün Kârlılığı");

  // ── Sayfa 4: Müşteri + Ürün Detayı ──────────────────────────────────────
  const detailHeader = [
    "MÜŞTERİ", "E-POSTA", "ÜLKE", "ŞEHİR", "BÖLGE",
    "SİPARİŞ NO", "TARİH", "DURUM",
    "ÜRÜN", "ADET", "BİRİM FİYAT (₺)", "TUTAR (₺)",
    "BİRİM MALİYET (₺)", "BRÜT KAR (₺)", "KAR MARJI (%)",
  ];
  const detailRows = data.customerProducts.map((r) => [
    r.customerName, r.email, r.countryCode, r.city, r.zoneName,
    r.orderId, r.orderDate, STATUS_TR[r.orderStatus] ?? r.orderStatus,
    r.productName, r.qty, r.unitPrice, r.lineTotal,
    r.costPrice, r.grossProfit, r.marginPct,
  ]);
  const ws4 = XLSX.utils.aoa_to_sheet([detailHeader, ...detailRows]);
  ws4["!cols"] = [
    { wch: 20 }, { wch: 24 }, { wch: 8 }, { wch: 14 }, { wch: 20 },
    { wch: 18 }, { wch: 12 }, { wch: 14 },
    { wch: 22 }, { wch: 8 }, { wch: 16 }, { wch: 14 },
    { wch: 16 }, { wch: 14 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws4, "Müşteri-Ürün Detayı");

  // ── Sayfa 5: Müşteri Özeti ────────────────────────────────────────────────
  const custMap = new Map<string, {
    name: string; email: string; country: string; city: string; zone: string;
    orders: Set<string>; revenue: number; cost: number; profit: number; products: string[];
  }>();
  for (const r of data.customerProducts) {
    if (!custMap.has(r.email)) {
      custMap.set(r.email, { name: r.customerName, email: r.email, country: r.countryCode, city: r.city, zone: r.zoneName, orders: new Set(), revenue: 0, cost: 0, profit: 0, products: [] });
    }
    const c = custMap.get(r.email)!;
    c.orders.add(r.orderId);
    c.revenue += r.lineTotal;
    c.cost += r.costPrice * r.qty;
    c.profit += r.grossProfit;
    if (!c.products.includes(r.productName)) c.products.push(r.productName);
  }
  const custHeader = ["MÜŞTERİ", "E-POSTA", "ÜLKE", "ŞEHİR", "BÖLGE", "SİPARİŞ SAYISI", "TOPLAM CİRO (₺)", "TOPLAM KAR (₺)", "MARJ (%)", "SATIN ALINAN ÜRÜNLER"];
  const custRows = [...custMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .map((c) => [
      c.name, c.email, c.country, c.city, c.zone,
      c.orders.size, c.revenue, c.profit,
      c.revenue > 0 ? Math.round((c.profit / c.revenue) * 100) : 0,
      c.products.join(", "),
    ]);
  const ws5 = XLSX.utils.aoa_to_sheet([custHeader, ...custRows]);
  ws5["!cols"] = [{ wch: 20 }, { wch: 26 }, { wch: 8 }, { wch: 14 }, { wch: 20 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws5, "Müşteri Özeti");

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PDF EXPORT (.pdf)
// ═══════════════════════════════════════════════════════════════════════════════
export async function exportPDF(data: ReportData, filename = `hudaisifa-rapor-${today()}`) {
  const { jsPDF } = await import("jspdf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autoTable = (await import("jspdf-autotable") as any).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const GREEN = [47, 59, 26] as const;    // #2F3B1A
  const GOLD  = [196, 154, 60] as const;  // #C49A3C
  const GRAY  = [90, 94, 82] as const;

  // ── Başlık ────────────────────────────────────────────────────────────────
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, 297, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Hüda-i Şifa — Bölgesel Rapor", 14, 13);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Oluşturulma: ${data.generatedAt}  |  Dönem: ${data.periodLabel}`, 14, 19);

  // Sağ taraf — özet rakamlar
  doc.setFontSize(9);
  doc.text(`Ciro: ${data.totalRevenue.toLocaleString("tr-TR")} TL`, 230, 10);
  doc.text(`Kar: ${data.totalProfit.toLocaleString("tr-TR")} TL`, 230, 16);

  let yPos = 30;

  // ── Bölge Özet Tablosu ───────────────────────────────────────────────────
  doc.setTextColor(...GREEN);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bölge Özeti", 14, yPos);
  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    head: [["Bölge", "Sipariş", "Ciro (₺)", "Pay (%)"]],
    body: [
      ...data.zoneSummary.map((z) => [z.zoneName, z.orderCount, z.revenue.toLocaleString("tr-TR"), `%${z.pct}`]),
      ["TOPLAM", new Set(data.customerProducts.map((r) => r.orderId)).size, data.totalRevenue.toLocaleString("tr-TR"), "%100"],
    ],
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    footStyles: { fillColor: [230, 235, 220] },
    alternateRowStyles: { fillColor: [248, 250, 244] },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
    margin: { left: 14 },
    tableWidth: 100,
  });

  yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // ── Ülke Tablosu ─────────────────────────────────────────────────────────
  doc.setTextColor(...GREEN);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Ülke Bazında Satışlar", 14, yPos);
  yPos += 4;

  autoTable(doc, {
    startY: yPos,
    head: [["Ülke", "Bölge", "Sipariş", "Ciro (₺)", "Ort. Sipariş (₺)", "Pay (%)"]],
    body: data.countrySummary.map((r) => [
      r.countryName, r.zoneName, r.orderCount,
      r.revenue.toLocaleString("tr-TR"), r.avgOrder.toLocaleString("tr-TR"),
      `%${data.totalRevenue > 0 ? Math.round((r.revenue / data.totalRevenue) * 100) : 0}`,
    ]),
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 244] },
    columnStyles: { 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right" } },
    margin: { left: 14 },
  });

  // ── Sayfa 2: Ürün Kârlılığı ──────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, 297, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Ürün Kârlılık Analizi", 14, 9);

  yPos = 22;

  autoTable(doc, {
    startY: yPos,
    head: [["Ürün", "Adet", "Ciro (₺)", "Maliyet (₺)", "Brüt Kâr (₺)", "Marj (%)"]],
    body: [
      ...data.productProfits.map((p) => [
        p.productName, p.totalQty,
        p.totalRevenue.toLocaleString("tr-TR"),
        p.totalCost.toLocaleString("tr-TR"),
        p.totalProfit.toLocaleString("tr-TR"),
        `%${p.marginPct}`,
      ]),
      ["TOPLAM",
        data.productProfits.reduce((s, p) => s + p.totalQty, 0),
        data.totalRevenue.toLocaleString("tr-TR"),
        data.totalCost.toLocaleString("tr-TR"),
        data.totalProfit.toLocaleString("tr-TR"),
        `%${data.avgMarginPct}`,
      ],
    ],
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 244] },
    columnStyles: {
      1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" },
      4: { halign: "right" }, 5: { halign: "right" },
    },
    margin: { left: 14 },
  });

  yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

  // ── Özet kutusu ──────────────────────────────────────────────────────────
  doc.setFillColor(240, 244, 232);
  doc.roundedRect(14, yPos, 269, 28, 3, 3, "F");
  doc.setTextColor(...GREEN);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Finansal Özet", 20, yPos + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(`Toplam Ciro: ${data.totalRevenue.toLocaleString("tr-TR")} ₺`, 20, yPos + 15);
  doc.text(`Toplam Maliyet: ${data.totalCost.toLocaleString("tr-TR")} ₺`, 20, yPos + 21);
  doc.setTextColor(...GREEN);
  doc.setFont("helvetica", "bold");
  doc.text(`Brüt Kâr: ${data.totalProfit.toLocaleString("tr-TR")} ₺  |  Ortalama Marj: %${data.avgMarginPct}`, 110, yPos + 15);

  // ── Sayfa 3: Müşteri + Ürün Detay ────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, 297, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Müşteri — Ürün Detay Raporu", 14, 9);

  autoTable(doc, {
    startY: 22,
    head: [["Müşteri", "Ülke", "Sipariş No", "Tarih", "Ürün", "Adet", "Tutar (₺)", "Kâr (₺)", "Marj (%)", "Durum"]],
    body: data.customerProducts.map((r) => [
      r.customerName, r.countryCode, r.orderId, r.orderDate,
      r.productName, r.qty,
      r.lineTotal.toLocaleString("tr-TR"),
      r.grossProfit.toLocaleString("tr-TR"),
      `%${r.marginPct}`,
      STATUS_TR[r.orderStatus] ?? r.orderStatus,
    ]),
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [248, 250, 244] },
    columnStyles: {
      5: { halign: "right" }, 6: { halign: "right" },
      7: { halign: "right" }, 8: { halign: "right" },
    },
    margin: { left: 14 },
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(`Hüda-i Şifa © ${new Date().getFullYear()} — Gizli / Dahili Kullanım`, 14, 205);
    doc.text(`Sayfa ${i} / ${pageCount}`, 270, 205);
    doc.setTextColor(...GOLD);
    doc.text("hudaisifa.com", 145, 205);
  }

  doc.save(`${filename}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSV EXPORT (varolan exportCsv wrapper)
// ═══════════════════════════════════════════════════════════════════════════════
export function exportDetailedCSV(data: ReportData, section: "all" | "countries" | "products" | "customers" | "zones" = "all") {
  const { exportCsv } = require("@/lib/exportCsv");
  const base = `hudaisifa-rapor-${today()}`;

  if (section === "zones" || section === "all") {
    exportCsv(`${base}-bolgeler`, data.zoneSummary.map((z) => ({
      Bölge: z.zoneName, Siparişler: z.orderCount, "Ciro (₺)": z.revenue, "Pay (%)": z.pct,
    })));
  }
  if (section === "countries" || section === "all") {
    exportCsv(`${base}-ulkeler`, data.countrySummary.map((r) => ({
      Ülke: r.countryName, "Ülke Kodu": r.countryCode, Bölge: r.zoneName,
      Siparişler: r.orderCount, "Ciro (₺)": r.revenue, "Ort. Sipariş (₺)": r.avgOrder,
    })));
  }
  if (section === "products" || section === "all") {
    exportCsv(`${base}-urunler`, data.productProfits.map((p) => ({
      Ürün: p.productName, Adet: p.totalQty, "Ciro (₺)": p.totalRevenue,
      "Maliyet (₺)": p.totalCost, "Kâr (₺)": p.totalProfit, "Marj (%)": p.marginPct,
    })));
  }
  if (section === "customers" || section === "all") {
    exportCsv(`${base}-musteri-urun-detay`, data.customerProducts.map((r) => ({
      Müşteri: r.customerName, "E-posta": r.email, Ülke: r.countryCode, Şehir: r.city, Bölge: r.zoneName,
      "Sipariş No": r.orderId, Tarih: r.orderDate, Durum: STATUS_TR[r.orderStatus] ?? r.orderStatus,
      Ürün: r.productName, Adet: r.qty, "Birim Fiyat (₺)": r.unitPrice, "Tutar (₺)": r.lineTotal,
      "Birim Maliyet (₺)": r.costPrice, "Brüt Kâr (₺)": r.grossProfit, "Marj (%)": r.marginPct,
    })));
  }
}
