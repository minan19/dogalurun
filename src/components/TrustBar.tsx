"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

type TrustKey = "expert" | "tested" | "natural" | "payment";
type LocaleKey = "tr" | "en" | "ar" | "ru";

interface PanelContent {
  title: string;
  body: string;
  points: string[];
  cta?: { label: string; href: string };
  logos?: string[];
}

const icons: Record<TrustKey, React.ReactElement> = {
  expert: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  tested: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  ),
  natural: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 2-4 4-4 7a4 4 0 0 0 8 0c0-3-2.5-5-4-7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v8" />
    </svg>
  ),
  payment: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
};

const allTranslations: Record<LocaleKey, {
  dir: string;
  items: { key: TrustKey; label: string; desc: string }[];
  panels: Record<TrustKey, PanelContent>;
  closeLabel: string;
  detailLabel: string;
  whatNeedHelp: string;
  expertTopics: string[];
  acceptedCards: string;
  paymentMethods: string[];
}> = {
  tr: {
    dir: "ltr",
    closeLabel: "Kapat ▲",
    detailLabel: "Detay ▼",
    whatNeedHelp: "Ne için destek arıyorsunuz?",
    expertTopics: ["Ürün seçimi", "İlaç etkileşimi", "Doz önerisi", "Genel sağlık"],
    acceptedCards: "Kabul edilen kartlar:",
    paymentMethods: ["💳 Visa", "💳 Mastercard", "💳 Troy", "🏦 Havale / EFT"],
    items: [
      { key: "expert",  label: "Uzman Danışman", desc: "Diyetisyen ve eczacı danışmanlarımız her ürünü inceler." },
      { key: "tested",  label: "Test Edilmiş", desc: "Sertifikalı laboratuvarlarda analiz edilmiş ürünler." },
      { key: "natural", label: "Doğal Formül", desc: "Yapay katkı maddesi içermeyen, doğal kaynaklı formüller." },
      { key: "payment", label: "Güvenli Ödeme", desc: "3D Secure altyapısıyla şifreli ve güvenli ödeme." },
    ],
    panels: {
      expert: {
        title: "Uzman Danışman Desteği",
        body: "Her ürün satışa sunulmadan önce alanında uzman diyetisyen ve eczacılarımız tarafından değerlendirilir. Siz de ihtiyacınıza özel destek alabilirsiniz.",
        points: ["Diyetisyen ve eczacı danışmanlığı", "Ürün seçiminde ücretsiz rehberlik", "İlaç-takviye etkileşim kontrolü", "Kişiselleştirilmiş öneriler"],
        cta: { label: "Uzmanlarımızla Tanışın →", href: "/experts" },
      },
      tested: {
        title: "Test Edilmiş & Sertifikalı İçerik",
        body: "Tüm ürünler ISO/IEC 17025 akreditasyonlu bağımsız laboratuvarlarda analiz edilmektedir. Sonuçlar şeffaf şekilde paylaşılmaktadır.",
        points: ["ISO 17025 akredite lab analizi", "Ağır metal & kirlilik testi", "Aktif madde doğrulama", "GMP (İyi Üretim Uygulamaları) sertifikası"],
        logos: ["ISO", "GMP", "NSF", "USP"],
      },
      natural: {
        title: "Doğal Formül Felsefesi",
        body: "Yapay renklendirici, tatlandırıcı ve dolgu maddesi kullanmıyoruz. Her formül, aktif bileşenlerin biyoyararlanımını en üst düzeye çıkarmak için tasarlanmaktadır.",
        points: ["Yapay katkı maddesi yok", "Non-GMO doğrulanmış hammadde", "Gluten / laktozsuz seçenekler mevcut", "Sürdürülebilir kaynak kullanımı"],
        cta: { label: "Formülasyon Politikamız →", href: "/about" },
      },
      payment: {
        title: "Güvenli Ödeme Altyapısı",
        body: "256-bit SSL şifreleme ve 3D Secure kimlik doğrulama ile ödeme bilgileriniz tamamen korunmaktadır. Kart bilgileriniz hiçbir zaman sunucularımızda saklanmaz.",
        points: ["256-bit SSL şifreli bağlantı", "3D Secure kimlik doğrulama", "PCI-DSS Level 1 uyumlu altyapı", "Kart bilgisi saklanmaz"],
        logos: ["Visa", "MC", "Troy", "3DS"],
      },
    },
  },
  en: {
    dir: "ltr",
    closeLabel: "Close ▲",
    detailLabel: "Details ▼",
    whatNeedHelp: "What do you need support for?",
    expertTopics: ["Product selection", "Drug interactions", "Dosage advice", "General health"],
    acceptedCards: "Accepted cards:",
    paymentMethods: ["💳 Visa", "💳 Mastercard", "💳 Troy", "🏦 Wire Transfer"],
    items: [
      { key: "expert",  label: "Expert Advisor", desc: "Our dietitian and pharmacist advisors review every product." },
      { key: "tested",  label: "Lab Tested", desc: "Products analyzed in certified laboratories." },
      { key: "natural", label: "Natural Formula", desc: "Natural-source formulas with no artificial additives." },
      { key: "payment", label: "Secure Payment", desc: "Encrypted and secure payment with 3D Secure." },
    ],
    panels: {
      expert: {
        title: "Expert Advisor Support",
        body: "Every product is evaluated by our expert dietitians and pharmacists before going on sale. You can also receive personalized support.",
        points: ["Dietitian and pharmacist consultation", "Free guidance in product selection", "Drug-supplement interaction check", "Personalized recommendations"],
        cta: { label: "Meet Our Experts →", href: "/experts" },
      },
      tested: {
        title: "Tested & Certified Content",
        body: "All products are analyzed in independent laboratories accredited to ISO/IEC 17025. Results are shared transparently.",
        points: ["ISO 17025 accredited lab analysis", "Heavy metal & contaminant testing", "Active ingredient verification", "GMP (Good Manufacturing Practice) certification"],
        logos: ["ISO", "GMP", "NSF", "USP"],
      },
      natural: {
        title: "Natural Formula Philosophy",
        body: "We do not use artificial colorants, sweeteners, or fillers. Every formula is designed to maximize the bioavailability of active ingredients.",
        points: ["No artificial additives", "Non-GMO verified raw materials", "Gluten / lactose-free options available", "Sustainable sourcing"],
        cta: { label: "Our Formulation Policy →", href: "/about" },
      },
      payment: {
        title: "Secure Payment Infrastructure",
        body: "Your payment information is fully protected with 256-bit SSL encryption and 3D Secure authentication. Card details are never stored on our servers.",
        points: ["256-bit SSL encrypted connection", "3D Secure authentication", "PCI-DSS Level 1 compliant infrastructure", "Card details never stored"],
        logos: ["Visa", "MC", "Troy", "3DS"],
      },
    },
  },
  ar: {
    dir: "rtl",
    closeLabel: "إغلاق ▲",
    detailLabel: "تفاصيل ▼",
    whatNeedHelp: "ما الذي تحتاج دعمًا فيه؟",
    expertTopics: ["اختيار المنتج", "تفاعلات الدواء", "نصيحة الجرعة", "الصحة العامة"],
    acceptedCards: "البطاقات المقبولة:",
    paymentMethods: ["💳 Visa", "💳 Mastercard", "💳 Troy", "🏦 تحويل بنكي"],
    items: [
      { key: "expert",  label: "مستشار خبير", desc: "يراجع مستشارونا من أخصائيي التغذية والصيادلة كل منتج." },
      { key: "tested",  label: "مختبَر ومعتمد", desc: "منتجات محللة في مختبرات معتمدة." },
      { key: "natural", label: "تركيبة طبيعية", desc: "تركيبات من مصادر طبيعية بدون إضافات اصطناعية." },
      { key: "payment", label: "دفع آمن", desc: "دفع مشفر وآمن مع 3D Secure." },
    ],
    panels: {
      expert: {
        title: "دعم المستشار الخبير",
        body: "يتم تقييم كل منتج من قِبَل أخصائيي التغذية والصيادلة الخبراء لدينا قبل طرحه للبيع. يمكنك أيضًا الحصول على دعم شخصي.",
        points: ["استشارة أخصائي تغذية وصيدلاني", "توجيه مجاني في اختيار المنتجات", "فحص تفاعلات الدواء والمكملات", "توصيات مخصصة"],
        cta: { label: "تعرف على خبرائنا ←", href: "/experts" },
      },
      tested: {
        title: "محتوى مختبَر ومعتمد",
        body: "يتم تحليل جميع المنتجات في مختبرات مستقلة معتمدة وفق ISO/IEC 17025. يتم مشاركة النتائج بشفافية.",
        points: ["تحليل مختبري معتمد ISO 17025", "اختبار المعادن الثقيلة والملوثات", "التحقق من المادة الفعالة", "شهادة GMP (ممارسات التصنيع الجيدة)"],
        logos: ["ISO", "GMP", "NSF", "USP"],
      },
      natural: {
        title: "فلسفة التركيبة الطبيعية",
        body: "لا نستخدم ألوانًا أو محليات أو حشوات اصطناعية. كل تركيبة مصممة لتعظيم التوافر البيولوجي للمكونات النشطة.",
        points: ["بدون إضافات اصطناعية", "مواد خام غير معدلة وراثيًا", "خيارات خالية من الغلوتين / اللاكتوز متاحة", "مصادر مستدامة"],
        cta: { label: "سياسة تركيباتنا ←", href: "/about" },
      },
      payment: {
        title: "بنية تحتية آمنة للدفع",
        body: "معلومات الدفع محمية بالكامل بتشفير SSL 256 بت وتوثيق 3D Secure. لا يتم تخزين بيانات البطاقة على خوادمنا.",
        points: ["اتصال مشفر بـ SSL 256 بت", "توثيق 3D Secure", "بنية تحتية متوافقة مع PCI-DSS المستوى 1", "لا يتم تخزين بيانات البطاقة"],
        logos: ["Visa", "MC", "Troy", "3DS"],
      },
    },
  },
  ru: {
    dir: "ltr",
    closeLabel: "Закрыть ▲",
    detailLabel: "Подробнее ▼",
    whatNeedHelp: "По какому вопросу вам нужна помощь?",
    expertTopics: ["Выбор продукта", "Взаимодействие лекарств", "Советы по дозировке", "Общее здоровье"],
    acceptedCards: "Принимаемые карты:",
    paymentMethods: ["💳 Visa", "💳 Mastercard", "💳 Troy", "🏦 Банковский перевод"],
    items: [
      { key: "expert",  label: "Эксперт-консультант", desc: "Наши диетологи и фармацевты проверяют каждый продукт." },
      { key: "tested",  label: "Лабораторно проверен", desc: "Продукты проанализированы в сертифицированных лабораториях." },
      { key: "natural", label: "Натуральная формула", desc: "Формулы из натуральных источников без искусственных добавок." },
      { key: "payment", label: "Безопасная оплата", desc: "Зашифрованная и безопасная оплата с 3D Secure." },
    ],
    panels: {
      expert: {
        title: "Поддержка эксперта-консультанта",
        body: "Каждый продукт оценивается нашими экспертами-диетологами и фармацевтами перед выходом на рынок. Вы также можете получить персонализированную поддержку.",
        points: ["Консультация диетолога и фармацевта", "Бесплатное руководство по выбору продуктов", "Проверка взаимодействий лекарств и добавок", "Персональные рекомендации"],
        cta: { label: "Познакомьтесь с нашими экспертами →", href: "/experts" },
      },
      tested: {
        title: "Проверенный и сертифицированный состав",
        body: "Все продукты анализируются в независимых лабораториях, аккредитованных по ISO/IEC 17025. Результаты раскрываются прозрачно.",
        points: ["Анализ в аккредитованной лаборатории ISO 17025", "Тестирование на тяжёлые металлы и загрязнители", "Верификация активных ингредиентов", "Сертификация GMP (Надлежащая производственная практика)"],
        logos: ["ISO", "GMP", "NSF", "USP"],
      },
      natural: {
        title: "Философия натуральной формулы",
        body: "Мы не используем искусственные красители, подсластители и наполнители. Каждая формула разработана для максимизации биодоступности активных ингредиентов.",
        points: ["Без искусственных добавок", "Подтверждённое сырьё без ГМО", "Варианты без глютена / лактозы", "Устойчивые источники сырья"],
        cta: { label: "Наша политика формулирования →", href: "/about" },
      },
      payment: {
        title: "Безопасная платёжная инфраструктура",
        body: "Ваши платёжные данные полностью защищены 256-битным шифрованием SSL и аутентификацией 3D Secure. Данные карты никогда не хранятся на наших серверах.",
        points: ["Соединение с шифрованием SSL 256 бит", "Аутентификация 3D Secure", "Инфраструктура, соответствующая PCI-DSS уровня 1", "Данные карты не сохраняются"],
        logos: ["Visa", "MC", "Troy", "3DS"],
      },
    },
  },
};

