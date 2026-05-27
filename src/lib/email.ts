import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Hüda-i Şifa <noreply@hudaisifa.com>";

export interface OrderEmailData {
  to: string;
  customerName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: {
    name: string;
    surname: string;
    address: string;
    city: string;
    district?: string;
  };
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
}

function orderConfirmationHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f3;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f3;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2D4A1E,#4A7A2E);padding:40px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:28px;font-style:italic">Hüda-i Şifa</h1>
            <p style="color:#B8C9A3;margin:8px 0 0;font-size:14px;font-family:sans-serif">ORGANİK ÜRÜNLER</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h2 style="color:#2D4A1E;margin:0 0 8px;font-size:22px">Siparişiniz Alındı! ✅</h2>
            <p style="color:#5A5E52;margin:0 0 24px;font-family:sans-serif;font-size:15px">
              Merhaba <strong>${data.customerName}</strong>, siparişiniz başarıyla oluşturuldu.
            </p>

            <div style="background:#f8faf6;border-radius:12px;padding:16px;margin-bottom:24px">
              <p style="margin:0;font-family:sans-serif;font-size:13px;color:#8A9080">SİPARİŞ NO</p>
              <p style="margin:4px 0 0;font-family:monospace;font-size:18px;color:#2D4A1E;font-weight:bold">#${data.orderId}</p>
            </div>

            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <thead>
                <tr style="background:#f8faf6">
                  <th style="padding:10px;text-align:left;font-family:sans-serif;font-size:12px;color:#8A9080;font-weight:600">ÜRÜN</th>
                  <th style="padding:10px;text-align:center;font-family:sans-serif;font-size:12px;color:#8A9080;font-weight:600">ADET</th>
                  <th style="padding:10px;text-align:right;font-family:sans-serif;font-size:12px;color:#8A9080;font-weight:600">TUTAR</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
              <tr>
                <td style="font-family:sans-serif;font-size:14px;color:#5A5E52;padding:4px 0">Ara Toplam</td>
                <td style="font-family:sans-serif;font-size:14px;color:#5A5E52;padding:4px 0;text-align:right">${formatPrice(data.subtotal)}</td>
              </tr>
              ${data.discount > 0 ? `<tr><td style="font-family:sans-serif;font-size:14px;color:#E07B39;padding:4px 0">İndirim</td><td style="font-family:sans-serif;font-size:14px;color:#E07B39;padding:4px 0;text-align:right">-${formatPrice(data.discount)}</td></tr>` : ""}
              <tr>
                <td style="font-family:sans-serif;font-size:14px;color:#5A5E52;padding:4px 0">Kargo</td>
                <td style="font-family:sans-serif;font-size:14px;color:#5A5E52;padding:4px 0;text-align:right">${data.shipping === 0 ? "Ücretsiz" : formatPrice(data.shipping)}</td>
              </tr>
              <tr>
                <td style="border-top:2px solid #2D4A1E;font-family:sans-serif;font-size:16px;color:#2D4A1E;font-weight:bold;padding:12px 0 4px">TOPLAM</td>
                <td style="border-top:2px solid #2D4A1E;font-family:sans-serif;font-size:16px;color:#2D4A1E;font-weight:bold;padding:12px 0 4px;text-align:right">${formatPrice(data.total)}</td>
              </tr>
            </table>

            <!-- Address -->
            <div style="background:#f8faf6;border-radius:12px;padding:20px;margin-bottom:32px">
              <p style="margin:0 0 8px;font-family:sans-serif;font-size:13px;color:#8A9080;font-weight:600">TESLİMAT ADRESİ</p>
              <p style="margin:0;font-family:sans-serif;font-size:14px;color:#2D4A1E;line-height:1.6">
                <strong>${data.address.name} ${data.address.surname}</strong><br>
                ${data.address.address}<br>
                ${data.address.district ? data.address.district + "/" : ""}${data.address.city}
              </p>
            </div>

            <div style="text-align:center">
              <p style="font-family:sans-serif;font-size:13px;color:#8A9080;margin:0">
                Siparişiniz 1-3 iş günü içinde kargoya verilecektir.<br>
                Sorularınız için: <a href="mailto:destek@hudaisifa.com" style="color:#2D4A1E">destek@hudaisifa.com</a>
              </p>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#2D4A1E;padding:24px;text-align:center">
            <p style="color:#B8C9A3;margin:0;font-family:sans-serif;font-size:12px">
              © 2026 Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti. — Tüm hakları saklıdır.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_BURAYA")) {
    console.log("Resend not configured — skipping email");
    return { success: false, skipped: true };
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: data.to,
      subject: `Siparişiniz Alındı — #${data.orderId} | Hüda-i Şifa`,
      html: orderConfirmationHtml(data),
    });
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: String(err) };
  }
}
