"use client";

import { useState } from "react";

type Locale = "tr" | "en" | "ar" | "ru";

const content: Record<Locale, {
  heading: string;
  sub: string;
  placeholder: string;
  cta: string;
  success: string;
  successSub: string;
}> = {
  tr: {
    heading: "Stok Girişinde Haber Al",
    sub: "E-posta adresinizi bırakın, ürün tekrar stoğa girdiğinde sizi bilgilendirelim.",
    placeholder: "E-posta adresiniz",
    cta: "Bildir",
    success: "Kaydedildi!",
    successSub: "Ürün tekrar stoğa girdiğinde e-posta ile bilgilendirileceksiniz.",
  },
  en: {
    heading: "Notify Me When Available",
    sub: "Leave your email and we'll let you know when this product is back in stock.",
    placeholder: "Your email address",
    cta: "Notify Me",
    success: "Saved!",
    successSub: "You'll receive an email when this product is back in stock.",
  },
  ar: {
    heading: "أعلمني عند توفره",
    sub: "اترك بريدك الإلكتروني وسنخبرك عندما يعود المنتج إلى المخزون.",
    placeholder: "بريدك الإلكتروني",
    cta: "أعلمني",
    success: "تم الحفظ!",
    successSub: "ستتلقى بريدًا إلكترونيًا عندما يتوفر هذا المنتج.",
  },
  ru: {
    heading: "Уведомить о поступлении",
    sub: "Оставьте email — мы сообщим, когда товар снова появится в наличии.",
    placeholder: "Ваш email",
    cta: "Уведомить",
    success: "Готово!",
    successSub: "Мы отправим вам письмо, когда товар поступит в продажу.",
  },
};

interface Props {
  productId: string;
  locale: string;
}

export function StockAlertButton({ productId: _, locale }: Props) {
  const loc = (locale as Locale) in content ? (locale as Locale) : "tr";
  const c = content[loc];
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  return (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        <span className="text-sm font-bold text-amber-800">{c.heading}</span>
      </div>

      {submitted ? (
        <div className="flex items-center gap-2 mt-2">
          <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-green-700">{c.success}</p>
            <p className="text-xs text-text-secondary mt-0.5">{c.successSub}</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-amber-700/80 mb-3">{c.sub}</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              className="flex-1 min-w-0 border border-amber-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 bg-white"
            />
            <button
              type="submit"
              className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              {c.cta}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
