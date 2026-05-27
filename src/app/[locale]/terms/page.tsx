"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const pageUi: Record<LocaleKey, {
  dir: string;
  heroTitle: string;
  heroSubtitle: string;
  tabs: { id: string; label: string }[];
  legalNote: string;
  legalNoteDistance: string;
  legalNotePreInfo: string;
  seller: string;
  buyer: string;
  sellerInfo: { label: string; value: string }[];
}> = {
  tr: {
    dir: "ltr",
    heroTitle: "Yasal Koşullar & Sözleşmeler",
    heroSubtitle: "6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca hazırlanmıştır.",
    tabs: [
      { id: "kullanim", label: "Kullanım Koşulları" },
      { id: "mesafeli", label: "Mesafeli Satış Sözleşmesi" },
      { id: "on-bilgi", label: "Ön Bilgilendirme Formu" },
    ],
    legalNote: "Yasal Bilgi:",
    legalNoteDistance: "Bu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.",
    legalNotePreInfo: "Bu form Mesafeli Sözleşmeler Yönetmeliği (Madde 5-6) uyarınca tüketiciyi sipariş öncesinde bilgilendirmek amacıyla hazırlanmıştır.",
    seller: "SATICI",
    buyer: "ALICI",
    sellerInfo: [
      ["Unvan", "Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti."],
      ["Web", "hudaisifa.com"],
      ["E-posta", "destek@hudaisifa.com"],
    ].map(([label, value]) => ({ label, value })),
  },
  en: {
    dir: "ltr",
    heroTitle: "Terms & Agreements",
    heroSubtitle: "Prepared in accordance with Turkish Consumer Protection Law No. 6502.",
    tabs: [
      { id: "terms", label: "Terms of Use" },
      { id: "distance", label: "Distance Sales Agreement" },
      { id: "pre-info", label: "Pre-Information Form" },
    ],
    legalNote: "Legal Note:",
    legalNoteDistance: "This agreement has been prepared under Law No. 6502 on Consumer Protection and the Distance Contracts Regulation.",
    legalNotePreInfo: "This form has been prepared to inform the consumer before placing an order, in accordance with the Distance Contracts Regulation (Articles 5-6).",
    seller: "SELLER",
    buyer: "BUYER",
    sellerInfo: [
      { label: "Name", value: "Hüda-i Şifa Natural Products Ltd." },
      { label: "Website", value: "hudaisifa.com" },
      { label: "Email", value: "destek@hudaisifa.com" },
    ],
  },
  ar: {
    dir: "rtl",
    heroTitle: "الشروط والاتفاقيات القانونية",
    heroSubtitle: "مُعَدَّة وفقًا لقانون حماية المستهلك التركي رقم 6502.",
    tabs: [
      { id: "terms", label: "شروط الاستخدام" },
      { id: "distance", label: "اتفاقية البيع عن بُعد" },
      { id: "pre-info", label: "نموذج المعلومات المسبقة" },
    ],
    legalNote: "ملاحظة قانونية:",
    legalNoteDistance: "أُعِدَّت هذه الاتفاقية بموجب قانون حماية المستهلك رقم 6502 ولائحة العقود عن بُعد.",
    legalNotePreInfo: "أُعِدَّ هذا النموذج لإعلام المستهلك قبل الطلب وفقًا للائحة العقود عن بُعد (المواد 5-6).",
    seller: "البائع",
    buyer: "المشتري",
    sellerInfo: [
      { label: "الاسم", value: "شركة هُدائي شِفا للمنتجات الطبيعية" },
      { label: "الموقع", value: "hudaisifa.com" },
      { label: "البريد الإلكتروني", value: "destek@hudaisifa.com" },
    ],
  },
  ru: {
    dir: "ltr",
    heroTitle: "Правовые условия и соглашения",
    heroSubtitle: "Подготовлено в соответствии с турецким законом о защите прав потребителей № 6502.",
    tabs: [
      { id: "terms", label: "Условия использования" },
      { id: "distance", label: "Договор дистанционной продажи" },
      { id: "pre-info", label: "Форма предварительной информации" },
    ],
    legalNote: "Юридическое примечание:",
    legalNoteDistance: "Это соглашение подготовлено в соответствии с Законом о защите прав потребителей № 6502 и Положением о дистанционных контрактах.",
    legalNotePreInfo: "Эта форма подготовлена для информирования потребителя перед оформлением заказа в соответствии с Положением о дистанционных контрактах (статьи 5-6).",
    seller: "ПРОДАВЕЦ",
    buyer: "ПОКУПАТЕЛЬ",
    sellerInfo: [
      { label: "Название", value: "Hüda-i Şifa Natural Products Ltd." },
      { label: "Сайт", value: "hudaisifa.com" },
      { label: "Email", value: "destek@hudaisifa.com" },
    ],
  },
};

