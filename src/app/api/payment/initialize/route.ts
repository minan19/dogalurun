import { NextRequest, NextResponse } from "next/server";
import { initiate3DPayment } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order, card, address } = body;

    if (!order || !card || !address) {
      return NextResponse.json({ success: false, error: "Eksik bilgi" }, { status: 400 });
    }

    if (
      typeof card.cardNumber !== "string" || !card.cardNumber ||
      typeof card.expireMonth !== "string" || !card.expireMonth ||
      typeof card.expireYear !== "string" || !card.expireYear ||
      typeof card.cvc !== "string" || !card.cvc
    ) {
      return NextResponse.json({ success: false, error: "Kart bilgileri eksik" }, { status: 400 });
    }

    if (
      typeof address.name !== "string" || !address.name ||
      typeof address.surname !== "string" || !address.surname ||
      typeof address.email !== "string" || !address.email ||
      typeof address.address !== "string" || !address.address ||
      typeof address.city !== "string" || !address.city
    ) {
      return NextResponse.json({ success: false, error: "Adres bilgileri eksik" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const buyerIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    const result = await initiate3DPayment({
      price: order.subtotal,
      paidPrice: order.total,
      orderId: order.id,
      customer: {
        name: address.name,
        surname: address.surname,
        email: address.email,
        phone: address.phone || "+905000000000",
        ip: buyerIp,
        city: address.city || "Istanbul",
        country: address.country || "Turkey",
        address: address.address,
        zipCode: address.zipCode,
      },
      items: order.items.map((item: { id: string; name: string; category?: string; price: number; quantity: number }) => ({
        id: item.id,
        name: item.name,
        category: item.category || "Takviye",
        price: item.price * item.quantity,
      })),
      callbackUrl: `${siteUrl}/api/payment/callback`,
      card,
    });

    if (result.status === "success") {
      return NextResponse.json({
        success: true,
        threeDSHtmlContent: result.threeDSHtmlContent,
        conversationId: result.conversationId,
      });
    }

    return NextResponse.json(
      { success: false, error: result.errorMessage || "Odeme baslatılamadı" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Payment init error:", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
