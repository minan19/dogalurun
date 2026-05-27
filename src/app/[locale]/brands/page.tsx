"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const brandTranslations: Record<LocaleKey, {
  dir: string;
  heroBadge: string;
  expertApproved: string;
  pageTitle: string;
  pageDesc: string;
  metrics: { val: string; label: string }[];
  filter: string;
  allCerts: string;
  sort: string;
  sortAZ: string;
  sortFounded: string;
  productCount: (n: number) => string;
  whyChoose: string;
  selectionReason: string;
  viewProducts: string;
  askExpert: string;
  criteriaTitle: string;
  criteriaDesc: string;
  askExperts: string;
  closeLabel: string;
}> = {
  tr: {
    dir: "ltr",
    heroBadge: "8 Güvenilir Marka",
    expertApproved: "Uzman Onaylı",
    pageTitle: "Markalarımız",
    pageDesc: "Her marka, uzmanlarımız tarafından bilimsel kriterler çerçevesinde seçilmektedir. Sertifikasyon, formülasyon kalitesi, şeffaflık ve bağımsız laboratuvar testleri değerlendirme ölçütlerimizdir.",
    metrics: [
      { val: "8", label: "Seçili Marka" },
      { val: "50+", label: "Sertifikasyon" },
      { val: "4", label: "Ülke" },
      { val: "75+", label: "Yıllık Deneyim" },
    ],
    filter: "Filtre:",
    allCerts: "Tüm Sertifikalar",
    sort: "Sırala:",
    sortAZ: "A→Z",
    sortFounded: "Kuruluş Yılı",
    productCount: (n) => `${n} ürün →`,
    whyChoose: "Neden Seçtik? ▼",
    closeLabel: "Kapat ▲",
    selectionReason: "Seçim Gerekçemiz",
    viewProducts: "Ürünleri İncele",
    askExpert: "Uzman Danış",
    criteriaTitle: "Marka Seçim Kriterlerimiz",
    criteriaDesc: "Her marka aşağıdaki kriterlere göre değerlendirilir: Bağımsız 3. taraf lab testleri, GMP veya eşdeğer üretim sertifikasyonu, içerik şeffaflığı, etkin madde dozajı ve aktif madde doğrulaması. Bu kriterleri karşılamayan markalar portföyümüze alınmamaktadır.",
    askExperts: "Uzmanlarımıza Sorun",
  },
  en: {
    dir: "ltr",
    heroBadge: "8 Trusted Brands",
    expertApproved: "Expert Approved",
    pageTitle: "Our Brands",
    pageDesc: "Every brand is selected by our experts using scientific criteria. Certification, formulation quality, transparency and independent lab tests are our evaluation standards.",
    metrics: [
      { val: "8", label: "Selected Brands" },
      { val: "50+", label: "Certifications" },
      { val: "4", label: "Countries" },
      { val: "75+", label: "Years of Experience" },
    ],
    filter: "Filter:",
    allCerts: "All Certifications",
    sort: "Sort:",
    sortAZ: "A→Z",
    sortFounded: "Founded Year",
    productCount: (n) => `${n} products →`,
    whyChoose: "Why We Chose ▼",
    closeLabel: "Close ▲",
    selectionReason: "Our Selection Rationale",
    viewProducts: "Browse Products",
    askExpert: "Ask an Expert",
    criteriaTitle: "Our Brand Selection Criteria",
    criteriaDesc: "Every brand is evaluated against the following criteria: Independent 3rd party lab tests, GMP or equivalent production certification, ingredient transparency, active ingredient dosage and active substance verification. Brands that do not meet these criteria are not added to our portfolio.",
    askExperts: "Ask Our Experts",
  },
  ar: {
    dir: "rtl",
    heroBadge: "8 علامات تجارية موثوقة",
    expertApproved: "معتمد من الخبراء",
    pageTitle: "علاماتنا التجارية",
    pageDesc: "تُختار كل علامة تجارية من قِبَل خبرائنا وفق معايير علمية. معايير تقييمنا هي: الشهادات وجودة التركيبة والشفافية واختبارات المختبرات المستقلة.",
    metrics: [
      { val: "8", label: "علامات مختارة" },
      { val: "+50", label: "شهادة" },
      { val: "4", label: "دول" },
      { val: "+75", label: "سنوات خبرة" },
    ],
    filter: "تصفية:",
    allCerts: "جميع الشهادات",
    sort: "ترتيب:",
    sortAZ: "أ→ي",
    sortFounded: "سنة التأسيس",
    productCount: (n) => `${n} منتجات ←`,
    whyChoose: "لماذا اخترناها؟ ▼",
    closeLabel: "إغلاق ▲",
    selectionReason: "مبررات اختيارنا",
    viewProducts: "تصفح المنتجات",
    askExpert: "استشر خبيرًا",
    criteriaTitle: "معايير اختيار العلامات التجارية",
    criteriaDesc: "تُقيَّم كل علامة تجارية وفق المعايير التالية: اختبارات مختبر مستقل من طرف ثالث، شهادة GMP أو ما يعادلها، شفافية المكونات، جرعة المادة الفعالة والتحقق منها. لا تُضاف العلامات التجارية التي لا تستوفي هذه المعايير إلى محفظتنا.",
    askExperts: "اسأل خبراءنا",
  },
  ru: {
    dir: "ltr",
    heroBadge: "8 надёжных брендов",
    expertApproved: "Одобрено экспертами",
    pageTitle: "Наши бренды",
    pageDesc: "Каждый бренд отбирается нашими экспертами по научным критериям. Наши стандарты оценки: сертификация, качество рецептуры, прозрачность и независимые лабораторные тесты.",
    metrics: [
      { val: "8", label: "Выбранных брендов" },
      { val: "50+", label: "Сертификаций" },
      { val: "4", label: "Страны" },
      { val: "75+", label: "Лет опыта" },
    ],
    filter: "Фильтр:",
    allCerts: "Все сертификации",
    sort: "Сортировка:",
    sortAZ: "А→Я",
    sortFounded: "Год основания",
    productCount: (n) => `${n} продуктов →`,
    whyChoose: "Почему мы выбрали ▼",
    closeLabel: "Закрыть ▲",
    selectionReason: "Наше обоснование выбора",
    viewProducts: "Просмотреть продукты",
    askExpert: "Спросить эксперта",
    criteriaTitle: "Наши критерии отбора брендов",
    criteriaDesc: "Каждый бренд оценивается по следующим критериям: независимые лабораторные тесты третьей стороны, сертификация GMP или аналогичная, прозрачность состава, дозировка активных веществ и их верификация. Бренды, не соответствующие этим критериям, не добавляются в наш портфель.",
    askExperts: "Спросить наших экспертов",
  },
};

