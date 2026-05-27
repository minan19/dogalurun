import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

// Static product name/description maps per locale for full-text search
const productNameMap: Record<string, Record<string, string>> = {
  tr: {
    vitaminD3K2: "Vitamin D3 + K2",
    omega3: "Omega-3 Balık Yağı",
    magnesium: "Magnezyum Bisglinat",
    probiotic: "Probiyotik 50 Milyar CFU",
    vitaminC: "C Vitamini 1000mg",
    vitaminB12: "Vitamin B12 Metilkobalamin",
    rawHoney: "Organik Ham Bal",
    chiaSeed: "Organik Chia Tohumu",
    turmeric: "Organik Zerdeçal",
    arganOil: "Saf Argan Yağı",
    collagenSerum: "Kolajen Serum",
    gutHealthPack: "Bağırsak Sağlığı Paketi",
  },
  en: {
    vitaminD3K2: "Vitamin D3 + K2",
    omega3: "Omega-3 Fish Oil",
    magnesium: "Magnesium Bisglycinate",
    probiotic: "Probiotic 50 Billion CFU",
    vitaminC: "Vitamin C 1000mg",
    vitaminB12: "Vitamin B12 Methylcobalamin",
    rawHoney: "Organic Raw Honey",
    chiaSeed: "Organic Chia Seeds",
    turmeric: "Organic Turmeric",
    arganOil: "Pure Argan Oil",
    collagenSerum: "Collagen Serum",
    gutHealthPack: "Gut Health Pack",
  },
  ar: {
    vitaminD3K2: "فيتامين D3 + K2",
    omega3: "زيت السمك أوميغا-3",
    magnesium: "المغنيسيوم بيسغليسينات",
    probiotic: "البروبيوتيك 50 مليار",
    vitaminC: "فيتامين C 1000 ملغ",
    vitaminB12: "فيتامين B12",
    rawHoney: "العسل الخام العضوي",
    chiaSeed: "بذور الشيا العضوية",
    turmeric: "الكركم العضوي",
    arganOil: "زيت الأرغان الخالص",
    collagenSerum: "سيروم الكولاجين",
    gutHealthPack: "حزمة صحة الأمعاء",
  },
  ru: {
    vitaminD3K2: "Витамин D3 + K2",
    omega3: "Омега-3 Рыбий жир",
    magnesium: "Магний Бисглицинат",
    probiotic: "Пробиотик 50 Миллиардов",
    vitaminC: "Витамин C 1000мг",
    vitaminB12: "Витамин B12 Метилкобаламин",
    rawHoney: "Органический Сырой Мёд",
    chiaSeed: "Органические Семена Чиа",
    turmeric: "Органическая Куркума",
    arganOil: "Чистое Аргановое Масло",
    collagenSerum: "Коллагеновая Сыворотка",
    gutHealthPack: "Набор для Здоровья Кишечника",
  },
};

const productDescMap: Record<string, Record<string, string>> = {
  tr: {
    vitaminD3K2Desc: "Kemik sağlığı ve bağışıklık sistemi için yüksek dozlu D3 ve K2 kombinasyonu.",
    omega3Desc: "Yüksek EPA ve DHA içeriğiyle kalp, beyin ve eklem sağlığını destekler.",
    magnesiumDesc: "En iyi emilen magnezyum formu. Uyku kalitesi, kas ve sinir sistemi için.",
    probioticDesc: "12 farklı probiyotik suş, sindirim ve bağışıklık desteği için güçlü formula.",
    vitaminCDesc: "Tamponlanmış C vitamini formülü, bağışıklık ve cilt sağlığı için.",
    vitaminB12Desc: "Aktif B12 formu olan metilkobalamin, enerji ve sinir sistemi için.",
    rawHoneyDesc: "İşlenmemiş, filtrelenmemiş. Tüm enzim ve besin değerleri korunmuş.",
    chiaSeedDesc: "Omega-3, lif ve protein açısından zengin süper tohum.",
    turmericDesc: "Kurkumin açısından zengin, antioksidan ve eklem desteği için.",
    arganOilDesc: "Soğuk sıkım, % 100 saf. Cilt ve saç bakımı için.",
    collagenSerumDesc: "Marine kolajen ve hyalüronik asit içeren anti-aging serum.",
    gutHealthPackDesc: "Probiyotik + Prebiyotik + Sindirim Enzimi üçlü kombinasyonu.",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const locale = searchParams.get("locale") ?? "tr";

  if (q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const names = productNameMap[locale] ?? productNameMap["tr"];
  const descs = productDescMap[locale] ?? productDescMap["tr"];

  const results = products
    .filter((p) => {
      const name = (names[p.nameKey] ?? "").toLowerCase();
      const desc = (descs[p.descriptionKey] ?? "").toLowerCase();
      const brand = p.brand.toLowerCase();
      const category = p.category.toLowerCase();
      const needs = p.needs.join(" ").toLowerCase();
      const slug = p.slug.toLowerCase();

      return (
        name.includes(q) ||
        desc.includes(q) ||
        brand.includes(q) ||
        category.includes(q) ||
        needs.includes(q) ||
        slug.includes(q)
      );
    })
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: names[p.nameKey] ?? p.nameKey,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      image: p.image,
      brand: p.brand,
      category: p.category,
    }));

  return NextResponse.json({ results, total: results.length });
}
