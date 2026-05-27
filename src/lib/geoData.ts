// ─────────────────────────────────────────────────────────────────────────────
// GEO DATA — coğrafi, kargo, gümrük ve bölgesel sağlık veri merkezi
// Tüm lookup'lar O(1) Map/Record ile — maksimum hız
// ─────────────────────────────────────────────────────────────────────────────

export type CurrencyCode = "TRY" | "USD" | "EUR" | "SAR" | "RUB";
export type ShippingZone = "zone1" | "zone2" | "zone3" | "zone4";

// ── Para birimi konfigürasyonu ────────────────────────────────────────────────
export const CURRENCIES: Record<CurrencyCode, {
  symbol: string;
  name: string;
  flag: string;
  rate: number;   // 1 TRY = X [para birimi] — ipapi üzerinden otomatik güncellenebilir
  locale: string;
  rtl: boolean;
}> = {
  TRY: { symbol: "₺",   name: "Türk Lirası",   flag: "🇹🇷", rate: 1,       locale: "tr-TR", rtl: false },
  USD: { symbol: "$",   name: "US Dollar",      flag: "🇺🇸", rate: 0.0277,  locale: "en-US", rtl: false },
  EUR: { symbol: "€",   name: "Euro",           flag: "🇪🇺", rate: 0.0256,  locale: "de-DE", rtl: false },
  SAR: { symbol: "ر.س", name: "Saudi Riyal",    flag: "🇸🇦", rate: 0.1038,  locale: "ar-SA", rtl: true  },
  RUB: { symbol: "₽",   name: "Rus Rublesi",    flag: "🇷🇺", rate: 2.521,   locale: "ru-RU", rtl: false },
};

// ── Kargo bölgesi konfigürasyonu ──────────────────────────────────────────────
export const ZONE_CONFIG: Record<ShippingZone, {
  name: string;
  flag: string;
  shippingTRY: number;
  freeThresholdTRY: number;
  estimatedDays: string;
  carriers: string[];
  cod: boolean; // Kapıda ödeme
}> = {
  zone1: {
    name: "Türkiye",
    flag: "🇹🇷",
    shippingTRY: 39.90,
    freeThresholdTRY: 500,
    estimatedDays: "1–3 iş günü",
    carriers: ["Aras Kargo", "Yurtiçi Kargo", "MNG Kargo", "Sürat Kargo"],
    cod: true,
  },
  zone2: {
    name: "Avrupa & Rusya",
    flag: "🌍",
    shippingTRY: 385,        // ~€9.99
    freeThresholdTRY: 2310,  // ~€60
    estimatedDays: "7–14 iş günü",
    carriers: ["DHL", "UPS", "FedEx"],
    cod: false,
  },
  zone3: {
    name: "Körfez & Orta Doğu",
    flag: "🌍",
    shippingTRY: 462,        // ~$12
    freeThresholdTRY: 2310,  // ~$60
    estimatedDays: "5–10 iş günü",
    carriers: ["Aramex", "DHL", "FedEx"],
    cod: false,
  },
  zone4: {
    name: "Diğer Ülkeler",
    flag: "🌍",
    shippingTRY: 578,        // ~$15
    freeThresholdTRY: 3080,  // ~$80
    estimatedDays: "14–21 iş günü",
    carriers: ["DHL", "UPS", "FedEx"],
    cod: false,
  },
};

// ── Gümrük/Vergi Bilgileri (HS Kodu: 2106.90 — Takviye Gıda) ─────────────────
// Kaynak: WTO Tariff Database, EU TARIC, UK Global Tariff, US CBP
// Güncelleme tarihi: 2026-Q1 — Otomatik güncelleme için customs API bağlanabilir
export interface CustomsInfo {
  zone: ShippingZone;
  countries: string[];        // İlgili ülke kodları
  deMinimis: number;          // TRY cinsinden vergisiz eşik (0 = yok)
  deMinimisNote: string;      // Eşik açıklaması
  dutyRate: number;           // Tahmini gümrük oranı % (0-15)
  vatRate: number;            // KDV/VAT oranı %
  responsible: "buyer" | "seller"; // Kim öder
  legalNote: string;          // Yasal açıklama
  lastUpdated: string;        // Son güncelleme
}