const brands = [
  {
    id: "hudaisifa",
    name: "Hüda-i Şifa",
    slug: "huda-i-sifa",
    tag: { tr: "Özel Seri", en: "Own Series", ar: "سلسلة خاصة", ru: "Собственная серия" },
    tagColor: "bg-green-700 text-white",
    country: "🇹🇷 Türkiye",
    founded: "2020",
    color: "from-[#2D5016] to-[#4A7C2E]",
    certifications: ["GMP", "TSE", "ISO 9001", "Helal"],
    categories: ["Takviye", "Organik Gıda"],
    desc: {
      tr: "Uzman diyetisyen ve eczacılarımız tarafından formüle edilen, Türkiye'de üretilen özel doğal takviye ve organik gıda serisi.",
      en: "Special natural supplement and organic food series formulated by our expert dietitians and pharmacists, manufactured in Turkey.",
      ar: "سلسلة خاصة من المكملات الطبيعية والأغذية العضوية، مُركَّبة من قِبَل أخصائيي التغذية والصيادلة الخبراء لدينا وتُصنَّع في تركيا.",
      ru: "Специальная серия натуральных добавок и органических продуктов питания, разработанная нашими экспертами-диетологами и фармацевтами, производится в Турции.",
    },
    whyChose: {
      tr: "Kendi özel formüllerimizi geliştirirken en yüksek kalite standartlarını esas aldık. Hammaddelerimiz sertifikalı tedarikçilerden, üretimimiz GMP belgeli tesislerde gerçekleşmektedir.",
      en: "We applied the highest quality standards when developing our own special formulas. Our raw materials come from certified suppliers, and our production takes place in GMP-certified facilities.",
      ar: "طبّقنا أعلى معايير الجودة عند تطوير تركيباتنا الخاصة. موادنا الخام من موردين معتمدين وإنتاجنا في منشآت حاصلة على شهادة GMP.",
      ru: "При разработке собственных формул мы применяли высочайшие стандарты качества. Наше сырьё поступает от сертифицированных поставщиков, производство осуществляется на объектах с сертификацией GMP.",
    },
    highlight: {
      tr: "Tüm ürünler uzman onaylı ve bağımsız lab test raporlu",
      en: "All products are expert-approved with independent lab test reports",
      ar: "جميع المنتجات معتمدة من الخبراء مع تقارير اختبارات مختبرية مستقلة",
      ru: "Все продукты одобрены экспертами с отчётами независимых лабораторных испытаний",
    },
    productCount: null,
  },
  {
    id: "nordic",
    name: "Nordic Naturals",
    slug: "nordic-naturals",
    tag: { tr: "İthal", en: "Imported", ar: "مستورد", ru: "Импортный" },
    tagColor: "bg-blue-700 text-white",
    country: "🇳🇴 Norveç",
    founded: "1995",
    color: "from-blue-700 to-blue-500",
    certifications: ["NSF", "IFOS 5 Yıldız", "Non-GMO", "Gluten-Free"],
    categories: ["Omega-3", "Balık Yağı"],
    desc: {
      tr: "Norveç'in soğuk sularından elde edilen, IFOS 5 yıldız sertifikalı omega-3 ürünleriyle Avrupa'nın lider balık yağı markası.",
      en: "Europe's leading fish oil brand with IFOS 5-star certified omega-3 products sourced from Norway's cold waters.",
      ar: "العلامة التجارية الرائدة في أوروبا لزيت السمك مع منتجات أوميغا-3 الحاصلة على شهادة IFOS 5 نجوم من المياه الباردة النرويجية.",
      ru: "Ведущий бренд рыбьего жира в Европе с сертифицированными IFOS 5 звёзд продуктами омега-3 из холодных вод Норвегии.",
    },
    whyChose: {
      tr: "Omega-3 saflık ve konsantrasyonunda sektörün referans standardını belirleyen IFOS belgelendirmesine göre seçildi.",
      en: "Selected based on IFOS certification, which sets the industry reference standard for omega-3 purity and concentration.",
      ar: "تم اختياره بناءً على شهادة IFOS التي تضع معيار المرجعية في الصناعة لنقاء وتركيز أوميغا-3.",
      ru: "Выбран на основе сертификации IFOS, которая устанавливает отраслевой эталон чистоты и концентрации омега-3.",
    },
    highlight: {
      tr: "IFOS 5 yıldız — dünyanın en sıkı balık yağı sertifikası",
      en: "IFOS 5 stars — the world's strictest fish oil certification",
      ar: "IFOS 5 نجوم — أصارم شهادة لزيت السمك في العالم",
      ru: "IFOS 5 звёзд — самая строгая сертификация рыбьего жира в мире",
    },
    productCount: null,
  },
  {
    id: "lifeextension",
    name: "Life Extension",
    slug: "life-extension",
    tag: { tr: "Premium", en: "Premium", ar: "بريميوم", ru: "Премиум" },
    tagColor: "bg-purple-700 text-white",
    country: "🇺🇸 ABD",
    founded: "1980",
    color: "from-purple-800 to-purple-600",
    certifications: ["NSF", "GMP", "USP", "Non-GMO"],
    categories: ["Anti-Aging", "Vitamins", "Hormones"],
    desc: {
      tr: "40 yıllık kanıta dayalı araştırma deneyimiyle 350'den fazla bilimsel çalışmaya dayanan premium uzun ömür ve yaşlanma karşıtı takviyeler.",
      en: "Premium longevity and anti-aging supplements backed by 40 years of evidence-based research and over 350 scientific studies.",
      ar: "مكملات طول العمر ومكافحة الشيخوخة المتميزة المدعومة بـ 40 عامًا من البحث المستند إلى الأدلة وأكثر من 350 دراسة علمية.",
      ru: "Премиальные добавки для долголетия и антивозрастной терапии, основанные на 40-летнем опыте доказательных исследований и более чем 350 научных работах.",
    },
    whyChose: {
      tr: "Kendi bilimsel araştırma merkezini bünyesinde bulunduran ve ürünlerini peer-reviewed çalışmalarla destekleyen ender markalardan.",
      en: "One of the rare brands that houses its own scientific research center and supports its products with peer-reviewed studies.",
      ar: "من العلامات التجارية النادرة التي تمتلك مركز بحث علمي خاص بها وتدعم منتجاتها بدراسات محكّمة.",
      ru: "Один из редких брендов, имеющих собственный научно-исследовательский центр и поддерживающих свои продукты рецензируемыми исследованиями.",
    },
    highlight: {
      tr: "350+ klinik çalışma destekli formülasyon",
      en: "Formulation supported by 350+ clinical studies",
      ar: "تركيبة مدعومة بأكثر من 350 دراسة سريرية",
      ru: "Рецептура, подкреплённая 350+ клиническими исследованиями",
    },
    productCount: null,
  },
  {
    id: "nowfoods",
    name: "Now Foods",
    slug: "now-foods",
    tag: { tr: "Popüler", en: "Popular", ar: "شائع", ru: "Популярный" },
    tagColor: "bg-orange-600 text-white",
    country: "🇺🇸 ABD",
    founded: "1968",
    color: "from-orange-600 to-orange-400",
    certifications: ["GMP", "NSF", "Non-GMO", "Kosher", "Halal"],
    categories: ["Vitamins", "Minerals", "Herbs", "Sports"],
    desc: {
      tr: "1968'den bu yana uygun fiyatlı, NSF sertifikalı geniş takviye yelpazesiyle hem profesyoneller hem bireysel kullanıcıların tercihi.",
      en: "Since 1968, the choice of both professionals and individual users with its affordable, NSF-certified wide supplement range.",
      ar: "منذ عام 1968، خيار المحترفين والمستخدمين الأفراد بفضل مجموعتها الواسعة والمعتمدة من NSF بأسعار معقولة.",
      ru: "С 1968 года — выбор как профессионалов, так и индивидуальных пользователей благодаря доступной и сертифицированной NSF широкой линейке добавок.",
    },
    whyChose: {
      tr: "Fiyat-kalite dengesi ve geniş ürün yelpazesi ön plana çıkmaktadır. GMP + NSF çift sertifikasyonu ile temel güven kriterleri karşılanmaktadır.",
      en: "Price-quality balance and wide product range stand out. Basic trust criteria are met with GMP + NSF double certification.",
      ar: "يبرز توازن السعر والجودة ومجموعة المنتجات الواسعة. تستوفي معايير الثقة الأساسية بشهادة مزدوجة GMP + NSF.",
      ru: "Выделяется соотношение цены и качества, а также широкий ассортимент. Базовые критерии доверия соответствуют двойной сертификации GMP + NSF.",
    },
    highlight: {
      tr: "55+ yıllık deneyim, 1500+ ürün",
      en: "55+ years of experience, 1500+ products",
      ar: "+55 سنة من الخبرة، +1500 منتج",
      ru: "55+ лет опыта, 1500+ продуктов",
    },
    productCount: null,
  },
  {
    id: "solgar",
    name: "Solgar",
    slug: "solgar",
    tag: { tr: "Köklü Marka", en: "Heritage Brand", ar: "علامة راسخة", ru: "Легендарный бренд" },
    tagColor: "bg-yellow-600 text-white",
    country: "🇺🇸 ABD",
    founded: "1947",
    color: "from-yellow-700 to-yellow-500",
    certifications: ["GMP", "Non-GMO", "Gluten-Free", "Kosher"],
    categories: ["Vitamins", "Minerals", "Specialty"],
    desc: {
      tr: "1947'den bu yana Yeni Jersey'de üretilen, 50'den fazla ülkede satılan, bioavailability araştırmalarına öncülük eden köklü premium marka.",
      en: "A heritage premium brand produced in New Jersey since 1947, sold in over 50 countries, pioneering bioavailability research.",
      ar: "علامة تجارية متميزة عريقة تُنتَج في نيوجيرسي منذ عام 1947، تُباع في أكثر من 50 دولة، وتُرسي أبحاث التوافر البيولوجي.",
      ru: "Легендарный премиальный бренд, производимый в Нью-Джерси с 1947 года, продаётся в более чем 50 странах, является пионером в исследованиях биодоступности.",
    },
    whyChose: {
      tr: "75 yılı aşkın deneyim ve özellikle chelated mineral formülasyonlarındaki uzmanlığı nedeniyle seçildi.",
      en: "Selected for its over 75 years of experience and expertise, especially in chelated mineral formulations.",
      ar: "اختير لخبرته التي تتجاوز 75 عامًا وخاصة خبرته في تركيبات المعادن المخلّبة.",
      ru: "Выбран за более чем 75-летний опыт и экспертизу, особенно в области хелатных минеральных рецептур.",
    },
    highlight: {
      tr: "Chelated mineral formülasyonunda global standart",
      en: "Global standard in chelated mineral formulation",
      ar: "المعيار العالمي في تركيبات المعادن المخلّبة",
      ru: "Глобальный стандарт в хелатных минеральных рецептурах",
    },
    productCount: null,
  },
  {
    id: "gardenoflife",
    name: "Garden of Life",
    slug: "garden-of-life",
    tag: { tr: "Organik", en: "Organic", ar: "عضوي", ru: "Органический" },
    tagColor: "bg-green-600 text-white",
    country: "🇺🇸 ABD",
    founded: "2000",
    color: "from-green-700 to-emerald-500",
    certifications: ["USDA Organic", "Non-GMO", "Gluten-Free", "Vegan"],
    categories: ["Probiotics", "Protein", "Greens", "Women"],
    desc: {
      tr: "USDA organik sertifikalı, tüm gıda kaynağı tabanlı vitamin, probiyotik ve protein ürünleriyle organik takviye kategorisinin lideri.",
      en: "Leader in the organic supplement category with USDA organic certified, whole food-based vitamins, probiotics and protein products.",
      ar: "رائد فئة المكملات العضوية مع فيتامينات وبروبيوتيك وبروتينات مستندة إلى الغذاء الكامل وحاصلة على شهادة USDA عضوية.",
      ru: "Лидер в категории органических добавок с сертифицированными USDA органическими витаминами, пробиотиками и белковыми продуктами на основе цельных продуктов питания.",
    },
    whyChose: {
      tr: "Tüm ürünlerde gerçek gıda kaynaklı hammadde kullanımı ve USDA organik sertifikasyonu, müşterilerimizin taleplerini tam olarak karşılamaktadır.",
      en: "The use of real food-sourced raw materials in all products and USDA organic certification fully meets the demands of our customers.",
      ar: "استخدام المواد الخام المستخرجة من الطعام الحقيقي في جميع المنتجات وشهادة USDA العضوية يلبّي تمامًا احتياجات عملائنا.",
      ru: "Использование сырья из натуральных продуктов питания во всех продуктах и органическая сертификация USDA полностью соответствует запросам наших клиентов.",
    },
    highlight: {
      tr: "USDA Organik sertifikalı — tüm ürün serisi",
      en: "USDA Organic certified — entire product range",
      ar: "حاصل على شهادة USDA Organic — مجموعة المنتجات الكاملة",
      ru: "Сертификат USDA Organic — вся линейка продуктов",
    },
    productCount: null,
  },
  {
    id: "thorne",
    name: "Thorne",
    slug: "thorne",
    tag: { tr: "Klinik", en: "Clinical", ar: "سريري", ru: "Клинический" },
    tagColor: "bg-gray-700 text-white",
    country: "🇺🇸 ABD",
    founded: "1984",
    color: "from-gray-800 to-gray-600",
    certifications: ["NSF Sport", "GMP", "NSF", "Informed-Sport"],
    categories: ["Sports", "Clinical", "Hormones", "Testing"],
    desc: {
      tr: "Mayo Clinic ve Olimpiyat sporcularının güvendiği, NSF Spor sertifikalı klinik kalite takviyeler ve kişiselleştirilmiş sağlık testleri.",
      en: "Clinical quality supplements and personalized health tests trusted by Mayo Clinic and Olympic athletes, NSF Sport certified.",
      ar: "مكملات غذائية بجودة سريرية واختبارات صحية مخصصة يثق بها Mayo Clinic والرياضيون الأولمبيون، حاصلة على شهادة NSF Sport.",
      ru: "Клинически качественные добавки и персонализированные тесты здоровья, которым доверяют Mayo Clinic и олимпийские спортсмены, с сертификатом NSF Sport.",
    },
    whyChose: {
      tr: "NSF for Sport sertifikası — ilaç doping maddelerinden arınmış olduğunu kanıtlayan en üst düzey spor takviye sertifikası.",
      en: "NSF for Sport certification — the highest level sports supplement certificate proving freedom from pharmaceutical doping substances.",
      ar: "شهادة NSF for Sport — أعلى مستوى من شهادات المكملات الرياضية التي تثبت الخلو من مواد الدوبينج الدوائية.",
      ru: "Сертификация NSF for Sport — высший уровень сертификации спортивных добавок, подтверждающий отсутствие фармацевтических допинговых веществ.",
    },
    highlight: {
      tr: "Mayo Clinic ortak markası — klinik kalite",
      en: "Mayo Clinic partner brand — clinical quality",
      ar: "علامة تجارية شريكة لـ Mayo Clinic — جودة سريرية",
      ru: "Партнёрский бренд Mayo Clinic — клиническое качество",
    },
    productCount: null,
  },
  {
    id: "pureenc",
    name: "Pure Encapsulations",
    slug: "pure-encapsulations",
    tag: { tr: "Hypoallergenic", en: "Hypoallergenic", ar: "هايبوأليرجينيك", ru: "Гипоаллергенный" },
    tagColor: "bg-teal-700 text-white",
    country: "🇺🇸 ABD",
    founded: "1991",
    color: "from-teal-700 to-cyan-600",
    certifications: ["GMP", "NSF", "Hypoallergenic", "Non-GMO"],
    categories: ["Allergy-Friendly", "Clinical", "Gut Health"],
    desc: {
      tr: "Soy, gluten, süt ürünü ve yapay katkı içermeyen, hipoalerjenik kapsüllerde sunulan klinik kalite formüller — hassas bireylerin tercihi.",
      en: "Clinical quality formulas free from soy, gluten, dairy and artificial additives, presented in hypoallergenic capsules — the choice of sensitive individuals.",
      ar: "تركيبات بجودة سريرية خالية من الصويا والغلوتين ومنتجات الألبان والمضافات الاصطناعية في كبسولات مضادة للحساسية — خيار الأفراد الحساسين.",
      ru: "Клинически качественные рецептуры без сои, глютена, молочных продуктов и искусственных добавок в гипоаллергенных капсулах — выбор чувствительных людей.",
    },
    whyChose: {
      tr: "Katkı maddesi, dolgu maddesi, boyar madde içermemesi ile bütünlükçü hekimlerin ve diyetisyenlerin birinci tercihi.",
      en: "The first choice of holistic physicians and dietitians for containing no additives, fillers or colorants.",
      ar: "الخيار الأول للأطباء الشموليين وأخصائيي التغذية لخلوه من المضافات والمواد الحاشية وأصباغ الألوان.",
      ru: "Первый выбор врачей-холистов и диетологов благодаря отсутствию добавок, наполнителей и красителей.",
    },
    highlight: {
      tr: "125+ bilimsel referans içeren formülasyon sistemi",
      en: "Formulation system with 125+ scientific references",
      ar: "نظام تركيبات يحتوي على أكثر من 125 مرجعًا علميًا",
      ru: "Система рецептур с 125+ научными ссылками",
    },
    productCount: null,
  },
];

