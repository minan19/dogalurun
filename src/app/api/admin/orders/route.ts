import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation, type OrderEmailData } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from("orders")
    .insert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send confirmation email non-blockingly — does not delay the response
  if (body.customer_email) {
    const shippingAddress = body.shipping_address ?? {};
    const emailData: OrderEmailData = {
      to: body.customer_email,
      customerName: body.customer_name ?? shippingAddress.name ?? "Değerli Müşteri",
      orderId: data.id ?? body.id ?? "",
      items: Array.isArray(body.items)
        ? body.items.map((item: Record<string, unknown>) => ({
            name: String(item.name ?? item.productName ?? "Ürün"),
            quantity: Number(item.quantity ?? 1),
            price: Number(item.price ?? 0),
          }))
        : [],
      subtotal: Number(body.subtotal ?? 0),
      shipping: Number(body.shipping_cost ?? 0),
      discount: Number(body.discount ?? 0),
      total: Number(body.total ?? 0),
      address: {
        name: String(shippingAddress.name ?? ""),
        surname: String(shippingAddress.surname ?? ""),
        address: String(shippingAddress.address ?? ""),
        city: String(shippingAddress.city ?? body.city ?? ""),
        district: shippingAddress.district ? String(shippingAddress.district) : undefined,
      },
    };
    sendOrderConfirmation(emailData).catch((err) =>
      console.error("Order confirmation email failed:", err)
    );
  }

  return NextResponse.json({ order: data });
}