export const CUSTOMS_DATA: CustomsInfo[] = [
  {
    zone: "zone1",
    countries: ["TR"],
    deMinimis: 0,
    deMinimisNote: "Yurt içi — gümrük yok",
    dutyRate: 0,
    vatRate: 18,
    responsible: "seller",
    legalNote: "Türkiye'de KDV dahil fiyatlandırma yapılmaktadır.",
    lastUpdated: "2026-01-01",
  },
  {
    zone: "zone2",
    countries: ["DE","FR","IT","ES","NL","BE","AT","CH","SE","NO","DK","FI","PL","PT","GR","CZ","HU","RO","BG","HR","SK","SI","EE","LV","LT","LU","IE","CY","MT","IS","GB"],
    deMinimis: 5775,           // ~€150 EU; ~£135 UK
    deMinimisNote: "€150 altı siparişler AB'de gümrük muafiyet kapsamındadır (AB IOSS Direktifi 2021/514)",
    dutyRate: 5.1,             // HS 2106.90 ortalama AB gümrük oranı
    vatRate: 20,               // Ort. AB/UK KDV oranı
    responsible: "buyer",
    legalNote: "€150 üzeri siparişlerde gümrük vergisi ve KDV alıcı tarafından ödenir (DDU — Delivered Duty Unpaid). AB IOSS sistemi kapsamında değiliz.",
    lastUpdated: "2026-01-15",
  },
  {
    zone: "zone2",
    countries: ["RU","UA","BY","KZ","GE","AZ","AM","MD"],
    deMinimis: 7700,          // ~€200
    deMinimisNote: "Rusya ve BDT ülkelerinde €200 altı bireysel ithalat vergisizdir (FCS/EEU kuralları)",
    dutyRate: 15,
    vatRate: 20,
    responsible: "buyer",
    legalNote: "€200 üzeri siparişlerde %15 gümrük + %20 KDV uygulanır. Alıcı sorumludur.",
    lastUpdated: "2026-01-15",
  },
  {
    zone: "zone3",
    countries: ["SA","AE","KW","QA","BH","OM"],
    deMinimis: 0,              // GCC'de de minimis eşiği yok — her sipariş vergilendirilir
    deMinimisNote: "GCC ülkelerinde tüm ithalatlara KDV uygulanır (2018'den itibaren)",
    dutyRate: 5,               // HS 2106 GCC Ortak Gümrük Tarifesi
    vatRate: 15,               // SA: %15 KDV, diğerleri: %5
    responsible: "buyer",
    legalNote: "Körfez ülkelerinde gümrük vergisi ve KDV alıcı tarafından kargo şirketi aracılığıyla tahsil edilir.",
    lastUpdated: "2026-01-15",
  },
  {
    zone: "zone3",
    countries: ["JO","LB","IQ","EG","MA","TN","DZ","LY","YE","SY","IR","PS"],
    deMinimis: 1155,           // ~$30 yaklaşık
    deMinimisNote: "Bölge ülkelerine göre değişkenlik gösterir",
    dutyRate: 8,
    vatRate: 14,
    responsible: "buyer",
    legalNote: "Gümrük oranları ülkeye göre farklılık gösterir. Alıcı sorumludur.",
    lastUpdated: "2026-01-15",
  },
  {
    zone: "zone4",
    countries: ["US","CA"],
    deMinimis: 30800,          // ~$800 USD — ABD de minimis en yüksek dünya
    deMinimisNote: "$800 altı siparişler ABD'ye gümrüksüz girer (19 U.S.C. § 1321)",
    dutyRate: 3.2,             // HS 2106.90 ABD gümrük oranı
    vatRate: 0,                // ABD federal VAT yok; eyalet satış vergisi ayrı
    responsible: "buyer",
    legalNote: "$800 üzeri siparişlerde gümrük beyanı gerekir. Alıcı sorumludur.",
    lastUpdated: "2026-01-15",
  },
  {
    zone: "zone4",
    countries: [],             // Geri kalan tüm ülkeler
    deMinimis: 770,            // ~$20 yaklaşık ortalama
    deMinimisNote: "Ülkeye göre değişkenlik gösterir",
    dutyRate: 8,
    vatRate: 10,
    responsible: "buyer",
    legalNote: "Gümrük vergi ve harçları alıcı ülkenin mevzuatına göre belirlenir ve alıcı tarafından ödenir.",
    lastUpdated: "2026-01-15",
  },
];

// O(1) ülke → gümrük bilgisi lookup
const _customsMap = new Map<string, CustomsInfo>();
for (const info of CUSTOMS_DATA) {
  if (info.countries.length === 0) {
    // Catch-all zone4 default — ülke kodları olmayan kayıt
    continue;
  }
  for (const c of info.countries) {
    _customsMap.set(c, info);
  }
}
// Default (fallback)
const _zone4Default = CUSTOMS_DATA.find((c) => c.zone === "zone4" && c.countries.length === 0)!;

export function getCustomsInfo(countryCode: string): CustomsInfo {
  return _customsMap.get(countryCode?.toUpperCase()) ?? _zone4Default;
}

