"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const pageUi: Record<LocaleKey, {
  dir: string;
  heroTitle: string;
  heroSubtitle: string;
  trackingTitle: string;
  trackingDesc: string;
  trackingBtn: string;
  shippingInfoTitle: string;
  returnPolicyTitle: string;
  rightOf14: string;
  rightOf14Text: string;
  acceptConditionsTitle: string;
  nonReturnableTitle: string;
  acceptConditions: string[];
  nonReturnable: string[];
  returnProcessTitle: string;
  refundTime: string;
  refundTimeBody: string;
  damagedTitle: string;
  damagedSteps: string[];
  ctaTitle: string;
  ctaBody: string;
  shippingCards: { title: string; icon: string; desc: string; highlight: boolean }[];
  returnSteps: { step: string; title: string; desc: string }[];
}> = {
  tr: {
    dir: "ltr",
    heroTitle: "Kargo & İade",
    heroSubtitle: "Teslimat koşulları, kargo ücretleri ve iade politikamız hakkında tüm bilgilere bu sayfadan ulaşabilirsiniz.",
    trackingTitle: "Kargo Takip",
    trackingDesc: "Siparişiniz kargoya verildiğinde size SMS ve e-posta ile takip numaranız iletilir. Aşağıdaki butonlar aracılığıyla kargo firmasının takip sayfasına yönlendirilirsiniz.",
    trackingBtn: "Kargom Nerede?",
    shippingInfoTitle: "Kargo Bilgileri",
    returnPolicyTitle: "İade & Değişim Politikası",
    rightOf14: "14 Günlük Cayma Hakkı (6502 Sayılı TKHK)",
    rightOf14Text: "Tüketici olarak ürünü teslim aldığınız tarihten itibaren 14 gün içinde, herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahipsiniz.",
    acceptConditionsTitle: "İade Kabul Koşulları",
    nonReturnableTitle: "İade Edilemeyen Ürünler",
    acceptConditions: [
      "Teslim tarihinden itibaren 14 gün içinde talep",
      "Ürün açılmamış ve orijinal ambalajında",
      "Ürün etiketi sökülmemiş",
      "Fatura veya sipariş belgesi ile birlikte",
      "Ürün kullanılmamış ve hasarsız",
    ],
    nonReturnable: [
      "Ambalajı açılmış takviye edici gıdalar",
      "Kapsül, tablet veya toz ürünler (açılmış)",
      "Hızlı bozulabilecek gıda ürünleri",
      "Kişisel bakım ürünleri (açılmış/kullanılmış)",
      "Özel sipariş / kişiselleştirilmiş ürünler",
    ],
    returnProcessTitle: "İade Süreci — Adım Adım",
    refundTime: "Para İadesi Süresi: 3–7 İş Günü",
    refundTimeBody: "Ürün depomuzda teslim alınıp kalite kontrolden geçirildikten sonra ödeme iadesi başlatılır. Kredi kartı ödemelerinde süre bankanıza göre değişebilir. Havale/EFT ödemelerinde 2–3 iş günü içinde hesabınıza aktarılır.",
    damagedTitle: "Hasarlı veya Hatalı Ürün Bildirimi",
    damagedSteps: [
      "Teslim anında, kargo görevlisi huzurunda hasar tespit tutanağı tutturun.",
      "24 saat içinde destek@hudaisifa.com adresine fotoğraflı belge ve sipariş numaranızı içeren bir e-posta gönderin.",
      "Ekibimiz en geç 1 iş günü içinde size dönüş yaparak çözüm üretir.",
      "Hasarlı veya hatalı ürünler için tarafınıza hiçbir ek kargo ücreti yansıtılmaz; yeni ürün gönderilir veya tam iade yapılır.",
    ],
    ctaTitle: "Sorunuz mu var?",
    ctaBody: "Kargo ve iade konularında müşteri hizmetlerimiz size yardımcı olmaktan memnuniyet duyar.",
    shippingCards: [
      { title: "Ücretsiz Kargo", icon: "🎁", desc: "200₺ ve üzeri tüm siparişlerde kargo tamamen ücretsizdir.", highlight: true },
      { title: "Kargo Ücreti", icon: "📦", desc: "200₺ altındaki siparişlerde 29,90₺ kargo bedeli uygulanır.", highlight: false },
      { title: "Sipariş Kesim Saati", icon: "⏰", desc: "Hafta içi saat 14:00'e kadar verilen siparişler aynı gün kargoya teslim edilir.", highlight: false },
      { title: "Kargo Süresi", icon: "🚚", desc: "Büyük şehirlerde genellikle ertesi gün, diğer bölgelerde 1–3 iş günü.", highlight: false },
      { title: "Hafta Sonu Siparişleri", icon: "📅", desc: "Cumartesi–Pazar ve resmi tatil günlerinde verilen siparişler ilk iş günü işleme alınır.", highlight: false },
      { title: "Çalışılan Kargo Firmaları", icon: "🏢", desc: "Yurtiçi Kargo, Aras Kargo ve MNG Kargo. Kargo firması seçimi sipariş anında belirlenir.", highlight: false },
    ],
    returnSteps: [
      { step: "1", title: "İade Talebi Oluşturun", desc: "destek@hudaisifa.com adresine sipariş numaranızı ve iade nedeninizi belirterek e-posta gönderin." },
      { step: "2", title: "Onay Alın", desc: "Ekibimiz 1 iş günü içinde iade talebinizi değerlendirip onay bildirimi gönderir." },
      { step: "3", title: "Ürünü Paketleyin", desc: "Ürünü orijinal ambalajında, tüm aksesuarları ve faturasıyla birlikte sağlamca paketleyin." },
      { step: "4", title: "Kargoya Verin", desc: "Onay e-postasında belirtilen adrese herhangi bir kargo firmasıyla gönderebilirsiniz. İade kargo ücreti size aittir." },
      { step: "5", title: "Para İadenizi Alın", desc: "Ürün depomuzda teslim alınıp incelendikten sonra 3–7 iş günü içinde ödeme iade edilir." },
    ],
  },
  en: {
    dir: "ltr",
    heroTitle: "Shipping & Returns",
    heroSubtitle: "Find all information about delivery conditions, shipping fees and our return policy on this page.",
    trackingTitle: "Shipment Tracking",
    trackingDesc: "When your order is shipped, your tracking number will be sent to you by SMS and email. The buttons below will redirect you to the courier's tracking page.",
    trackingBtn: "Where is my order?",
    shippingInfoTitle: "Shipping Information",
    returnPolicyTitle: "Returns & Exchange Policy",
    rightOf14: "14-Day Right of Withdrawal (Consumer Protection Law)",
    rightOf14Text: "As a consumer, you have the right to withdraw from the contract within 14 days of receiving the product, without giving any reason and without paying a penalty.",
    acceptConditionsTitle: "Return Acceptance Conditions",
    nonReturnableTitle: "Non-Returnable Products",
    acceptConditions: [
      "Request within 14 days of delivery date",
      "Product unopened and in original packaging",
      "Product label not removed",
      "Sent with the invoice or order document",
      "Product unused and undamaged",
    ],
    nonReturnable: [
      "Opened dietary supplement packaging",
      "Capsules, tablets or powder products (opened)",
      "Perishable food products",
      "Personal care products (opened/used)",
      "Custom order / personalized products",
    ],
    returnProcessTitle: "Return Process — Step by Step",
    refundTime: "Refund Time: 3–7 Business Days",
    refundTimeBody: "Refund is initiated after the product is received at our warehouse and passes quality control. For credit card payments, the time may vary by bank. Wire/bank transfer refunds are processed within 2–3 business days.",
    damagedTitle: "Damaged or Incorrect Product Report",
    damagedSteps: [
      "Have a damage report drawn up in front of the courier at the time of delivery.",
      "Send an email with photos and your order number to destek@hudaisifa.com within 24 hours.",
      "Our team will respond within 1 business day and provide a solution.",
      "No additional shipping cost will be charged for damaged or incorrect products; a replacement or full refund will be provided.",
    ],
    ctaTitle: "Have a question?",
    ctaBody: "Our customer service team is happy to help you with shipping and return inquiries.",
    shippingCards: [
      { title: "Free Shipping", icon: "🎁", desc: "All orders of 200₺ or more qualify for completely free shipping.", highlight: true },
      { title: "Shipping Fee", icon: "📦", desc: "A shipping fee of 29.90₺ applies to orders below 200₺.", highlight: false },
      { title: "Order Cut-off Time", icon: "⏰", desc: "Orders placed by 14:00 on weekdays are shipped the same day.", highlight: false },
      { title: "Delivery Time", icon: "🚚", desc: "Usually next day in major cities, 1–3 business days in other regions.", highlight: false },
      { title: "Weekend Orders", icon: "📅", desc: "Orders placed on Saturday–Sunday and public holidays are processed on the first business day.", highlight: false },
      { title: "Courier Partners", icon: "🏢", desc: "Yurtiçi Kargo, Aras Kargo and MNG Kargo. The courier is selected at the time of order.", highlight: false },
    ],
    returnSteps: [
      { step: "1", title: "Create Return Request", desc: "Send an email to destek@hudaisifa.com with your order number and reason for return." },
      { step: "2", title: "Get Approval", desc: "Our team will review your return request within 1 business day and send a confirmation." },
      { step: "3", title: "Package the Product", desc: "Pack the product securely in its original packaging with all accessories and invoice." },
      { step: "4", title: "Ship It", desc: "You can send it to the address specified in the approval email with any courier. Return shipping cost is at your expense." },
      { step: "5", title: "Receive Your Refund", desc: "After the product is received and inspected at our warehouse, refund is processed within 3–7 business days." },
    ],
  },
  ar: {
    dir: "rtl",
    heroTitle: "الشحن والإرجاع",
    heroSubtitle: "ستجد في هذه الصفحة جميع المعلومات حول شروط التوصيل ورسوم الشحن وسياسة الإرجاع.",
    trackingTitle: "تتبع الشحنة",
    trackingDesc: "عند شحن طلبك، سيُرسَل إليك رقم التتبع عبر الرسائل القصيرة والبريد الإلكتروني. ستتوجّه الأزرار أدناه إلى صفحة تتبع شركة الشحن.",
    trackingBtn: "أين طلبي؟",
    shippingInfoTitle: "معلومات الشحن",
    returnPolicyTitle: "سياسة الإرجاع والاستبدال",
    rightOf14: "حق الانسحاب لمدة 14 يومًا (قانون حماية المستهلك)",
    rightOf14Text: "بصفتك مستهلكًا، يحق لك الانسحاب من العقد خلال 14 يومًا من استلام المنتج دون إبداء أي سبب وبدون دفع أي غرامة.",
    acceptConditionsTitle: "شروط قبول الإرجاع",
    nonReturnableTitle: "المنتجات غير القابلة للإرجاع",
    acceptConditions: [
      "طلب في غضون 14 يومًا من تاريخ التوصيل",
      "المنتج غير مفتوح وفي تغليفه الأصلي",
      "ملصق المنتج غير مُزال",
      "الإرسال مع الفاتورة أو وثيقة الطلب",
      "المنتج غير مستخدم وغير تالف",
    ],
    nonReturnable: [
      "تغليف المكملات الغذائية المفتوح",
      "الكبسولات أو الأقراص أو منتجات المسحوق (المفتوحة)",
      "المنتجات الغذائية سريعة التلف",
      "منتجات العناية الشخصية (مفتوحة/مستخدمة)",
      "طلبات خاصة / منتجات مخصصة",
    ],
    returnProcessTitle: "عملية الإرجاع — خطوة بخطوة",
    refundTime: "مدة استرداد المبلغ: 3–7 أيام عمل",
    refundTimeBody: "يبدأ استرداد المبلغ بعد استلام المنتج في مستودعنا واجتيازه مراقبة الجودة. لمدفوعات بطاقة الائتمان قد يختلف الوقت حسب البنك. تُحوَّل مبالغ الحوالة/التحويل البنكي في غضون 2–3 أيام عمل.",
    damagedTitle: "الإبلاغ عن منتج تالف أو خاطئ",
    damagedSteps: [
      "حرّر محضر ضرر بحضور موظف الشحن عند التسليم.",
      "أرسل بريدًا إلكترونيًا مع صور ورقم طلبك إلى destek@hudaisifa.com في غضون 24 ساعة.",
      "سيتواصل فريقنا معك في غضون يوم عمل واحد ويقدم حلًا.",
      "لن تُحمَّل رسوم شحن إضافية للمنتجات التالفة أو الخاطئة؛ سيُرسَل بديل أو استرداد كامل.",
    ],
    ctaTitle: "هل لديك سؤال؟",
    ctaBody: "يسعد فريق خدمة العملاء لدينا مساعدتك في استفسارات الشحن والإرجاع.",
    shippingCards: [
      { title: "شحن مجاني", icon: "🎁", desc: "جميع الطلبات بقيمة 200₺ أو أكثر تحظى بشحن مجاني تمامًا.", highlight: true },
      { title: "رسوم الشحن", icon: "📦", desc: "تُطبَّق رسوم شحن بقيمة 29.90₺ على الطلبات التي تقل عن 200₺.", highlight: false },
      { title: "وقت قطع الطلبات", icon: "⏰", desc: "الطلبات المُقدَّمة قبل الساعة 14:00 في أيام الأسبوع تُشحَن في نفس اليوم.", highlight: false },
      { title: "مدة التوصيل", icon: "🚚", desc: "في الغالب اليوم التالي في المدن الكبرى، 1–3 أيام عمل في المناطق الأخرى.", highlight: false },
      { title: "طلبات عطلة نهاية الأسبوع", icon: "📅", desc: "تُعالَج الطلبات المُقدَّمة في عطلات نهاية الأسبوع والأعياد الرسمية في أول يوم عمل.", highlight: false },
      { title: "شركات الشحن الشريكة", icon: "🏢", desc: "Yurtiçi Kargo وAras Kargo وMNG Kargo. تُحدَّد شركة الشحن وقت الطلب.", highlight: false },
    ],
    returnSteps: [
      { step: "1", title: "إنشاء طلب إرجاع", desc: "أرسل بريدًا إلكترونيًا إلى destek@hudaisifa.com مع رقم طلبك وسبب الإرجاع." },
      { step: "2", title: "الحصول على الموافقة", desc: "سيراجع فريقنا طلب الإرجاع في غضون يوم عمل واحد ويرسل تأكيدًا." },
      { step: "3", title: "تغليف المنتج", desc: "عبّئ المنتج بأمان في تغليفه الأصلي مع جميع الملحقات والفاتورة." },
      { step: "4", title: "الشحن", desc: "يمكنك إرساله إلى العنوان المحدد في بريد الموافقة مع أي شركة شحن. رسوم الشحن العائد على حسابك." },
      { step: "5", title: "استلام استرداد مبلغك", desc: "بعد استلام المنتج وفحصه في مستودعنا، يُعالَج الاسترداد في غضون 3–7 أيام عمل." },
    ],
  },
  ru: {
    dir: "ltr",
    heroTitle: "Доставка и возврат",
    heroSubtitle: "На этой странице вы найдёте всю информацию об условиях доставки, стоимости доставки и нашей политике возврата.",
    trackingTitle: "Отслеживание заказа",
    trackingDesc: "При отправке вашего заказа номер для отслеживания будет выслан вам по SMS и электронной почте. Кнопки ниже перенаправят вас на страницу отслеживания курьерской службы.",
    trackingBtn: "Где мой заказ?",
    shippingInfoTitle: "Информация о доставке",
    returnPolicyTitle: "Политика возврата и обмена",
    rightOf14: "14-дневное право отказа (Закон о защите прав потребителей)",
    rightOf14Text: "Как потребитель, вы имеете право отказаться от договора в течение 14 дней с момента получения товара без объяснения причин и без уплаты штрафа.",
    acceptConditionsTitle: "Условия принятия возврата",
    nonReturnableTitle: "Невозвратные товары",
    acceptConditions: [
      "Запрос в течение 14 дней с даты получения",
      "Товар не открыт и в оригинальной упаковке",
      "Этикетка товара не снята",
      "Отправлен вместе со счётом или документом заказа",
      "Товар не использован и не повреждён",
    ],
    nonReturnable: [
      "Вскрытая упаковка пищевых добавок",
      "Капсулы, таблетки или порошковые продукты (вскрытые)",
      "Скоропортящиеся пищевые продукты",
      "Средства личной гигиены (вскрытые/использованные)",
      "Товары на заказ / персонализированные товары",
    ],
    returnProcessTitle: "Процесс возврата — шаг за шагом",
    refundTime: "Срок возврата: 3–7 рабочих дней",
    refundTimeBody: "Возврат инициируется после получения товара на нашем складе и прохождения контроля качества. Для оплаты кредитной картой срок может варьироваться в зависимости от банка. Банковские переводы возвращаются в течение 2–3 рабочих дней.",
    damagedTitle: "Сообщение о повреждённом или неправильном товаре",
    damagedSteps: [
      "Составьте акт о повреждении в присутствии курьера при получении.",
      "Отправьте письмо с фотографиями и номером заказа на destek@hudaisifa.com в течение 24 часов.",
      "Наша команда свяжется с вами в течение 1 рабочего дня и предложит решение.",
      "Для повреждённых или неправильных товаров дополнительная стоимость доставки не взимается; будет отправлена замена или произведён полный возврат.",
    ],
    ctaTitle: "Есть вопрос?",
    ctaBody: "Наша служба поддержки с удовольствием поможет вам с вопросами доставки и возврата.",
    shippingCards: [
      { title: "Бесплатная доставка", icon: "🎁", desc: "Все заказы на сумму 200₺ и выше доставляются бесплатно.", highlight: true },
      { title: "Стоимость доставки", icon: "📦", desc: "Для заказов ниже 200₺ взимается плата за доставку 29,90₺.", highlight: false },
      { title: "Время приёма заказов", icon: "⏰", desc: "Заказы, оформленные до 14:00 в рабочие дни, отправляются в тот же день.", highlight: false },
      { title: "Срок доставки", icon: "🚚", desc: "Обычно на следующий день в крупных городах, 1–3 рабочих дня в других регионах.", highlight: false },
      { title: "Заказы в выходные", icon: "📅", desc: "Заказы в выходные и праздничные дни обрабатываются в первый рабочий день.", highlight: false },
      { title: "Курьерские партнёры", icon: "🏢", desc: "Yurtiçi Kargo, Aras Kargo и MNG Kargo. Курьер определяется при оформлении заказа.", highlight: false },
    ],
    returnSteps: [
      { step: "1", title: "Создать запрос на возврат", desc: "Отправьте письмо на destek@hudaisifa.com с номером заказа и причиной возврата." },
      { step: "2", title: "Получить подтверждение", desc: "Наша команда рассмотрит ваш запрос в течение 1 рабочего дня и отправит подтверждение." },
      { step: "3", title: "Упакуйте товар", desc: "Надёжно упакуйте товар в оригинальную упаковку со всеми аксессуарами и счётом." },
      { step: "4", title: "Отправьте его", desc: "Вы можете отправить его по адресу, указанному в письме-подтверждении, любой курьерской службой. Стоимость обратной доставки за ваш счёт." },
      { step: "5", title: "Получите возврат средств", desc: "После получения и проверки товара на нашем складе возврат обрабатывается в течение 3–7 рабочих дней." },
    ],
  },
};

