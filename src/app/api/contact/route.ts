import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Ad, e-posta ve mesaj zorunludur." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi." }, { status: 400 });
    }

    // Skip if Resend not configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_BURAYA")) {
      console.log("Contact form (Resend not configured):", { name, email, subject, message });
      return NextResponse.json({ success: true });
    }

    await resend.emails.send({
      from: "Hüda-i Şifa İletişim <noreply@hudaisifa.com>",
      to: "destek@hudaisifa.com",
      replyTo: email,
      subject: `İletişim Formu: ${subject || "Yeni Mesaj"} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f4f6f3;border-radius:12px">
          <h2 style="color:#2D4A1E;margin:0 0 16px">Yeni İletişim Mesajı</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#5A5E52;font-size:14px;width:100px"><strong>Ad:</strong></td><td style="padding:8px 0;font-size:14px">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#5A5E52;font-size:14px"><strong>E-posta:</strong></td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#556B2F">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;color:#5A5E52;font-size:14px"><strong>Konu:</strong></td><td style="padding:8px 0;font-size:14px">${subject}</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #d8e4c8;margin:16px 0">
          <p style="font-size:14px;color:#3a4a2e;line-height:1.7;white-space:pre-wrap">${message}</p>
          <hr style="border:none;border-top:1px solid #d8e4c8;margin:16px 0">
          <p style="font-size:12px;color:#8A9080">Hüda-i Şifa İletişim Formu • ${new Date().toLocaleString("tr-TR")}</p>
        </div>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: "Hüda-i Şifa <noreply@hudaisifa.com>",
      to: email,
      subject: "Mesajınız Alındı — Hüda-i Şifa",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f4f6f3;border-radius:12px">
          <h2 style="color:#2D4A1E">Merhaba ${name},</h2>
          <p style="font-size:15px;color:#3a4a2e;line-height:1.7">Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.</p>
          <p style="font-size:14px;color:#5A5E52;line-height:1.7">Gönderdiğiniz mesaj:<br><em style="color:#3a4a2e">"${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"</em></p>
          <hr style="border:none;border-top:1px solid #d8e4c8;margin:16px 0">
          <p style="font-size:12px;color:#8A9080">© 2026 Hüda-i Şifa Doğal Ürünler • destek@hudaisifa.com</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Mesaj gönderilemedi, lütfen tekrar deneyin." }, { status: 500 });
  }
}