export function estimateCustomsTRY(cartTotalTRY: number, countryCode: string): {
  dutyTRY: number;
  vatTRY: number;
  totalTRY: number;
  isAboveThreshold: boolean;
  info: CustomsInfo;
} {
  const info = getCustomsInfo(countryCode);
  const above = cartTotalTRY > info.deMinimis;
  if (!above) {
    return { dutyTRY: 0, vatTRY: 0, totalTRY: 0, isAboveThreshold: false, info };
  }
  const dutyTRY = Math.round(cartTotalTRY * (info.dutyRate / 100));
  const vatBase = cartTotalTRY + dutyTRY;
  const vatTRY = Math.round(vatBase * (info.vatRate / 100));
  return { dutyTRY, vatTRY, totalTRY: dutyTRY + vatTRY, isAboveThreshold: true, info };
}

// ── Ülke → Bölge lookup (O(1) Set) ──────────────────────────────────────────
const _zone1 = new Set(["TR"]);
const _zone2 = new Set([
  "DE","FR","GB","IT","ES","NL","BE","AT","CH","PL","SE","NO","DK","FI",
  "PT","GR","CZ","HU","RO","BG","HR","SK","SI","EE","LV","LT","LU","IE",
  "CY","MT","IS","RU","UA","BY","KZ","GE","AZ","AM","MD",
]);
const _zone3 = new Set([
  "SA","AE","KW","QA","BH","OM","JO","LB","IQ","EG","MA","TN","DZ","LY",
  "YE","SY","IR","PS",
]);

export function getZone(countryCode: string): ShippingZone {
  const c = countryCode?.toUpperCase() ?? "";
  if (_zone1.has(c)) return "zone1";
  if (_zone2.has(c)) return "zone2";
  if (_zone3.has(c)) return "zone3";
  return "zone4";
}

// ── Varsayılan para birimi ────────────────────────────────────────────────────
export function getDefaultCurrency(countryCode: string): CurrencyCode {
  const c = countryCode?.toUpperCase() ?? "";
  if (c === "TR") return "TRY";
  if (["SA","AE","KW","QA","BH","OM"].includes(c)) return "SAR";
  if (["RU","BY","KZ"].includes(c)) return "RUB";
  if (_zone2.has(c) && !["RU","UA","BY","KZ","GE","AZ","AM","MD"].includes(c)) return "EUR";
  return "USD";
}

// ── Para birimi dönüştürme ────────────────────────────────────────────────────
export function convertFromTRY(amountTRY: number, currency: CurrencyCode): number {
  return amountTRY * CURRENCIES[currency].rate;
}