const termsContent: Record<LocaleKey, { title: string; content: string }[]> = {
  tr: [
    { title: "1. Genel", content: "hudaisifa.com web sitesini ziyaret etmeniz ve/veya kullanmanız halinde aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Şirket, bu koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar." },
    { title: "2. Fikri Mülkiyet Hakları", content: "Site üzerindeki tüm içerik Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti.'ye aittir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında koruma altındadır." },
    { title: "3. Kullanıcı Yükümlülükleri", content: "Kullanıcılar siteyi yalnızca yasal amaçlar doğrultusunda kullanmayı kabul eder. Zararlı yazılım yüklemek, siteyi engellemeye çalışmak veya başkalarının verilerine izinsiz erişmek yasaktır." },
    { title: "4. Üyelik ve Hesap Güvenliği", content: "Üyelik oluşturmak için 18 yaşını doldurmuş olmanız gerekmektedir. Hesap bilgilerinizin gizliliğini ve güvenliğini korumak kullanıcının sorumluluğundadır." },
    { title: "5. Sorumluluk Sınırlaması", content: "Şirket, site üzerindeki bilgilerin doğruluğunu sağlamak için azami özeni göstermektedir; ancak içeriklerin eksiksizliğini veya belirli bir amaca uygunluğunu garanti etmemektedir." },
    { title: "6. Yürürlük Hukuku", content: "Bu kullanım koşulları Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlık halinde Türk mahkemeleri yetkilidir." },
  ],
  en: [
    { title: "1. General", content: "By visiting and/or using the hudaisifa.com website, you are deemed to have accepted the following terms of use. The Company reserves the right to change these terms without prior notice." },
    { title: "2. Intellectual Property Rights", content: "All content on the site belongs to Hüda-i Şifa Natural Products Ltd. and is protected under the applicable intellectual property laws. No content may be copied, distributed or modified without written permission." },
    { title: "3. User Obligations", content: "Users agree to use the site only for lawful purposes. Uploading malicious software, attempting to disrupt the site or accessing others' data without permission is strictly prohibited." },
    { title: "4. Membership and Account Security", content: "You must be 18 years of age or older to create a membership. You are responsible for maintaining the confidentiality and security of your account credentials." },
    { title: "5. Limitation of Liability", content: "The Company takes maximum care to ensure the accuracy of information on the site; however, it does not guarantee the completeness or fitness for a particular purpose of the content." },
    { title: "6. Governing Law", content: "These terms of use are governed by the laws of the Republic of Turkey. Turkish courts shall have jurisdiction in case of disputes." },
  ],
  ar: [
    { title: "1. عام", content: "بزيارتك واستخدامك لموقع hudaisifa.com يُعتبَر أنك قبلت شروط الاستخدام التالية. تحتفظ الشركة بالحق في تغيير هذه الشروط دون إشعار مسبق." },
    { title: "2. حقوق الملكية الفكرية", content: "جميع المحتوى على الموقع مملوك لشركة هُدائي شِفا ومحمي بموجب قوانين الملكية الفكرية المعمول بها. لا يجوز نسخ أي محتوى أو توزيعه أو تعديله دون إذن كتابي." },
    { title: "3. التزامات المستخدم", content: "يوافق المستخدمون على استخدام الموقع للأغراض القانونية فقط. يُحظَر تحميل البرامج الضارة أو محاولة تعطيل الموقع أو الوصول إلى بيانات الآخرين دون إذن." },
    { title: "4. العضوية وأمان الحساب", content: "يجب أن يكون عمرك 18 عامًا أو أكثر لإنشاء عضوية. أنت مسؤول عن الحفاظ على سرية وأمان بيانات حسابك." },
    { title: "5. حد المسؤولية", content: "تبذل الشركة قصارى جهدها لضمان دقة المعلومات على الموقع؛ ومع ذلك لا تضمن اكتمال المحتوى أو ملاءمته لغرض معين." },
    { title: "6. القانون الحاكم", content: "تخضع شروط الاستخدام هذه لقوانين جمهورية تركيا. تختص المحاكم التركية في حالة النزاعات." },
  ],
  ru: [
    { title: "1. Общие положения", content: "Посещая и/или используя сайт hudaisifa.com, вы считаетесь принявшим следующие условия использования. Компания оставляет за собой право изменять эти условия без предварительного уведомления." },
    { title: "2. Права интеллектуальной собственности", content: "Весь контент сайта принадлежит Hüda-i Şifa Natural Products Ltd. и защищён применимым законодательством об интеллектуальной собственности. Запрещено копирование, распространение или изменение контента без письменного разрешения." },
    { title: "3. Обязательства пользователя", content: "Пользователи соглашаются использовать сайт только в законных целях. Строго запрещается загружать вредоносные программы, пытаться нарушить работу сайта или получать несанкционированный доступ к данным других пользователей." },
    { title: "4. Членство и безопасность аккаунта", content: "Для регистрации необходимо быть старше 18 лет. Вы несёте ответственность за сохранение конфиденциальности и безопасности данных вашего аккаунта." },
    { title: "5. Ограничение ответственности", content: "Компания прилагает максимальные усилия для обеспечения точности информации на сайте; однако не гарантирует полноту контента или его пригодность для конкретной цели." },
    { title: "6. Применимое право", content: "Настоящие условия использования регулируются законодательством Республики Турция. Турецкие суды имеют юрисдикцию в случае споров." },
  ],
};

