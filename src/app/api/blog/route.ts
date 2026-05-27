import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Hardcoded fallback articles (shown when Supabase not configured)
const FALLBACK_ARTICLES = [
  {
    id: "1",
    slug: "d-vitamini-eksikligi",
    title: "D Vitamini Eksikliğinin 7 Belirtisi",
    summary: "Türkiye'de her 3 kişiden 1'i D vitamini eksikliği yaşıyor. Belirtileri tanıyın ve doğal çözümler keşfedin.",
    content: "D vitamini, kemik sağlığı, bağışıklık sistemi ve genel yaşam kalitesi için kritik öneme sahip bir vitamin...",
    author: "Ecz. Elif Karaca",
    category: "Sağlık",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    read_time: 5,
    published_at: "2026-03-01T10:00:00Z",
    is_published: true,
  },
  {
    id: "2",
    slug: "omega-3-faydalari",
    title: "Omega-3 Yağ Asitlerinin Kanıtlanmış 10 Faydası",
    summary: "Balık yağı ve omega-3 takviyelerinin beyin, kalp ve eklem sağlığına etkileri üzerine bilimsel veriler.",
    content: "Omega-3 yağ asitleri, vücudumuzun üretemediği ancak ihtiyaç duyduğu esansiyel yağlardır...",
    author: "Uzm. Dyt. Ayşe Demir",
    category: "Beslenme",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    read_time: 7,
    published_at: "2026-02-15T10:00:00Z",
    is_published: true,
  },
  {
    id: "3",
    slug: "bagisiklik-guclendir",
    title: "Bağışıklık Sisteminizi Güçlendirmenin 8 Doğal Yolu",
    summary: "Mevsim geçişlerinde hasta olmamak için uzman önerileri ve doğal takviyeler hakkında bilmeniz gerekenler.",
    content: "Bağışıklık sistemi, vücudumuzu dış tehditlere karşı koruyan karmaşık bir savunma mekanizmasıdır...",
    author: "Dr. Mehmet Yıldız",
    category: "Bağışıklık",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    read_time: 6,
    published_at: "2026-01-20T10:00:00Z",
    is_published: true,
  },
  {
    id: "4",
    slug: "magnezyum-eksikligi",
    title: "Magnezyum Eksikliği: Sessiz Salgın",
    summary: "Yorgunluk, uyku sorunları ve kas krampları yaşıyorsanız magnezyum eksikliği olabilir.",
    content: "Magnezyum, vücutta 300'den fazla enzimatik reaksiyonda görev alan kritik bir mineraldir...",
    author: "Ecz. Elif Karaca",
    category: "Mineraller",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80",
    read_time: 4,
    published_at: "2026-01-05T10:00:00Z",
    is_published: true,
  },
  {
    id: "5",
    slug: "probiyotik-rehberi",
    title: "Probiyotik Seçim Rehberi: Hangisi Size Uygun?",
    summary: "Piyasadaki onlarca probiyotik arasından doğru olanı nasıl seçersiniz? Uzman tavsiyesi.",
    content: "Probiyotikler, bağırsak sağlığını destekleyen canlı mikroorganizmalardır...",
    author: "Uzm. Dyt. Ayşe Demir",
    category: "Sindirim",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    read_time: 8,
    published_at: "2025-12-10T10:00:00Z",
    is_published: true,
  },
  {
    id: "6",
    slug: "collagen-cilt-sagligi",
    title: "Kolajen ve Cilt Sağlığı: Ne Zaman Başlamalısınız?",
    summary: "25 yaşından sonra kolajen üretimi düşmeye başlar. Doğal destekle cildinizi koruyun.",
    content: "Kolajen, cildin, kemiklerin ve eklemlerin yapı taşı olan bir proteindir...",
    author: "Dr. Mehmet Yıldız",
    category: "Cilt Sağlığı",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    read_time: 5,
    published_at: "2025-11-28T10:00:00Z",
    is_published: true,
  },
];

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "10");

  // Try Supabase first
  if (supabaseUrl && !supabaseUrl.includes("PROJE_ID")) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (category) query = query.eq("category", category);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({ articles: data, source: "supabase" });
      }
    } catch {}
  }

  // Fallback to hardcoded articles
  let articles = FALLBACK_ARTICLES.filter((a) => a.is_published);
  if (category) articles = articles.filter((a) => a.category === category);
  articles = articles.slice(0, limit);

  return NextResponse.json({ articles, source: "fallback" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (supabaseUrl && !supabaseUrl.includes("PROJE_ID")) {
      const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseKey);
      const { error } = await supabase.from("blog_posts").insert([body]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    // Without Supabase, just acknowledge
    return NextResponse.json({ success: true, note: "Supabase yapılandırılmamış — kayıt edilmedi" });
  } catch (err) {
    console.error("Blog POST error:", err);
    return NextResponse.json({ error: "Yazı eklenemedi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
    if (supabaseUrl && !supabaseUrl.includes("PROJE_ID")) {
      const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseKey);
      const { error } = await supabase.from("blog_posts").update(body).eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true, note: "Supabase yapılandırılmamış" });
  } catch (err) {
    console.error("Blog PUT error:", err);
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
    if (supabaseUrl && !supabaseUrl.includes("PROJE_ID")) {
      const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseKey);
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: true, note: "Supabase yapılandırılmamış" });
  } catch (err) {
    console.error("Blog DELETE error:", err);
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}
