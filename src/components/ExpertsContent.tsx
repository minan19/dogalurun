"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const params_locale = () => "tr"; // fallback, overridden in component

const experts = [
  {
    id: "e1",
    initial: "AY",
    name: "Uzm. Dyt. Ayşe Yılmaz",
    role: {
      tr: "Klinik Diyetisyen",
      en: "Clinical Dietitian",
      ar: "اختصاصية تغذية سريرية",
      ru: "Клинический диетолог",
    },
    title: {
      tr: "Uzman Diyetisyen",
      en: "Expert Dietitian",
      ar: "اختصاصية تغذية",
      ru: "Диетолог-эксперт",
    },
    color: "bg-[#556B2F]",
    experience: {
      tr: "12 yıl",
      en: "12 years",
      ar: "12 سنة",
      ru: "12 лет",
    },
    specialty: {
      tr: ["Bağışıklık Sistemi", "Bağırsak Sağlığı", "Kadın Sağlığı"],
      en: ["Immune System", "Gut Health", "Women's Health"],
      ar: ["جهاز المناعة", "صحة الأمعاء", "صحة المرأة"],
      ru: ["Иммунная система", "Здоровье кишечника", "Женское здоровье"],
    },
    credentials: {
      tr: ["Hacettepe Üniv. — Beslenme ve Diyetetik", "Klinik Beslenme Uzmanlığı (ESPEN)", "Fonksiyonel Tıp Sertifikası (IFM)"],
      en: ["Hacettepe Univ. — Nutrition & Dietetics", "Clinical Nutrition Expertise (ESPEN)", "Functional Medicine Certificate (IFM)"],
      ar: ["جامعة هاجيتيبي — التغذية وعلم التغذية", "تخصص التغذية السريرية (ESPEN)", "شهادة الطب الوظيفي (IFM)"],
      ru: ["Университет Hacettepe — Питание и диетология", "Специализация по клиническому питанию (ESPEN)", "Сертификат по функциональной медицине (IFM)"],
    },
    bio: {
      tr: "12 yıllık klinik deneyimiyle bağırsak sağlığı, bağışıklık sistemi optimizasyonu ve kadın sağlığı konularında uzmanlaşmış. 2000'den fazla müşteriye bireysel beslenme programı hazırlamıştır.",
      en: "Specialized in gut health, immune system optimization and women's health with 12 years of clinical experience. Has prepared personalized nutrition programs for over 2000 clients.",
      ar: "متخصصة في صحة الأمعاء وتحسين المناعة وصحة المرأة بخبرة سريرية تمتد لـ 12 عامًا. أعدّت برامج تغذية شخصية لأكثر من 2000 عميل.",
      ru: "Специализируется на здоровье кишечника, оптимизации иммунной системы и женском здоровье с 12-летним клиническим опытом. Разработала индивидуальные программы питания для более чем 2000 клиентов.",
    },
    reviewCount: 248,
    rating: 4.9,
    consultations: 2000,
    publications: 8,
    available: true,
    availabilityNote: {
      tr: "Bugün müsait — 14:00 ve 17:00",
      en: "Available today — 14:00 and 17:00",
      ar: "متاحة اليوم — 14:00 و 17:00",
      ru: "Доступна сегодня — 14:00 и 17:00",
    },
    reviews: [
      { name: "S. Kaya", rating: 5, text: { tr: "Omega-3 seçiminde çok yardımcı oldu, fark yarattı.", en: "Very helpful in choosing Omega-3, made a real difference.", ar: "كانت مساعدتها في اختيار أوميغا-3 رائعة وأحدثت فرقًا.", ru: "Очень помогла с выбором Омега-3, это изменило ситуацию." } },
      { name: "F. Arslan", rating: 5, text: { tr: "Bağırsak protokolü sayesinde sorunlarım büyük ölçüde çözüldü.", en: "My gut issues were largely resolved thanks to the protocol.", ar: "تحسّنت مشاكلي المعوية بشكل كبير بفضل البروتوكول.", ru: "Мои проблемы с кишечником в значительной мере разрешились благодаря протоколу." } },
    ],
  },
  {
    id: "e2",
    initial: "MK",
    name: "Ecz. Mehmet Koç",
    role: {
      tr: "Eczacı & Fitoterapi Uzmanı",
      en: "Pharmacist & Phytotherapy Expert",
      ar: "صيدلاني وخبير العلاج بالنباتات",
      ru: "Фармацевт и эксперт по фитотерапии",
    },
    title: {
      tr: "Eczacı",
      en: "Pharmacist",
      ar: "صيدلاني",
      ru: "Фармацевт",
    },
    color: "bg-blue-700",
    experience: {
      tr: "18 yıl",
      en: "18 years",
      ar: "18 سنة",
      ru: "18 лет",
    },
    specialty: {
      tr: ["İlaç Etkileşimleri", "Bitkisel Tıp", "Spor Takviyesi"],
      en: ["Drug Interactions", "Herbal Medicine", "Sports Supplementation"],
      ar: ["تفاعلات الأدوية", "الطب العشبي", "المكملات الرياضية"],
      ru: ["Лекарственные взаимодействия", "Фитотерапия", "Спортивное питание"],
    },
    credentials: {
      tr: ["Marmara Üniv. — Eczacılık Fakültesi", "Fitoterapi Uzmanlık Eğitimi (ARL)", "Klinik Farmakognozi Sertifikası"],
      en: ["Marmara Univ. — Faculty of Pharmacy", "Phytotherapy Specialty Training (ARL)", "Clinical Pharmacognosy Certificate"],
      ar: ["جامعة مرمرة — كلية الصيدلة", "تدريب تخصص العلاج بالنباتات (ARL)", "شهادة علم الأدوية السريري"],
      ru: ["Университет Marmara — Фармацевтический факультет", "Специализированное обучение фитотерапии (ARL)", "Сертификат по клинической фармакогнозии"],
    },
    bio: {
      tr: "18 yıllık eczacılık tecrübesiyle ilaç-takviye etkileşimleri, bitkisel preparatların klinik kullanımı ve spor performansı konularında uzmanlaşmış.",
      en: "Specialized in drug-supplement interactions, clinical use of herbal preparations and sports performance with 18 years of pharmacy experience.",
      ar: "متخصص في تفاعلات الأدوية والمكملات والاستخدام السريري للمستحضرات العشبية والأداء الرياضي بخبرة صيدلانية تمتد لـ 18 عامًا.",
      ru: "Специализируется на взаимодействии лекарств и добавок, клиническом применении растительных препаратов и спортивной результативности с 18-летним опытом в фармацевтике.",
    },
    reviewCount: 185,
    rating: 4.8,
    consultations: 3500,
    publications: 12,
    available: false,
    availabilityNote: {
      tr: "En yakın müsaitlik: Yarın 10:00",
      en: "Next availability: Tomorrow 10:00",
      ar: "أقرب موعد متاح: غدًا 10:00",
      ru: "Ближайшее время: Завтра 10:00",
    },
    reviews: [
      { name: "T. Demir", rating: 5, text: { tr: "İlaçlarımla takviye etkileşimlerini tek tek açıkladı, çok değerliydi.", en: "He explained drug-supplement interactions one by one, very valuable.", ar: "شرح لي تفاعلات المكملات مع أدويتي واحدة تلو الأخرى، كان ذلك قيّمًا جدًا.", ru: "Объяснил взаимодействия добавок с моими лекарствами одно за другим, очень ценно." } },
      { name: "E. Şahin", rating: 5, text: { tr: "Spor takviyesi konusunda son derece bilgiliydi.", en: "He was extremely knowledgeable about sports supplementation.", ar: "كان على دراية واسعة جدًا بالمكملات الرياضية.", ru: "Он был чрезвычайно осведомлён о спортивном питании." } },
    ],
  },
  {
    id: "e3",
    initial: "ZD",
    name: "Dr. Zeynep Doğan",
    role: {
      tr: "Fonksiyonel Tıp Uzmanı",
      en: "Functional Medicine Specialist",
      ar: "أخصائية الطب الوظيفي",
      ru: "Специалист по функциональной медицине",
    },
    title: {
      tr: "Tıp Doktoru",
      en: "Medical Doctor",
      ar: "طبيبة",
      ru: "Врач",
    },
    color: "bg-purple-700",
    experience: {
      tr: "9 yıl",
      en: "9 years",
      ar: "9 سنوات",
      ru: "9 лет",
    },
    specialty: {
      tr: ["Fonksiyonel Tıp", "Anti-Aging", "Hormonal Denge"],
      en: ["Functional Medicine", "Anti-Aging", "Hormonal Balance"],
      ar: ["الطب الوظيفي", "مكافحة الشيخوخة", "التوازن الهرموني"],
      ru: ["Функциональная медицина", "Антивозрастная терапия", "Гормональный баланс"],
    },
    credentials: {
      tr: ["Ankara Üniv. — Tıp Fakültesi", "Fonksiyonel Tıp (IFM Board Certified)", "Anti-Aging Tıp Uzmanlığı (A4M)"],
      en: ["Ankara Univ. — Faculty of Medicine", "Functional Medicine (IFM Board Certified)", "Anti-Aging Medicine Expertise (A4M)"],
      ar: ["جامعة أنقرة — كلية الطب", "الطب الوظيفي (شهادة مجلس IFM)", "تخصص طب مكافحة الشيخوخة (A4M)"],
      ru: ["Университет Анкары — Медицинский факультет", "Функциональная медицина (IFM Board Certified)", "Специализация по антивозрастной медицине (A4M)"],
    },
    bio: {
      tr: "Konvansiyonel tıbbı fonksiyonel yaklaşımla bütünleştiren, hormonal denge, anti-aging ve kronik hastalık yönetimi konularında uzman.",
      en: "Integrates conventional medicine with a functional approach, specializing in hormonal balance, anti-aging and chronic disease management.",
      ar: "تدمج الطب التقليدي بالنهج الوظيفي، متخصصة في التوازن الهرموني ومكافحة الشيخوخة وإدارة الأمراض المزمنة.",
      ru: "Интегрирует традиционную медицину с функциональным подходом, специализируясь на гормональном балансе, антивозрастной терапии и управлении хроническими заболеваниями.",
    },
    reviewCount: 132,
    rating: 4.9,
    consultations: 1200,
    publications: 5,
    available: true,
    availabilityNote: {
      tr: "Bugün müsait — 16:00",
      en: "Available today — 16:00",
      ar: "متاحة اليوم — 16:00",
      ru: "Доступна сегодня — 16:00",
    },
    reviews: [
      { name: "N. Öztürk", rating: 5, text: { tr: "Hormonal dengesizliğime gerçekten çözüm odaklı yaklaştı.", en: "She approached my hormonal imbalance with a truly solution-focused mindset.", ar: "تعاملت مع اختلالي الهرموني بنهج يركز على الحلول فعلًا.", ru: "Она подошла к моему гормональному дисбалансу с действительно решение-ориентированным подходом." } },
      { name: "A. Çelik", rating: 5, text: { tr: "Takviyelerimi ilaçlarımla uyumlu şekilde düzenledi.", en: "She organized my supplements in harmony with my medications.", ar: "نظّمت مكملاتي بما يتوافق مع أدويتي.", ru: "Она организовала мои добавки в гармонии с моими лекарствами." } },
    ],
  },
];

