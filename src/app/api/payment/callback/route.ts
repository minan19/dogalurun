import { NextRequest, NextResponse } from "next/server";
import { verify3DPayment } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const paymentId = formData.get("paymentId") as string;
    const conversationId = formData.get("conversationId") as string;
    const status = formData.get("status") as string;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (status !== "success" || !paymentId) {
      return NextResponse.redirect(`${siteUrl}/tr/checkout?payment=failed`);
    }

    const result = await verify3DPayment(paymentId, conversationId);

    if (result.status === "success") {
      return NextResponse.redirect(
        `${siteUrl}/tr/checkout?payment=success&orderId=${conversationId}`
      );
    }

    return NextResponse.redirect(`${siteUrl}/tr/checkout?payment=failed&error=${encodeURIComponent(result.errorMessage || "")}`);
  } catch (err) {
    console.error("Payment callback error:", err);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${siteUrl}/tr/checkout?payment=error`);
  }
}
