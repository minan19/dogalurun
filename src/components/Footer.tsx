"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const footerTranslations: Record<LocaleKey, {
  dir: string;
  tagline: string;
  desc: string;
  phone: string;
  address: string;
  securePayment: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  newsletter: { title: string; desc: string; placeholder: string; btn: string; loading: string; success: string; kvkkText: string; kvkkLink: string; errorDefault: string; errorConn: string };
  disclaimer: string;
  copyright: string;
  dev: string;
}> = {
  tr: {
    dir: "ltr",
    tagline: "Doğanın Şifasını Sunuyoruz",
    desc: "Uzman onaylı, bilimsel destekli doğal takviye ve organik gıda ürünleri. Türkiye genelinde hızlı kargo ile kapınıza.",
    phone: "0850 XXX XX XX (Hafta içi 09–18)",
    address: "Çankaya, Ankara / Türkiye",
    securePayment: "Güvenli ödeme:",
    columns: [
      {
        title: "Hüda-i Şifa",
        links: [
          { label: "Hakkımızda", href: "/about" },
          { label: "Uzmanlarımız", href: "/experts" },
          { label: "Markalarımız", href: "/brands" },
          { label: "Blog & İçerikler", href: "/blog" },
          { label: "İletişim", href: "/contact" },
          { label: "Kariyer", href: "/contact" },
        ],
      },
      {
        title: "Ürünler & Hizmetler",
        links: [
          { label: "Tüm Ürünler", href: "/products" },
          { label: "Takviye Edici Gıdalar", href: "/products" },
          { label: "Organik Gıdalar", href: "/products" },
          { label: "Doğal Kişisel Bakım", href: "/products" },
          { label: "Özel Seçimler", href: "/products" },
          { label: "Sağlık Önerisi Al", href: "/recommendations" },
        ],
      },
      {
        title: "Destek & Yardım",
        links: [
          { label: "Sık Sorulan Sorular", href: "/faq" },
          { label: "Kargo & Teslimat", href: "/shipping" },
          { label: "İade & Değişim", href: "/shipping" },
          { label: "Sipariş Takibi", href: "/order-tracking" },
          { label: "Takviye Bilgilendirme", href: "/supplement-info" },
          { label: "Uzman Danışmanlığı", href: "/experts" },
        ],
      },
      {
        title: "Hukuki",
        links: [
          { label: "KVKK Aydınlatma Metni", href: "/privacy" },
          { label: "Gizlilik Politikası", href: "/privacy" },
          { label: "Kullanım Koşulları", href: "/terms" },
          { label: "Mesafeli Satış Sözleşmesi", href: "/terms" },
          { label: "Ön Bilgilendirme Formu", href: "/terms" },
          { label: "Çerez Politikası", href: "/privacy" },
        ],
      },
    ],
    newsletter: {
      title: "Bülten",
      desc: "Kampanya, sağlık içerikleri ve yeni ürünlerden haberdar olun.",
      placeholder: "E-posta adresiniz",
      btn: "Abone Ol",
      loading: "…",
      success: "✓ Abone oldunuz! Teşekkürler.",
      kvkkText: "kapsamında korunmaktadır.",
      kvkkLink: "KVKK",
      errorDefault: "Hata oluştu.",
      errorConn: "Bağlantı hatası. Lütfen tekrar deneyin.",
    },
    disclaimer: "⚠️ Önemli Uyarı: Bu sitede yer alan ürünler takviye edici gıda niteliğinde olup herhangi bir hastalığı tedavi etmez, tanı koymaz veya önlemez. Ürünleri kullanmadan önce doktorunuza veya eczacınıza danışmanız önerilir. Hamile, emziren, kronik hastalığı olan veya ilaç kullanan kişiler özellikle dikkatli olmalıdır. Tüm içerikler bilgilendirme amaçlıdır; sağlık tavsiyesi niteliği taşımaz.",
    copyright: "Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti. — Tüm hakları saklıdır.",
    dev: "Tasarım & Geliştirme: Hüda-i Şifa Teknoloji",
  },
  en: {
    dir: "ltr",
    tagline: "Bringing Nature's Healing to You",
    desc: "Expert-approved, scientifically supported natural supplement and organic food products. Fast delivery across Turkey.",
    phone: "0850 XXX XX XX (Weekdays 09–18)",
    address: "Çankaya, Ankara / Turkey",
    securePayment: "Secure payment:",
    columns: [
      {
        title: "Hüda-i Şifa",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Our Experts", href: "/experts" },
          { label: "Our Brands", href: "/brands" },
          { label: "Blog & Content", href: "/blog" },
          { label: "Contact", href: "/contact" },
          { label: "Careers", href: "/contact" },
        ],
      },
      {
        title: "Products & Services",
        links: [
          { label: "All Products", href: "/products" },
          { label: "Dietary Supplements", href: "/products" },
          { label: "Organic Foods", href: "/products" },
          { label: "Natural Personal Care", href: "/products" },
          { label: "Special Picks", href: "/products" },
          { label: "Get Health Advice", href: "/recommendations" },
        ],
      },
      {
        title: "Support & Help",
        links: [
          { label: "FAQ", href: "/faq" },
          { label: "Shipping & Delivery", href: "/shipping" },
          { label: "Returns & Exchanges", href: "/shipping" },
          { label: "Order Tracking", href: "/order-tracking" },
          { label: "Supplement Info", href: "/supplement-info" },
          { label: "Expert Consultation", href: "/experts" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy (KVKK)", href: "/privacy" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Use", href: "/terms" },
          { label: "Distance Sales Agreement", href: "/terms" },
          { label: "Pre-Information Form", href: "/terms" },
          { label: "Cookie Policy", href: "/privacy" },
        ],
      },
    ],
    newsletter: {
      title: "Newsletter",
      desc: "Stay informed about campaigns, health content and new products.",
      placeholder: "Your email address",
      btn: "Subscribe",
      loading: "…",
      success: "✓ Subscribed! Thank you.",
      kvkkText: "Your personal data is protected under our",
      kvkkLink: "Privacy Policy",
      errorDefault: "An error occurred.",
      errorConn: "Connection error. Please try again.",
    },
    disclaimer: "⚠️ Important Notice: Products on this site are dietary supplements and do not treat, diagnose or prevent any disease. It is recommended that you consult your doctor or pharmacist before use. Pregnant or nursing women, people with chronic conditions or those taking medication should be especially careful. All content is for informational purposes only and does not constitute health advice.",
    copyright: "Hüda-i Şifa Natural Products Ltd. — All rights reserved.",
    dev: "Design & Development: Hüda-i Şifa Technology",
  },
  ar: {
    dir: "rtl",
    tagline: "نقدم لك شفاء الطبيعة",
    desc: "منتجات طبيعية ومكملات غذائية عضوية معتمدة من الخبراء ومدعومة علميًا. توصيل سريع في جميع أنحاء تركيا.",
    phone: "0850 XXX XX XX (أيام الأسبوع 09–18)",
    address: "تشانكايا، أنقرة / تركيا",
    securePayment: "دفع آمن:",
    columns: [
      {
        title: "هُدائي شِفا",
        links: [
          { label: "من نحن", href: "/about" },
          { label: "خبراؤنا", href: "/experts" },
          { label: "علاماتنا التجارية", href: "/brands" },
          { label: "المدونة والمحتوى", href: "/blog" },
          { label: "اتصل بنا", href: "/contact" },
          { label: "وظائف", href: "/contact" },
        ],
      },
      {
        title: "المنتجات والخدمات",
        links: [
          { label: "جميع المنتجات", href: "/products" },
          { label: "المكملات الغذائية", href: "/products" },
          { label: "الأغذية العضوية", href: "/products" },
          { label: "العناية الشخصية الطبيعية", href: "/products" },
          { label: "اختيارات خاصة", href: "/products" },
          { label: "احصل على نصيحة صحية", href: "/recommendations" },
        ],
      },
      {
        title: "الدعم والمساعدة",
        links: [
          { label: "الأسئلة الشائعة", href: "/faq" },
          { label: "الشحن والتوصيل", href: "/shipping" },
          { label: "الإرجاع والاستبدال", href: "/shipping" },
          { label: "تتبع الطلب", href: "/order-tracking" },
          { label: "معلومات المكملات", href: "/supplement-info" },
          { label: "استشارة الخبراء", href: "/experts" },
        ],
      },
      {
        title: "القانونية",
        links: [
          { label: "سياسة حماية البيانات (KVKK)", href: "/privacy" },
          { label: "سياسة الخصوصية", href: "/privacy" },
          { label: "شروط الاستخدام", href: "/terms" },
          { label: "اتفاقية البيع عن بُعد", href: "/terms" },
          { label: "نموذج المعلومات المسبقة", href: "/terms" },
          { label: "سياسة ملفات تعريف الارتباط", href: "/privacy" },
        ],
      },
    ],
    newsletter: {
      title: "النشرة الإخبارية",
      desc: "ابق على اطلاع بالعروض والمحتوى الصحي والمنتجات الجديدة.",
      placeholder: "بريدك الإلكتروني",
      btn: "اشترك",
      loading: "…",
      success: "✓ تم الاشتراك! شكرًا لك.",
      kvkkText: "بياناتك الشخصية محمية بموجب",
      kvkkLink: "سياسة الخصوصية",
      errorDefault: "حدث خطأ.",
      errorConn: "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
    },
    disclaimer: "⚠️ تنبيه مهم: المنتجات الموجودة في هذا الموقع هي مكملات غذائية ولا تعالج أي مرض ولا تشخّصه ولا تمنعه. يُنصح باستشارة الطبيب أو الصيدلاني قبل الاستخدام. يجب على الحوامل والمرضعات وأصحاب الأمراض المزمنة ومستخدمي الأدوية توخّي الحذر. جميع المحتويات لأغراض معلوماتية فقط وليست نصيحة طبية.",
    copyright: "هُدائي شِفا للمنتجات الطبيعية — جميع الحقوق محفوظة.",
    dev: "التصميم والتطوير: هُدائي شِفا للتكنولوجيا",
  },
  ru: {
    dir: "ltr",
    tagline: "Приносим вам целительную силу природы",
    desc: "Одобренные экспертами, научно обоснованные натуральные добавки и органические продукты питания. Быстрая доставка по всей Турции.",
    phone: "0850 XXX XX XX (Будни 09–18)",
    address: "Чанкая, Анкара / Турция",
    securePayment: "Безопасная оплата:",
    columns: [
      {
        title: "Hüda-i Şifa",
        links: [
          { label: "О нас", href: "/about" },
          { label: "Наши эксперты", href: "/experts" },
          { label: "Наши бренды", href: "/brands" },
          { label: "Блог и материалы", href: "/blog" },
          { label: "Контакты", href: "/contact" },
          { label: "Вакансии", href: "/contact" },
        ],
      },
      {
        title: "Продукты и услуги",
        links: [
          { label: "Все продукты", href: "/products" },
          { label: "Пищевые добавки", href: "/products" },
          { label: "Органическое питание", href: "/products" },
          { label: "Натуральный уход", href: "/products" },
          { label: "Специальный выбор", href: "/products" },
          { label: "Получить рекомендацию", href: "/recommendations" },
        ],
      },
      {
        title: "Поддержка и помощь",
        links: [
          { label: "Частые вопросы", href: "/faq" },
          { label: "Доставка", href: "/shipping" },
          { label: "Возврат и обмен", href: "/shipping" },
          { label: "Отслеживание заказа", href: "/order-tracking" },
          { label: "О добавках", href: "/supplement-info" },
          { label: "Консультация эксперта", href: "/experts" },
        ],
      },
      {
        title: "Правовая информация",
        links: [
          { label: "Политика конфиденциальности (KVKK)", href: "/privacy" },
          { label: "Политика конфиденциальности", href: "/privacy" },
          { label: "Условия использования", href: "/terms" },
          { label: "Договор дистанционной продажи", href: "/terms" },
          { label: "Форма предварительной информации", href: "/terms" },
          { label: "Политика cookies", href: "/privacy" },
        ],
      },
    ],
    newsletter: {
      title: "Рассылка",
      desc: "Будьте в курсе акций, материалов о здоровье и новых продуктов.",
      placeholder: "Ваш email",
      btn: "Подписаться",
      loading: "…",
      success: "✓ Подписка оформлена! Спасибо.",
      kvkkText: "Ваши данные защищены в соответствии с нашей",
      kvkkLink: "Политикой конфиденциальности",
      errorDefault: "Произошла ошибка.",
      errorConn: "Ошибка соединения. Пожалуйста, попробуйте снова.",
    },
    disclaimer: "⚠️ Важное уведомление: Продукты на этом сайте являются пищевыми добавками и не лечат, не диагностируют и не предотвращают никакие заболевания. Перед применением рекомендуется проконсультироваться с врачом или фармацевтом. Беременным, кормящим матерям, людям с хроническими заболеваниями и принимающим лекарства следует соблюдать особую осторожность. Весь контент носит исключительно информационный характер и не является медицинским советом.",
    copyright: "Hüda-i Şifa Natural Products Ltd. — Все права защищены.",
    dev: "Дизайн и разработка: Hüda-i Şifa Technology",
  },
};

