import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Kupon kodu giriniz." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: couponRaw, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("active", true)
      .single();

    type CouponRow = {
      code: string;
      type: string;
      discount: number;
      min_cart?: number;
      max_uses?: number | null;
      used_count?: number;
      expires_at?: string | null;
    };
    const coupon = couponRaw as CouponRow | null;

    if (error || !coupon) {
      return NextResponse.json({ error: "Kupon kodu bulunamadı veya geçersiz." }, { status: 404 });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "Bu kuponun süresi dolmuş." }, { status: 400 });
    }

    if (coupon.max_uses != null && (coupon.used_count ?? 0) >= coupon.max_uses) {
      return NextResponse.json({ error: "Bu kupon kullanım limitine ulaşmış." }, { status: 400 });
    }

    const minCart = coupon.min_cart ?? 0;
    if (cartTotal < minCart) {
      return NextResponse.json({
        error: `Bu kupon için minimum sepet tutarı ${minCart} ₺'dir.`,
      }, { status: 400 });
    }

    const discountAmount =
      coupon.type === "pct"
        ? Math.round((cartTotal * coupon.discount) / 100)
        : coupon.discount;

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discount: discountAmount,
      type: coupon.type,
      pct: coupon.discount,
    });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
