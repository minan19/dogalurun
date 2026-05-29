"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const t: Record<LocaleKey, {
  dir: string;
  badge: string;
  title: string;
  subtitle: string;
  placeholder: string;
  button: string;
  success: string;
  successSub: string;
  privacy: string;
}> = {
  tr: {
    dir: "ltr",
    badge: "Ücretsiz",
    title: "Sağlık Rehberi Bültenine Katılın",
    subtitle: "Uzman önerileri, yeni ürünler ve özel indirimler doğrudan e-postanıza gelsin.",
    placeholder: "E-posta adresiniz",
    button: "Abone Ol",
    success: "Teşekkürler!",
    successSub: "Hoş geldin! İlk bülteniniz yakında posta kutunuzda.",
    privacy: "Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.",
  },
  en: {
    dir: "ltr",
    badge: "Free",
    title: "Join the Health Guide Newsletter",
    subtitle: "Expert tips, new products and exclusive discounts straight to your inbox.",
    placeholder: "Your email address",
    button: "Subscribe",
    success: "Thank you!",
    successSub: "Welcome! Your first newsletter will be in your inbox soon.",
    privacy: "No spam. Unsubscribe any time.",
  },
  ar: {
    dir: "rtl",
    badge: "مجاني",
    title: "انضم إلى نشرة الدليل الصحي",
    subtitle: "نصائح الخبراء والمنتجات الجديدة والخصومات الحصرية مباشرةً إلى بريدك الإلكتروني.",
    placeholder: "عنوان بريدك الإلكتروني",
    button: "اشترك",
    success: "شكراً لك!",
    successSub: "مرحباً! ستصلك نشرتك الأولى قريباً.",
    privacy: "لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت.",
  },
  ru: {
    dir: "ltr",
    badge: "Бесплатно",
    title: "Подпишитесь на рассылку о здоровье",
    subtitle: "Советы экспертов, новые продукты и эксклюзивные скидки прямо на почту.",
    placeholder: "Ваш адрес электронной почты",
    button: "Подписаться",
    success: "Спасибо!",
    successSub: "Добро пожаловать! Первый выпуск рассылки скоро в вашем ящике.",
    privacy: "Без спама. Отписаться можно в любое время.",
  },
};

export function NewsletterSection() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const tx = t[locale] ?? t.tr;

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="py-14 sm:py-20 bg-green-800" dir={tx.dir}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-green-300 bg-green-700/60 px-3 py-1 rounded-full mb-4">
          {tx.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{tx.title}</h2>
        <p className="text-green-100/80 text-sm sm:text-base mb-8 max-w-md mx-auto">{tx.subtitle}</p>

        {submitted ? (
          <div className="bg-green-700/50 border border-green-600 rounded-2xl px-6 py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold text-lg">{tx.success}</p>
            <p className="text-green-200 text-sm mt-1">{tx.successSub}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tx.placeholder}
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-green-800 font-bold px-6 py-3.5 rounded-xl text-sm hover:bg-green-50 transition-colors disabled:opacity-70 shrink-0"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                </span>
              ) : tx.button}
            </button>
          </form>
        )}

        <p className="text-green-300/60 text-xs mt-4">{tx.privacy}</p>
      </div>
    </section>
  );
}
