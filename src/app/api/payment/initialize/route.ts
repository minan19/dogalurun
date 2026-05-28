import { NextRequest, NextResponse } from "next/server";
import { initiate3DPayment } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order, card, address } = body;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const buyerIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';
    const buyerIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';
    const buyerIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

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
        ip: buyerIp,
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
      { success: false, error: result.errorMessage || "Ödeme başlatılamadı" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Payment init error:", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