function NewsletterForm({ t }: { t: typeof footerTranslations.tr.newsletter }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t.errorDefault); return; }
      setDone(true);
    } catch {
      setError(t.errorConn);
    } finally {
      setLoading(false);
    }
  }

  return done ? (
    <p className="text-sm text-green-300 font-medium">{t.success}</p>
  ) : (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 min-w-0" />
        <button type="submit" disabled={loading}
          className="bg-[#C49A3C] hover:bg-[#D4AA4C] disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shrink-0">
          {loading ? t.loading : t.btn}
        </button>
      </form>
      {error && <p className="text-xs text-red-300 mt-1">{error}</p>}
      <p className="text-[11px] text-white/40 mt-2 leading-snug">
        {t.kvkkText}{" "}<Link href="/privacy" className="underline hover:text-white/60">{t.kvkkLink}</Link>
        {" "}
      </p>
    </>
  );
}

export function Footer() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = footerTranslations[locale] ?? footerTranslations.tr;

  return (
    <footer className="bg-[#1a2e0a] text-white" dir={t.dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo + contact column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Hüda-i Şifa"
                width={96}
                height={96}
                className="w-24 h-24 object-contain mix-blend-multiply shrink-0"
                unoptimized
              />
              <div>
                <p className="font-bold text-white text-base leading-tight">Hüda-i Şifa</p>
                <p className="text-[11px] text-white/50">{t.tagline}</p>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-4">{t.desc}</p>
            <div className="flex flex-col gap-2 mb-4">
              {[
                { icon: "📧", text: "destek@hudaisifa.com" },
                { icon: "📞", text: t.phone },
                { icon: "📍", text: t.address },
              ].map((c) => (
                <div key={c.text} className="flex items-center gap-2">
                  <span className="text-sm">{c.icon}</span>
                  <span className="text-xs text-white/60">{c.text}</span>
                </div>
              ))}
            </div>
            {/* Social media */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                </svg>
              </a>
              <a href="https://wa.me/905XXXXXXXXX" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {t.columns.map((col) => (
            <div key={col.title} className="col-span-1">
              <h3 className="text-xs font-bold text-[#C49A3C] uppercase tracking-wider mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}
                      className="text-xs text-white/60 hover:text-white transition-colors leading-tight block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className="text-xs font-bold text-[#C49A3C] uppercase tracking-wider mb-1">{t.newsletter.title}</h3>
            <p className="text-xs text-white/60 leading-snug">{t.newsletter.desc}</p>
            <NewsletterForm t={t.newsletter} />
          </div>
        </div>

        {/* Payment & trust logos */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-white/40 mr-1">{t.securePayment}</span>
              {["VISA", "Mastercard", "Troy", "Havale/EFT"].map((p) => (
                <span key={p} className="text-[10px] border border-white/20 rounded px-2 py-1 text-white/60 font-medium">
                  {p}
                </span>
              ))}
              <span className="text-[10px] bg-green-900/50 border border-green-700/30 rounded px-2 py-1 text-green-400 font-semibold">
                🔒 3D Secure
              </span>
              <span className="text-[10px] bg-green-900/50 border border-green-700/30 rounded px-2 py-1 text-green-400 font-semibold">
                SSL 256-bit
              </span>
            </div>
            <div className="flex items-center gap-2">
              {["GMP", "ISO 9001", "TSE"].map((c) => (
                <span key={c} className="text-[10px] border border-white/20 rounded px-2 py-1 text-white/50 font-semibold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 bg-white/5 rounded-xl px-4 py-3">
          <p className="text-[11px] text-white/40 leading-relaxed">
            {t.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} {t.copyright}
          </p>
          <p className="text-[11px] text-white/30">
            {t.dev}
          </p>
        </div>
      </div>
    </footer>
  );
}
