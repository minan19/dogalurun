"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const pageUi = {
  tr: {
    dir: "ltr",
    heroTitle: "Takviye Edici Gıda Bilgilendirmesi",
    heroSubtitle:
      "Türk gıda mevzuatı çerçevesinde hazırlanan zorunlu tüketici bilgilendirme sayfası. Doğru ve bilinçli takviye kullanımı için lütfen dikkatle okuyunuz.",
    legalWarningTitle: "Zorunlu Yasal Uyarı",
    legalWarningBody:
      "Takviye edici gıdalar <strong>ilaç değildir</strong>. Hastalıkların tedavisinde kullanılamaz ve hastalıkları önleme amacı taşıyamaz. Bu ürünler normal beslenmeyi desteklemek amacıyla kullanılır. Herhangi bir sağlık sorununuz için lütfen bir sağlık profesyoneline (doktor, diyetisyen, eczacı) danışınız.",
    legalWarningNote:
      "Türk Gıda Kodeksi Takviye Edici Gıdalar Tebliği (No: 2013/49) gereğince zorunlu bilgilendirmedir.",
    whatIsTitle: "Takviye Edici Gıda Nedir?",
    whatIsP1:
      "Türk Gıda Kodeksi Takviye Edici Gıdalar Tebliği'ne (Tebliğ No: 2013/49) göre takviye edici gıdalar:",
    whatIsQuote:
      '"Normal beslenmeyi tamamlamak amacıyla; vitamin, mineral, protein, karbonhidrat, lif, yağ asidi, amino asit gibi besin ögeleri veya bunların dışında besleyici ya da fizyolojik etkisi bulunan bitki, bitkisel ve hayvansal kaynaklı maddeler, biyoaktif maddeler ve benzeri maddelerin konsantre veya özütlerini, tek başına ya da karışım halinde kapsül, tablet, draje, granül, toz, ampul, damla, sıvı vb. formlarda içeren"',
    whatIsP2:
      "gıda ürünleridir. Bu tanım çerçevesinde takviye edici gıdalar; normal ve dengeli bir beslenme düzeninin yanında, belirli besin ögelerinin alımını artırmak amacıyla kullanılan gıda ürünleridir. Besin değeri ya da fizyolojik etki yaratmak amacıyla üretilmekle birlikte, hiçbir koşulda ilaç yerine geçemez.",
    tipsTitle: "Kullanım Önerileri",
    tips: [
      { icon: "📋", tip: "Ürün etiketinde yer alan kullanım talimatlarını ve önerilen dozajı takip edin." },
      { icon: "🚫", tip: "Belirtilen günlük önerilen dozun üzerine çıkmayın." },
      { icon: "🌡️", tip: "Ürünleri serin, kuru ve karanlık bir ortamda, doğrudan güneş ışığından uzak saklayın." },
      { icon: "📅", tip: "Son kullanma tarihini düzenli olarak kontrol edin; tarihi geçmiş ürün kullanmayın." },
      { icon: "🔒", tip: "Çocukların göremeyeceği ve erişemeyeceği yerlerde muhafaza edin." },
      { icon: "🥗", tip: "Takviyeler dengeli bir beslenme ve sağlıklı yaşam tarzının yerini alamaz; destekleyici olarak kullanın." },
      { icon: "💊", tip: "Herhangi bir ilaçla eş zamanlı kullanıyorsanız mutlaka doktorunuza danışın." },
      { icon: "📝", tip: "Yan etki veya beklenmedik bir durum yaşadığınızda kullanımı keserek sağlık profesyoneline başvurun." },
    ],
    groupsTitle: "Kimler Özellikle Dikkat Etmeli?",
    groupsIntro:
      "Aşağıdaki gruplarda takviye edici gıda kullanmadan önce <strong>mutlaka bir sağlık profesyoneline</strong> danışılması önerilir:",
    groups: [
      { icon: "🤰", grup: "Hamile Kadınlar", aciklama: "Gebelik döneminde alınan bazı takviyeler fetal gelişimi olumsuz etkileyebilir. Yalnızca doktor onaylı ürünler kullanılmalıdır." },
      { icon: "👶", grup: "Emziren Anneler", aciklama: "Bazı aktif maddeler anne sütüne geçebilir. Emzirme döneminde kullanılacak her takviye için doktor görüşü alınmalıdır." },
      { icon: "🧒", grup: "Çocuklar ve Ergenler", aciklama: "18 yaş altındaki bireyler için yetişkin dozları uygun değildir. Çocuklara özel formüle edilmiş ürünler tercih edilmeli ve pediatrist onayı alınmalıdır." },
      { icon: "💊", grup: "İlaç Kullananlar", aciklama: "Balık yağı (antikoagülanlar), St. John's Wort (antidepresanlar) gibi takviyeler ilaçlarla etkileşime girebilir. Reçeteli ilaç kullanıyorsanız doktorunuza danışın." },
      { icon: "🏥", grup: "Kronik Hastalığı Olanlar", aciklama: "Diyabet, kalp hastalığı, böbrek veya karaciğer yetmezliği gibi kronik hastalıklarda bazı takviyeler kontrendike olabilir." },
      { icon: "🌸", grup: "Alerjisi / İntoleransı Olanlar", aciklama: "Gluten, laktoz, soya gibi bileşenlere hassasiyetiniz varsa içerik listesini dikkatlice inceleyin ve gerekirse üreticiden bilgi alın." },
    ],
    certsTitle: "Sertifikalar ve Denetim",
    certs: [
      { icon: "🏅", baslik: "GMP Sertifikası", aciklama: "İyi Üretim Uygulamaları (Good Manufacturing Practice) standartlarına uygun tesislerde üretim yapılmaktadır." },
      { icon: "🔬", baslik: "ISO 22000 Gıda Güvenliği", aciklama: "Uluslararası gıda güvenliği yönetim sistemi standardına uygunluk tedarikçi seçiminde temel kriter olarak uygulanır." },
      { icon: "🏛️", baslik: "Tarım ve Orman Bakanlığı Kayıt", aciklama: "Tüm ürünlerimiz TC Tarım ve Orman Bakanlığı'na kayıtlı ve gerekli gıda izinlerine sahip tesislerde üretilmektedir." },
      { icon: "🌿", baslik: "Organik Sertifikasyon", aciklama: "Organik sertifikalı ürünlerimiz Ecocert, IMO veya SKAL gibi uluslararası tanınmış kuruluşlar tarafından denetlenmektedir." },
    ],
    qualityTitle: "Ürünlerimizin Güvencesi — Kalite Kontrol Sürecimiz",
    quality: [
      { adim: "1", baslik: "Hammadde Seçimi", aciklama: "GMP sertifikalı tedarikçilerden sertifikalı hammadde temini ve analiz raporlarının doğrulanması." },
      { adim: "2", baslik: "Üretim Denetimi", aciklama: "Üretim sürecinde hijyen, sıcaklık ve nem kontrolü; GMP protokollerine tam uyum." },
      { adim: "3", baslik: "Laboratuvar Analizi", aciklama: "Bağımsız akredite laboratuvarlarda ağır metal, mikrobiyoloji ve aktif madde miktarı testleri." },
      { adim: "4", baslik: "Etiket Doğrulama", aciklama: "İçerik listesi, dozaj bilgisi ve yasal uyarıların Türk Gıda Kodeksi'ne uygunluğunun kontrolü." },
      { adim: "5", baslik: "Depolama & Sevkiyat", aciklama: "Serin, kuru ve karanlık depoda ürün bütünlüğünü koruyacak koşullarda saklama ve ambalajlama." },
    ],
    ctaTitle: "Hangi Takviyeyi Kullanmalısınız?",
    ctaBody:
      "Uzman diyetisyen ve eczacılardan oluşan ekibimiz size özel tavsiyeler sunmak için hazır. Ücretsiz danışmanlık hizmetimizden yararlanın.",
    ctaBtn: "Uzman Ekibimizle Tanışın →",
    legalTitle: "Yasal Referanslar",
    legalItems: [
      { no: "1", baslik: "Türk Gıda Kodeksi Takviye Edici Gıdalar Tebliği", aciklama: "Tebliğ No: 2013/49 — Takviye edici gıdaların tanımı, içerik sınırları ve etiketleme kurallarını düzenler." },
      { no: "2", baslik: "5996 Sayılı Veteriner Hizmetleri, Bitki Sağlığı, Gıda ve Yem Kanunu", aciklama: "Gıda işletmelerinin kayıt ve onay yükümlülüklerini, denetim esaslarını belirler." },
      { no: "3", baslik: "Gıda İşletmelerinin Kayıt ve Onay İşlemlerine Dair Yönetmelik", aciklama: "Üretim tesislerinin Tarım ve Orman Bakanlığı tarafından kayıt altına alınmasını zorunlu kılar." },
      { no: "4", baslik: "Türk Gıda Kodeksi Etiketleme Yönetmeliği", aciklama: "Gıda ürünlerinde yer alması zorunlu bilgileri (içerik listesi, son kullanma tarihi, net miktar vb.) düzenler." },
      { no: "5", baslik: "Türk Gıda Kodeksi Beslenme ve Sağlık Beyanları Yönetmeliği", aciklama: "Takviye edici gıdaların pazarlanmasında kullanılabilecek beslenme ve sağlık beyanlarını sınırlandırır." },
      { no: "6", baslik: "İyi Üretim Uygulamaları (GMP) Kılavuzu", aciklama: "Gıda üretim tesislerinin hijyen, kalite kontrol ve belgeleme standartlarını belirler." },
    ],
    legalNote1: "Resmi mevzuat bilgilerine",
    legalNote2: "ve",
    legalNote3: "üzerinden ulaşabilirsiniz.",
  },
  en: {
    dir: "ltr",
    heroTitle: "Dietary Supplement Information",
    heroSubtitle:
      "Mandatory consumer information page prepared in accordance with Turkish food legislation. Please read carefully for safe and informed supplement use.",
    legalWarningTitle: "Mandatory Legal Notice",
    legalWarningBody:
      "Dietary supplements are <strong>not medicines</strong>. They cannot be used to treat diseases and are not intended to prevent illness. These products are used to support normal nutrition. For any health concern, please consult a healthcare professional (physician, dietitian, pharmacist).",
    legalWarningNote:
      "Mandatory disclosure pursuant to Turkish Food Codex Dietary Supplements Communiqué (No: 2013/49).",
    whatIsTitle: "What Is a Dietary Supplement?",
    whatIsP1:
      "According to the Turkish Food Codex Dietary Supplements Communiqué (Communiqué No: 2013/49), dietary supplements are defined as:",
    whatIsQuote:
      '"Food products that, for the purpose of supplementing normal diet, contain concentrates or extracts of nutrients such as vitamins, minerals, proteins, carbohydrates, fibre, fatty acids and amino acids, or other substances with nutritional or physiological effects — including plants, plant- and animal-derived substances, bioactive compounds and similar — whether alone or in combination, in forms such as capsules, tablets, dragées, granules, powder, ampoules, drops, liquids, etc."',
    whatIsP2:
      "Within this definition, dietary supplements are food products used alongside a normal, balanced diet to increase the intake of specific nutrients. Although produced to provide nutritional value or physiological effect, they can under no circumstances replace medicines.",
    tipsTitle: "Usage Recommendations",
    tips: [
      { icon: "📋", tip: "Follow the usage instructions and recommended dosage stated on the product label." },
      { icon: "🚫", tip: "Do not exceed the stated daily recommended dose." },
      { icon: "🌡️", tip: "Store products in a cool, dry, dark place away from direct sunlight." },
      { icon: "📅", tip: "Regularly check the expiry date; do not use expired products." },
      { icon: "🔒", tip: "Keep out of the sight and reach of children." },
      { icon: "🥗", tip: "Supplements cannot replace a balanced diet and healthy lifestyle; use them as a complement." },
      { icon: "💊", tip: "If you are taking any medication simultaneously, consult your doctor beforehand." },
      { icon: "📝", tip: "If you experience any side effects or unexpected reactions, stop use and consult a healthcare professional." },
    ],
    groupsTitle: "Who Should Be Especially Careful?",
    groupsIntro:
      "The following groups are advised to consult <strong>a healthcare professional</strong> before using dietary supplements:",
    groups: [
      { icon: "🤰", grup: "Pregnant Women", aciklama: "Some supplements taken during pregnancy may adversely affect fetal development. Only use products approved by your doctor." },
      { icon: "👶", grup: "Breastfeeding Mothers", aciklama: "Some active ingredients may pass into breast milk. Seek medical advice for any supplement to be used during breastfeeding." },
      { icon: "🧒", grup: "Children & Adolescents", aciklama: "Adult dosages are not appropriate for individuals under 18. Choose products formulated specifically for children and obtain paediatrician approval." },
      { icon: "💊", grup: "People Taking Medication", aciklama: "Supplements such as fish oil (anticoagulants) and St. John's Wort (antidepressants) may interact with medicines. Consult your doctor if you take prescription medication." },
      { icon: "🏥", grup: "People with Chronic Conditions", aciklama: "In chronic conditions such as diabetes, heart disease, or kidney or liver failure, some supplements may be contraindicated." },
      { icon: "🌸", grup: "People with Allergies / Intolerances", aciklama: "If you have sensitivities to ingredients such as gluten, lactose, or soy, carefully review the ingredient list and contact the manufacturer if necessary." },
    ],
    certsTitle: "Certifications & Oversight",
    certs: [
      { icon: "🏅", baslik: "GMP Certificate", aciklama: "Products are manufactured in facilities that comply with Good Manufacturing Practice (GMP) standards." },
      { icon: "🔬", baslik: "ISO 22000 Food Safety", aciklama: "Compliance with the international food safety management system standard is a fundamental criterion in supplier selection." },
      { icon: "🏛️", baslik: "Ministry of Agriculture & Forestry Registration", aciklama: "All our products are manufactured in facilities registered with the Republic of Turkey Ministry of Agriculture and Forestry and holding the required food permits." },
      { icon: "🌿", baslik: "Organic Certification", aciklama: "Our organically certified products are audited by internationally recognised bodies such as Ecocert, IMO or SKAL." },
    ],
    qualityTitle: "Our Quality Assurance — Quality Control Process",
    quality: [
      { adim: "1", baslik: "Raw Material Selection", aciklama: "Sourcing certified raw materials from GMP-certified suppliers and verifying analysis reports." },
      { adim: "2", baslik: "Production Oversight", aciklama: "Hygiene, temperature and humidity controls throughout production; full compliance with GMP protocols." },
      { adim: "3", baslik: "Laboratory Analysis", aciklama: "Heavy metal, microbiology and active ingredient quantity tests conducted at independent accredited laboratories." },
      { adim: "4", baslik: "Label Verification", aciklama: "Checking conformity of ingredient list, dosage information and legal warnings with the Turkish Food Codex." },
      { adim: "5", baslik: "Storage & Dispatch", aciklama: "Storage and packaging in a cool, dry and dark warehouse under conditions that preserve product integrity." },
    ],
    ctaTitle: "Which Supplement Should You Use?",
    ctaBody:
      "Our team of expert dietitians and pharmacists is ready to provide personalised advice. Take advantage of our free consultation service.",
    ctaBtn: "Meet Our Expert Team →",
    legalTitle: "Legal References",
    legalItems: [
      { no: "1", baslik: "Turkish Food Codex Dietary Supplements Communiqué", aciklama: "Communiqué No: 2013/49 — Regulates the definition, content limits and labelling rules for dietary supplements." },
      { no: "2", baslik: "Law No. 5996 on Veterinary Services, Plant Health, Food and Feed", aciklama: "Defines the registration and approval obligations of food businesses and the principles of inspection." },
      { no: "3", baslik: "Regulation on Registration and Approval of Food Businesses", aciklama: "Makes it mandatory for production facilities to be registered with the Ministry of Agriculture and Forestry." },
      { no: "4", baslik: "Turkish Food Codex Labelling Regulation", aciklama: "Regulates the mandatory information to appear on food products (ingredient list, expiry date, net quantity, etc.)." },
      { no: "5", baslik: "Turkish Food Codex Nutrition and Health Claims Regulation", aciklama: "Restricts the nutrition and health claims that may be used in the marketing of dietary supplements." },
      { no: "6", baslik: "Good Manufacturing Practice (GMP) Guide", aciklama: "Defines hygiene, quality control and documentation standards for food production facilities." },
    ],
    legalNote1: "Official legislative information is available at",
    legalNote2: "and",
    legalNote3: ".",
  },
  ar: {
    dir: "rtl",
    heroTitle: "معلومات حول المكملات الغذائية",
    heroSubtitle:
      "صفحة إعلام المستهلك الإلزامية المعدّة وفقاً للتشريعات الغذائية التركية. يُرجى القراءة بعناية لضمان استخدام آمن وواعٍ للمكملات.",
    legalWarningTitle: "تحذير قانوني إلزامي",
    legalWarningBody:
      "المكملات الغذائية <strong>ليست أدوية</strong>. لا يجوز استخدامها لعلاج الأمراض ولا تهدف إلى الوقاية منها. تُستخدم هذه المنتجات لدعم التغذية الطبيعية. بشأن أي مشكلة صحية، يُرجى استشارة مختص صحي (طبيب، أخصائي تغذية، صيدلاني).",
    legalWarningNote:
      "إفصاح إلزامي وفقاً لبلاغ المكملات الغذائية في قانون الغذاء التركي (رقم: 2013/49).",
    whatIsTitle: "ما هو المكمل الغذائي؟",
    whatIsP1:
      "وفقاً لبلاغ المكملات الغذائية في قانون الغذاء التركي (رقم البلاغ: 2013/49)، تُعرَّف المكملات الغذائية بأنها:",
    whatIsQuote:
      '"منتجات غذائية تحتوي، لغرض استكمال التغذية الطبيعية، على مركّزات أو مستخلصات من عناصر غذائية كالفيتامينات والمعادن والبروتينات والكربوهيدرات والألياف والأحماض الدهنية والأحماض الأمينية، أو مواد أخرى ذات تأثير غذائي أو فيزيولوجي — بما فيها النباتات والمواد النباتية والحيوانية والمركبات النشطة بيولوجياً — منفردةً أو مجتمعةً، في أشكال كالكبسولات والأقراص والحبوب والحبيبات والمساحيق والأمبولات والقطرات والسوائل وغيرها."',
    whatIsP2:
      "ضمن هذا التعريف، تُعدّ المكملات الغذائية منتجاتٍ غذائية تُستخدم إلى جانب النظام الغذائي الطبيعي والمتوازن لزيادة تناول عناصر غذائية معينة. وعلى الرغم من إنتاجها بهدف توفير قيمة غذائية أو تأثير فيزيولوجي، فإنها لا يمكن أن تحلّ محلّ الأدوية بأي حال من الأحوال.",
    tipsTitle: "توصيات الاستخدام",
    tips: [
      { icon: "📋", tip: "اتّبع تعليمات الاستخدام والجرعة الموصى بها المدوّنة على ملصق المنتج." },
      { icon: "🚫", tip: "لا تتجاوز الجرعة اليومية الموصى بها." },
      { icon: "🌡️", tip: "احفظ المنتجات في مكان بارد وجاف وبعيد عن أشعة الشمس المباشرة." },
      { icon: "📅", tip: "تحقق بانتظام من تاريخ الصلاحية؛ لا تستخدم منتجات منتهية الصلاحية." },
      { icon: "🔒", tip: "احفظها بعيداً عن متناول الأطفال وبصرهم." },
      { icon: "🥗", tip: "لا يمكن للمكملات أن تحلّ محلّ النظام الغذائي المتوازن ونمط الحياة الصحي؛ استخدمها كعنصر مكمّل." },
      { icon: "💊", tip: "إذا كنت تتناول أي دواء في الوقت ذاته، استشر طبيبك أولاً." },
      { icon: "📝", tip: "إذا عانيت من آثار جانبية أو ردود فعل غير متوقعة، أوقف الاستخدام واستشر مختصاً صحياً." },
    ],
    groupsTitle: "من يجب أن يكون أكثر حذراً؟",
    groupsIntro:
      "يُنصح الفئات التالية <strong>باستشارة مختص صحي</strong> قبل استخدام المكملات الغذائية:",
    groups: [
      { icon: "🤰", grup: "الحوامل", aciklama: "قد تؤثر بعض المكملات التي تُؤخذ أثناء الحمل سلباً على نمو الجنين. استخدمي فقط المنتجات التي يوافق عليها طبيبك." },
      { icon: "👶", grup: "الأمهات المُرضعات", aciklama: "قد تنتقل بعض المكونات النشطة إلى حليب الأم. استشيري طبيبك قبل استخدام أي مكمل خلال فترة الرضاعة." },
      { icon: "🧒", grup: "الأطفال والمراهقون", aciklama: "جرعات البالغين غير مناسبة للأفراد دون 18 عاماً. اختر منتجات مُصمَّمة خصيصاً للأطفال واحصل على موافقة طبيب الأطفال." },
      { icon: "💊", grup: "متناولو الأدوية", aciklama: "مكملات كزيت السمك (مع مضادات التخثر) وعشبة سانت جون (مع مضادات الاكتئاب) قد تتفاعل مع الأدوية. استشر طبيبك إذا كنت تتناول دواءً موصوفاً." },
      { icon: "🏥", grup: "مرضى الأمراض المزمنة", aciklama: "في حالات كالسكري وأمراض القلب وقصور الكلى أو الكبد، قد تكون بعض المكملات مضادة للاستطباب." },
      { icon: "🌸", grup: "أصحاب الحساسية / عدم التحمّل", aciklama: "إذا كنت حساساً لمكونات كالغلوتين أو اللاكتوز أو الصويا، فراجع قائمة المكونات بعناية وتواصل مع الشركة المصنّعة عند الحاجة." },
    ],
    certsTitle: "الشهادات والرقابة",
    certs: [
      { icon: "🏅", baslik: "شهادة GMP", aciklama: "تُنتَج المنتجات في منشآت مستوفيةً لمعايير الممارسات الجيدة في التصنيع (GMP)." },
      { icon: "🔬", baslik: "سلامة الغذاء ISO 22000", aciklama: "يُعدّ الامتثال لمعيار نظام إدارة سلامة الغذاء الدولي معياراً أساسياً في اختيار الموردين." },
      { icon: "🏛️", baslik: "تسجيل وزارة الزراعة والغابات", aciklama: "جميع منتجاتنا مُصنَّعة في منشآت مسجّلة لدى وزارة الزراعة والغابات في جمهورية تركيا وتحمل التصاريح الغذائية المطلوبة." },
      { icon: "🌿", baslik: "شهادة العضوية", aciklama: "منتجاتنا العضوية مُدقَّقة من قِبل هيئات دولية معترف بها مثل Ecocert وIMO وSKAL." },
    ],
    qualityTitle: "ضماننا — عملية مراقبة الجودة",
    quality: [
      { adim: "1", baslik: "اختيار المواد الخام", aciklama: "تأمين مواد خام معتمدة من موردين حاملي شهادة GMP والتحقق من تقارير التحليل." },
      { adim: "2", baslik: "مراقبة الإنتاج", aciklama: "التحكم في النظافة ودرجة الحرارة والرطوبة طوال عملية الإنتاج؛ الالتزام الكامل ببروتوكولات GMP." },
      { adim: "3", baslik: "التحليل المختبري", aciklama: "اختبارات المعادن الثقيلة والأحياء الدقيقة وكميات المواد الفعّالة في مختبرات معتمدة ومستقلة." },
      { adim: "4", baslik: "التحقق من الملصق", aciklama: "التحقق من مطابقة قائمة المكونات ومعلومات الجرعة والتحذيرات القانونية لقانون الغذاء التركي." },
      { adim: "5", baslik: "التخزين والشحن", aciklama: "التخزين والتغليف في مستودع بارد وجاف ومظلم في ظروف تحافظ على سلامة المنتج." },
    ],
    ctaTitle: "أيّ مكمل ينبغي لك تناوله؟",
    ctaBody:
      "فريقنا من أخصائيي التغذية والصيادلة المتخصصين مستعد لتقديم نصائح مخصصة لك. استفد من خدمة استشارتنا المجانية.",
    ctaBtn: "تعرّف على فريق خبرائنا →",
    legalTitle: "المراجع القانونية",
    legalItems: [
      { no: "1", baslik: "بلاغ المكملات الغذائية في قانون الغذاء التركي", aciklama: "رقم البلاغ: 2013/49 — ينظّم تعريف المكملات الغذائية وحدود المحتوى وقواعد الوسم." },
      { no: "2", baslik: "القانون رقم 5996 للخدمات البيطرية وصحة النبات والغذاء والعلف", aciklama: "يُحدد التزامات تسجيل وموافقة منشآت الأغذية ومبادئ التفتيش." },
      { no: "3", baslik: "لائحة تسجيل وموافقة منشآت الأغذية وإجراءاتها", aciklama: "تُلزم تسجيلَ منشآت الإنتاج لدى وزارة الزراعة والغابات." },
      { no: "4", baslik: "لائحة الوسم في قانون الغذاء التركي", aciklama: "تُنظّم المعلومات الإلزامية على منتجات الغذاء (قائمة المكونات، تاريخ الانتهاء، الكمية الصافية، إلخ)." },
      { no: "5", baslik: "لائحة ادعاءات التغذية والصحة في قانون الغذاء التركي", aciklama: "تُقيّد ادعاءات التغذية والصحة التي يمكن استخدامها في تسويق المكملات الغذائية." },
      { no: "6", baslik: "دليل الممارسات الجيدة في التصنيع (GMP)", aciklama: "يُحدد معايير النظافة ومراقبة الجودة والتوثيق لمنشآت إنتاج الغذاء." },
    ],
    legalNote1: "يمكن الاطلاع على المعلومات التشريعية الرسمية عبر",
    legalNote2: "و",
    legalNote3: ".",
  },
  ru: {
    dir: "ltr",
    heroTitle: "Информация о биологически активных добавках",
    heroSubtitle:
      "Обязательная страница информирования потребителей, подготовленная в соответствии с турецким пищевым законодательством. Пожалуйста, внимательно прочитайте для безопасного и осознанного применения добавок.",
    legalWarningTitle: "Обязательное юридическое предупреждение",
    legalWarningBody:
      "Биологически активные добавки <strong>не являются лекарственными средствами</strong>. Они не могут применяться для лечения заболеваний и не предназначены для их профилактики. Данные продукты используются для поддержки нормального питания. При любых проблемах со здоровьем проконсультируйтесь с медицинским специалистом (врачом, диетологом, фармацевтом).",
    legalWarningNote:
      "Обязательное раскрытие информации согласно Коммюнике о биологически активных добавках Турецкого пищевого кодекса (№ 2013/49).",
    whatIsTitle: "Что такое биологически активная добавка?",
    whatIsP1:
      "Согласно Коммюнике о биологически активных добавках Турецкого пищевого кодекса (Коммюнике № 2013/49) биологически активные добавки определяются как:",
    whatIsQuote:
      '"Пищевые продукты, предназначенные для дополнения обычного рациона питания и содержащие концентраты или экстракты питательных веществ — витаминов, минералов, белков, углеводов, пищевых волокон, жирных кислот и аминокислот, — а также других веществ с питательным или физиологическим эффектом, включая растения, вещества растительного и животного происхождения, биологически активные соединения и аналогичные вещества, отдельно или в комбинации, в форме капсул, таблеток, драже, гранул, порошков, ампул, капель, жидкостей и т.д."',
    whatIsP2:
      "В рамках данного определения биологически активные добавки представляют собой пищевые продукты, применяемые наряду с нормальным сбалансированным питанием для увеличения потребления определённых питательных веществ. Несмотря на то что они производятся с целью обеспечения питательной ценности или физиологического эффекта, они ни при каких обстоятельствах не могут заменить лекарственные средства.",
    tipsTitle: "Рекомендации по применению",
    tips: [
      { icon: "📋", tip: "Следуйте инструкциям по применению и рекомендуемой дозировке, указанным на этикетке продукта." },
      { icon: "🚫", tip: "Не превышайте указанную суточную рекомендуемую дозу." },
      { icon: "🌡️", tip: "Храните продукты в прохладном, сухом, тёмном месте вдали от прямых солнечных лучей." },
      { icon: "📅", tip: "Регулярно проверяйте срок годности; не используйте продукты с истёкшим сроком." },
      { icon: "🔒", tip: "Храните в местах, недоступных для детей." },
      { icon: "🥗", tip: "Добавки не могут заменить сбалансированное питание и здоровый образ жизни; используйте их как дополнение." },
      { icon: "💊", tip: "Если вы одновременно принимаете какие-либо лекарства, предварительно проконсультируйтесь с врачом." },
      { icon: "📝", tip: "При возникновении побочных эффектов или неожиданных реакций прекратите приём и обратитесь к медицинскому специалисту." },
    ],
    groupsTitle: "Кому следует быть особенно осторожными?",
    groupsIntro:
      "Следующим категориям лиц рекомендуется проконсультироваться <strong>с медицинским специалистом</strong> перед применением биологически активных добавок:",
    groups: [
      { icon: "🤰", grup: "Беременные женщины", aciklama: "Некоторые добавки, принимаемые во время беременности, могут негативно повлиять на развитие плода. Используйте только продукты, одобренные врачом." },
      { icon: "👶", grup: "Кормящие матери", aciklama: "Некоторые активные вещества могут проникать в грудное молоко. Перед применением любой добавки в период лактации проконсультируйтесь с врачом." },
      { icon: "🧒", grup: "Дети и подростки", aciklama: "Дозировки для взрослых не подходят для лиц моложе 18 лет. Выбирайте продукты, специально разработанные для детей, и получите одобрение педиатра." },
      { icon: "💊", grup: "Принимающие лекарства", aciklama: "Такие добавки, как рыбий жир (с антикоагулянтами) и зверобой (с антидепрессантами), могут взаимодействовать с лекарствами. Проконсультируйтесь с врачом, если принимаете рецептурные препараты." },
      { icon: "🏥", grup: "Люди с хроническими заболеваниями", aciklama: "При хронических заболеваниях, таких как диабет, болезни сердца, почечная или печёночная недостаточность, некоторые добавки могут быть противопоказаны." },
      { icon: "🌸", grup: "Люди с аллергией / непереносимостью", aciklama: "Если вы чувствительны к таким компонентам, как глютен, лактоза или соя, внимательно изучите список ингредиентов и при необходимости свяжитесь с производителем." },
    ],
    certsTitle: "Сертификаты и контроль",
    certs: [
      { icon: "🏅", baslik: "Сертификат GMP", aciklama: "Продукция производится на предприятиях, соответствующих стандартам надлежащей производственной практики (GMP)." },
      { icon: "🔬", baslik: "Безопасность пищевых продуктов ISO 22000", aciklama: "Соответствие международному стандарту системы управления безопасностью пищевых продуктов является ключевым критерием при выборе поставщиков." },
      { icon: "🏛️", baslik: "Регистрация в Министерстве сельского хозяйства и лесного хозяйства", aciklama: "Вся наша продукция производится на предприятиях, зарегистрированных в Министерстве сельского хозяйства и лесного хозяйства Турецкой Республики и имеющих необходимые разрешения." },
      { icon: "🌿", baslik: "Органическая сертификация", aciklama: "Наша органически сертифицированная продукция проходит аудит международно признанными организациями, такими как Ecocert, IMO или SKAL." },
    ],
    qualityTitle: "Наша гарантия — процесс контроля качества",
    quality: [
      { adim: "1", baslik: "Выбор сырья", aciklama: "Закупка сертифицированного сырья у поставщиков с сертификатом GMP и проверка аналитических отчётов." },
      { adim: "2", baslik: "Контроль производства", aciklama: "Контроль гигиены, температуры и влажности на протяжении всего производственного процесса; полное соответствие протоколам GMP." },
      { adim: "3", baslik: "Лабораторный анализ", aciklama: "Испытания на тяжёлые металлы, микробиологические показатели и содержание активных веществ в независимых аккредитованных лабораториях." },
      { adim: "4", baslik: "Проверка этикетки", aciklama: "Проверка соответствия списка ингредиентов, информации о дозировке и юридических предупреждений требованиям Турецкого пищевого кодекса." },
      { adim: "5", baslik: "Хранение и отгрузка", aciklama: "Хранение и упаковка в прохладном, сухом и тёмном складе в условиях, обеспечивающих сохранность продукта." },
    ],
    ctaTitle: "Какую добавку вам следует принимать?",
    ctaBody:
      "Наша команда квалифицированных диетологов и фармацевтов готова дать персональные рекомендации. Воспользуйтесь нашей бесплатной консультационной услугой.",
    ctaBtn: "Познакомьтесь с нашей командой экспертов →",
    legalTitle: "Правовые ссылки",
    legalItems: [
      { no: "1", baslik: "Коммюнике Турецкого пищевого кодекса о биологически активных добавках", aciklama: "Коммюнике № 2013/49 — регулирует определение, предельное содержание компонентов и правила маркировки биологически активных добавок." },
      { no: "2", baslik: "Закон № 5996 о ветеринарных услугах, здоровье растений, пищевых продуктах и кормах", aciklama: "Определяет обязательства по регистрации и утверждению пищевых предприятий и принципы инспектирования." },
      { no: "3", baslik: "Регламент о регистрации и утверждении пищевых предприятий", aciklama: "Обязывает регистрировать производственные объекты в Министерстве сельского хозяйства и лесного хозяйства." },
      { no: "4", baslik: "Регламент о маркировке Турецкого пищевого кодекса", aciklama: "Регулирует обязательную информацию на пищевых продуктах (список ингредиентов, срок годности, нетто-количество и др.)." },
      { no: "5", baslik: "Регламент о заявлениях о питании и здоровье Турецкого пищевого кодекса", aciklama: "Ограничивает заявления о питании и здоровье, которые могут использоваться при маркетинге биологически активных добавок." },
      { no: "6", baslik: "Руководство по надлежащей производственной практике (GMP)", aciklama: "Определяет стандарты гигиены, контроля качества и документации для пищевых производственных объектов." },
    ],
    legalNote1: "Официальная законодательная информация доступна на сайтах",
    legalNote2: "и",
    legalNote3: ".",
  },
} as const;