const kargoFirmalari = [
  {
    name: "Yurtiçi Kargo",
    url: "https://www.yurticikargo.com.tr/online-islemler/gonderi-sorgula",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
    btnColor: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "Aras Kargo",
    url: "https://www.araskargo.com.tr/gonderi-sorgula",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    btnColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "MNG Kargo",
    url: "https://www.mngkargo.com.tr/gonderi-sorgulama",
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-800",
    btnColor: "bg-orange-500 hover:bg-orange-600",
  },
];

export default function ShippingPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = pageUi[locale] ?? pageUi.tr;

  return (
    <div className="min-h-screen bg-cream-50" dir={t.dir}>
      <Header />
      <main>
        <section className="bg-green-800 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{t.heroTitle}</h1>
            <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">{t.heroSubtitle}</p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-10">

            {/* Tracking */}
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">{t.trackingTitle}</h2>
              <p className="text-sm text-text-secondary mb-5">{t.trackingDesc}</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {kargoFirmalari.map((firma) => (
                  <div key={firma.name} className={`border rounded-2xl p-5 flex flex-col items-center gap-3 ${firma.color}`}>
                    <p className={`text-base font-bold ${firma.textColor}`}>{firma.name}</p>
                    <a href={firma.url} target="_blank" rel="noopener noreferrer"
                      className={`${firma.btnColor} text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors w-full text-center`}>
                      {t.trackingBtn}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">{t.shippingInfoTitle}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {t.shippingCards.map((item) => (
                  <div key={item.title} className={`rounded-2xl p-5 border ${item.highlight ? "bg-green-600 border-green-700 text-white" : "bg-white border-olive-border/30"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className={`font-bold text-sm mb-1 ${item.highlight ? "text-white" : "text-green-900"}`}>{item.title}</p>
                        <p className={`text-sm leading-relaxed ${item.highlight ? "text-green-100" : "text-text-secondary"}`}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Policy */}
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">{t.returnPolicyTitle}</h2>
              <div className="bg-green-50 border border-olive-border/40 rounded-2xl p-5 mb-5 flex gap-4 items-start">
                <span className="text-3xl flex-shrink-0">⚖️</span>
                <div>
                  <p className="font-bold text-green-900 mb-1">{t.rightOf14}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{t.rightOf14Text}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2"><span className="text-lg">✅</span> {t.acceptConditionsTitle}</h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    {t.acceptConditions.map((item, i) => (
                      <li key={i} className="flex gap-2"><span className="text-green-600 mt-0.5">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl border border-olive-border/30 p-5">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2"><span className="text-lg">❌</span> {t.nonReturnableTitle}</h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    {t.nonReturnable.map((item, i) => (
                      <li key={i} className="flex gap-2"><span className="text-red-500 mt-0.5">•</span><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Return Process */}
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-6">{t.returnProcessTitle}</h2>
              <div className="flex flex-col gap-4">
                {t.returnSteps.map((adim) => (
                  <div key={adim.step} className="bg-white border border-olive-border/30 rounded-2xl p-5 flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{adim.step}</div>
                    <div>
                      <p className="font-bold text-green-900 text-sm mb-1">{adim.title}</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{adim.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-gold-300 border border-gold-400/30 rounded-2xl p-5">
                <p className="font-bold text-green-900 mb-1">{t.refundTime}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{t.refundTimeBody}</p>
              </div>
            </div>

            {/* Damaged */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2"><span>⚠️</span> {t.damagedTitle}</h2>
              <ol className="space-y-2 text-sm text-text-secondary">
                {t.damagedSteps.map((step, i) => (
                  <li key={i} className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">{i + 1}.</span><span>{step}</span></li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <div className="bg-green-800 rounded-2xl p-6 text-center">
              <p className="text-white font-bold mb-2">{t.ctaTitle}</p>
              <p className="text-green-100 text-sm mb-4">{t.ctaBody}</p>
              <a href="mailto:destek@hudaisifa.com"
                className="inline-block bg-white text-green-800 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
                destek@hudaisifa.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
