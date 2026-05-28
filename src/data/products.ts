export type Category =
  | "supplements"
  | "organic-food"
  | "personal-care"
  | "special"
  | "brands"
  | "sports"
  | "beauty";

export type NeedTag =
  | "immunity"
  | "energy"
  | "digestion"
  | "sleep"
  | "stress"
  | "sport"
  | "skin"
  | "joints";

export interface Product {
  id: string;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: Category;
  needs: NeedTag[];
  price: number;
  originalPrice?: number;
  currency: "TRY";
  image: string;
  badge?: "expert" | "new" | "bestseller";
  expertNoteKey?: string;
  ingredientsKey: string;
  usageKey: string;
  amount: string;
  brand: string;
  inStock: boolean;
  stock: number;          // Mevcut stok adedi
  lowStockThreshold?: number; // Uyarı eşiği (default: 10)
  rating: number;
  reviewCount: number;
  costPrice?: number;     // Maliyet fiyatı (admin)
  marginPct?: number;     // Kar marjı %
}

export const categories: { key: Category; iconEmoji: string }[] = [
  { key: "supplements", iconEmoji: "💊" },
  { key: "organic-food", iconEmoji: "🌿" },
  { key: "personal-care", iconEmoji: "🧴" },
  { key: "special", iconEmoji: "⭐" },
  { key: "sports", iconEmoji: "🏋️" },
  { key: "beauty", iconEmoji: "💆" },
  { key: "brands", iconEmoji: "🏷️" },
];

