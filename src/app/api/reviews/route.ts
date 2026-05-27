import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET /api/reviews?productId=xxx
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId gerekli." }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Yorumlar yüklenemedi." }, { status: 500 });

  return NextResponse.json({ reviews: data });
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  try {
    const { productId, author, rating, title, body } = await req.json();

    if (!productId || !author || !rating || !title || !body) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Puan 1-5 arasında olmalı." }, { status: 400 });
    }

    const supabase = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("reviews") as any).insert({
      product_id: productId,
      author: author.trim(),
      rating,
      title: title.trim(),
      body: body.trim(),
      verified: false,
      approved: false,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Yorum gönderilemedi." }, { status: 500 });
  }
}
