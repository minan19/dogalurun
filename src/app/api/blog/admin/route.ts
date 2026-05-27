import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fallback in-memory store for when Supabase isn't configured
const memoryArticles: Record<string, unknown>[] = [];

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("PROJE_ID")
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(body)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ article: data });
  }

  // Memory fallback
  const article = {
    ...body,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  memoryArticles.push(article);
  return NextResponse.json({ article });
}