export const products: Product[] = [
  // --- Takviye Edici Gıdalar ---
  {
    id: "p1",
    slug: "vitamin-d3-k2",
    nameKey: "vitaminD3K2",
    descriptionKey: "vitaminD3K2Desc",
    category: "supplements",
    needs: ["immunity", "joints"],
    price: 289,
    originalPrice: 349,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    badge: "expert",
    expertNoteKey: "vitaminD3K2Expert",
    ingredientsKey: "vitaminD3K2Ingredients",
    usageKey: "vitaminD3K2Usage",
    amount: "60 Kapsül",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 45,
    costPrice: 130,
    marginPct: 55,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "p2",
    slug: "omega-3-balik-yagi",
    nameKey: "omega3",
    descriptionKey: "omega3Desc",
    category: "supplements",
    needs: ["immunity", "joints", "stress"],
    price: 345,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80",
    badge: "bestseller",
    expertNoteKey: "omega3Expert",
    ingredientsKey: "omega3Ingredients",
    usageKey: "omega3Usage",
    amount: "90 Kapsül",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 78,
    costPrice: 155,
    marginPct: 55,
    rating: 4.9,
    reviewCount: 218,
  },
  {
    id: "p3",
    slug: "magnezyum-bisglisinat",
    nameKey: "magnesium",
    descriptionKey: "magnesiumDesc",
    category: "supplements",
    needs: ["sleep", "stress", "sport"],
    price: 199,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80",
    badge: "expert",
    expertNoteKey: "magnesiumExpert",
    ingredientsKey: "magnesiumIngredients",
    usageKey: "magnesiumUsage",
    amount: "120 Tablet",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 8,
    lowStockThreshold: 15,
    costPrice: 90,
    marginPct: 55,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: "p4",
    slug: "probiyotik-50-milyar",
    nameKey: "probiotic",
    descriptionKey: "probioticDesc",
    category: "supplements",
    needs: ["digestion", "immunity"],
    price: 399,
    originalPrice: 459,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80",
    badge: "new",
    expertNoteKey: "probioticExpert",
    ingredientsKey: "probioticIngredients",
    usageKey: "probioticUsage",
    amount: "30 Kapsül",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 23,
    costPrice: 180,
    marginPct: 55,
    rating: 4.6,
    reviewCount: 56,
  },
  {
    id: "p5",
    slug: "c-vitamini-1000mg",
    nameKey: "vitaminC",
    descriptionKey: "vitaminCDesc",
    category: "supplements",
    needs: ["immunity", "skin", "energy"],
    price: 159,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=600&q=80",
    ingredientsKey: "vitaminCIngredients",
    usageKey: "vitaminCUsage",
    amount: "60 Tablet",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 5,
    lowStockThreshold: 10,
    costPrice: 72,
    marginPct: 55,
    rating: 4.5,
    reviewCount: 167,
  },
  {
    id: "p6",
    slug: "b12-vitamini",
    nameKey: "vitaminB12",
    descriptionKey: "vitaminB12Desc",
    category: "supplements",
    needs: ["energy", "stress"],
    price: 179,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "expert",
    expertNoteKey: "vitaminB12Expert",
    ingredientsKey: "vitaminB12Ingredients",
    usageKey: "vitaminB12Usage",
    amount: "90 Tablet",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 31,
    costPrice: 80,
    marginPct: 55,
    rating: 4.7,
    reviewCount: 93,
  },
  // --- Organik Gıdalar ---
  {
    id: "p7",
    slug: "organik-ham-bal",
    nameKey: "rawHoney",
    descriptionKey: "rawHoneyDesc",
    category: "organic-food",
    needs: ["immunity", "energy"],
    price: 249,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    badge: "bestseller",
    ingredientsKey: "rawHoneyIngredients",
    usageKey: "rawHoneyUsage",
    amount: "450g",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 12,
    costPrice: 112,
    marginPct: 55,
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "p8",
    slug: "organik-chia-tohumu",
    nameKey: "chiaSeed",
    descriptionKey: "chiaSeedDesc",
    category: "organic-food",
    needs: ["digestion", "energy"],
    price: 129,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9d8e6?w=600&q=80",
    ingredientsKey: "chiaSeedIngredients",
    usageKey: "chiaSeedUsage",
    amount: "500g",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 44,
    costPrice: 58,
    marginPct: 55,
    rating: 4.6,
    reviewCount: 78,
  },
  {
    id: "p9",
    slug: "organik-zerdeçal",
    nameKey: "turmeric",
    descriptionKey: "turmericDesc",
    category: "organic-food",
    needs: ["immunity", "joints"],
    price: 89,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
    badge: "new",
    ingredientsKey: "turmericIngredients",
    usageKey: "turmericUsage",
    amount: "200g",
    brand: "Hüda-i Şifa",
    inStock: false,
    stock: 0,
    costPrice: 40,
    marginPct: 55,
    rating: 4.4,
    reviewCount: 45,
  },
  // --- Doğal Kişisel Bakım ---
  {
    id: "p10",
    slug: "dogal-argan-yagi",
    nameKey: "arganOil",
    descriptionKey: "arganOilDesc",
    category: "personal-care",
    needs: ["skin"],
    price: 189,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
    badge: "expert",
    expertNoteKey: "arganOilExpert",
    ingredientsKey: "arganOilIngredients",
    usageKey: "arganOilUsage",
    amount: "50ml",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 19,
    costPrice: 85,
    marginPct: 55,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: "p11",
    slug: "kolajen-serum",
    nameKey: "collagenSerum",
    descriptionKey: "collagenSerumDesc",
    category: "personal-care",
    needs: ["skin"],
    price: 269,
    originalPrice: 329,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    ingredientsKey: "collagenSerumIngredients",
    usageKey: "collagenSerumUsage",
    amount: "30ml",
    brand: "Hüda-i Şifa",
    inStock: false,
    stock: 0,
    costPrice: 121,
    marginPct: 55,
    rating: 4.5,
    reviewCount: 67,
  },
  // --- Spor Ürünleri ---
  {
    id: "p13", slug: "kreatin-monohidrat", nameKey: "creatine", descriptionKey: "creatineDesc",
    category: "sports", needs: ["sport", "energy"], price: 299, currency: "TRY",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    badge: "bestseller", expertNoteKey: "creatineExpert",
    ingredientsKey: "creatineIngredients", usageKey: "creatineUsage",
    amount: "300g", brand: "Hüda-i Şifa", inStock: true, stock: 40,
    lowStockThreshold: 10, costPrice: 135, marginPct: 55, rating: 4.8, reviewCount: 95,
  },
  {
    id: "p14", slug: "bcaa-aminoasit", nameKey: "bcaa", descriptionKey: "bcaaDesc",
    category: "sports", needs: ["sport"], price: 349, currency: "TRY",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    badge: "expert", expertNoteKey: "bcaaExpert",
    ingredientsKey: "bcaaIngredients", usageKey: "bcaaUsage",
    amount: "300g", brand: "Hüda-i Şifa", inStock: true, stock: 35,
    lowStockThreshold: 10, costPrice: 157, marginPct: 55, rating: 4.7, reviewCount: 62,
  },
  {
    id: "p15", slug: "dogal-whey-protein", nameKey: "wheyProtein", descriptionKey: "wheyProteinDesc",
    category: "sports", needs: ["sport", "energy"], price: 599, originalPrice: 699, currency: "TRY",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
    badge: "bestseller", expertNoteKey: "wheyProteinExpert",
    ingredientsKey: "wheyProteinIngredients", usageKey: "wheyProteinUsage",
    amount: "1000g", brand: "Hüda-i Şifa", inStock: true, stock: 28,
    lowStockThreshold: 10, costPrice: 270, marginPct: 55, rating: 4.9, reviewCount: 148,
  },
  {
    id: "p16", slug: "l-glutamin", nameKey: "glutamine", descriptionKey: "glutamineDesc",
    category: "sports", needs: ["sport"], price: 249, currency: "TRY",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=80",
    badge: "new", ingredientsKey: "glutamineIngredients", usageKey: "glutamineUsage",
    amount: "250g", brand: "Hüda-i Şifa", inStock: true, stock: 22,
    lowStockThreshold: 10, costPrice: 112, marginPct: 55, rating: 4.6, reviewCount: 34,
  },
  {
    id: "p17", slug: "magnezyum-spor", nameKey: "magnesiumSport", descriptionKey: "magnesiumSportDesc",
    category: "sports", needs: ["sport", "sleep"], price: 219, currency: "TRY",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80",
    badge: "expert", expertNoteKey: "magnesiumSportExpert",
    ingredientsKey: "magnesiumSportIngredients", usageKey: "magnesiumSportUsage",
    amount: "60 Kapsül", brand: "Hüda-i Şifa", inStock: true, stock: 31,
    lowStockThreshold: 10, costPrice: 99, marginPct: 55, rating: 4.7, reviewCount: 47,
  },
  // --- Cilt Bakım & Güzellik ---
  {
    id: "p18", slug: "hiyaluronik-asit-serum", nameKey: "hyaluronicSerum", descriptionKey: "hyaluronicSerumDesc",
    category: "beauty", needs: ["skin"], price: 189, currency: "TRY",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    badge: "bestseller", expertNoteKey: "hyaluronicSerumExpert",
    ingredientsKey: "hyaluronicSerumIngredients", usageKey: "hyaluronicSerumUsage",
    amount: "30ml", brand: "Hüda-i Şifa", inStock: true, stock: 45,
    lowStockThreshold: 10, costPrice: 85, marginPct: 55, rating: 4.8, reviewCount: 112,
  },
  {
    id: "p19", slug: "kolajen-tozu", nameKey: "collagenPowder", descriptionKey: "collagenPowderDesc",
    category: "beauty", needs: ["skin"], price: 399, originalPrice: 459, currency: "TRY",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
    badge: "expert", expertNoteKey: "collagenPowderExpert",
    ingredientsKey: "collagenPowderIngredients", usageKey: "collagenPowderUsage",
    amount: "300g", brand: "Hüda-i Şifa", inStock: true, stock: 20,
    lowStockThreshold: 10, costPrice: 180, marginPct: 55, rating: 4.7, reviewCount: 58,
  },
  {
    id: "p20", slug: "kus-burnu-yagi", nameKey: "rosehipOil", descriptionKey: "rosehipOilDesc",
    category: "beauty", needs: ["skin"], price: 149, currency: "TRY",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
    badge: "new", ingredientsKey: "rosehipOilIngredients", usageKey: "rosehipOilUsage",
    amount: "30ml", brand: "Hüda-i Şifa", inStock: true, stock: 38,
    lowStockThreshold: 10, costPrice: 67, marginPct: 55, rating: 4.6, reviewCount: 29,
  },
  {
    id: "p21", slug: "biyotin-5000", nameKey: "biotin", descriptionKey: "biotinDesc",
    category: "beauty", needs: ["skin"], price: 179, currency: "TRY",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    badge: "expert", expertNoteKey: "biotinExpert",
    ingredientsKey: "biotinIngredients", usageKey: "biotinUsage",
    amount: "90 Tablet", brand: "Hüda-i Şifa", inStock: true, stock: 55,
    lowStockThreshold: 10, costPrice: 81, marginPct: 55, rating: 4.8, reviewCount: 87,
  },
  {
    id: "p22", slug: "e-vitamini-yagi", nameKey: "vitaminEOil", descriptionKey: "vitaminEOilDesc",
    category: "beauty", needs: ["skin"], price: 129, currency: "TRY",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
    ingredientsKey: "vitaminEOilIngredients", usageKey: "vitaminEOilUsage",
    amount: "30ml", brand: "Hüda-i Şifa", inStock: true, stock: 42,
    lowStockThreshold: 10, costPrice: 58, marginPct: 55, rating: 4.5, reviewCount: 41,
  },
    // --- Özel Seçimler ---
  {
    id: "p12",
    slug: "bagirsak-sagligi-paketi",
    nameKey: "gutHealthPack",
    descriptionKey: "gutHealthPackDesc",
    category: "special",
    needs: ["digestion", "immunity"],
    price: 699,
    originalPrice: 849,
    currency: "TRY",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
    badge: "expert",
    expertNoteKey: "gutHealthPackExpert",
    ingredientsKey: "gutHealthPackIngredients",
    usageKey: "gutHealthPackUsage",
    amount: "3 Ürün Seti",
    brand: "Hüda-i Şifa",
    inStock: true,
    stock: 7,
    lowStockThreshold: 10,
    costPrice: 315,
    marginPct: 55,
    rating: 4.9,
    reviewCount: 34,
  },
];

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByNeed(need: NeedTag): Product[] {
  return products.filter((p) => p.needs.includes(need));
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge === "expert" || p.badge === "bestseller");
}