type LocaleKey = "tr" | "en" | "ar" | "ru";

export function ExpertsContent() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;

  const [openExpert, setOpenExpert] = useState<string | null>(null);
  const [consultModal, setConsultModal] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const ui = {
    tr: {
      badge: "Uzman Danışmanlığı",
      heroTitle: "Uzmanlarımız",
      heroDesc: "Diyetisyen, eczacı ve fonksiyonel tıp uzmanlarından oluşan ekibimiz, ihtiyacınıza özel takviye ve beslenme rehberliği sunar.",
      stats: ["3 Uzman", "5000+ Danışmanlık", "4.9/5 Memnuniyet", "Ücretsiz İlk Görüşme"],
      topicTitle: "Ne için destek arıyorsunuz?",
      topics: ["Ürün seçimi", "İlaç etkileşimi", "Doz önerisi", "Bağışıklık desteği", "Spor & performans", "Hormonal denge", "Bağırsak sağlığı", "Kilo yönetimi"],
      topicSelected: (t: string) => `${t} konusunda yardım almak istiyorsunuz. Aşağıdan bir uzman seçin veya whatsapp üzerinden hemen bağlanın.`,
      whatsappAsk: "WhatsApp Danış",
      experience: "Deneyim",
      consultations: "Danışma",
      publications: "Makale",
      detailBtn: (open: boolean) => open ? "Kapat ▲" : "Profil Detayı & Yorumlar ▼",
      education: "Eğitim & Sertifikalar",
      reviews: "Müşteri Yorumları",
      bookBtn: "Randevu Al",
      whatsapp: "WhatsApp",
      howTitle: "Nasıl Danışmak İstersiniz?",
      howDesc: "Uzmanlarımızla iletişime geçmek için size en uygun yöntemi seçin.",
      consultTypes: [
        { icon: "💬", label: "WhatsApp Danışma", desc: "Hızlı soru & yanıt", time: "15 dak", price: "Ücretsiz" },
        { icon: "📹", label: "Video Görüşme", desc: "Detaylı online randevu", time: "45 dak", price: "₺299" },
        { icon: "📝", label: "Yazılı Program", desc: "Kişisel beslenme planı", time: "2-3 gün", price: "₺499" },
      ],
      startNow: "Hemen Başla",
      book: "Randevu Al",
      modalSelectType: "Randevu tipi seçin:",
      modalBook: "Randevu Oluştur",
      cancel: "İptal",
      dir: "ltr",
    },
    en: {
      badge: "Expert Consultation",
      heroTitle: "Our Experts",
      heroDesc: "Our team of dietitians, pharmacists and functional medicine specialists provides personalized supplement and nutrition guidance.",
      stats: ["3 Experts", "5000+ Consultations", "4.9/5 Satisfaction", "Free First Session"],
      topicTitle: "What do you need support for?",
      topics: ["Product selection", "Drug interactions", "Dosage advice", "Immune support", "Sports & performance", "Hormonal balance", "Gut health", "Weight management"],
      topicSelected: (t: string) => `You want help with ${t}. Choose an expert below or connect via WhatsApp right away.`,
      whatsappAsk: "Ask on WhatsApp",
      experience: "Experience",
      consultations: "Consults",
      publications: "Articles",
      detailBtn: (open: boolean) => open ? "Close ▲" : "Profile & Reviews ▼",
      education: "Education & Certifications",
      reviews: "Client Reviews",
      bookBtn: "Book Appointment",
      whatsapp: "WhatsApp",
      howTitle: "How Would You Like to Consult?",
      howDesc: "Choose the most suitable way to contact our experts.",
      consultTypes: [
        { icon: "💬", label: "WhatsApp Consultation", desc: "Quick Q&A", time: "15 min", price: "Free" },
        { icon: "📹", label: "Video Call", desc: "Detailed online appointment", time: "45 min", price: "₺299" },
        { icon: "📝", label: "Written Plan", desc: "Personal nutrition plan", time: "2-3 days", price: "₺499" },
      ],
      startNow: "Start Now",
      book: "Book Now",
      modalSelectType: "Select appointment type:",
      modalBook: "Create Appointment",
      cancel: "Cancel",
      dir: "ltr",
    },
    ar: {
      badge: "استشارة الخبراء",
      heroTitle: "خبراؤنا",
      heroDesc: "فريقنا من أخصائيي التغذية والصيادلة وأطباء الطب الوظيفي يقدم إرشادات مخصصة في المكملات الغذائية والتغذية.",
      stats: ["3 خبراء", "+5000 استشارة", "4.9/5 رضا", "جلسة أولى مجانية"],
      topicTitle: "ما الذي تحتاج دعمًا فيه؟",
      topics: ["اختيار المنتج", "تفاعلات الدواء", "نصيحة الجرعة", "دعم المناعة", "الرياضة والأداء", "التوازن الهرموني", "صحة الأمعاء", "إدارة الوزن"],
      topicSelected: (t: string) => `تريد مساعدة في ${t}. اختر خبيرًا أدناه أو تواصل عبر واتساب مباشرة.`,
      whatsappAsk: "استشر عبر واتساب",
      experience: "خبرة",
      consultations: "استشارة",
      publications: "مقال",
      detailBtn: (open: boolean) => open ? "إغلاق ▲" : "الملف الشخصي والتقييمات ▼",
      education: "التعليم والشهادات",
      reviews: "تقييمات العملاء",
      bookBtn: "احجز موعدًا",
      whatsapp: "واتساب",
      howTitle: "كيف تريد الاستشارة؟",
      howDesc: "اختر الطريقة الأنسب للتواصل مع خبرائنا.",
      consultTypes: [
        { icon: "💬", label: "استشارة واتساب", desc: "أسئلة وأجوبة سريعة", time: "15 دقيقة", price: "مجاني" },
        { icon: "📹", label: "مكالمة فيديو", desc: "موعد تفصيلي عبر الإنترنت", time: "45 دقيقة", price: "₺299" },
        { icon: "📝", label: "خطة مكتوبة", desc: "خطة تغذية شخصية", time: "2-3 أيام", price: "₺499" },
      ],
      startNow: "ابدأ الآن",
      book: "احجز الآن",
      modalSelectType: "اختر نوع الموعد:",
      modalBook: "إنشاء موعد",
      cancel: "إلغاء",
      dir: "rtl",
    },
    ru: {
      badge: "Консультация экспертов",
      heroTitle: "Наши эксперты",
      heroDesc: "Наша команда диетологов, фармацевтов и специалистов по функциональной медицине предоставляет персонализированные рекомендации по добавкам и питанию.",
      stats: ["3 эксперта", "5000+ консультаций", "4.9/5 удовлетворённость", "Бесплатная первая встреча"],
      topicTitle: "По какому вопросу вам нужна помощь?",
      topics: ["Выбор продукта", "Взаимодействие лекарств", "Советы по дозировке", "Иммунная поддержка", "Спорт и результативность", "Гормональный баланс", "Здоровье кишечника", "Управление весом"],
      topicSelected: (t: string) => `Вы хотите помощи по теме ${t}. Выберите эксперта ниже или свяжитесь через WhatsApp прямо сейчас.`,
      whatsappAsk: "Спросить в WhatsApp",
      experience: "Опыт",
      consultations: "Консультации",
      publications: "Статьи",
      detailBtn: (open: boolean) => open ? "Закрыть ▲" : "Профиль и отзывы ▼",
      education: "Образование и сертификаты",
      reviews: "Отзывы клиентов",
      bookBtn: "Записаться",
      whatsapp: "WhatsApp",
      howTitle: "Как вы хотите проконсультироваться?",
      howDesc: "Выберите наиболее подходящий способ связи с нашими экспертами.",
      consultTypes: [
        { icon: "💬", label: "Консультация WhatsApp", desc: "Быстрые вопросы и ответы", time: "15 мин", price: "Бесплатно" },
        { icon: "📹", label: "Видеозвонок", desc: "Подробная онлайн-запись", time: "45 мин", price: "₺299" },
        { icon: "📝", label: "Письменный план", desc: "Персональный план питания", time: "2-3 дня", price: "₺499" },
      ],
      startNow: "Начать сейчас",
      book: "Записаться",
      modalSelectType: "Выберите тип записи:",
      modalBook: "Создать запись",
      cancel: "Отмена",
      dir: "ltr",
    },
  }[locale] ?? {
    badge: "Uzman Danışmanlığı", heroTitle: "Uzmanlarımız", heroDesc: "", stats: [], topicTitle: "", topics: [],
    topicSelected: (t: string) => t, whatsappAsk: "WhatsApp", experience: "Deneyim", consultations: "Danışma", publications: "Makale",
    detailBtn: (open: boolean) => open ? "Kapat ▲" : "Profil ▼", education: "Eğitim", reviews: "Yorumlar", bookBtn: "Randevu Al", whatsapp: "WhatsApp",
    howTitle: "", howDesc: "", consultTypes: [], startNow: "Başla", book: "Randevu Al", modalSelectType: "", modalBook: "", cancel: "İptal", dir: "ltr",
  };

  const consultTypes = ui.consultTypes;

  return (
    <div dir={ui.dir}>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-[#FAFAF5] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200 mb-4">
              {ui.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 leading-tight">
              {ui.heroTitle}
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {ui.heroDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {ui.stats.map((s) => (
                <span key={s} className="text-xs font-semibold bg-white border border-olive-border/30 text-green-800 px-4 py-2 rounded-full">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Topic picker */}
      <section className="bg-[#EAF0DC]/50 border-y border-olive-border/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-base font-bold text-green-800 mb-4">{ui.topicTitle}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {ui.topics.map((t) => (
              <button key={t} onClick={() => setTopic(topic === t ? null : t)}
                className={`text-sm px-4 py-2 rounded-full border font-medium transition-all ${
                  topic === t
                    ? "bg-green-700 border-green-700 text-white shadow-sm"
                    : "bg-white border-olive-border/40 text-green-800 hover:border-green-700/40"
                }`}>
                {t}
              </button>
            ))}
          </div>
          {topic && (
            <div className="mt-4 bg-white border border-green-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fade-in-up">
              <p className="text-sm text-green-800">
                {ui.topicSelected(topic)}
              </p>
              <a href={`https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(topic)}`}
                target="_blank" rel="noreferrer"
                className="shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {ui.whatsappAsk}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Expert Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert, i) => (
              <div key={expert.id}
                className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all animate-fade-in-up ${
                  openExpert === expert.id ? "border-green-700/40" : "border-olive-border/30"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}>

                <div className={`${expert.color} px-5 pt-6 pb-4`}>
                  <div className="flex items-end justify-between">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{expert.initial}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                      <span className="text-yellow-200 text-sm">★</span>
                      <span className="text-white text-xs font-bold">{expert.rating}</span>
                      <span className="text-white/70 text-[10px]">({expert.reviewCount})</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-white font-bold text-base">{expert.name}</h3>
                    <p className="text-white/80 text-xs mt-0.5">{expert.role[locale]}</p>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${expert.available ? "text-green-700" : "text-amber-600"}`}>
                    <span className={`w-2 h-2 rounded-full ${expert.available ? "bg-green-500" : "bg-amber-400"}`} />
                    {expert.availabilityNote[locale]}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: expert.experience[locale], label: ui.experience },
                      { val: expert.consultations.toLocaleString("tr-TR") + "+", label: ui.consultations },
                      { val: expert.publications + " " + ui.publications, label: ui.publications },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#FAFAF5] rounded-xl p-2 text-center">
                        <p className="text-xs font-bold text-green-800">{s.val}</p>
                        <p className="text-[10px] text-text-secondary">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {expert.specialty[locale].map((s) => (
                      <span key={s} className="text-[10px] bg-green-50 border border-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{expert.bio[locale]}</p>

                  <button onClick={() => setOpenExpert(openExpert === expert.id ? null : expert.id)}
                    className="text-xs font-semibold text-green-700 hover:underline text-left">
                    {ui.detailBtn(openExpert === expert.id)}
                  </button>

                  {openExpert === expert.id && (
                    <div className="border-t border-olive-border/30 pt-3 flex flex-col gap-3 animate-fade-in-up">
                      <div>
                        <p className="text-[10px] font-bold text-green-800 uppercase tracking-wide mb-2">{ui.education}</p>
                        {expert.credentials[locale].map((c) => (
                          <p key={c} className="text-xs text-text-secondary flex items-start gap-1.5 mb-1">
                            <span className="text-green-600 font-bold shrink-0">▸</span>{c}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-green-800 uppercase tracking-wide mb-2">{ui.reviews}</p>
                        {expert.reviews.map((r) => (
                          <div key={r.name} className="bg-[#FAFAF5] rounded-xl p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-green-800">{r.name}</span>
                              <span className="text-amber-400 text-xs">{"★".repeat(r.rating)}</span>
                            </div>
                            <p className="text-xs text-text-secondary leading-snug">{r.text[locale]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setConsultModal(expert.id)}
                      className="flex-1 text-xs font-semibold bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl transition-colors">
                      {ui.bookBtn}
                    </button>
                    <a href="https://wa.me/905XXXXXXXXX" target="_blank" rel="noreferrer"
                      className="flex-1 text-xs font-semibold border border-green-700/40 text-green-700 hover:bg-green-50 py-2.5 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      {ui.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consult type section */}
      <section className="bg-[#EAF0DC]/40 border-t border-olive-border/30 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">{ui.howTitle}</h2>
          <p className="text-text-secondary text-sm mb-8">{ui.howDesc}</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {consultTypes.map((ct) => (
              <div key={ct.label} className="bg-white border border-olive-border/30 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <span className="text-3xl block mb-3">{ct.icon}</span>
                <h3 className="text-sm font-bold text-green-800 mb-1">{ct.label}</h3>
                <p className="text-xs text-text-secondary mb-3">{ct.desc}</p>
                <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                  <span>⏱ {ct.time}</span>
                  <span className={`font-bold ${ct.price === "Ücretsiz" || ct.price === "Free" || ct.price === "مجاني" || ct.price === "Бесплатно" ? "text-green-600" : "text-green-800"}`}>{ct.price}</span>
                </div>
                {ct.icon === "💬" ? (
                  <a href="https://wa.me/905XXXXXXXXX" target="_blank" rel="noreferrer"
                    className="block w-full text-center text-xs font-semibold bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl transition-colors">
                    {ui.startNow}
                  </a>
                ) : (
                  <Link href="/contact"
                    className="block w-full text-center text-xs font-semibold border border-green-700/40 text-green-700 hover:bg-green-50 py-2.5 rounded-xl transition-colors">
                    {ui.book}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consult Modal */}
      {consultModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setConsultModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const expert = experts.find((e) => e.id === consultModal)!;
              return (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 ${expert.color} rounded-full flex items-center justify-center text-white font-bold`}>
                      {expert.initial}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-green-800">{expert.name}</h3>
                      <p className="text-xs text-text-secondary">{expert.role[locale]}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-800 mb-3">{ui.modalSelectType}</p>
                  <div className="flex flex-col gap-2 mb-5">
                    {consultTypes.slice(1).map((ct) => (
                      <label key={ct.label} className="flex items-center justify-between border border-olive-border/40 rounded-xl p-3 cursor-pointer hover:border-green-700/40 hover:bg-green-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{ct.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-green-800">{ct.label}</p>
                            <p className="text-[11px] text-text-secondary">{ct.time}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-green-700">{ct.price}</span>
                      </label>
                    ))}
                  </div>
                  <Link href="/contact"
                    className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                    {ui.modalBook}
                  </Link>
                  <button onClick={() => setConsultModal(null)}
                    className="w-full mt-2 text-xs text-text-secondary hover:underline py-2">
                    {ui.cancel}
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