const distanceContent: Record<LocaleKey, { title: string; content: string }[]> = {
  tr: [
    { title: "Madde 1 – Taraflar", content: "Satıcı: Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti. — hudaisifa.com\nAlıcı: Sipariş formunu dolduran ve onaylayan gerçek veya tüzel kişi." },
    { title: "Madde 2 – Konu", content: "İşbu sözleşme, Alıcı'nın hudaisifa.com internet sitesi üzerinden sipariş verdiği ürünlerin satışı ve teslimatına ilişkin tarafların hak ve yükümlülüklerini düzenlemektedir." },
    { title: "Madde 5 – Teslimat", content: "Ürünler ödemenin onayından itibaren en geç 3 iş günü içinde kargoya teslim edilir. 200₺ üzeri siparişlerde kargo ücretsizdir." },
    { title: "Madde 6 – Cayma Hakkı (14 Gün)", content: "Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkına sahiptir. Cayma bildirimi için: destek@hudaisifa.com" },
    { title: "Madde 7 – Cayma Hakkının İstisnaları", content: "Ambalajı açılmış takviye edici gıdalar, kişiye özel ürünler ve hızlı bozulabilecek ürünlerde cayma hakkı kullanılamaz (TKHK Madde 15/f)." },
    { title: "Madde 9 – Uyuşmazlık", content: "Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Bildirimler için: destek@hudaisifa.com" },
  ],
  en: [
    { title: "Article 1 – Parties", content: "Seller: Hüda-i Şifa Natural Products Ltd. — hudaisifa.com\nBuyer: The individual or legal entity who fills in and confirms the order form." },
    { title: "Article 2 – Subject", content: "This agreement governs the rights and obligations of the parties regarding the sale and delivery of products ordered by the Buyer through hudaisifa.com." },
    { title: "Article 5 – Delivery", content: "Products will be shipped within a maximum of 3 business days from payment approval. Orders of 200₺ or more qualify for free shipping." },
    { title: "Article 6 – Right of Withdrawal (14 Days)", content: "The Buyer has the right to withdraw from the contract within 14 days of receiving the product without giving any reason. For withdrawal: destek@hudaisifa.com" },
    { title: "Article 7 – Exceptions to Right of Withdrawal", content: "The right of withdrawal cannot be exercised for opened dietary supplements, custom-made products and perishable items (Consumer Protection Law Art. 15/f)." },
    { title: "Article 9 – Dispute Resolution", content: "Consumer Arbitration Committees and Consumer Courts have jurisdiction for disputes. For notifications: destek@hudaisifa.com" },
  ],
  ar: [
    { title: "المادة 1 – الأطراف", content: "البائع: شركة هُدائي شِفا للمنتجات الطبيعية — hudaisifa.com\nالمشتري: الشخص الطبيعي أو الاعتباري الذي يملأ نموذج الطلب ويؤكده." },
    { title: "المادة 2 – الموضوع", content: "تنظم هذه الاتفاقية حقوق والتزامات الطرفين فيما يتعلق ببيع وتسليم المنتجات التي يطلبها المشتري عبر hudaisifa.com." },
    { title: "المادة 5 – التوصيل", content: "تُشحَن المنتجات في غضون 3 أيام عمل على الأكثر من الموافقة على الدفع. الطلبات بقيمة 200₺ أو أكثر مجانية الشحن." },
    { title: "المادة 6 – حق الانسحاب (14 يومًا)", content: "يحق للمشتري الانسحاب من العقد خلال 14 يومًا من استلام المنتج دون إبداء أي سبب. للإشعار بالانسحاب: destek@hudaisifa.com" },
    { title: "المادة 7 – استثناءات حق الانسحاب", content: "لا يمكن ممارسة حق الانسحاب للمكملات الغذائية التي فُتح تغليفها والمنتجات المخصصة والمنتجات سريعة التلف." },
    { title: "المادة 9 – تسوية النزاعات", content: "تختص لجان التحكيم الاستهلاكي ومحاكم المستهلك بالنظر في النزاعات. للإشعارات: destek@hudaisifa.com" },
  ],
  ru: [
    { title: "Статья 1 – Стороны", content: "Продавец: Hüda-i Şifa Natural Products Ltd. — hudaisifa.com\nПокупатель: Физическое или юридическое лицо, заполняющее и подтверждающее форму заказа." },
    { title: "Статья 2 – Предмет", content: "Настоящее соглашение регулирует права и обязанности сторон в отношении продажи и доставки товаров, заказанных Покупателем через hudaisifa.com." },
    { title: "Статья 5 – Доставка", content: "Товары будут отправлены в течение максимум 3 рабочих дней с момента подтверждения оплаты. Заказы на сумму 200₺ и выше доставляются бесплатно." },
    { title: "Статья 6 – Право отказа (14 дней)", content: "Покупатель имеет право отказаться от договора в течение 14 дней с момента получения товара без объяснения причин. Для уведомления: destek@hudaisifa.com" },
    { title: "Статья 7 – Исключения из права отказа", content: "Право отказа не может быть реализовано для вскрытых пищевых добавок, товаров на заказ и скоропортящихся товаров." },
    { title: "Статья 9 – Разрешение споров", content: "Потребительские арбитражные комитеты и потребительские суды имеют юрисдикцию для рассмотрения споров. Для уведомлений: destek@hudaisifa.com" },
  ],
};

