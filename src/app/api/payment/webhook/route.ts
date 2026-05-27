import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const SECRET_KEY = process.env.IYZICO_SECRET_KEY!;

function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!SECRET_KEY || !signature) return false;
  const expected = crypto
    .createHmac("sha1", SECRET_KEY)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-iyz-signature") ?? "";

    // Verify signature in production
    if (
      process.env.NODE_ENV === "production" &&
      !verifyWebhookSignature(rawBody, signature)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { iyziEventType, paymentConversationId, status } = event;

    console.log("İyzico webhook:", iyziEventType, paymentConversationId, status);

    if (!paymentConversationId) {
      return NextResponse.json({ received: true });
    }

    // Update order status in Supabase
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("PROJE_ID")
    ) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      let orderStatus: string | undefined;
      if (iyziEventType === "PAYMENT_SUCCESS" || status === "SUCCESS") {
        orderStatus = "preparing";
      } else if (iyziEventType === "PAYMENT_FAILURE" || status === "FAILURE") {
        orderStatus = "cancelled";
      } else if (iyziEventType === "REFUND_SUCCESS") {
        orderStatus = "refunded";
      }

      if (orderStatus) {
        await supabase
          .from("orders")
          .update({ status: orderStatus, updated_at: new Date().toISOString() })
          .eq("id", paymentConversationId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// İyzico sends GET to verify endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "hudaisifa-payment-webhook",
  });
}
