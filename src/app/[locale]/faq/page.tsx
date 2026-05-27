"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type LocaleKey = "tr" | "en" | "ar" | "ru";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  icon: string;
  items: FaqItem[];
}

const allFaqData: Record<LocaleKey, FaqCategory[]> = {
  tr: [
    {
      title: "Sipariş & Teslimat",
      icon: "📦",
      items: [
        { question: "Siparişimi ne zaman kargoya verirsiniz?", answer: "Hafta içi saat 14:00'e kadar verilen ve ödemesi onaylanan siparişler aynı iş günü kargoya teslim edilir. Saat 14:00'den sonra verilen siparişler ise bir sonraki iş günü kargoya verilir. Hafta sonu (Cumartesi–Pazar) ve resmi tatil günlerinde verilen siparişler takip eden ilk iş günü işleme alınır. Siparişiniz kargoya verildikten sonra size e-posta ve SMS ile takip numaranız iletilir." },
        { question: "Kargo süresi ne kadar?", answer: "Çalıştığımız kargo firmalarına (Yurtiçi Kargo, Aras Kargo, MNG Kargo) ve teslimat bölgesine göre değişmekle birlikte:\n\n• İstanbul ve büyük şehir merkezleri: Genellikle 1 iş günü\n• İl merkezleri: 1–2 iş günü\n• İlçe ve köyler: 2–3 iş günü\n• Uzak/dağlık bölgeler: 3–5 iş günü\n\nBelirtilen süreler iş günü bazındadır; hafta sonu ve resmi tatiller bu sürelere dahil değildir." },
        { question: "Siparişimi takip edebilir miyim?", answer: "Evet. Siparişiniz kargoya teslim edildiğinde size e-posta ve SMS ile kargo takip numaranız gönderilir. Bu numara ile;\n\n• Yurtiçi Kargo: yurticikargo.com.tr\n• Aras Kargo: araskargo.com.tr\n• MNG Kargo: mngkargo.com.tr\n\nweb sitelerinden siparişinizi anlık olarak takip edebilirsiniz." },
        { question: "Minimum sipariş tutarı var mı?", answer: "Sitemizde herhangi bir minimum sipariş tutarı zorunluluğu bulunmamaktadır; istediğiniz miktarda alışveriş yapabilirsiniz. Ancak 200₺ ve üzeri siparişlerinizde kargo ücretsizdir. 200₺ altındaki siparişlerde 29,90₺ kargo ücreti uygulanır." },
        { question: "Yurt dışına kargo yapıyor musunuz?", answer: "Şu an itibarıyla yalnızca Türkiye'deki teslimat adreslerine hizmet vermekteyiz. Yurt dışı teslimat için çalışmalarımız devam etmekte olup bu konudaki güncellemeler web sitemiz ve sosyal medya hesaplarımız üzerinden duyurulacaktır." },
        { question: "Siparişimi iptal edebilir miyim?", answer: "Siparişiniz kargoya verilmeden önce müşteri hizmetlerimizi arayarak veya destek@hudaisifa.com adresine e-posta göndererek iptal talebinde bulunabilirsiniz. Kargoya verildikten sonra iptal mümkün değildir; bu durumda ürünü teslim aldıktan sonra 14 günlük cayma hakkınızı kullanarak iade başlatabilirsiniz." },
      ],
    },
    {
      title: "Ürünler & İçerikler",
      icon: "🌿",
      items: [
        { question: "Ürünleriniz organik sertifikalı mı?", answer: "Ürün portföyümüzün büyük çoğunluğu organik sertifikalıdır. Organik sertifikalı ürünlerde ürün sayfasında ve ambalajında \"Organik Sertifikalı\" ibaresi yer almaktadır." },
        { question: "İçerikler nereden temin ediliyor?", answer: "Ürünlerimizde kullandığımız hammaddeler; Anadolu'nun çeşitli bölgelerinden seçilen yerli çiftçilerden ve uluslararası GMP sertifikalı tedarikçilerden temin edilmektedir." },
        { question: "Ürünlerde hangi katkı maddeleri kullanılıyor?", answer: "Ürünlerimizde yapay renklendirici, yapay tatlandırıcı veya koruyucu madde kullanılmamaktadır. Her ürünün içerik listesi ürün sayfasında ve ambalajında eksiksiz olarak yer almaktadır." },
        { question: "Ürünleri nerede üretiyorsunuz?", answer: "Ürünlerimiz, Tarım ve Orman Bakanlığı tarafından denetlenen ve GMP sertifikasına sahip Türkiye'deki üretim tesislerinde imal edilmektedir." },
        { question: "Raf ömürleri ne kadar?", answer: "Ürünlerin raf ömrü formülasyona ve içeriğe göre farklılık gösterir; genellikle 18 ay ile 36 ay arasında değişmektedir. Size gönderilen ürünlerde son kullanma tarihine en az 6 ay kaldığından emin olarak sevkiyat yapılmaktadır." },
        { question: "Çocuklar kullanabilir mi?", answer: "Takviye edici gıdaların çocuklarda kullanımı, ürünün içeriğine ve çocuğun yaşına göre değişir. 18 yaş altı bireylerin herhangi bir takviye kullanmadan önce mutlaka pediatrist veya aile hekimine danışması önerilir." },
      ],
    },
    {
      title: "Ödeme & Fatura",
      icon: "💳",
      items: [
        { question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", answer: "Sitemizde aşağıdaki ödeme yöntemleri geçerlidir:\n\n• Kredi kartı (Visa, Mastercard, American Express, Troy)\n• Banka/Ön ödemeli kart\n• Havale / EFT\n• Kapıda ödeme (nakit veya POS — ek ücret uygulanabilir)" },
        { question: "Taksit seçenekleri var mı?", answer: "Anlaşmalı bankalar aracılığıyla 2 ila 12 taksit imkânı sunulmaktadır. Ödeme adımında geçerli taksit seçeneklerini kartınızı girdiğinizde görebilirsiniz." },
        { question: "Fatura kesiliyor mu?", answer: "Evet, tüm siparişler için e-fatura veya e-arşiv fatura düzenlenmektedir. Fatura, siparişiniz kargoya verildikten sonra kayıtlı e-posta adresinize gönderilir." },
        { question: "Ödeme güvenli mi?", answer: "Tüm ödeme işlemleri 256-bit SSL şifrelemesi ile korunmaktadır. Kart bilgileriniz sunucularımızda saklanmaz; ödemeler PCI-DSS uyumlu ödeme altyapı sağlayıcısı üzerinden gerçekleştirilir." },
        { question: "Kapıda ödeme seçeneği var mı?", answer: "Evet, kapıda ödeme seçeneği mevcuttur. Nakit veya taşınabilir POS cihazı ile ödeme yapılabilmektedir. Kapıda ödeme seçeneğinde sipariş tutarına 9,90₺ ek hizmet bedeli yansıtılmaktadır." },
      ],
    },
    {
      title: "İade & Değişim",
      icon: "🔄",
      items: [
        { question: "İade koşulları nelerdir?", answer: "Aşağıdaki koşulların tamamının sağlanması halinde iade kabul edilir:\n\n• Teslim tarihinden itibaren 14 gün içinde iade talebinde bulunulması\n• Ürünün açılmamış, kullanılmamış ve orijinal ambalajında olması\n• Ürün etiketinin sökülmemiş olması\n• Fatura veya sipariş belgesi ile birlikte gönderilmesi" },
        { question: "İade süreci nasıl işler?", answer: "1. destek@hudaisifa.com adresine sipariş numaranız ve iade nedeninizle başvurunuzu gönderin.\n2. Ekibimiz 1 iş günü içinde size dönüş yapar ve iade onayı verir.\n3. Ürünü orijinal ambalajında, fatura/sipariş belgesiyle birlikte belirtilen adrese gönderin.\n4. Ürün depomuzda teslim alındıktan sonra kalite kontrolden geçirilir.\n5. Onayın ardından 3–7 iş günü içinde ödeme iade edilir." },
        { question: "Hasarlı ürün geldi, ne yapmalıyım?", answer: "Kargo hasarı durumunda öncelikle teslim anında kargo görevlisi huzurunda hasar tespit tutanağı tutturmanızı önemle tavsiye ederiz. Ardından 24 saat içinde destek@hudaisifa.com adresine siparişinizin fotoğraflarını ve açıklamanızı gönderin." },
        { question: "Para iadesi ne zaman yapılır?", answer: "Ürünün depomuzda teslim alınmasının ardından kalite kontrolden geçirilmesi tamamlandığında iade onaylanır. Onay sonrasında:\n\n• Kredi kartı ile ödemelerde: 3–7 iş günü\n• Havale/EFT ile ödemelerde: 2–3 iş günü\n• Kapıda ödeme ile ödemelerde: banka havalesi ile 3–5 iş günü" },
      ],
    },
    {
      title: "Üyelik & Hesap",
      icon: "👤",
      items: [
        { question: "Üyelik avantajları nelerdir?", answer: "Üye olarak aşağıdaki avantajlardan yararlanabilirsiniz:\n\n• Her alışverişte puan kazanma ve puan kullanma\n• Sipariş geçmişine ve faturalara kolayca erişim\n• Favori ürünleri istek listesine ekleme\n• Özel üye kampanyaları ve erken erişim fırsatları" },
        { question: "Puan sistemi nasıl çalışır?", answer: "Her 100₺ harcama için 10 Şifa Puanı kazanırsınız. Biriktirdiğiniz puanları ilerleyen alışverişlerinizde indirim olarak kullanabilirsiniz: 100 Şifa Puanı = 1₺ indirim." },
        { question: "Şifremi unuttum, ne yapmalıyım?", answer: "Giriş sayfasındaki \"Şifremi Unuttum\" bağlantısına tıklayarak kayıtlı e-posta adresinizi girin. Size şifre sıfırlama bağlantısı gönderilecektir. Bu bağlantı 30 dakika geçerlidir." },
        { question: "Hesabımı nasıl silebilirim?", answer: "Hesap silme talebinizi destek@hudaisifa.com adresine, kayıtlı e-posta adresinizden yazarak iletebilirsiniz. KVKK kapsamındaki kişisel veri silme talebiniz 30 gün içinde işleme alınır." },
      ],
    },
  ],
  en: [
    {
      title: "Orders & Delivery",
      icon: "📦",
      items: [
        { question: "When will you ship my order?", answer: "Orders placed and paid by 14:00 on weekdays are shipped the same business day. Orders placed after 14:00 are shipped the next business day. Orders placed on weekends (Saturday–Sunday) and public holidays are processed on the first following business day. Once shipped, you will receive a tracking number by email and SMS." },
        { question: "How long does shipping take?", answer: "Delivery times vary depending on the courier and destination:\n\n• Istanbul and major city centers: Usually 1 business day\n• Provincial centers: 1–2 business days\n• Districts and villages: 2–3 business days\n• Remote/mountainous areas: 3–5 business days\n\nThese times are in business days; weekends and public holidays are not included." },
        { question: "Can I track my order?", answer: "Yes. When your order is shipped, your tracking number will be sent to you by email and SMS. You can track your order in real time through the courier websites." },
        { question: "Is there a minimum order amount?", answer: "There is no minimum order requirement on our site. However, orders of 200₺ or more qualify for free shipping. Orders below 200₺ are charged a 29.90₺ shipping fee." },
        { question: "Do you ship internationally?", answer: "We currently only serve delivery addresses in Turkey. We are working on international delivery and updates will be announced via our website and social media." },
        { question: "Can I cancel my order?", answer: "You can request a cancellation by contacting customer service or emailing destek@hudaisifa.com before the order is shipped. Cancellation is not possible after shipping; in that case you can initiate a return using your 14-day right of withdrawal after receiving the product." },
      ],
    },
    {
      title: "Products & Ingredients",
      icon: "🌿",
      items: [
        { question: "Are your products organically certified?", answer: "The majority of our product portfolio is organically certified. Organically certified products are labeled \"Organically Certified\" on the product page and packaging." },
        { question: "Where do the ingredients come from?", answer: "The raw materials we use in our products are sourced from local farmers in various regions of Anatolia and internationally GMP-certified suppliers." },
        { question: "What additives are used in your products?", answer: "Our products contain no artificial colorants, sweeteners or preservatives. The ingredient list of every product is fully listed on the product page and packaging." },
        { question: "Where are the products manufactured?", answer: "Our products are manufactured in GMP-certified production facilities in Turkey, supervised by the Ministry of Agriculture and Forestry." },
        { question: "What is the shelf life?", answer: "Shelf life varies by formulation and content, generally between 18 and 36 months. Products are shipped with at least 6 months remaining before expiration." },
        { question: "Can children use your products?", answer: "Use of dietary supplements in children depends on the product's content and the child's age. It is recommended that individuals under 18 consult a pediatrician or family doctor before using any supplement." },
      ],
    },
    {
      title: "Payment & Invoicing",
      icon: "💳",
      items: [
        { question: "What payment methods do you accept?", answer: "The following payment methods are accepted:\n\n• Credit card (Visa, Mastercard, American Express, Troy)\n• Debit/prepaid card\n• Bank transfer / Wire transfer\n• Cash on delivery (additional fee may apply)" },
        { question: "Are installment options available?", answer: "Installment options from 2 to 12 are available through partner banks. Available installment options are displayed at the payment step when you enter your card." },
        { question: "Do you issue invoices?", answer: "Yes, an e-invoice or e-archive invoice is issued for all orders. The invoice is sent to your registered email address after your order is shipped." },
        { question: "Is payment secure?", answer: "All payment transactions are protected with 256-bit SSL encryption. Card details are not stored on our servers; payments are processed through a PCI-DSS compliant payment provider." },
        { question: "Is cash on delivery available?", answer: "Yes, cash on delivery is available. Payment can be made by cash or mobile POS. A 9.90₺ service fee is added to the order total for cash on delivery. This option may not be available in all regions." },
      ],
    },
    {
      title: "Returns & Exchanges",
      icon: "🔄",
      items: [
        { question: "What are the return conditions?", answer: "Returns are accepted when all of the following conditions are met:\n\n• Return request made within 14 days of delivery date\n• Product unopened, unused and in original packaging\n• Product label not removed\n• Sent together with the invoice or order document" },
        { question: "How does the return process work?", answer: "1. Send your request to destek@hudaisifa.com with your order number and reason.\n2. Our team will get back to you within 1 business day and provide return approval.\n3. Send the product in its original packaging with invoice/order document to the specified address.\n4. After the product is received at our warehouse, it undergoes quality control.\n5. After approval, the payment is refunded within 3–7 business days." },
        { question: "My product arrived damaged, what should I do?", answer: "In case of shipping damage, we strongly recommend having a damage report drawn up in front of the courier at the time of delivery. Then send photos of your order and a description to destek@hudaisifa.com within 24 hours." },
        { question: "When will I receive my refund?", answer: "The refund is approved once quality control is completed after the product is received at our warehouse. After approval:\n\n• Credit card payments: 3–7 business days\n• Wire/bank transfer payments: 2–3 business days\n• Cash on delivery payments: 3–5 business days by bank transfer" },
      ],
    },
    {
      title: "Membership & Account",
      icon: "👤",
      items: [
        { question: "What are the membership benefits?", answer: "As a member you can benefit from:\n\n• Earn and use points on every purchase\n• Easy access to order history and invoices\n• Add favorite products to wish list\n• Special member campaigns and early access opportunities" },
        { question: "How does the points system work?", answer: "You earn 10 Şifa Points for every 100₺ spent. You can use accumulated points as discounts on future purchases: 100 Şifa Points = 1₺ discount." },
        { question: "I forgot my password, what should I do?", answer: "Click the \"Forgot Password\" link on the login page and enter your registered email address. A password reset link will be sent to you. This link is valid for 30 minutes." },
        { question: "How can I delete my account?", answer: "You can send your account deletion request to destek@hudaisifa.com from your registered email address. Your personal data deletion request under privacy regulations will be processed within 30 days." },
      ],
    },
  ],
  ar: [
    {
      title: "الطلبات والتوصيل",
      icon: "📦",
      items: [
        { question: "متى سيتم شحن طلبي؟", answer: "يُشحن الطلبات المُقدَّمة والمدفوعة قبل الساعة 14:00 في أيام الأسبوع في نفس يوم العمل. يُشحن الطلبات المُقدَّمة بعد الساعة 14:00 في يوم العمل التالي. تُعالَج الطلبات المُقدَّمة في عطلة نهاية الأسبوع والأعياد الرسمية في أول يوم عمل تالٍ. بعد الشحن، ستتلقى رقم التتبع عبر البريد الإلكتروني والرسائل القصيرة." },
        { question: "كم تستغرق مدة الشحن؟", answer: "تختلف مدة التوصيل حسب شركة الشحن والمنطقة:\n\n• إسطنبول والمدن الكبرى: يوم عمل واحد عادةً\n• مراكز المحافظات: 1–2 يوم عمل\n• الأحياء والقرى: 2–3 أيام عمل\n• المناطق النائية/الجبلية: 3–5 أيام عمل\n\nالمدد المذكورة بأيام العمل، لا تشمل عطل نهاية الأسبوع والأعياد الرسمية." },
        { question: "هل يمكنني تتبع طلبي؟", answer: "نعم. عند شحن طلبك، سيُرسَل إليك رقم التتبع عبر البريد الإلكتروني والرسائل القصيرة. يمكنك تتبع طلبك في الوقت الفعلي عبر مواقع شركات الشحن." },
        { question: "هل هناك حد أدنى لمبلغ الطلب؟", answer: "لا يوجد حد أدنى لمبلغ الطلب في موقعنا. ومع ذلك، الطلبات بقيمة 200₺ أو أكثر مجانية الشحن. تُطبَّق رسوم شحن بقيمة 29.90₺ على الطلبات التي تقل عن 200₺." },
        { question: "هل تشحنون دولياً؟", answer: "نخدم حالياً عناوين التوصيل داخل تركيا فقط. نعمل على التوصيل الدولي وسيتم الإعلان عن التحديثات عبر موقعنا ووسائل التواصل الاجتماعي." },
        { question: "هل يمكنني إلغاء طلبي؟", answer: "يمكنك طلب الإلغاء بالتواصل مع خدمة العملاء أو إرسال بريد إلكتروني إلى destek@hudaisifa.com قبل شحن الطلب. لا يمكن الإلغاء بعد الشحن؛ في هذه الحالة يمكنك البدء في الإرجاع باستخدام حق السحب خلال 14 يومًا بعد استلام المنتج." },
      ],
    },
    {
      title: "المنتجات والمكونات",
      icon: "🌿",
      items: [
        { question: "هل منتجاتكم حاصلة على شهادة عضوية؟", answer: "معظم محفظة منتجاتنا حاصلة على شهادة عضوية. المنتجات الحاصلة على شهادة عضوية تحمل عبارة \"حاصل على شهادة عضوية\" في صفحة المنتج والتغليف." },
        { question: "من أين تأتي المكونات؟", answer: "تُستمَد المواد الخام التي نستخدمها في منتجاتنا من المزارعين المحليين في مناطق مختلفة من الأناضول والموردين الدوليين الحاصلين على شهادة GMP." },
        { question: "ما المواد المضافة المستخدمة في منتجاتكم؟", answer: "لا تحتوي منتجاتنا على أصباغ أو محليات أو مواد حافظة اصطناعية. قائمة المكونات الكاملة لكل منتج موجودة في صفحة المنتج والتغليف." },
        { question: "أين تُصنَّع المنتجات؟", answer: "تُصنَّع منتجاتنا في منشآت إنتاج حاصلة على شهادة GMP في تركيا تحت إشراف وزارة الزراعة والغابات." },
        { question: "ما هي مدة الصلاحية؟", answer: "تتراوح مدة الصلاحية عادةً بين 18 و36 شهرًا. يتم شحن المنتجات مع بقاء 6 أشهر على الأقل قبل انتهاء الصلاحية." },
        { question: "هل يمكن للأطفال استخدام منتجاتكم؟", answer: "يعتمد استخدام المكملات الغذائية عند الأطفال على محتوى المنتج وعمر الطفل. يُنصح بالتشاور مع طبيب الأطفال أو الطبيب العائلي قبل استخدام أي مكمل لمن هم دون 18 عامًا." },
      ],
    },
    {
      title: "الدفع والفوترة",
      icon: "💳",
      items: [
        { question: "ما طرق الدفع المقبولة؟", answer: "الطرق التالية مقبولة:\n\n• بطاقة الائتمان (Visa, Mastercard, American Express, Troy)\n• بطاقة الخصم/المدفوع مسبقًا\n• حوالة / تحويل بنكي\n• الدفع عند الاستلام (قد تُطبَّق رسوم إضافية)" },
        { question: "هل تتوفر خيارات تقسيط؟", answer: "تتوفر خيارات تقسيط من 2 إلى 12 قسطًا عبر البنوك الشريكة. تُعرَض خيارات التقسيط المتاحة في خطوة الدفع عند إدخال بياناتك." },
        { question: "هل تصدرون فواتير؟", answer: "نعم، تُصدَر فاتورة إلكترونية لجميع الطلبات. تُرسَل الفاتورة إلى بريدك الإلكتروني المسجل بعد شحن طلبك." },
        { question: "هل الدفع آمن؟", answer: "جميع معاملات الدفع محمية بتشفير SSL 256 بت. لا تُخزَّن بيانات البطاقة على خوادمنا؛ تُعالَج المدفوعات عبر مزود بنية تحتية للدفع متوافق مع PCI-DSS." },
        { question: "هل يتوفر الدفع عند الاستلام؟", answer: "نعم، يتوفر الدفع عند الاستلام. يمكن الدفع نقدًا أو بجهاز POS. يُضاف 9.90₺ رسوم خدمة إضافية على مبلغ الطلب. قد لا يتوفر هذا الخيار في جميع المناطق." },
      ],
    },
    {
      title: "الإرجاع والاستبدال",
      icon: "🔄",
      items: [
        { question: "ما شروط الإرجاع؟", answer: "يُقبَل الإرجاع عند استيفاء جميع الشروط التالية:\n\n• تقديم طلب الإرجاع خلال 14 يومًا من تاريخ التوصيل\n• المنتج غير مفتوح وغير مستخدم وفي تغليفه الأصلي\n• ملصق المنتج غير مُزال\n• الإرسال مع الفاتورة أو وثيقة الطلب" },
        { question: "كيف تسير عملية الإرجاع؟", answer: "1. أرسل طلبك إلى destek@hudaisifa.com مع رقم طلبك وسبب الإرجاع.\n2. سيتواصل معك فريقنا خلال يوم عمل واحد ويقدم موافقة الإرجاع.\n3. أرسل المنتج في تغليفه الأصلي مع الفاتورة/وثيقة الطلب إلى العنوان المحدد.\n4. بعد استلام المنتج في مستودعنا يخضع لمراقبة الجودة.\n5. بعد الموافقة يُسترد المبلغ خلال 3–7 أيام عمل." },
        { question: "وصلني منتج تالف، ماذا أفعل؟", answer: "في حالة تلف الشحن نوصي بشدة بتحرير محضر ضرر بحضور موظف الشحن عند التسليم. ثم أرسل صوراً لطلبك ووصفاً إلى destek@hudaisifa.com في غضون 24 ساعة." },
        { question: "متى سأحصل على استرداد المبلغ؟", answer: "تُعتمد استرداد المبلغ بعد اكتمال مراقبة الجودة عقب استلام المنتج. بعد الموافقة:\n\n• المدفوعات ببطاقة الائتمان: 3–7 أيام عمل\n• المدفوعات بالتحويل البنكي: 2–3 أيام عمل\n• مدفوعات الدفع عند الاستلام: 3–5 أيام عمل بالتحويل البنكي" },
      ],
    },
    {
      title: "العضوية والحساب",
      icon: "👤",
      items: [
        { question: "ما مزايا العضوية؟", answer: "كعضو يمكنك الاستفادة من:\n\n• كسب النقاط واستخدامها في كل عملية شراء\n• الوصول السهل إلى سجل الطلبات والفواتير\n• إضافة المنتجات المفضلة إلى قائمة الرغبات\n• حملات العضوية الخاصة وفرص الوصول المبكر" },
        { question: "كيف يعمل نظام النقاط؟", answer: "تكسب 10 نقاط شفاء لكل 100₺ تنفقها. يمكنك استخدام النقاط المتراكمة كخصومات في مشترياتك القادمة: 100 نقطة شفاء = 1₺ خصم." },
        { question: "نسيت كلمة المرور، ماذا أفعل؟", answer: "انقر على رابط \"نسيت كلمة المرور\" في صفحة تسجيل الدخول وأدخل بريدك الإلكتروني المسجل. سيُرسَل إليك رابط إعادة تعيين كلمة المرور. هذا الرابط صالح لمدة 30 دقيقة." },
        { question: "كيف يمكنني حذف حسابي؟", answer: "يمكنك إرسال طلب حذف الحساب إلى destek@hudaisifa.com من بريدك الإلكتروني المسجل. سيُعالَج طلب حذف بياناتك الشخصية وفق اللوائح في غضون 30 يومًا." },
      ],
    },
  ],
  ru: [
    {
      title: "Заказы и доставка",
      icon: "📦",
      items: [
        { question: "Когда вы отправите мой заказ?", answer: "Заказы, оформленные и оплаченные до 14:00 в рабочие дни, отправляются в тот же рабочий день. Заказы, оформленные после 14:00, отправляются на следующий рабочий день. Заказы, оформленные в выходные и праздничные дни, обрабатываются в первый следующий рабочий день. После отправки вы получите номер для отслеживания по электронной почте и SMS." },
        { question: "Сколько времени занимает доставка?", answer: "Время доставки варьируется в зависимости от курьерской службы и адреса:\n\n• Стамбул и крупные города: обычно 1 рабочий день\n• Провинциальные центры: 1–2 рабочих дня\n• Районы и сёла: 2–3 рабочих дня\n• Отдалённые/горные районы: 3–5 рабочих дней\n\nСроки указаны в рабочих днях; выходные и праздничные дни не включены." },
        { question: "Могу ли я отслеживать свой заказ?", answer: "Да. Когда ваш заказ отправлен, номер для отслеживания будет выслан вам по электронной почте и SMS. Вы можете отслеживать заказ в режиме реального времени через сайты курьерских служб." },
        { question: "Есть ли минимальная сумма заказа?", answer: "На нашем сайте нет требования к минимальной сумме заказа. Однако заказы на сумму 200₺ и выше доставляются бесплатно. Для заказов ниже 200₺ взимается плата за доставку 29,90₺." },
        { question: "Вы доставляете за рубеж?", answer: "В настоящее время мы обслуживаем только адреса доставки в Турции. Мы работаем над международной доставкой, обновления будут объявлены на нашем сайте и в социальных сетях." },
        { question: "Могу ли я отменить заказ?", answer: "Вы можете запросить отмену, связавшись со службой поддержки или написав на destek@hudaisifa.com до отправки заказа. После отправки отмена невозможна; в этом случае вы можете инициировать возврат, воспользовавшись правом отказа в течение 14 дней после получения товара." },
      ],
    },
    {
      title: "Продукты и ингредиенты",
      icon: "🌿",
      items: [
        { question: "Ваши продукты имеют органическую сертификацию?", answer: "Большинство нашего ассортимента имеет органическую сертификацию. Органически сертифицированные продукты помечены надписью «Органически сертифицировано» на странице продукта и упаковке." },
        { question: "Откуда берутся ингредиенты?", answer: "Сырьё, используемое в наших продуктах, поступает от местных фермеров из различных регионов Анатолии и от международных поставщиков с сертификацией GMP." },
        { question: "Какие добавки используются в ваших продуктах?", answer: "Наши продукты не содержат искусственных красителей, подсластителей или консервантов. Полный список ингредиентов каждого продукта указан на странице продукта и упаковке." },
        { question: "Где производятся продукты?", answer: "Наши продукты производятся на производственных объектах в Турции с сертификацией GMP под надзором Министерства сельского хозяйства и лесного хозяйства." },
        { question: "Каков срок годности?", answer: "Срок годности варьируется в зависимости от рецептуры, как правило от 18 до 36 месяцев. Продукты отправляются с оставшимся сроком годности не менее 6 месяцев." },
        { question: "Могут ли дети использовать ваши продукты?", answer: "Использование пищевых добавок у детей зависит от состава продукта и возраста ребёнка. Рекомендуется проконсультироваться с педиатром или семейным врачом перед применением любой добавки лицами до 18 лет." },
      ],
    },
    {
      title: "Оплата и выставление счетов",
      icon: "💳",
      items: [
        { question: "Какие способы оплаты вы принимаете?", answer: "Принимаются следующие способы оплаты:\n\n• Кредитная карта (Visa, Mastercard, American Express, Troy)\n• Дебетовая/предоплаченная карта\n• Банковский перевод\n• Оплата при доставке (может взиматься дополнительная плата)" },
        { question: "Доступны ли рассрочки?", answer: "Рассрочки от 2 до 12 платежей доступны через банки-партнёры. Доступные варианты рассрочки отображаются на этапе оплаты при введении данных карты." },
        { question: "Вы выставляете счета-фактуры?", answer: "Да, для всех заказов выставляется электронный счёт-фактура. Счёт отправляется на ваш зарегистрированный адрес электронной почты после отправки заказа." },
        { question: "Безопасна ли оплата?", answer: "Все платёжные операции защищены 256-битным шифрованием SSL. Данные карты не хранятся на наших серверах; платежи обрабатываются через провайдера, соответствующего PCI-DSS." },
        { question: "Доступна ли оплата при доставке?", answer: "Да, оплата при доставке доступна. Оплата принимается наличными или через мобильный POS-терминал. К сумме заказа добавляется сервисный сбор 9,90₺. Этот вариант может быть недоступен во всех регионах." },
      ],
    },
    {
      title: "Возвраты и обмены",
      icon: "🔄",
      items: [
        { question: "Каковы условия возврата?", answer: "Возврат принимается при выполнении всех следующих условий:\n\n• Запрос на возврат в течение 14 дней с даты получения\n• Товар не открыт, не использован и в оригинальной упаковке\n• Этикетка товара не снята\n• Отправлен вместе со счётом или документом заказа" },
        { question: "Как работает процесс возврата?", answer: "1. Отправьте запрос на destek@hudaisifa.com с номером заказа и причиной возврата.\n2. Наша команда свяжется с вами в течение 1 рабочего дня и подтвердит возврат.\n3. Отправьте товар в оригинальной упаковке со счётом/документом заказа по указанному адресу.\n4. После получения товара на нашем складе он проходит контроль качества.\n5. После одобрения платёж возвращается в течение 3–7 рабочих дней." },
        { question: "Мой товар пришёл повреждённым, что делать?", answer: "В случае повреждения при доставке настоятельно рекомендуем составить акт о повреждении в присутствии курьера при получении. Затем отправьте фотографии заказа и описание на destek@hudaisifa.com в течение 24 часов." },
        { question: "Когда я получу возврат средств?", answer: "Возврат одобряется после завершения контроля качества по получении товара. После одобрения:\n\n• Оплата кредитной картой: 3–7 рабочих дней\n• Банковский перевод: 2–3 рабочих дня\n• Оплата при доставке: 3–5 рабочих дней банковским переводом" },
      ],
    },
    {
      title: "Членство и аккаунт",
      icon: "👤",
      items: [
        { question: "Каковы преимущества членства?", answer: "Как член вы можете воспользоваться:\n\n• Накопление и использование баллов при каждой покупке\n• Лёгкий доступ к истории заказов и счетам\n• Добавление любимых товаров в список желаний\n• Специальные акции для участников и ранний доступ" },
        { question: "Как работает система баллов?", answer: "Вы получаете 10 Şifa Points за каждые потраченные 100₺. Накопленные баллы можно использовать как скидку при последующих покупках: 100 Şifa Points = скидка 1₺." },
        { question: "Я забыл пароль, что делать?", answer: "Нажмите ссылку «Забыли пароль» на странице входа и введите зарегистрированный адрес электронной почты. Вам будет отправлена ссылка для сброса пароля. Эта ссылка действительна 30 минут." },
        { question: "Как удалить мой аккаунт?", answer: "Вы можете отправить запрос на удаление аккаунта на destek@hudaisifa.com с вашего зарегистрированного адреса электронной почты. Ваш запрос на удаление персональных данных будет обработан в течение 30 дней." },
      ],
    },
  ],
};

const pageUi: Record<LocaleKey, { dir: string; title: string; subtitle: string; notFound: string; support: string; contactBtn: string }> = {
  tr: { dir: "ltr", title: "Sık Sorulan Sorular", subtitle: "Merak ettiğiniz her şeyi burada bulabilirsiniz. Yanıt bulamazsanız müşteri hizmetlerimiz size yardımcı olmaktan memnuniyet duyar.", notFound: "Aradığınız cevabı bulamadınız mı?", support: "Müşteri hizmetlerimiz hafta içi 09:00–18:00 saatleri arasında hizmetinizdedir.", contactBtn: "Bize Ulaşın" },
  en: { dir: "ltr", title: "Frequently Asked Questions", subtitle: "You can find answers to everything you're wondering here. If you can't find an answer, our customer service team is happy to help.", notFound: "Couldn't find the answer you were looking for?", support: "Our customer service is available weekdays from 09:00–18:00.", contactBtn: "Contact Us" },
  ar: { dir: "rtl", title: "الأسئلة الشائعة", subtitle: "يمكنك هنا العثور على إجابات لكل ما يدور في ذهنك. إذا لم تجد إجابة، يسعد فريق خدمة العملاء لدينا مساعدتك.", notFound: "لم تجد الإجابة التي تبحث عنها؟", support: "خدمة العملاء لدينا متاحة أيام الأسبوع من 09:00 إلى 18:00.", contactBtn: "اتصل بنا" },
  ru: { dir: "ltr", title: "Часто задаваемые вопросы", subtitle: "Здесь вы найдёте ответы на все интересующие вас вопросы. Если не найдёте ответа, наша служба поддержки с удовольствием поможет.", notFound: "Не нашли нужный ответ?", support: "Наша служба поддержки работает в рабочие дни с 09:00 до 18:00.", contactBtn: "Связаться с нами" },
};

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-olive-border/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-green-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-green-900">{question}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 bg-white border-t border-olive-border/20">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: FaqCategory }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{category.icon}</span>
        <h2 className="text-lg font-bold text-green-800">{category.title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {category.items.map((item, i) => (
          <AccordionItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function FaqPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const ui = pageUi[locale] ?? pageUi.tr;
  const faqData = allFaqData[locale] ?? allFaqData.tr;

  return (
    <div className="min-h-screen bg-cream-50" dir={ui.dir}>
      <Header />
      <main>
        <section className="bg-green-800 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{ui.title}</h1>
            <p className="text-green-100 text-sm sm:text-base max-w-xl mx-auto">{ui.subtitle}</p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {faqData.map((category, i) => (
              <CategorySection key={i} category={category} />
            ))}

            <div className="mt-4 bg-green-50 border border-olive-border/40 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-green-900 mb-1">{ui.notFound}</p>
              <p className="text-sm text-text-secondary mb-4">{ui.support}</p>
              <a href="mailto:destek@hudaisifa.com"
                className="inline-block bg-green-600 hover:bg-green-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                {ui.contactBtn}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