const preInfoContent: Record<LocaleKey, { title: string; content: string }[]> = {
  tr: [
    { title: "A – Satıcı Bilgileri", content: "Ticaret Unvanı: Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti.\nWeb: hudaisifa.com | E-posta: destek@hudaisifa.com | Müşteri Hizmetleri: Hafta içi 09:00–18:00" },
    { title: "B – Ürün Özellikleri", content: "Satın almak istediğiniz ürünün adı, içeriği, temel özellikleri ve ilgili uyarılar ürün sayfasında ayrıntılı olarak belirtilmektedir. Takviye edici gıdalar ilaç değildir." },
    { title: "C – Toplam Fiyat", content: "Sipariş tamamlama ekranında ürün fiyatı, kargo ücreti (200₺ üzeri ücretsiz) ve indirimler KDV dahil olarak gösterilir." },
    { title: "D – Ödeme Koşulları", content: "Ödemeler; kredi kartı (Visa, Mastercard, Troy), banka kartı, havale/EFT veya kapıda ödeme yöntemleriyle yapılabilmektedir. 3D Secure aktif." },
    { title: "E – Teslimat Bilgileri", content: "Siparişiniz 1–3 iş günü içinde kargoya teslim edilir. Kargo takip numarası e-posta ve SMS ile bildirilir." },
    { title: "F – Cayma Hakkı Özeti", content: "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. İstisna: Ambalajı açılmış takviye edici gıdalar iade edilemez." },
    { title: "G – Şikayet ve Uyuşmazlık", content: "Şikayetlerinizi destek@hudaisifa.com adresine iletebilirsiniz. Çözüme kavuşturulamayan uyuşmazlıklar için Tüketici Hakem Heyetleri'ne başvurabilirsiniz." },
  ],
  en: [
    { title: "A – Seller Information", content: "Trade Name: Hüda-i Şifa Natural Products Ltd.\nWebsite: hudaisifa.com | Email: destek@hudaisifa.com | Customer Service: Weekdays 09:00–18:00" },
    { title: "B – Product Features", content: "The name, content, key features and relevant warnings of the product you wish to purchase are detailed on the product page. Dietary supplements are not medicines." },
    { title: "C – Total Price", content: "The product price, shipping fee (free over 200₺) and discounts are shown including VAT on the order summary screen." },
    { title: "D – Payment Terms", content: "Payments can be made by credit card (Visa, Mastercard, Troy), debit card, wire transfer or cash on delivery. 3D Secure is active." },
    { title: "E – Delivery Information", content: "Your order will be shipped within 1–3 business days. Tracking number will be notified by email and SMS." },
    { title: "F – Right of Withdrawal Summary", content: "You can exercise your right of withdrawal within 14 days of receiving the product. Exception: Opened dietary supplement packaging cannot be returned." },
    { title: "G – Complaints and Disputes", content: "You can submit your complaints to destek@hudaisifa.com. For unresolved disputes you can apply to Consumer Arbitration Committees." },
  ],
  ar: [
    { title: "أ – معلومات البائع", content: "الاسم التجاري: شركة هُدائي شِفا للمنتجات الطبيعية\nالموقع: hudaisifa.com | البريد: destek@hudaisifa.com | خدمة العملاء: أيام الأسبوع 09:00–18:00" },
    { title: "ب – مواصفات المنتج", content: "اسم المنتج الذي تريد شراءه ومحتواه وميزاته الأساسية والتحذيرات ذات الصلة مذكورة بالتفصيل في صفحة المنتج. المكملات الغذائية ليست أدوية." },
    { title: "ج – السعر الإجمالي", content: "يظهر سعر المنتج ورسوم الشحن (مجاني فوق 200₺) والخصومات شاملةً ضريبة القيمة المضافة في شاشة ملخص الطلب." },
    { title: "د – شروط الدفع", content: "يمكن الدفع ببطاقة الائتمان (Visa, Mastercard, Troy) أو بطاقة الخصم أو التحويل البنكي أو الدفع عند الاستلام. 3D Secure مفعّل." },
    { title: "هـ – معلومات التوصيل", content: "سيُشحَن طلبك خلال 1–3 أيام عمل. سيُرسَل رقم التتبع عبر البريد الإلكتروني والرسائل القصيرة." },
    { title: "و – ملخص حق الانسحاب", content: "يمكنك ممارسة حق الانسحاب خلال 14 يومًا من استلام المنتج. استثناء: لا يمكن إرجاع تغليف المكملات الغذائية المفتوح." },
    { title: "ز – الشكاوى والنزاعات", content: "يمكنك إرسال شكاواك إلى destek@hudaisifa.com. للنزاعات غير المحلولة يمكنك التقدم للجان التحكيم الاستهلاكي." },
  ],
  ru: [
    { title: "А – Информация о продавце", content: "Торговое название: Hüda-i Şifa Natural Products Ltd.\nСайт: hudaisifa.com | Email: destek@hudaisifa.com | Поддержка: будни 09:00–18:00" },
    { title: "Б – Характеристики товара", content: "Название, состав, ключевые характеристики и предупреждения товара, который вы хотите купить, подробно указаны на странице товара. Пищевые добавки не являются лекарственными средствами." },
    { title: "В – Итоговая цена", content: "Цена товара, стоимость доставки (бесплатно от 200₺) и скидки отображаются включая НДС в сводке заказа." },
    { title: "Г – Условия оплаты", content: "Оплата принимается кредитной картой (Visa, Mastercard, Troy), дебетовой картой, банковским переводом или при доставке. 3D Secure активен." },
    { title: "Д – Информация о доставке", content: "Ваш заказ будет отправлен в течение 1–3 рабочих дней. Номер для отслеживания будет отправлен по электронной почте и SMS." },
    { title: "Е – Краткое изложение права отказа", content: "Вы можете воспользоваться правом отказа в течение 14 дней с момента получения товара. Исключение: Вскрытую упаковку пищевых добавок вернуть нельзя." },
    { title: "Ж – Жалобы и споры", content: "Вы можете направлять жалобы на destek@hudaisifa.com. Для неурегулированных споров можно обратиться в потребительские арбитражные комитеты." },
  ],
};

