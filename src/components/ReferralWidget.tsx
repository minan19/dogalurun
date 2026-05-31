"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

const labels: Record<Locale, {
  title: string;
  subtitle: string;
  yourLink: string;
  copy: string;
  copied: string;
  share: string;
  howTitle: string;
  step1: string;
  step2: string;
  step3: string;
  reward: string;
  rewardDesc: string;
  shareVia: string;
  whatsapp: string;
  email: string;
  twitter: string;
  dir: string;
}> = {
  tr: {
    title: "Arkadaşını Davet Et, İkisi de Kazan",
    subtitle: "Her başarılı davet için sen ve arkadaşın 50 ₺ indirim kazanır.",
    yourLink: "Referans Linkin",
    copy: "Kopyala",
    copied: "Kopyalandı!",
    share: "Paylaş",
    howTitle: "Nasıl Çalışır?",
    step1: "Linki arkadaşınla paylaş",
    step2: "Arkadaşın ilk siparişini verir",
    step3: "İkisi de 50 ₺ indirim kazanır",
    reward: "50 ₺",
    rewardDesc: "her başarılı davet için",
    shareVia: "Şununla Paylaş:",
    whatsapp: "WhatsApp",
    email: "E-posta",
    twitter: "X / Twitter",
    dir: "ltr",
  },
  en: {
    title: "Invite Friends, Both Win",
    subtitle: "You and your friend each earn 50 ₺ off for every successful referral.",
    yourLink: "Your Referral Link",
    copy: "Copy",
    copied: "Copied!",
    share: "Share",
    howTitle: "How It Works",
    step1: "Share your link with a friend",
    step2: "Friend places their first order",
    step3: "Both of you get 50 ₺ off",
    reward: "50 ₺",
    rewardDesc: "per successful referral",
    shareVia: "Share via:",
    whatsapp: "WhatsApp",
    email: "Email",
    twitter: "X / Twitter",
    dir: "ltr",
  },
  ar: {
    title: "ادعُ أصدقاءك، كلاكما يفوز",
    subtitle: "أنت وصديقك تحصلان على خصم 50 ₺ لكل إحالة ناجحة.",
    yourLink: "رابط الإحالة الخاص بك",
    copy: "نسخ",
    copied: "تم النسخ!",
    share: "مشاركة",
    howTitle: "كيف يعمل؟",
    step1: "شارك رابطك مع صديق",
    step2: "يُقدّم صديقك طلبه الأول",
    step3: "كلاكما يحصل على خصم 50 ₺",
    reward: "50 ₺",
    rewardDesc: "لكل إحالة ناجحة",
    shareVia: "شارك عبر:",
    whatsapp: "واتساب",
    email: "بريد إلكتروني",
    twitter: "X / تويتر",
    dir: "rtl",
  },
  ru: {
    title: "Приглашай друзей — оба выигрывают",
    subtitle: "Вы и ваш друг получаете скидку 50 ₺ за каждого успешно приглашённого.",
    yourLink: "Ваша реферальная ссылка",
    copy: "Скопировать",
    copied: "Скопировано!",
    share: "Поделиться",
    howTitle: "Как это работает?",
    step1: "Поделитесь ссылкой с другом",
    step2: "Друг делает первый заказ",
    step3: "Оба получают скидку 50 ₺",
    reward: "50 ₺",
    rewardDesc: "за каждого приглашённого",
    shareVia: "Поделиться через:",
    whatsapp: "WhatsApp",
    email: "Эл. почта",
    twitter: "X / Twitter",
    dir: "ltr",
  },
};

function generateCode(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padEnd(6, "X");
  return `HS${code}`;
}

interface Props {
  email?: string;
}

export function ReferralWidget({ email = "musteri@hudaisifa.com" }: Props) {
  const locale = (useLocale() as Locale) ?? "tr";
  const l = labels[locale] ?? labels.tr;
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const code = generateCode(email);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://hudaisifa.com";
  const referralUrl = `${baseUrl}/${locale}/products?ref=${code}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const whatsappText = encodeURIComponent(`Hüda-i Şifa'dan doğal takviye ürünleri keşfet! Benim linkimden ilk siparişinde 50 ₺ indirim: ${referralUrl}`);
  const emailSubject = encodeURIComponent("Hüda-i Şifa'da 50 ₺ indirim fırsatı");
  const emailBody = encodeURIComponent(`Merhaba! Hüda-i Şifa'dan alışveriş yaparsan benim referans linkimle 50 ₺ indirim kazanırsın:\n\n${referralUrl}`);
  const twitterText = encodeURIComponent(`Doğal takviyeler için Hüda-i Şifa'yı deneyin — benim linkimden %50 ₺ indirim: ${referralUrl}`);

  return (
    <div className="rounded-2xl border border-olive-border/30 overflow-hidden" dir={l.dir}>
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-green-800 px-5 py-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-10 -translate-x-8" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎁</span>
            <h3 className="text-base font-bold">{l.title}</h3>
          </div>
          <p className="text-sm text-green-100/90 leading-relaxed">{l.subtitle}</p>

          {/* Reward badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <span className="text-xl font-black text-amber-300">{l.reward}</span>
            <span className="text-xs text-green-100">{l.rewardDesc}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 space-y-5">
        {/* Referral link */}
        <div>
          <p className="text-xs font-semibold text-green-800 mb-2 uppercase tracking-wide">{l.yourLink}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-cream-50 border border-olive-border/30 rounded-xl px-3 py-2.5 overflow-hidden">
              <p className="text-xs text-text-secondary truncate font-mono">
                {mounted ? referralUrl : "Yükleniyor..."}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                copied
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-green-700 hover:bg-green-800 text-white"
              }`}
            >
              {copied ? l.copied : l.copy}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div>
          <p className="text-xs font-semibold text-text-secondary/70 mb-2">{l.shareVia}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5C] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {l.whatsapp}
            </a>
            <a
              href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              {l.email}
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {l.twitter}
            </a>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-cream-50 rounded-xl p-4">
          <p className="text-xs font-bold text-green-800 mb-3">{l.howTitle}</p>
          <div className="space-y-2">
            {[l.step1, l.step2, l.step3].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <span className="text-xs text-text-secondary">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