export default function SupplementInfoPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = pageUi[locale] ?? pageUi.tr;

  return (
    <div className="min-h-screen bg-cream-50" dir={t.dir}>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-green-800 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              {t.heroTitle}
            </h1>
            <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-8">

            {/* Legal Warning */}
            <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6">
              <div className="flex gap-3 items-start">
                <span className="text-3xl flex-shrink-0">⚠️</span>
                <div>
                  <p className="text-base font-bold text-amber-900 mb-2">
                    {t.legalWarningTitle}
                  </p>
                  <p
                    className="text-sm text-amber-800 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: t.legalWarningBody }}
                  />
                  <p className="text-xs text-amber-700 mt-2">
                    {t.legalWarningNote}
                  </p>
                </div>
              </div>
            </div>

            {/* What Is */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <span>📖</span> {t.whatIsTitle}
              </h2>
              <div className="text-sm text-text-secondary leading-relaxed space-y-3">
                <p>{t.whatIsP1}</p>
                <p>
                  <strong className="text-green-900">{t.whatIsQuote}</strong>
                </p>
                <p>{t.whatIsP2}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <span>💡</span> {t.tipsTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {t.tips.map((item, i) => (
                  <div key={i} className="flex gap-3 bg-green-50 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Groups */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-2 flex items-center gap-2">
                <span>🩺</span> {t.groupsTitle}
              </h2>
              <p
                className="text-sm text-text-secondary mb-5"
                dangerouslySetInnerHTML={{ __html: t.groupsIntro }}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                {t.groups.map((item) => (
                  <div key={item.grup} className="border border-olive-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <p className="font-bold text-green-900 text-sm">{item.grup}</p>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.aciklama}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <span>🏆</span> {t.certsTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {t.certs.map((s) => (
                  <div key={s.baslik} className="flex gap-3 bg-green-50 rounded-xl p-4">
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div>
                      <p className="font-bold text-green-900 text-sm mb-1">{s.baslik}</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{s.aciklama}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Control */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-5 flex items-center gap-2">
                <span>🔬</span> {t.qualityTitle}
              </h2>
              <div className="flex flex-col gap-4">
                {t.quality.map((adim) => (
                  <div key={adim.adim} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {adim.adim}
                    </div>
                    <div>
                      <p className="font-bold text-green-900 text-sm mb-0.5">{adim.baslik}</p>
                      <p className="text-sm text-text-secondary leading-relaxed">{adim.aciklama}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-green-800 rounded-2xl p-6 sm:p-8 text-center">
              <span className="text-4xl block mb-3">👨‍⚕️</span>
              <h2 className="text-xl font-bold text-white mb-2">
                {t.ctaTitle}
              </h2>
              <p className="text-green-100 text-sm max-w-lg mx-auto mb-5 leading-relaxed">
                {t.ctaBody}
              </p>
              <Link
                href={`/${locale}/experts`}
                className="inline-block bg-white text-green-800 font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
              >
                {t.ctaBtn}
              </Link>
            </div>

            {/* Legal References */}
            <div className="bg-white border border-olive-border/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <span>📜</span> {t.legalTitle}
              </h2>
              <div className="flex flex-col gap-3">
                {t.legalItems.map((m) => (
                  <div key={m.no} className="flex gap-4 items-start border-b border-olive-border/20 pb-3 last:border-0 last:pb-0">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {m.no}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-green-900">{m.baslik}</p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{m.aciklama}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-4">
                {t.legalNote1}{" "}
                <a
                  href="https://www.mevzuat.gov.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  mevzuat.gov.tr
                </a>{" "}
                {t.legalNote2}{" "}
                <a
                  href="https://www.tarimorman.gov.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  tarimorman.gov.tr
                </a>{" "}
                {t.legalNote3}
              </p>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