function SectionList({ items }: { items: { title: string; content: string }[] }) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((s) => (
        <div key={s.title} className="bg-white rounded-2xl border border-olive-border/30 p-6">
          <h3 className="text-base font-bold text-green-900 mb-3">{s.title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{s.content}</p>
        </div>
      ))}
    </div>
  );
}

export default function TermsPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const ui = pageUi[locale] ?? pageUi.tr;

  const [activeTab, setActiveTab] = useState(ui.tabs[0].id);

  const tabContent: Record<string, React.ReactNode> = {};
  ui.tabs.forEach((tab, idx) => {
    if (idx === 0) tabContent[tab.id] = <SectionList items={termsContent[locale] ?? termsContent.tr} />;
    if (idx === 1) {
      tabContent[tab.id] = (
        <div className="flex flex-col gap-6">
          <div className="bg-gold-300 border border-gold-400/30 rounded-2xl p-4 text-sm text-green-900">
            <strong>{ui.legalNote}</strong> {ui.legalNoteDistance}
          </div>
          <SectionList items={distanceContent[locale] ?? distanceContent.tr} />
        </div>
      );
    }
    if (idx === 2) {
      tabContent[tab.id] = (
        <div className="flex flex-col gap-6">
          <div className="bg-gold-300 border border-gold-400/30 rounded-2xl p-4 text-sm text-green-900">
            <strong>{ui.legalNote}</strong> {ui.legalNotePreInfo}
          </div>
          <SectionList items={preInfoContent[locale] ?? preInfoContent.tr} />
        </div>
      );
    }
  });

  return (
    <div className="min-h-screen bg-cream-50" dir={ui.dir}>
      <Header />
      <main>
        <section className="bg-green-800 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{ui.heroTitle}</h1>
            <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">{ui.heroSubtitle}</p>
          </div>
        </section>

        <div className="sticky top-0 z-10 bg-white border-b border-olive-border/30 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto">
              {ui.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-green-600 text-green-700"
                      : "border-transparent text-text-secondary hover:text-green-800 hover:border-olive-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {tabContent[activeTab]}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
