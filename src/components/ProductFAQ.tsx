"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

interface FAQItem {
  q: string;
  a: string;
}

const faqByLocale: Record<Locale, FAQItem[]> = {
  tr: [
    { q: "Bu ürünü nasıl kullanmalıyım?", a: "Ürün etiketi ve ambalaj üzerindeki kullanım talimatlarını takip edin. Ayrıntılı kullanım önerisi ürün sayfasının 'Kullanım Önerisi' bölümünde yer almaktadır." },
    { q: "Ürünün içeriğinde alerjen var mı?", a: "Ürün içeriği 'İçerik Bilgisi' bölümünde detaylı olarak listelenmiştir. Bilinen alerjiniz varsa lütfen bir uzmana danışın." },
    { q: "İade ve değişim politikanız nedir?", a: "Açılmamış ürünlerde 14 gün içinde iade/değişim yapılabilmektedir. Kargo ücretleri müşteriye aittir. Bozuk veya hatalı ürünlerde ücretsiz iade yapılır." },
    { q: "Kargo ne kadar sürer?", a: "Türkiye içi siparişler 1-3 iş günü içinde teslim edilmektedir. Bugün 14:00'a kadar verilen siparişler aynı gün kargoya verilir." },
    { q: "Bu ürünü hamilelikte kullanabilir miyim?", a: "Hamilelik veya emzirme döneminde herhangi bir takviye kullanmadan önce mutlaka doktorunuza danışmanızı öneririz." },
  ],
  en: [
    { q: "How should I use this product?", a: "Follow the usage instructions on the label and packaging. Detailed directions are also available in the 'Usage Instructions' section on this page." },
    { q: "Does the product contain allergens?", a: "Full ingredient information is listed in the 'Ingredients' section. If you have known allergies, please consult a healthcare professional." },
    { q: "What is your return policy?", a: "Unopened products can be returned or exchanged within 14 days. Shipping costs are the customer's responsibility unless the product is defective." },
    { q: "How long does shipping take?", a: "Domestic orders are delivered within 1-3 business days. Orders placed before 14:00 are dispatched the same day." },
    { q: "Can I use this product during pregnancy?", a: "We strongly recommend consulting your doctor before using any supplement during pregnancy or while breastfeeding." },
  ],
  ar: [
    { q: "كيف أستخدم هذا المنتج؟", a: "اتبع تعليمات الاستخدام الموجودة على العبوة. يمكنك أيضًا الاطلاع على قسم 'طريقة الاستخدام' في هذه الصفحة." },
    { q: "هل يحتوي المنتج على مواد مسببة للحساسية؟", a: "قائمة المكونات الكاملة موجودة في قسم 'مكونات المنتج'. إذا كان لديك حساسية معروفة، يُرجى استشارة طبيبك." },
    { q: "ما هي سياسة الإرجاع؟", a: "يمكن إرجاع المنتجات غير المفتوحة خلال 14 يومًا. تكاليف الشحن على عاتق العميل إلا في حالة المنتجات التالفة." },
    { q: "كم يستغرق الشحن؟", a: "تُسلَّم الطلبات المحلية خلال 1-3 أيام عمل. الطلبات المقدمة قبل الساعة 14:00 تُشحن في نفس اليوم." },
    { q: "هل يمكن استخدامه أثناء الحمل؟", a: "ننصح بشدة باستشارة الطبيب قبل استخدام أي مكمل غذائي أثناء الحمل أو الرضاعة." },
  ],
  ru: [
    { q: "Как правильно принимать этот продукт?", a: "Следуйте инструкции на упаковке. Подробная информация также доступна в разделе 'Инструкция по применению' на этой странице." },
    { q: "Содержит ли продукт аллергены?", a: "Полный список ингредиентов указан в разделе 'Состав'. При наличии аллергий проконсультируйтесь с врачом." },
    { q: "Каковы условия возврата?", a: "Неоткрытые товары можно вернуть в течение 14 дней. Стоимость доставки несёт покупатель, кроме случаев брака." },
    { q: "Сколько времени занимает доставка?", a: "Внутренние заказы доставляются в течение 1-3 рабочих дней. Заказы до 14:00 отправляются в тот же день." },
    { q: "Можно ли принимать при беременности?", a: "Настоятельно рекомендуем проконсультироваться с врачом перед приёмом любых добавок во время беременности или кормления." },
  ],
};

interface ProductFAQProps {
  productId: string;
}

export function ProductFAQ({ productId: _ }: ProductFAQProps) {
  const locale = (useLocale() as Locale) ?? "tr";
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = faqByLocale[locale] ?? faqByLocale.tr;

  const title: Record<Locale, string> = {
    tr: "Sıkça Sorulan Sorular",
    en: "Frequently Asked Questions",
    ar: "الأسئلة الشائعة",
    ru: "Часто задаваемые вопросы",
  };

  return (
    <div className="mt-10 border-t border-olive-border/20 pt-10">
      <h2 className="text-lg font-bold text-green-900 mb-4">{title[locale]}</h2>
      <div className="flex flex-col gap-2">
        {faqs.map((item, i) => (
          <div key={i} className="border border-olive-border/30 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white hover:bg-cream-50 transition-colors"
            >
              <span className="text-sm font-semibold text-green-900 pr-4">{item.q}</span>
              <svg
                className={`w-4 h-4 text-green-700 shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openIdx === i && (
              <div className="px-4 py-3 bg-cream-50 border-t border-olive-border/20">
                <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
