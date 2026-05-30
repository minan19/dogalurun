"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "next-intl";

const STORAGE_KEY = "hudaisifa_exit_popup_dismissed";
const COUPON_CODE = "HUDA10";

type Locale = "tr" | "en" | "ar" | "ru";

const content: Record<Locale, {
  title: string; body: string; sub: string;
  placeholder: string; cta: string; skip: string;
  success: string; successSub: string; dir: string;
}> = {
  tr: {
    title: "Ayrılmadan önce!", body: "İlk siparişinize %10 indirim", sub: "E-posta adresinizi bırakın, kupon kodunuzu hemen göndeririz.",
    placeholder: "E-posta adresiniz", cta: "İndirim Kodumu Al", skip: "Teşekkür ederim, istemiyorum",
    success: `Kupon kodunuz: ${COUPON_CODE}`, successSub: "Bu kodu ödeme sayfasında kullanın. İyi alışverişler!", dir: "ltr",
  },
  en: {
    title: "Wait! Before you go…", body: "10% off your first order", sub: "Leave your email and we'll send your coupon code instantly.",
    placeholder: "Your email address", cta: "Get My Discount", skip: "No thanks, I'll pay full price",
    success: `Your coupon code: ${COUPON_CODE}`, successSub: "Use this code at checkout. Happy shopping!", dir: "ltr",
  },
  ar: {
    title: "انتظر قبل المغادرة!", body: "خصم 10% على طلبك الأول", sub: "اترك بريدك الإلكتروني وسنرسل لك كود الخصم فورًا.",
    placeholder: "بريدك الإلكتروني", cta: "احصل على الخصم", skip: "لا شكرًا",
    success: `كود الخصم: ${COUPON_CODE}`, successSub: "استخدم هذا الكود عند الدفع.", dir: "rtl",
  },
  ru: {
    title: "Подождите!", body: "Скидка 10% на первый заказ", sub: "Оставьте email, и мы сразу пришлём промокод.",
    placeholder: "Ваш email", cta: "Получить скидку", skip: "Нет, спасибо",
    success: `Ваш промокод: ${COUPON_CODE}`, successSub: "Используйте его при оформлении заказа.", dir: "ltr",
  },
};

export function ExitIntentPopup() {
  const locale = (useLocale() as Locale) ?? "tr";
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function show() {
      if (triggered.current) return;
      triggered.current = true;
      setVisible(true);
    }

    // Desktop: mouse exits viewport from top
    function onMouseOut(e: MouseEvent) {
      if (e.clientY <= 0 && e.relatedTarget === null) show();
    }

    // Mobile fallback: 30s timeout
    const timer = setTimeout(show, 30000);

    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
    setTimeout(dismiss, 5000);
  }

  if (!visible) return null;

  const c = content[locale] ?? content.tr;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={dismiss}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir={c.dir}
      >
        {/* Dekoratif arka plan */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-50 rounded-full opacity-60" />
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-50 rounded-full opacity-40" />

        {/* Kapat */}
        <button onClick={dismiss} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-secondary/50 hover:text-text-secondary rounded-full hover:bg-cream-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4 relative">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-lg font-bold text-green-800 mb-2">{c.success}</p>
            <div className="bg-green-50 border-2 border-dashed border-green-700/30 rounded-xl px-6 py-3 my-4 inline-block">
              <span className="text-2xl font-bold tracking-widest text-green-700">{COUPON_CODE}</span>
            </div>
            <p className="text-sm text-text-secondary">{c.successSub}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6 relative">
              <div className="text-4xl mb-3">🌿</div>
              <h2 className="text-xl font-bold text-green-900">{c.title}</h2>
              <p className="text-2xl font-extrabold text-green-700 mt-1">{c.body}</p>
              <p className="text-sm text-text-secondary mt-2">{c.sub}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.placeholder}
                className="border border-olive-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50"
              />
              <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                {c.cta}
              </button>
              <button type="button" onClick={dismiss} className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors text-center py-1">
                {c.skip}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
