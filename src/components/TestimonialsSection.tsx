"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

type Locale = "tr" | "en" | "ar" | "ru";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  avatar: string;
  date: string;
}

const testimonials: Record<Locale, Testimonial[]> = {
  tr: [
    { name: "Ayşe K.", location: "İstanbul", rating: 5, text: "Omega-3 takviyesini 2 aydır kullanıyorum, enerji seviyem gözle görülür şekilde arttı. Kesinlikle tavsiye ederim!", product: "Omega-3 Balık Yağı", avatar: "A", date: "Mart 2026" },
    { name: "Mehmet Y.", location: "Ankara", rating: 5, text: "Magnezyum glisinati denedim, uyku kalitem inanılmaz iyileşti. Sabahları çok daha dinç uyanıyorum.", product: "Magnezyum Bisglisinat", avatar: "M", date: "Şubat 2026" },
    { name: "Fatma S.", location: "İzmir", rating: 5, text: "D3+K2 kombinasyonu mükemmel. Kemik sağlığım için doktorum tavsiye etti, gerçekten fark yarattı.", product: "D3+K2 Vitamini", avatar: "F", date: "Mart 2026" },
    { name: "Ali R.", location: "Bursa", rating: 5, text: "Kargo hızlıydı, ürün kalitesi beklentilerimin üzerinde. Müşteri hizmetleri de çok ilgili.", product: "C Vitamini 1000mg", avatar: "A", date: "Ocak 2026" },
    { name: "Zeynep T.", location: "Antalya", rating: 5, text: "Organik spirulina ile başladım, artık sabah kahvesi bile içmiyorum. Enerjimi veriyor!", product: "Spirulina Tozu", avatar: "Z", date: "Şubat 2026" },
    { name: "Hasan B.", location: "Konya", rating: 4, text: "Probiyotik kürünü tamamladım, sindirim sorunlarım geride kaldı. Güvenilir bir marka.", product: "Probiyotik Kompleks", avatar: "H", date: "Mart 2026" },
  ],
  en: [
    { name: "Sarah M.", location: "London", rating: 5, text: "I've been using the Omega-3 supplement for 2 months and my energy levels have visibly improved. Highly recommend!", product: "Omega-3 Fish Oil", avatar: "S", date: "March 2026" },
    { name: "James L.", location: "Manchester", rating: 5, text: "Tried magnesium glycinate for sleep issues — incredible improvement. Waking up so refreshed every morning.", product: "Magnesium Bisglycinate", avatar: "J", date: "February 2026" },
    { name: "Emma W.", location: "Birmingham", rating: 5, text: "D3+K2 combination is excellent. My doctor recommended it for bone health and it really made a difference.", product: "D3+K2 Vitamin", avatar: "E", date: "March 2026" },
    { name: "Oliver P.", location: "Leeds", rating: 5, text: "Fast shipping, product quality exceeded my expectations. Customer service was very helpful too.", product: "Vitamin C 1000mg", avatar: "O", date: "January 2026" },
    { name: "Grace H.", location: "Bristol", rating: 5, text: "Started with organic spirulina and I don't even need my morning coffee anymore. It energizes me!", product: "Spirulina Powder", avatar: "G", date: "February 2026" },
    { name: "David K.", location: "Edinburgh", rating: 4, text: "Completed the probiotic course and my digestive issues are gone. A trustworthy brand.", product: "Probiotic Complex", avatar: "D", date: "March 2026" },
  ],
  ar: [
    { name: "سارة م.", location: "دبي", rating: 5, text: "أستخدم مكمل أوميغا-3 منذ شهرين وتحسنت طاقتي بشكل ملحوظ. أنصح به بشدة!", product: "زيت السمك أوميغا-3", avatar: "س", date: "مارس 2026" },
    { name: "أحمد ل.", location: "الرياض", rating: 5, text: "جربت المغنيسيوم لمشاكل النوم — تحسن مذهل. أستيقظ منتعشًا كل صباح.", product: "مغنيسيوم بيسغليسينات", avatar: "أ", date: "فبراير 2026" },
    { name: "نور ف.", location: "القاهرة", rating: 5, text: "مزيج D3+K2 ممتاز. أوصى به طبيبي لصحة العظام وقد أحدث فرقًا حقيقيًا.", product: "فيتامين D3+K2", avatar: "ن", date: "مارس 2026" },
    { name: "خالد ر.", location: "الكويت", rating: 5, text: "شحن سريع وجودة المنتج تجاوزت توقعاتي. خدمة العملاء رائعة أيضًا.", product: "فيتامين C 1000 ملغ", avatar: "خ", date: "يناير 2026" },
    { name: "منى ت.", location: "أبوظبي", rating: 5, text: "بدأت بالسبيرولينا العضوية ولم أعد بحاجة لقهوتي الصباحية. تمنحني الطاقة!", product: "مسحوق السبيرولينا", avatar: "م", date: "فبراير 2026" },
    { name: "عمر ب.", location: "عمّان", rating: 4, text: "أكملت كورس البروبيوتيك ومشاكل الهضم اختفت. علامة تجارية موثوقة.", product: "مركب البروبيوتيك", avatar: "ع", date: "مارس 2026" },
  ],
  ru: [
    { name: "Анна М.", location: "Москва", rating: 5, text: "Принимаю Омега-3 уже 2 месяца — уровень энергии заметно вырос. Очень рекомендую!", product: "Рыбий жир Омега-3", avatar: "А", date: "Март 2026" },
    { name: "Дмитрий Л.", location: "Санкт-Петербург", rating: 5, text: "Пробовал магний глицинат при проблемах со сном — невероятное улучшение. Просыпаюсь бодрым каждое утро.", product: "Магний бисглицинат", avatar: "Д", date: "Февраль 2026" },
    { name: "Елена В.", location: "Новосибирск", rating: 5, text: "Комбинация D3+K2 отличная. Врач порекомендовал для здоровья костей — реально помогло.", product: "Витамин D3+K2", avatar: "Е", date: "Март 2026" },
    { name: "Олег П.", location: "Казань", rating: 5, text: "Быстрая доставка, качество товара превзошло ожидания. Служба поддержки тоже на высоте.", product: "Витамин C 1000 мг", avatar: "О", date: "Январь 2026" },
    { name: "Наталья Х.", location: "Екатеринбург", rating: 5, text: "Начала принимать органическую спирулину и перестала пить утренний кофе. Даёт заряд энергии!", product: "Порошок спирулины", avatar: "Н", date: "Февраль 2026" },
    { name: "Сергей Б.", location: "Краснодар", rating: 4, text: "Прошёл курс пробиотиков — проблем с пищеварением больше нет. Надёжный бренд.", product: "Пробиотический комплекс", avatar: "С", date: "Март 2026" },
  ],
};

