import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { segment } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // API key yoksa fallback döndür
    return NextResponse.json(getFallback(segment));
  }

  const prompt = `Sen Hüda-i Şifa organik ürünler markasının e-posta pazarlama uzmanısın.

Segment bilgileri:
- Kaynak: ${segment.source === "all" ? "Tüm kanallar" : segment.source === "checkout" ? "Sipariş sonrası kayıt" : "Footer formu"}
- Durum: ${segment.status === "active" ? "Aktif aboneler" : segment.status === "passive" ? "Pasif aboneler" : "Tümü"}
- Zaman: ${segment.dateRange === "all" ? "Tüm zamanlar" : `Son ${segment.dateRange} gün`}
- Toplam kişi: ${segment.count}
- Daha önce alışveriş yapanlar: ${segment.buyerCount}
- Müşteri sınıfı: ${segment.tier ?? "standart"}

Bu segmente özel bir e-posta kampanyası öner. Şu JSON formatında yanıt ver (başka hiçbir şey yazma):
{
  "template": "welcome|promo|new_prod|blog|custom",
  "subject": "E-posta konusu (max 60 karakter)",
  "body": "E-posta metni (3-4 paragraf, samimi, doğal, Türkçe)",
  "reason": "Neden bu içeriği önerdin (1-2 cümle)"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return NextResponse.json(getFallback(segment));

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    if (!json.subject) return NextResponse.json(getFallback(segment));
    return NextResponse.json(json);
  } catch {
    return NextResponse.json(getFallback(segment));
  }
}

function getFallback(seg: { source: string; status: string; count: number; buyerCount: number; tier?: string }) {
  if (seg.tier === "vip") {
    return {
      template: "promo",
      subject: "VIP Ayrıcalığınız: Özel Koleksiyon Erken Erişim 🌟",
      body: `Değerli VIP müşterimiz,\n\nSiz Hüda-i Şifa ailesinin en değerli üyelerinden birisiniz. Yeni premium koleksiyonumuza herkesin görmesinden 48 saat önce özel erişim hakkı kazandınız.\n\nVIP1 koduyla tüm siparişlerinizde %25 indirim ve ücretsiz express kargo sizin için hazır.\n\nSağlık ve huzurla,\nHüda-i Şifa Ekibi`,
      reason: "VIP segment için özel erken erişim ve yüksek indirim oranı önerildi — sadakat ödüllendirmesi en etkili yaklaşım.",
    };
  }
  if (seg.source === "checkout" || seg.buyerCount > 0) {
    return {
      template: "promo",
      subject: "Tekrar Hoş Geldiniz! Size Özel %15 İndirim 🎁",
      body: `Merhaba,\n\nSizi tekrar aramızda görmek harika! Daha önce Hüda-i Şifa'dan alışveriş yaptığınız için size özel bir sürpriz hazırladık.\n\nBu hafta tüm siparişlerinizde %15 indirim için TEKRAR15 kodunu kullanın.\n\nDoğal ve sağlıklı günler,\nHüda-i Şifa Ekibi`,
      reason: "Sipariş geçmişi olan segment için sadakat kampanyası önerildi. Alıcı segmenti en yüksek dönüşüm oranına sahip.",
    };
  }
  if (seg.status === "passive") {
    return {
      template: "promo",
      subject: "Sizi Özledik — Geri Dönün, Sürpriz Var! 🌿",
      body: `Merhaba,\n\nBir süredir haber alamadık; umarız iyisinizdir.\n\nHüda-i Şifa'da çok şey değişti: yeni ürünler, uzman önerileri sizi bekliyor. Geri dönüşünüzü kutlamak için GERI20 koduyla %20 indirim.\n\nSağlıklı günler,\nHüda-i Şifa Ekibi`,
      reason: "Pasif aboneleri yeniden kazanmak için win-back kampanyası önerildi.",
    };
  }
  return {
    template: "welcome",
    subject: "Hüda-i Şifa'ya Hoş Geldiniz — Hediyeniz Hazır! 🌿",
    body: `Merhaba,\n\nBültenimize abone olduğunuz için teşekkür ederiz!\n\nHer hafta doğal yaşam ipuçları ve özel indirimler sizi bekliyor. İlk alışverişinizde HOSGELDIN10 koduyla %10 indirim kazanıyorsunuz.\n\nDoğal günler,\nHüda-i Şifa Ekibi`,
    reason: "Yeni footer abonelerine hoşgeldin kampanyası önerildi — ilk temasın önemi yüksek.",
  };
}