type SortKey = "name" | "founded" | "category";

export default function BrandsPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = brandTranslations[locale] ?? brandTranslations.tr;

  const [expanded, setExpanded] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterCert, setFilterCert] = useState<string>("all");

  const allCerts = Array.from(
    new Set(brands.flatMap((b) => b.certifications))
  ).sort();

  const handleSortClick = (key: SortKey) => {
    if (sort === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setSortDir("asc");
    }
  };

  const sorted = [...brands]
    .filter((b) => filterCert === "all" || b.certifications.includes(filterCert))
    .sort((a, b) => {
      let cmp = 0;
      if (sort === "founded") cmp = parseInt(a.founded) - parseInt(b.founded);
      else cmp = a.name.localeCompare(b.name, "tr");
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="min-h-screen bg-[#FAFAF5]" dir={t.dir}>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-green-50 to-[#FAFAF5] py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  {t.heroBadge}
                </span>
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                  {t.expertApproved}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-green-800 leading-tight">
                {t.pageTitle}
              </h1>
              <p className="mt-3 text-text-secondary leading-relaxed">
                {t.pageDesc}
              </p>
            </div>

            {/* Trust metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {t.metrics.map((m) => (
                <div key={m.label} className="bg-white rounded-2xl border border-olive-border/30 p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{m.val}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-0 bg-[#FAFAF5]/95 backdrop-blur border-b border-olive-border/30 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-secondary">{t.filter}</span>
              <select value={filterCert} onChange={(e) => setFilterCert(e.target.value)}
                className="text-xs border border-olive-border/40 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-green-700/50">
                <option value="all">{t.allCerts}</option>
                {allCerts.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-semibold text-text-secondary">{t.sort}</span>
              {([
                { key: "name" as SortKey, labelAsc: t.sortAZ, labelDesc: t.sortAZ.replace("→", "←") },
                { key: "founded" as SortKey, labelAsc: t.sortFounded + " ↑", labelDesc: t.sortFounded + " ↓" },
              ]).map((s) => {
                const isActive = sort === s.key;
                const label = isActive && sortDir === "desc" ? s.labelDesc : s.labelAsc;
                return (
                  <button key={s.key} onClick={() => handleSortClick(s.key)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                      isActive
                        ? "bg-green-700 text-white border-green-700"
                        : "bg-white border-olive-border/40 text-text-secondary hover:border-green-700/30"
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brand cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.map((brand) => {
              const brandProducts = products.filter((p) => p.brand === brand.name);
              const isExpanded = expanded === brand.id;

              return (
                <div key={brand.id}
                  className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${
                    isExpanded ? "border-green-700/40 shadow-md col-span-1 sm:col-span-2" : "border-olive-border/30"
                  }`}>
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${brand.color} h-28 flex flex-col items-start justify-end px-5 py-4 relative`}>
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {brand.country}
                    </span>
                    <p className="text-white font-bold text-lg leading-tight">{brand.name}</p>
                    <p className="text-white/70 text-[11px]">Est. {brand.founded}</p>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {/* Tag + product count */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${brand.tagColor}`}>
                        {brand.tag[locale]}
                      </span>
                      {brandProducts.length > 0 && (
                        <Link href="/products"
                          className="text-[11px] text-green-700 font-semibold hover:underline">
                          {t.productCount(brandProducts.length)}
                        </Link>
                      )}
                    </div>

                    {/* Highlight */}
                    <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-green-700 font-semibold">{brand.highlight[locale]}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-text-secondary leading-relaxed">{brand.desc[locale]}</p>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-1.5">
                      {brand.certifications.map((cert) => (
                        <span key={cert}
                          className="text-[10px] font-semibold border border-olive-border/40 rounded-md px-2 py-0.5 text-green-800 bg-[#FAFAF5]">
                          {cert}
                        </span>
                      ))}
                    </div>

                    {/* Expand toggle */}
                    <button onClick={() => setExpanded(isExpanded ? null : brand.id)}
                      className="w-full text-xs font-semibold text-green-700 border border-green-700/30 rounded-xl py-2 hover:bg-green-50 transition-colors">
                      {isExpanded ? t.closeLabel : t.whyChoose}
                    </button>

                    {/* Expanded: "Why we chose" */}
                    {isExpanded && (
                      <div className="border-t border-olive-border/30 pt-3 mt-1">
                        <h4 className="text-xs font-bold text-green-800 mb-2">{t.selectionReason}</h4>
                        <p className="text-xs text-text-secondary leading-relaxed mb-3">{brand.whyChose[locale]}</p>
                        <div className="flex gap-2">
                          <Link href="/products"
                            className="flex-1 text-center text-xs font-semibold bg-green-700 hover:bg-green-800 text-white py-2 rounded-xl transition-colors">
                            {t.viewProducts}
                          </Link>
                          <Link href="/experts"
                            className="flex-1 text-center text-xs font-semibold border border-green-700/40 text-green-700 hover:bg-green-50 py-2 rounded-xl transition-colors">
                            {t.askExpert}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom trust note */}
          <div className="mt-12 bg-green-50 border border-olive-border/30 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-green-800 mb-1">{t.criteriaTitle}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{t.criteriaDesc}</p>
              </div>
              <Link href="/experts"
                className="shrink-0 text-sm font-semibold bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl transition-colors">
                {t.askExperts}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