const titles: Record<Locale, { heading: string; sub: string }> = {
  tr: { heading: "Müşterilerimiz Ne Diyor?", sub: "Gerçek kullanıcı deneyimleri" },
  en: { heading: "What Our Customers Say", sub: "Real user experiences" },
  ar: { heading: "ماذا يقول عملاؤنا؟", sub: "تجارب مستخدمين حقيقيين" },
  ru: { heading: "Что говорят наши клиенты", sub: "Реальные отзывы пользователей" },
};

export function TestimonialsSection() {
  const locale = (useLocale() as Locale) ?? "tr";
  const items = testimonials[locale] ?? testimonials.tr;
  const { heading, sub } = titles[locale] ?? titles.tr;
  const [active, setActive] = useState(0);

  const visible = 3;
  const pages = Math.ceil(items.length / visible);
  const start = active * visible;
  const shown = items.slice(start, start + visible);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">{sub}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-900">{heading}</h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-text-secondary ml-2 font-medium">4.9 / 5 · 2,400+ yorum</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t, i) => (
            <div key={i} className="bg-cream-50 border border-olive-border/25 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= t.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-text-secondary leading-relaxed flex-1">"{t.text}"</p>

              {/* Product tag */}
              <span className="self-start text-[11px] font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                {t.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-1 border-t border-olive-border/20">
                <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">{t.name}</p>
                  <p className="text-[11px] text-text-secondary">{t.location} · {t.date}</p>
                </div>
                <svg className="w-5 h-5 text-green-600 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === active ? "bg-green-700 w-6" : "bg-green-200"}`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
