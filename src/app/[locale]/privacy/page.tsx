"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const pageUi: Record<LocaleKey, {
  dir: string;
  heroTitle: string;
  heroSubtitle: string;
  lastUpdated: string;
  toc: string;
  applyMethod: string;
  applyBody: string;
  sections: { id: string; title: string; content: React.ReactNode }[];
}> = {
  tr: {
    dir: "ltr",
    heroTitle: "KVKK & Gizlilik Politikası",
    heroSubtitle: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır.",
    lastUpdated: "Son güncelleme: 21 Mart 2026",
    toc: "İçindekiler",
    applyMethod: "Başvuru Yöntemi",
    applyBody: "Haklarınızı kullanmak için kimliğinizi doğrulayan belgelerle birlikte kvkk@hudaisifa.com adresine e-posta gönderebilirsiniz. Talepleriniz 30 gün içinde yanıtlanır.",
    sections: [
      { id: "veri-sorumlusu", title: "1. Veri Sorumlusu", content: <p className="text-sm text-text-secondary">Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti. — kvkk@hudaisifa.com</p> },
      { id: "islenen-veriler", title: "2. İşlenen Kişisel Veriler", content: <p className="text-sm text-text-secondary">Kimlik, iletişim, finansal, işlem ve teknik veriler toplanmaktadır.</p> },
      { id: "amaclar", title: "3. İşleme Amaçları", content: <p className="text-sm text-text-secondary">Sipariş işleme, kargo, fatura, müşteri hizmetleri, güvenlik ve pazarlama (izinli).</p> },
      { id: "aktarim", title: "4. Veri Aktarımı", content: <p className="text-sm text-text-secondary">Kargo şirketleri, ödeme altyapısı, e-fatura ve yasal kuruluşlarla paylaşılır. Veriler satılmaz.</p> },
      { id: "toplama", title: "5. Veri Toplama", content: <p className="text-sm text-text-secondary">Formlar, sipariş süreci, müşteri hizmetleri, çerezler ve sosyal medya aracılığıyla toplanır.</p> },
      { id: "hukuki-sebep", title: "6. Hukuki Sebep", content: <p className="text-sm text-text-secondary">Sözleşme ifası, yasal yükümlülük, meşru menfaat ve açık rıza (pazarlama).</p> },
      { id: "sureler", title: "7. Saklama Süreleri", content: <p className="text-sm text-text-secondary">Sipariş ve fatura: 10 yıl; müşteri hesabı: aktif + 3 yıl; pazarlama: rıza geri alınana kadar.</p> },
      { id: "haklar", title: "8. KVKK Kapsamındaki Haklarınız", content: <p className="text-sm text-text-secondary">Bilgi edinme, erişim, düzeltme, silme, itiraz ve tazminat talep etme haklarına sahipsiniz.</p> },
      { id: "cerezler", title: "9. Çerezler", content: <p className="text-sm text-text-secondary">Zorunlu, tercih, analitik ve pazarlama çerezleri kullanılmaktadır. Tarayıcı ayarlarından yönetilebilir.</p> },
      { id: "degisiklikler", title: "10. Politika Değişiklikleri", content: <p className="text-sm text-text-secondary">Önemli değişikliklerde e-posta ile bildirim yapılır. <strong>Son güncelleme: 21 Mart 2026</strong></p> },
      { id: "iletisim", title: "11. İletişim", content: <div className="text-sm text-text-secondary space-y-1"><p>KVKK Başvuruları: <a href="mailto:kvkk@hudaisifa.com" className="text-green-700 underline">kvkk@hudaisifa.com</a></p><p>Genel Destek: <a href="mailto:destek@hudaisifa.com" className="text-green-700 underline">destek@hudaisifa.com</a></p></div> },
    ],
  },
  en: {
    dir: "ltr",
    heroTitle: "Privacy Policy",
    heroSubtitle: "Prepared in accordance with Turkish data protection law (KVKK / Law No. 6698).",
    lastUpdated: "Last updated: March 21, 2026",
    toc: "Table of Contents",
    applyMethod: "How to Apply",
    applyBody: "To exercise your rights, you can send an email to kvkk@hudaisifa.com with documents verifying your identity. Your requests will be answered within 30 days.",
    sections: [
      { id: "data-controller", title: "1. Data Controller", content: <p className="text-sm text-text-secondary">Hüda-i Şifa Natural Products Ltd. — kvkk@hudaisifa.com</p> },
      { id: "data-collected", title: "2. Data We Collect", content: <p className="text-sm text-text-secondary">Identity, contact, financial, transactional and technical data are collected.</p> },
      { id: "purposes", title: "3. Purposes of Processing", content: <p className="text-sm text-text-secondary">Order processing, shipping, invoicing, customer service, security, and marketing (with consent).</p> },
      { id: "sharing", title: "4. Data Sharing", content: <p className="text-sm text-text-secondary">Shared with courier companies, payment infrastructure, e-invoice provider and legal authorities. Data is never sold.</p> },
      { id: "collection", title: "5. Data Collection Methods", content: <p className="text-sm text-text-secondary">Collected via forms, order process, customer service, cookies and social media.</p> },
      { id: "legal-basis", title: "6. Legal Basis", content: <p className="text-sm text-text-secondary">Contract performance, legal obligation, legitimate interest and explicit consent (marketing).</p> },
      { id: "retention", title: "7. Retention Periods", content: <p className="text-sm text-text-secondary">Orders & invoices: 10 years; customer account: active + 3 years; marketing: until consent withdrawn.</p> },
      { id: "rights", title: "8. Your Rights", content: <p className="text-sm text-text-secondary">You have the right to access, correct, delete, object, and request compensation regarding your personal data.</p> },
      { id: "cookies", title: "9. Cookies", content: <p className="text-sm text-text-secondary">Essential, preference, analytics and marketing cookies are used. Manageable via browser settings.</p> },
      { id: "changes", title: "10. Policy Changes", content: <p className="text-sm text-text-secondary">You will be notified by email of significant changes. <strong>Last updated: March 21, 2026</strong></p> },
      { id: "contact", title: "11. Contact", content: <div className="text-sm text-text-secondary space-y-1"><p>Privacy Requests: <a href="mailto:kvkk@hudaisifa.com" className="text-green-700 underline">kvkk@hudaisifa.com</a></p><p>General Support: <a href="mailto:destek@hudaisifa.com" className="text-green-700 underline">destek@hudaisifa.com</a></p></div> },
    ],
  },
  ar: {
    dir: "rtl",
    heroTitle: "سياسة الخصوصية",
    heroSubtitle: "مُعَدَّة وفقًا لقانون حماية البيانات التركي (KVKK / القانون رقم 6698).",
    lastUpdated: "آخر تحديث: 21 مارس 2026",
    toc: "جدول المحتويات",
    applyMethod: "طريقة التقديم",
    applyBody: "لممارسة حقوقك، يمكنك إرسال بريد إلكتروني إلى kvkk@hudaisifa.com مع المستندات التي تثبت هويتك. سيتم الرد على طلباتك في غضون 30 يومًا.",
    sections: [
      { id: "data-controller", title: "1. مسؤول البيانات", content: <p className="text-sm text-text-secondary">شركة هُدائي شِفا للمنتجات الطبيعية — kvkk@hudaisifa.com</p> },
      { id: "data-collected", title: "2. البيانات التي نجمعها", content: <p className="text-sm text-text-secondary">تُجمَع بيانات الهوية والتواصل والمالية والمعاملات والبيانات التقنية.</p> },
      { id: "purposes", title: "3. أغراض المعالجة", content: <p className="text-sm text-text-secondary">معالجة الطلبات والشحن والفوترة وخدمة العملاء والأمان والتسويق (بالموافقة).</p> },
      { id: "sharing", title: "4. مشاركة البيانات", content: <p className="text-sm text-text-secondary">تُشارَك مع شركات الشحن والبنية التحتية للدفع ومزود الفاتورة الإلكترونية والسلطات القانونية. لا تُباع البيانات أبدًا.</p> },
      { id: "collection", title: "5. طرق جمع البيانات", content: <p className="text-sm text-text-secondary">تُجمَع عبر النماذج وعملية الطلب وخدمة العملاء وملفات الارتباط ووسائل التواصل الاجتماعي.</p> },
      { id: "legal-basis", title: "6. الأساس القانوني", content: <p className="text-sm text-text-secondary">تنفيذ العقد، الالتزام القانوني، المصلحة المشروعة والموافقة الصريحة (التسويق).</p> },
      { id: "retention", title: "7. فترات الاحتفاظ", content: <p className="text-sm text-text-secondary">الطلبات والفواتير: 10 سنوات؛ حساب العميل: نشط + 3 سنوات؛ التسويق: حتى سحب الموافقة.</p> },
      { id: "rights", title: "8. حقوقك", content: <p className="text-sm text-text-secondary">لديك الحق في الوصول والتصحيح والحذف والاعتراض وطلب التعويض بشأن بياناتك الشخصية.</p> },
      { id: "cookies", title: "9. ملفات الارتباط", content: <p className="text-sm text-text-secondary">تُستخدَم ملفات الارتباط الأساسية والتفضيلية والتحليلية والتسويقية. يمكن إدارتها عبر إعدادات المتصفح.</p> },
      { id: "changes", title: "10. تغييرات السياسة", content: <p className="text-sm text-text-secondary">ستتلقى إشعارًا بالبريد الإلكتروني عند التغييرات المهمة. <strong>آخر تحديث: 21 مارس 2026</strong></p> },
      { id: "contact", title: "11. التواصل", content: <div className="text-sm text-text-secondary space-y-1"><p>طلبات الخصوصية: <a href="mailto:kvkk@hudaisifa.com" className="text-green-700 underline">kvkk@hudaisifa.com</a></p><p>الدعم العام: <a href="mailto:destek@hudaisifa.com" className="text-green-700 underline">destek@hudaisifa.com</a></p></div> },
    ],
  },
  ru: {
    dir: "ltr",
    heroTitle: "Политика конфиденциальности",
    heroSubtitle: "Подготовлена в соответствии с турецким законом о защите данных (KVKK / Закон № 6698).",
    lastUpdated: "Последнее обновление: 21 марта 2026",
    toc: "Содержание",
    applyMethod: "Способ подачи заявления",
    applyBody: "Чтобы воспользоваться своими правами, вы можете отправить письмо на kvkk@hudaisifa.com с документами, подтверждающими вашу личность. Ваши запросы будут рассмотрены в течение 30 дней.",
    sections: [
      { id: "data-controller", title: "1. Контролёр данных", content: <p className="text-sm text-text-secondary">Hüda-i Şifa Natural Products Ltd. — kvkk@hudaisifa.com</p> },
      { id: "data-collected", title: "2. Собираемые данные", content: <p className="text-sm text-text-secondary">Собираются данные личности, контактные, финансовые, транзакционные и технические данные.</p> },
      { id: "purposes", title: "3. Цели обработки", content: <p className="text-sm text-text-secondary">Обработка заказов, доставка, выставление счетов, поддержка клиентов, безопасность и маркетинг (с согласия).</p> },
      { id: "sharing", title: "4. Передача данных", content: <p className="text-sm text-text-secondary">Передаётся курьерским службам, платёжной инфраструктуре, провайдеру электронных счетов и уполномоченным органам. Данные никогда не продаются.</p> },
      { id: "collection", title: "5. Способы сбора данных", content: <p className="text-sm text-text-secondary">Собираются через формы, процесс заказа, поддержку клиентов, файлы cookie и социальные сети.</p> },
      { id: "legal-basis", title: "6. Правовое основание", content: <p className="text-sm text-text-secondary">Исполнение договора, законное обязательство, законный интерес и явное согласие (маркетинг).</p> },
      { id: "retention", title: "7. Сроки хранения", content: <p className="text-sm text-text-secondary">Заказы и счета: 10 лет; аккаунт клиента: активный + 3 года; маркетинг: до отзыва согласия.</p> },
      { id: "rights", title: "8. Ваши права", content: <p className="text-sm text-text-secondary">Вы имеете право на доступ, исправление, удаление, возражение и требование компенсации в отношении своих персональных данных.</p> },
      { id: "cookies", title: "9. Файлы cookie", content: <p className="text-sm text-text-secondary">Используются обязательные, настроечные, аналитические и маркетинговые файлы cookie. Управляется через настройки браузера.</p> },
      { id: "changes", title: "10. Изменения политики", content: <p className="text-sm text-text-secondary">Вы будете уведомлены по электронной почте о значительных изменениях. <strong>Последнее обновление: 21 марта 2026</strong></p> },
      { id: "contact", title: "11. Контакты", content: <div className="text-sm text-text-secondary space-y-1"><p>Запросы о конфиденциальности: <a href="mailto:kvkk@hudaisifa.com" className="text-green-700 underline">kvkk@hudaisifa.com</a></p><p>Общая поддержка: <a href="mailto:destek@hudaisifa.com" className="text-green-700 underline">destek@hudaisifa.com</a></p></div> },
    ],
  },
};

export default function PrivacyPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const ui = pageUi[locale] ?? pageUi.tr;

  return (
    <div className="min-h-screen bg-cream-50" dir={ui.dir}>
      <Header />
      <main>
        <section className="bg-green-800 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{ui.heroTitle}</h1>
            <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">{ui.heroSubtitle}</p>
            <p className="text-green-200 text-xs mt-3">{ui.lastUpdated}</p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6 mb-8">
              <p className="text-sm font-bold text-green-900 mb-3">{ui.toc}</p>
              <ol className="grid sm:grid-cols-2 gap-1">
                {ui.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-sm text-green-700 hover:text-green-900 hover:underline transition-colors">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-6">
              {ui.sections.map((s) => (
                <div key={s.id} id={s.id} className="bg-white rounded-2xl border border-olive-border/30 p-6 scroll-mt-20">
                  <h2 className="text-base font-bold text-green-900 mb-4">{s.title}</h2>
                  {s.content}
                  {s.id === "haklar" || s.id === "rights" ? (
                    <div className="bg-gold-300 border border-gold-400/30 rounded-xl p-4 mt-4">
                      <p className="font-semibold text-green-900 mb-1">{ui.applyMethod}</p>
                      <p className="text-sm text-text-secondary">{ui.applyBody}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