export function formatCurrency(amountTRY: number, currency: CurrencyCode): string {
  const { rate, locale, symbol, rtl } = CURRENCIES[currency];
  const converted = amountTRY * rate;
  const decimals = currency === "TRY" ? 0 : 2;
  const formatted = converted.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return rtl ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

// ── Bayrak emoji ──────────────────────────────────────────────────────────────
export const FLAG_EMOJI: Record<string, string> = {
  TR:"🇹🇷", DE:"🇩🇪", FR:"🇫🇷", GB:"🇬🇧", NL:"🇳🇱", BE:"🇧🇪", IT:"🇮🇹",
  ES:"🇪🇸", AT:"🇦🇹", CH:"🇨🇭", PL:"🇵🇱", SE:"🇸🇪", NO:"🇳🇴", DK:"🇩🇰",
  FI:"🇫🇮", PT:"🇵🇹", GR:"🇬🇷", CZ:"🇨🇿", HU:"🇭🇺", RO:"🇷🇴", BG:"🇧🇬",
  SA:"🇸🇦", AE:"🇦🇪", KW:"🇰🇼", QA:"🇶🇦", BH:"🇧🇭", OM:"🇴🇲", JO:"🇯🇴",
  EG:"🇪🇬", MA:"🇲🇦", RU:"🇷🇺", UA:"🇺🇦", BY:"🇧🇾", KZ:"🇰🇿",
  US:"🇺🇸", CA:"🇨🇦", AU:"🇦🇺", JP:"🇯🇵", CN:"🇨🇳", IN:"🇮🇳",
};

export function getFlagEmoji(countryCode: string): string {
  return FLAG_EMOJI[countryCode?.toUpperCase()] ?? "🌍";
}

// ── Bölgesel sağlık profilleri ────────────────────────────────────────────────
export interface RegionalHealthProfile {
  region: string;
  flag: string;
  topIssues: string[];
  recommendedSlugs: string[];
  tip: string;
}

const _healthProfiles: Record<string, RegionalHealthProfile> = {
  TR: {
    region: "Türkiye", flag: "🇹🇷",
    topIssues: ["D Vitamini Eksikliği", "Demir Eksikliği", "Stres & Yorgunluk"],
    recommendedSlugs: ["vitamin-d3-k2", "zinc-iron", "ashwagandha"],
    tip: "Türkiye'de D vitamini eksikliği %80 oranında görülmektedir.",
  },
  DE: {
    region: "Almanya", flag: "🇩🇪",
    topIssues: ["D Vitamini", "Omega-3 Eksikliği", "Sezonsal Depresyon"],
    recommendedSlugs: ["vitamin-d3-k2", "omega-3", "magnesium"],
    tip: "Kuzey Avrupa'da düşük güneş ışığı nedeniyle D vitamini kritiktir.",
  },
  GB: {
    region: "İngiltere", flag: "🇬🇧",
    topIssues: ["D Vitamini", "Omega-3", "Stres"],
    recommendedSlugs: ["vitamin-d3-k2", "omega-3", "ashwagandha"],
    tip: "İngiltere'de D vitamini eksikliği çok yaygındır.",
  },
  FR: {
    region: "Fransa", flag: "🇫🇷",
    topIssues: ["Magnezyum", "Omega-3", "Stres"],
    recommendedSlugs: ["magnesium", "omega-3", "ashwagandha"],
    tip: "Fransa'da magnezyum eksikliği yaygındır.",
  },
  IT: {
    region: "İtalya", flag: "🇮🇹",
    topIssues: ["Omega-3", "Antioksidan", "Kollajen"],
    recommendedSlugs: ["omega-3", "green-tea", "collagen"],
    tip: "Akdeniz diyetini desteklemek için omega-3 ve antioksidanlar önerilir.",
  },
  RU: {
    region: "Rusya", flag: "🇷🇺",
    topIssues: ["D Vitamini", "Bağışıklık", "C Vitamini"],
    recommendedSlugs: ["vitamin-d3-k2", "vitamin-c", "probiotic"],
    tip: "Sert kış ikliminde bağışıklık desteği kritiktir.",
  },
  SA: {
    region: "Suudi Arabistan", flag: "🇸🇦",
    topIssues: ["D Vitamini (kapalı ortam)", "Demir Eksikliği", "Çörek Otu"],
    recommendedSlugs: ["vitamin-d3-k2", "black-seed", "raw-honey"],
    tip: "Güneşten kaçınma nedeniyle D vitamini eksikliği yaygındır.",
  },
  AE: {
    region: "BAE", flag: "🇦🇪",
    topIssues: ["D Vitamini", "Demir", "Probiyotik"],
    recommendedSlugs: ["vitamin-d3-k2", "zinc-iron", "probiotic"],
    tip: "Kapalı ortam yaşantısı D vitamini eksikliğine yol açar.",
  },
  KW: {
    region: "Kuveyt", flag: "🇰🇼",
    topIssues: ["D Vitamini", "Omega-3", "Sağlıklı Bağırsak"],
    recommendedSlugs: ["vitamin-d3-k2", "omega-3", "probiotic"],
    tip: "Körfez ikliminde D vitamini ve probiyotik desteği önerilir.",
  },
  QA: {
    region: "Katar", flag: "🇶🇦",
    topIssues: ["D Vitamini", "Çörek Otu", "Bağışıklık"],
    recommendedSlugs: ["vitamin-d3-k2", "black-seed", "vitamin-c"],
    tip: "Körfez ikliminde D vitamini ve doğal bağışıklık güçlendiriciler önerilir.",
  },
  _DEFAULT: {
    region: "Dünya Geneli", flag: "🌍",
    topIssues: ["D Vitamini", "Omega-3", "Magnezyum"],
    recommendedSlugs: ["vitamin-d3-k2", "omega-3", "magnesium"],
    tip: "Dünya genelinde D vitamini ve omega-3 eksikliği en yaygın sorunlardandır.",
  },
};

// SE, NO, FI, DK → Almanya ile aynı profil
["SE","NO","FI","DK","NL","BE","AT","CH"].forEach((c) => {
  _healthProfiles[c] = { ..._healthProfiles.DE, region: c, flag: getFlagEmoji(c) };
});
["ES","PT","GR"].forEach((c) => {
  _healthProfiles[c] = { ..._healthProfiles.IT, region: c, flag: getFlagEmoji(c) };
});
["UA","BY","KZ"].forEach((c) => {
  _healthProfiles[c] = { ..._healthProfiles.RU, region: c, flag: getFlagEmoji(c) };
});
["BH","OM"].forEach((c) => {
  _healthProfiles[c] = { ..._healthProfiles.QA, region: c, flag: getFlagEmoji(c) };
});

export function getRegionalProfile(countryCode: string): RegionalHealthProfile {
  return _healthProfiles[countryCode?.toUpperCase()] ?? _healthProfiles["_DEFAULT"];
}