export function TrustBar() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const tr = allTranslations[locale] ?? allTranslations.tr;

  const [open, setOpen] = useState<TrustKey | null>(null);

  function toggle(key: TrustKey) {
    setOpen((prev) => (prev === key ? null : key));
  }

  const panel = open ? tr.panels[open] : null;

  return (
    <section className="bg-cream-100 border-y border-olive-border/30" dir={tr.dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tr.items.map((item) => (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={`flex flex-col items-center gap-2 justify-center rounded-xl px-4 py-4 border text-center transition-all ${
                open === item.key
                  ? "bg-green-700 border-green-700 shadow-md"
                  : "bg-white border-olive-border/30 hover:border-green-700/30 hover:shadow-sm"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                open === item.key ? "bg-white/20 text-white" : "bg-green-50 text-green-700"
              }`}>
                {icons[item.key]}
              </div>
              <span className={`text-sm font-semibold leading-tight ${open === item.key ? "text-white" : "text-green-800"}`}>
                {item.label}
              </span>
              <span className={`text-[11px] leading-snug ${open === item.key ? "text-white/80" : "text-text-secondary/70"}`}>
                {item.desc}
              </span>
              <span className={`text-[10px] font-semibold mt-0.5 ${open === item.key ? "text-white/70" : "text-green-700/60"}`}>
                {open === item.key ? tr.closeLabel : tr.detailLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Expand panel */}
        {panel && open && (
          <div className="mt-4 bg-white border border-green-700/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-bold text-green-800 mb-2">{panel.title}</h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">{panel.body}</p>

                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {panel.points.map((pt) => (
                    <div key={pt} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5 shrink-0">✓</span>
                      <span className="text-sm text-text-secondary">{pt}</span>
                    </div>
                  ))}
                </div>

                {panel.logos && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {panel.logos.map((logo) => (
                      <span key={logo} className="text-xs font-bold border border-olive-border/40 rounded-lg px-3 py-1.5 text-green-800 bg-green-50">
                        {logo}
                      </span>
                    ))}
                  </div>
                )}

                {open === "expert" && (
                  <div className="bg-green-50 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
                    <p className="text-sm text-green-800 font-medium flex-1">{tr.whatNeedHelp}</p>
                    <div className="flex flex-wrap gap-2">
                      {tr.expertTopics.map((q) => (
                        <Link key={q} href="/experts"
                          className="text-xs bg-white border border-green-700/30 text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 hover:text-white transition-colors">
                          {q}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {open === "payment" && (
                  <div className="flex gap-3 items-center flex-wrap">
                    <span className="text-xs text-text-secondary">{tr.acceptedCards}</span>
                    {tr.paymentMethods.map((m) => (
                      <span key={m} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700">
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {panel.cta && (
                  <div className="mt-4">
                    <Link href={panel.cta.href}
                      className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-900 hover:underline">
                      {panel.cta.label}
                    </Link>
                  </div>
                )}
              </div>

              <button onClick={() => setOpen(null)}
                className="text-text-secondary/50 hover:text-text-secondary shrink-0 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
