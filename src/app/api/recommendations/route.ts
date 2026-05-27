import { NextRequest, NextResponse } from "next/server";
import { products, type NeedTag } from "@/data/products";

// Rule-based recommendation engine (works without AI API key)
// Can be upgraded to Claude API when ANTHROPIC_API_KEY is set

interface RecommendationInput {
  needs: NeedTag[];        // ["energy", "immunity", "digestion"]
  age?: string;
  gender?: string;
  lifestyle?: string;
  diet?: string;
  goal?: string;
  excludeIds?: string[];
}

function scoreProduct(product: (typeof products)[number], input: RecommendationInput): number {
  let score = 0;

  // Need matching (highest weight)
  for (const need of input.needs) {
    if (product.needs.includes(need)) score += 30;
    // Also check nameKey for loose match
    if (product.nameKey.toLowerCase().includes(need.toLowerCase())) score += 5;
  }

  // Rating bonus
  if (product.rating) score += product.rating * 2;

  // Badge bonus
  if (product.badge === "bestseller") score += 10;
  if (product.badge === "expert") score += 8;

  // Age-based bonus
  if (input.age === "51+" && product.needs.some((n) => ["joints", "immunity"].includes(n))) score += 5;
  if (input.age === "18-25" && product.needs.some((n) => ["energy", "sport"].includes(n))) score += 5;

  // Lifestyle bonus
  if ((input.lifestyle === "active" || input.lifestyle === "athlete") && product.needs.includes("sport")) {
    score += 8;
  }

  // Goal bonus
  if (input.goal === "beauty" && product.needs.includes("skin")) score += 10;
  if (input.goal === "energy" && product.needs.includes("energy")) score += 10;
  if (input.goal === "recovery" && product.needs.some((n) => ["joints", "stress"].includes(n))) score += 8;

  return score;
}

export async function POST(req: NextRequest) {
  const input: RecommendationInput = await req.json();

  if (!input.needs || input.needs.length === 0) {
    return NextResponse.json({ recommendations: [] });
  }

  // Score all products
  const scored = products
    .filter((p) => p.inStock && !input.excludeIds?.includes(p.id))
    .map((p) => ({ product: p, score: scoreProduct(p, input) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ product }) => ({
      id: product.id,
      slug: product.slug,
      nameKey: product.nameKey,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      amount: product.amount,
      needs: product.needs,
      badge: product.badge,
      rating: product.rating,
      reviewCount: product.reviewCount,
    }));

  // Generate explanation text
  const needLabels: Record<NeedTag, string> = {
    immunity: "Bağışıklık",
    energy: "Enerji",
    digestion: "Sindirim",
    sleep: "Uyku",
    stress: "Stres & Odak",
    sport: "Spor",
    skin: "Cilt & Güzellik",
    joints: "Eklem & Kemik",
  };
  const needsText = input.needs
    .slice(0, 3)
    .map((n) => needLabels[n] ?? n)
    .join(", ");
  const explanation = `${needsText} ihtiyaçlarınıza göre ${scored.length} ürün önerildi.`;

  return NextResponse.json({
    recommendations: scored,
    explanation,
    total: scored.length,
  });
}
