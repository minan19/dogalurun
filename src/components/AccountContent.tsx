"use client";

import { useState, useEffect } from "react";
import { useUserProfileStore } from "@/store/userProfileStore";
import { signIn, signUp, signOut } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const accountTranslations = {
  tr: {
    dir: "ltr",
    // Login form
    loginTitle: "Hesabım",
    loginSubtitle: "Hüda-i Şifa ailesine hoş geldiniz.",
    tabLogin: "Giriş Yap",
    tabRegister: "Kayıt Ol",
    labelFullName: "Ad Soyad",
    placeholderFullName: "Adınız Soyadınız",
    labelEmail: "E-posta",
    placeholderEmail: "ornek@email.com",
    labelPassword: "Şifre",
    forgotPassword: "Şifremi Unuttum",
    termsConsent: (terms: string, privacy: string) =>
      `${terms} ve ${privacy} okudum, kabul ediyorum.`,
    termsLink: "Üyelik sözleşmesi",
    privacyLink: "gizlilik politikasını",
    btnLogin: "Giriş Yap",
    btnCreateAccount: "Hesap Oluştur",
    orContinueWith: "veya şununla devam et",
    googleLogin: "Google ile Giriş Yap",
    guestNote: "Üye olmadan alışveriş yapabilirsiniz.",
    guestBtn: "Misafir Olarak Devam",
    // Dashboard
    memberLabel: "Üye",
    memberSinceLabel: "Üye olma:",
    pointsLabel: "puan",
    tiles: {
      orders: "Siparişlerim",
      wishlist: "İstek Listem",
      tracking: "Kargo Takibi",
      addresses: "Adreslerim",
      payment: "Ödeme Yöntemlerim",
      notifications: "Bildirimler",
      reviews: "Değerlendirmelerim",
      quiz: "Sağlık Profilim",
    },
    // Panels
    ordersTitle: "Son Siparişlerim",
    trackOrderBtn: "🚚 Kargoda Takip Et",
    cargoDetailBtn: "Kargo Detayı",
    buyAgainBtn: "Tekrar Satın Al",
    cancelBtn: "İptal Et",
    trackingTitle: "Kargo Takibi",
    trackingSubtitle: "Aktif ve tamamlanan siparişlerinizin kargo durumu",
    deliveredLabel: "✅ Teslim tarihi:",
    estimatedLabel: "📅 Tahmini teslim:",
    queryBtn: (company: string) => `${company} Sorgula →`,
    addressesTitle: "Adreslerim",
    addAddressBtn: "+ Yeni Adres",
    defaultBadge: "Varsayılan",
    editBtn: "Düzenle",
    makeDefaultBtn: "Varsayılan Yap",
    deleteBtn: "Sil",
    paymentTitle: "Ödeme Yöntemlerim",
    addCardBtn: "+ Kart Ekle",
    removeCardBtn: "Kartı Kaldır",
    notificationsTitle: "Bildirim Tercihleri",
    notificationItems: [
      { label: "Sipariş durumu güncellemeleri", sub: "Kargo ve teslim bildirimleri" },
      { label: "İndirim ve kampanyalar", sub: "Özel teklifler ve fırsatlar" },
      { label: "Ürün geri stok bildirimi", sub: "İstek listendeki ürünler gelince" },
      { label: "Sağlık ipuçları bülteni", sub: "Haftada bir uzman içerikleri" },
    ],
    reviewsTitle: "Değerlendirmelerim",
    quizTitle: "Sağlık Profilim",
    quizSubtitle: "Son anketinize göre kişiselleştirilmiş öneriler hazırlanmaktadır.",
    quizLabels: ["Yaş Grubu", "Öncelik", "Aktivite", "Quiz Tarihi"],
    newRecommendationBtn: "Yeni Öneri Al →",
    couponsTitle: "Aktif Kuponlarım",
    couponExpiry: "Son geçerlilik:",
    copyBtn: "Kopyala",
    copiedBtn: "✓ Kopyalandı",
    settingsTitle: "Hesap Ayarları",
    settingsItems: [
      { label: "Ad & E-posta Güncelle", icon: "✏️" },
      { label: "Şifre Değiştir", icon: "🔒" },
      { label: "Telefon Numarası", icon: "📱" },
    ],
    logoutBtn: "Çıkış Yap",
    statusMap: {
      preparing: { label: "Hazırlanıyor", cls: "bg-amber-50 text-amber-700", icon: "⏳" },
      shipped:   { label: "Kargoda",      cls: "bg-blue-50 text-blue-700",   icon: "🚚" },
      delivered: { label: "Teslim Edildi",cls: "bg-green-50 text-green-700", icon: "✅" },
      cancelled: { label: "İptal",        cls: "bg-red-50 text-red-600",     icon: "❌" },
    },
    cargoSteps: ["Sipariş Alındı", "Hazırlandı", "Kargoya Verildi", "Dağıtımda", "Teslim Edildi"],
  },
  en: {
    dir: "ltr",
    loginTitle: "My Account",
    loginSubtitle: "Welcome to the Hüda-i Şifa family.",
    tabLogin: "Sign In",
    tabRegister: "Register",
    labelFullName: "Full Name",
    placeholderFullName: "Your Full Name",
    labelEmail: "Email",
    placeholderEmail: "example@email.com",
    labelPassword: "Password",
    forgotPassword: "Forgot Password",
    termsConsent: (terms: string, privacy: string) =>
      `I have read and accept the ${terms} and ${privacy}.`,
    termsLink: "membership agreement",
    privacyLink: "privacy policy",
    btnLogin: "Sign In",
    btnCreateAccount: "Create Account",
    orContinueWith: "or continue with",
    googleLogin: "Sign in with Google",
    guestNote: "You can shop without registering.",
    guestBtn: "Continue as Guest",
    memberLabel: "Member",
    memberSinceLabel: "Member since:",
    pointsLabel: "points",
    tiles: {
      orders: "My Orders",
      wishlist: "Wishlist",
      tracking: "Track Shipment",
      addresses: "My Addresses",
      payment: "Payment Methods",
      notifications: "Notifications",
      reviews: "My Reviews",
      quiz: "Health Profile",
    },
    ordersTitle: "Recent Orders",
    trackOrderBtn: "🚚 Track Shipment",
    cargoDetailBtn: "Shipment Details",
    buyAgainBtn: "Buy Again",
    cancelBtn: "Cancel",
    trackingTitle: "Shipment Tracking",
    trackingSubtitle: "Shipment status of active and completed orders",
    deliveredLabel: "✅ Delivered on:",
    estimatedLabel: "📅 Estimated delivery:",
    queryBtn: (company: string) => `Track on ${company} →`,
    addressesTitle: "My Addresses",
    addAddressBtn: "+ New Address",
    defaultBadge: "Default",
    editBtn: "Edit",
    makeDefaultBtn: "Set as Default",
    deleteBtn: "Delete",
    paymentTitle: "Payment Methods",
    addCardBtn: "+ Add Card",
    removeCardBtn: "Remove Card",
    notificationsTitle: "Notification Preferences",
    notificationItems: [
      { label: "Order status updates", sub: "Shipping and delivery notifications" },
      { label: "Discounts and campaigns", sub: "Special offers and deals" },
      { label: "Back-in-stock alerts", sub: "When wishlist items are available" },
      { label: "Health tips newsletter", sub: "Expert content once a week" },
    ],
    reviewsTitle: "My Reviews",
    quizTitle: "Health Profile",
    quizSubtitle: "Personalised recommendations based on your last quiz are being prepared.",
    quizLabels: ["Age Group", "Priority", "Activity", "Quiz Date"],
    newRecommendationBtn: "Get New Recommendations →",
    couponsTitle: "Active Coupons",
    couponExpiry: "Expires:",
    copyBtn: "Copy",
    copiedBtn: "✓ Copied",
    settingsTitle: "Account Settings",
    settingsItems: [
      { label: "Update Name & Email", icon: "✏️" },
      { label: "Change Password", icon: "🔒" },
      { label: "Phone Number", icon: "📱" },
    ],
    logoutBtn: "Sign Out",
    statusMap: {
      preparing: { label: "Preparing",  cls: "bg-amber-50 text-amber-700", icon: "⏳" },
      shipped:   { label: "Shipped",    cls: "bg-blue-50 text-blue-700",   icon: "🚚" },
      delivered: { label: "Delivered",  cls: "bg-green-50 text-green-700", icon: "✅" },
      cancelled: { label: "Cancelled",  cls: "bg-red-50 text-red-600",     icon: "❌" },
    },
    cargoSteps: ["Order Placed", "Prepared", "Dispatched", "Out for Delivery", "Delivered"],
  },
  ar: {
    dir: "rtl",
    loginTitle: "حسابي",
    loginSubtitle: "أهلاً بك في عائلة هدايي شيفا.",
    tabLogin: "تسجيل الدخول",
    tabRegister: "إنشاء حساب",
    labelFullName: "الاسم الكامل",
    placeholderFullName: "اسمك الكامل",
    labelEmail: "البريد الإلكتروني",
    placeholderEmail: "example@email.com",
    labelPassword: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور",
    termsConsent: (terms: string, privacy: string) =>
      `لقد قرأت ${terms} و${privacy} وأوافق عليهما.`,
    termsLink: "اتفاقية العضوية",
    privacyLink: "سياسة الخصوصية",
    btnLogin: "تسجيل الدخول",
    btnCreateAccount: "إنشاء حساب",
    orContinueWith: "أو تابع مع",
    googleLogin: "تسجيل الدخول بـ Google",
    guestNote: "يمكنك التسوق دون تسجيل.",
    guestBtn: "المتابعة كضيف",
    memberLabel: "عضو",
    memberSinceLabel: "عضو منذ:",
    pointsLabel: "نقطة",
    tiles: {
      orders: "طلباتي",
      wishlist: "قائمة الأمنيات",
      tracking: "تتبع الشحنة",
      addresses: "عناويني",
      payment: "طرق الدفع",
      notifications: "الإشعارات",
      reviews: "تقييماتي",
      quiz: "ملفي الصحي",
    },
    ordersTitle: "آخر الطلبات",
    trackOrderBtn: "🚚 تتبع الشحنة",
    cargoDetailBtn: "تفاصيل الشحنة",
    buyAgainBtn: "الشراء مجدداً",
    cancelBtn: "إلغاء",
    trackingTitle: "تتبع الشحنة",
    trackingSubtitle: "حالة شحن الطلبات النشطة والمكتملة",
    deliveredLabel: "✅ تاريخ التسليم:",
    estimatedLabel: "📅 التسليم المتوقع:",
    queryBtn: (company: string) => `تتبع عبر ${company} ←`,
    addressesTitle: "عناويني",
    addAddressBtn: "+ عنوان جديد",
    defaultBadge: "افتراضي",
    editBtn: "تعديل",
    makeDefaultBtn: "تعيين افتراضياً",
    deleteBtn: "حذف",
    paymentTitle: "طرق الدفع",
    addCardBtn: "+ إضافة بطاقة",
    removeCardBtn: "إزالة البطاقة",
    notificationsTitle: "تفضيلات الإشعارات",
    notificationItems: [
      { label: "تحديثات حالة الطلب", sub: "إشعارات الشحن والتسليم" },
      { label: "الخصومات والعروض", sub: "العروض والصفقات الخاصة" },
      { label: "تنبيهات توفر المنتج", sub: "عند توفر منتجات من قائمة الأمنيات" },
      { label: "نشرة النصائح الصحية", sub: "محتوى متخصص مرة أسبوعياً" },
    ],
    reviewsTitle: "تقييماتي",
    quizTitle: "ملفي الصحي",
    quizSubtitle: "يجري تحضير توصيات مخصصة بناءً على آخر اختبار أجريته.",
    quizLabels: ["الفئة العمرية", "الأولوية", "النشاط", "تاريخ الاختبار"],
    newRecommendationBtn: "← الحصول على توصيات جديدة",
    couponsTitle: "كوبونات نشطة",
    couponExpiry: "تنتهي في:",
    copyBtn: "نسخ",
    copiedBtn: "✓ تم النسخ",
    settingsTitle: "إعدادات الحساب",
    settingsItems: [
      { label: "تحديث الاسم والبريد الإلكتروني", icon: "✏️" },
      { label: "تغيير كلمة المرور", icon: "🔒" },
      { label: "رقم الهاتف", icon: "📱" },
    ],
    logoutBtn: "تسجيل الخروج",
    statusMap: {
      preparing: { label: "قيد التحضير", cls: "bg-amber-50 text-amber-700", icon: "⏳" },
      shipped:   { label: "في الشحن",    cls: "bg-blue-50 text-blue-700",   icon: "🚚" },
      delivered: { label: "تم التسليم",  cls: "bg-green-50 text-green-700", icon: "✅" },
      cancelled: { label: "ملغى",        cls: "bg-red-50 text-red-600",     icon: "❌" },
    },
    cargoSteps: ["تم الطلب", "جاهز", "تم الإرسال", "في التوصيل", "تم التسليم"],
  },
  ru: {
    dir: "ltr",
    loginTitle: "Мой аккаунт",
    loginSubtitle: "Добро пожаловать в семью Hüda-i Şifa.",
    tabLogin: "Войти",
    tabRegister: "Регистрация",
    labelFullName: "Полное имя",
    placeholderFullName: "Ваше полное имя",
    labelEmail: "Эл. почта",
    placeholderEmail: "example@email.com",
    labelPassword: "Пароль",
    forgotPassword: "Забыли пароль",
    termsConsent: (terms: string, privacy: string) =>
      `Я прочитал(а) и принимаю ${terms} и ${privacy}.`,
    termsLink: "пользовательское соглашение",
    privacyLink: "политику конфиденциальности",
    btnLogin: "Войти",
    btnCreateAccount: "Создать аккаунт",
    orContinueWith: "или продолжить с помощью",
    googleLogin: "Войти через Google",
    guestNote: "Вы можете совершать покупки без регистрации.",
    guestBtn: "Продолжить как гость",
    memberLabel: "Участник",
    memberSinceLabel: "Участник с:",
    pointsLabel: "баллов",
    tiles: {
      orders: "Мои заказы",
      wishlist: "Список желаний",
      tracking: "Отслеживание доставки",
      addresses: "Мои адреса",
      payment: "Способы оплаты",
      notifications: "Уведомления",
      reviews: "Мои отзывы",
      quiz: "Профиль здоровья",
    },
    ordersTitle: "Последние заказы",
    trackOrderBtn: "🚚 Отследить доставку",
    cargoDetailBtn: "Детали доставки",
    buyAgainBtn: "Купить снова",
    cancelBtn: "Отменить",
    trackingTitle: "Отслеживание доставки",
    trackingSubtitle: "Статус доставки активных и завершённых заказов",
    deliveredLabel: "✅ Дата доставки:",
    estimatedLabel: "📅 Ожидаемая доставка:",
    queryBtn: (company: string) => `Отслеживать на ${company} →`,
    addressesTitle: "Мои адреса",
    addAddressBtn: "+ Новый адрес",
    defaultBadge: "По умолчанию",
    editBtn: "Изменить",
    makeDefaultBtn: "Сделать основным",
    deleteBtn: "Удалить",
    paymentTitle: "Способы оплаты",
    addCardBtn: "+ Добавить карту",
    removeCardBtn: "Удалить карту",
    notificationsTitle: "Настройки уведомлений",
    notificationItems: [
      { label: "Обновления статуса заказа", sub: "Уведомления о доставке и получении" },
      { label: "Скидки и акции", sub: "Специальные предложения и акции" },
      { label: "Уведомления о наличии", sub: "Когда товары из списка желаний появятся" },
      { label: "Рассылка советов по здоровью", sub: "Экспертные материалы раз в неделю" },
    ],
    reviewsTitle: "Мои отзывы",
    quizTitle: "Профиль здоровья",
    quizSubtitle: "На основе вашего последнего теста готовятся персональные рекомендации.",
    quizLabels: ["Возрастная группа", "Приоритет", "Активность", "Дата теста"],
    newRecommendationBtn: "Получить новые рекомендации →",
    couponsTitle: "Активные купоны",
    couponExpiry: "Действует до:",
    copyBtn: "Скопировать",
    copiedBtn: "✓ Скопировано",
    settingsTitle: "Настройки аккаунта",
    settingsItems: [
      { label: "Обновить имя и эл. почту", icon: "✏️" },
      { label: "Изменить пароль", icon: "🔒" },
      { label: "Номер телефона", icon: "📱" },
    ],
    logoutBtn: "Выйти",
    statusMap: {
      preparing: { label: "Готовится",   cls: "bg-amber-50 text-amber-700", icon: "⏳" },
      shipped:   { label: "Отправлен",   cls: "bg-blue-50 text-blue-700",   icon: "🚚" },
      delivered: { label: "Доставлен",   cls: "bg-green-50 text-green-700", icon: "✅" },
      cancelled: { label: "Отменён",     cls: "bg-red-50 text-red-600",     icon: "❌" },
    },
    cargoSteps: ["Заказ получен", "Подготовлен", "Передан в доставку", "В пути", "Доставлен"],
  },
} as const;

// --- Mock veri ---
const MOCK_USER = {
  name: "Mustafa İnan",
  email: "mustafa@email.com",
  avatar: "MI",
  memberSince: "Ocak 2025",
  points: 240,
  tier: "Gümüş",
};

const MOCK_ORDERS = [
  {
    id: "HS-2026-10841", date: "20 Mar 2026", items: "Omega-3 x2, D Vitamini x1", total: 834,
    status: "shipped",
    cargo: { company: "Yurtiçi Kargo", trackingNo: "1234567890", eta: "21 Mar 2026",
      trackingUrl: "https://www.yurticikargo.com/tr/online-islemler/gonderi-sorgula?code=1234567890",
      currentStep: 3 },
  },
  {
    id: "HS-2026-10829", date: "8 Mar 2026", items: "Probiyotik 50M", total: 399,
    status: "delivered",
    cargo: { company: "Aras Kargo", trackingNo: "9876543210", eta: "10 Mar 2026",
      trackingUrl: "https://www.araskargo.com.tr/aracsorgulama/kargo-sorgulama.aspx",
      currentStep: 5 },
  },
  {
    id: "HS-2026-10801", date: "22 Şub 2026", items: "Magnezyum B6, B-12", total: 468,
    status: "delivered",
    cargo: { company: "MNG Kargo", trackingNo: "5432109876", eta: "25 Şub 2026",
      trackingUrl: "https://www.mngkargo.com.tr/wps/portal/mng/main/musteri/gonderi-sorgulama",
      currentStep: 5 },
  },
  {
    id: "HS-2026-10795", date: "15 Şub 2026", items: "C Vitamini 1000mg x3", total: 297,
    status: "preparing",
    cargo: null,
  },
];

const MOCK_COUPONS = [
  { code: "HISIFA10", desc: "%10 indirim — tüm ürünler", expires: "15 Nis 2026", color: "bg-green-50 border-green-200 text-green-700" },
  { code: "YENI20",   desc: "%20 — ilk sipariş",         expires: "31 Mar 2026", color: "bg-amber-50 border-amber-200 text-amber-700" },
];

const MOCK_ADDRESSES = [
  { label: "Ev", full: "Çankaya Mah. Atatürk Cad. No:45 D:3, Ankara", default: true },
  { label: "İş", full: "Kızılay, Atatürk Blv. No:12, Ankara",         default: false },
];

const tierColors: Record<string, string> = {
  Bronz: "text-amber-700 bg-amber-50 border-amber-200",
  Gümüş: "text-slate-600 bg-slate-100 border-slate-200",
  Altın:  "text-yellow-700 bg-yellow-50 border-yellow-200",
};

type Panel = "orders" | "tracking" | "payment" | "notifications" | "reviews" | "quiz" | null;
type T = typeof accountTranslations.tr;

// ─── Giriş Formu ─────────────────────────────────────────────────────────────
function LoginForm({ onLogin, t }: { onLogin: (email: string, name: string) => void; t: T }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12" dir={t.dir}>
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-[#EAF0DC] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#556B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#2F3B1A] mb-1">{t.loginTitle}</h1>
        <p className="text-sm text-[#5A5E52]">{t.loginSubtitle}</p>
      </div>

      {/* Tab */}
      <div className="bg-[#EAF0DC] rounded-2xl p-1 flex mb-6">
        {(["login", "register"] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === tabKey ? "bg-white text-[#2F3B1A] shadow-sm" : "text-[#5A5E52]"
            }`}
          >
            {tabKey === "login" ? t.tabLogin : t.tabRegister}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#d8e4c8] p-6 mb-4">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#2F3B1A] block mb-1.5">{t.labelFullName}</label>
            <input type="text" placeholder={t.placeholderFullName} value={nameInput} onChange={(e) => setNameInput(e.target.value)}
              className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#2F3B1A] block mb-1.5">{t.labelEmail}</label>
            <input type="email" placeholder={t.placeholderEmail} value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#2F3B1A]">{t.labelPassword}</label>
              {tab === "login" && (
                <button className="text-xs text-[#556B2F] hover:underline">{t.forgotPassword}</button>
              )}
            </div>
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="••••••••"
                value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5] pr-10" />
              <button onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5E52]/50 hover:text-[#5A5E52]">
                {showPw
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                }
              </button>
            </div>
          </div>
          {tab === "register" && (<label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-[#556B2F]" />
              <span className="text-xs text-[#5A5E52] leading-relaxed">
                <span className="text-[#2F3B1A] font-medium">{t.termsLink}</span>{" "}
                {t.termsConsent("", "").split(t.termsLink).join("").split(t.privacyLink).join("")}
                <span className="text-[#2F3B1A] font-medium">{t.privacyLink}</span>
              </span>
            </label>
          )}
          {authError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {authError}
            </p>
          )}
          <button
            onClick={async () => {
              setAuthError("");
              setLoading(true);
              if (tab === "login") {
                const { data, error } = await signIn(emailInput, passwordInput);
                if (error) {
                  setAuthError("E-posta veya şifre hatalı.");
                } else if (data.user) {
                  const displayName =
                    (data.user.user_metadata?.display_name as string | undefined) ||
                    emailInput.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                  onLogin(data.user.email ?? emailInput, displayName);
                }
              } else {
                if (!nameInput.trim()) {
                  setAuthError("Lütfen adınızı girin.");
                  setLoading(false);
                  return;
                }
                const { data, error } = await signUp(emailInput, passwordInput, nameInput.trim());
                if (error) {
                  setAuthError(error.message);
                } else if (data.user) {
                  // Auto-login after sign up (email confirmation may be required)
                  const { data: signInData, error: signInErr } = await signIn(emailInput, passwordInput);
                  if (!signInErr && signInData.user) {
                    onLogin(signInData.user.email ?? emailInput, nameInput.trim());
                  } else {
                    setAuthError("Hesabınız oluşturuldu. Lütfen e-postanızı doğrulayın ve giriş yapın.");
                  }
                }
              }
              setLoading(false);
            }}
            disabled={loading}
            className="w-full bg-[#556B2F] hover:bg-[#2F3B1A] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors mt-1">
            {loading ? "Lütfen bekleyin…" : tab === "login" ? t.btnLogin : t.btnCreateAccount}
          </button>
        </div>

        {/* Social login */}
        <div className="mt-5 pt-4 border-t border-[#d8e4c8] flex flex-col gap-3">
          <p className="text-xs text-center text-[#5A5E52]/60">{t.orContinueWith}</p>
          <button className="w-full flex items-center justify-center gap-2.5 border border-[#d8e4c8] rounded-xl py-2.5 text-sm font-medium text-[#5A5E52] hover:bg-[#EAF0DC] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t.googleLogin}
          </button>
        </div>
      </div>

      {/* Misafir */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] p-4 text-center">
        <p className="text-xs text-[#5A5E52] mb-2.5">{t.guestNote}</p>
        <Link href="/products"
          className="block w-full border border-[#556B2F]/40 text-[#556B2F] hover:bg-[#EAF0DC] font-semibold py-2.5 rounded-xl text-sm transition-colors">
          {t.guestBtn}
        </Link>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const EMPTY_ADDR = { label: "", name: "", surname: "", phone: "", email: "", city: "", district: "", address: "", invoiceType: "individual" as "individual" | "corporate", companyName: "", taxId: "" };

function Dashboard({ onLogout, t }: { onLogout: () => void; t: T }) {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [settingsPanel, setSettingsPanel] = useState<"profile" | "password" | "phone" | null>(null);
  const { displayName, email, phone, updateProfile, savedAddresses, defaultAddressId, addAddress, removeAddress, setDefaultAddress, updateAddress } = useUserProfileStore();

  // Address form state
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null); // null = new
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrSaved, setAddrSaved] = useState(false);

  function openNewAddr() { setAddrForm(EMPTY_ADDR); setEditingAddrId(null); setShowAddrForm(true); setAddrSaved(false); }

  function openEditAddr(id: string) {
    const a = savedAddresses.find((x) => x.id === id);
    if (!a) return;
    setAddrForm({ label: a.label, name: a.name, surname: a.surname, phone: a.phone, email: a.email, city: a.city, district: a.district, address: a.address, invoiceType: a.invoiceType as "individual" | "corporate", companyName: a.companyName ?? "", taxId: a.taxId ?? "" });
    setEditingAddrId(id); setShowAddrForm(true); setAddrSaved(false);
  }
  function saveAddr() {
    if (!addrForm.name || !addrForm.city || !addrForm.address) return;
    if (editingAddrId) {
      updateAddress(editingAddrId, { ...addrForm, label: addrForm.label || addrForm.city });
    } else {
      const id = addAddress({ ...addrForm, label: addrForm.label || addrForm.city });
      setDefaultAddress(id);
    }
    setAddrSaved(true);
    setTimeout(() => { setShowAddrForm(false); setAddrSaved(false); }, 900);
  }

  // Settings form state
  const [profileForm, setProfileForm] = useState({ name: displayName, email });
  const [phoneForm, setPhoneForm] = useState({ phone });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [settingsSaved, setSettingsSaved] = useState(false);

  function handleProfileSave() {
    updateProfile({ displayName: profileForm.name, email: profileForm.email });
    setSettingsSaved(true);
    setTimeout(() => { setSettingsSaved(false); setSettingsPanel(null); }, 1200);
  }
  function handlePhoneSave() {
    updateProfile({ phone: phoneForm.phone });
    setSettingsSaved(true);
    setTimeout(() => { setSettingsSaved(false); setSettingsPanel(null); }, 1200);
  }
  function handlePwSave() {
    if (pwForm.next && pwForm.next === pwForm.confirm) {
      setSettingsSaved(true);
      setTimeout(() => { setSettingsSaved(false); setSettingsPanel(null); setPwForm({ current: "", next: "", confirm: "" }); }, 1200);
    }
  }

  function toggleSettings(key: "profile" | "password" | "phone") {
    setSettingsPanel(settingsPanel === key ? null : key);
    setSettingsSaved(false);
    if (key === "profile") setProfileForm({ name: displayName, email });
    if (key === "phone") setPhoneForm({ phone });
    if (key === "password") setPwForm({ current: "", next: "", confirm: "" });
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const tiles = [
    { id: "orders",        icon: "📦", label: t.tiles.orders,        badge: MOCK_ORDERS.length,    href: null },
    { id: "wishlist",      icon: "❤️", label: t.tiles.wishlist,       badge: 3,                     href: "/wishlist" },
    { id: "tracking",      icon: "🚚", label: t.tiles.tracking,       badge: MOCK_ORDERS.filter(o => o.status === "shipped").length, href: null },
    { id: "addresses",     icon: "📍", label: t.tiles.addresses,      badge: savedAddresses.length, href: "/account#addresses" },
    { id: "payment",       icon: "💳", label: t.tiles.payment,        badge: null,                  href: null },
    { id: "notifications", icon: "🔔", label: t.tiles.notifications,  badge: null,                  href: null },
    { id: "reviews",       icon: "⭐", label: t.tiles.reviews,        badge: 2,                     href: null },
    { id: "quiz",          icon: "🌿", label: t.tiles.quiz,           badge: null,                  href: null },
  ] as const;

  const quizValues = ["25–34", "Enerji & Bağışıklık", "Orta", "10 Mar 2026"];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10" dir={t.dir}>
      {/* Profil başlığı */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#556B2F] flex items-center justify-center text-white text-lg font-bold shrink-0">
          {displayName ? displayName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() : (email[0] ?? "U").toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-[#2F3B1A]">{displayName || MOCK_USER.name}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierColors[MOCK_USER.tier]}`}>
              {MOCK_USER.tier} {t.memberLabel}
            </span>
          </div>
          <p className="text-xs text-[#5A5E52] mt-0.5">{email || MOCK_USER.email}</p>
          <p className="text-xs text-[#5A5E52]">{t.memberSinceLabel} {MOCK_USER.memberSince}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-[#556B2F]">{MOCK_USER.points}</p>
          <p className="text-[10px] text-[#5A5E52]">{t.pointsLabel}</p>
        </div>
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {tiles.map((tile) => {
          const content = (
            <div className={`relative bg-white rounded-2xl border p-4 hover:border-[#556B2F]/40 hover:shadow-sm transition-all cursor-pointer text-left ${
              activePanel === tile.id ? "border-[#556B2F] bg-[#EAF0DC]/40" : "border-[#d8e4c8]"
            }`}>
              {tile.badge != null && tile.badge > 0 && (
                <span className="absolute top-2.5 right-2.5 bg-[#556B2F] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {tile.badge}
                </span>
              )}
              <span className="text-2xl mb-2 block">{tile.icon}</span>
              <span className="text-xs font-semibold text-[#2F3B1A] leading-tight">{tile.label}</span>
            </div>
          );

          if (tile.href) {
            return <Link key={tile.label} href={tile.href}>{content}</Link>;
          }
          return (
            <button key={tile.label} onClick={() => setActivePanel(activePanel === tile.id ? null : (tile.id as Panel))}>
              {content}
            </button>
          );
        })}
      </div>

      {/* Panel: Orders */}
      {activePanel === "orders" && (
        <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
          <h3 className="text-sm font-bold text-[#2F3B1A] mb-4">{t.ordersTitle}</h3>
          <div className="flex flex-col divide-y divide-[#d8e4c8]">
            {MOCK_ORDERS.map((o) => {
              const st = t.statusMap[o.status as keyof typeof t.statusMap];
              return (
                <div key={o.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-[#2F3B1A]">{o.id}</p>
                      <p className="text-[11px] text-[#5A5E52] mt-0.5">{o.date} • {o.items}</p>
                      {o.cargo && (
                        <p className="text-[11px] text-[#5A5E52] mt-0.5">
                          {o.cargo.company} • <span className="font-mono font-semibold">{o.cargo.trackingNo}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#556B2F]">{o.total.toLocaleString("tr-TR")}₺</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.cls}`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {o.cargo && o.status === "shipped" && (
                      <a href={o.cargo.trackingUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                        {t.trackOrderBtn}
                      </a>
                    )}
                    {o.cargo && o.status === "delivered" && (
                      <a href={o.cargo.trackingUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] text-[#5A5E52] hover:underline">
                        {t.cargoDetailBtn}
                      </a>
                    )}
                    {o.status === "delivered" && (
                      <button className="text-[11px] text-[#556B2F] font-semibold hover:underline">
                        {t.buyAgainBtn}
                      </button>
                    )}
                    {o.status === "preparing" && (
                      <button className="text-[11px] text-red-500 hover:underline">{t.cancelBtn}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Panel: Tracking */}
      {activePanel === "tracking" && (
        <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
          <h3 className="text-sm font-bold text-[#2F3B1A] mb-1">{t.trackingTitle}</h3>
          <p className="text-[11px] text-[#5A5E52] mb-4">{t.trackingSubtitle}</p>
          <div className="flex flex-col gap-4">
            {MOCK_ORDERS.filter(o => o.cargo).map((o) => {
              const c = o.cargo!;
              const steps = t.cargoSteps;
              const current = c.currentStep;
              const st = t.statusMap[o.status as keyof typeof t.statusMap];
              return (
                <div key={o.id} className={`rounded-xl border p-4 ${o.status === "shipped" ? "border-blue-200 bg-blue-50/40" : "border-[#d8e4c8]"}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs font-bold text-[#2F3B1A]">{o.id}</p>
                      <p className="text-[11px] text-[#5A5E52]">{o.items}</p>
                      <p className="text-[11px] text-[#5A5E52] mt-0.5">
                        {c.company} · <span className="font-mono font-semibold">{c.trackingNo}</span>
                      </p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border shrink-0 ${st.cls}`}>
                      {st.icon} {st.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative mb-3">
                    <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-gray-200 mx-5" />
                    <div
                      className="absolute top-2.5 left-5 h-0.5 bg-[#556B2F] transition-all"
                      style={{ width: `calc(${((current - 1) / (steps.length - 1)) * 100}% - 10px)` }}
                    />
                    <div className="relative flex justify-between">
                      {steps.map((step, i) => {
                        const done = i + 1 <= current;
                        const active = i + 1 === current;
                        return (
                          <div key={step} className="flex flex-col items-center gap-1" style={{ width: `${100 / steps.length}%` }}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              done ? "bg-[#556B2F] border-[#556B2F]" : "bg-white border-gray-300"
                            } ${active ? "ring-2 ring-[#556B2F]/30" : ""}`}>
                              {done && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-[9px] text-center leading-tight ${done ? "text-[#556B2F] font-semibold" : "text-gray-400"}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] text-[#5A5E52]">
                      {o.status === "delivered" ? t.deliveredLabel : t.estimatedLabel}{" "}
                      <span className="font-semibold text-[#2F3B1A]">{c.eta}</span>
                    </p>
                    <a href={c.trackingUrl} target="_blank" rel="noopener noreferrer"
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        o.status === "shipped"
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "border-[#d8e4c8] text-[#556B2F] hover:bg-[#EAF0DC]"
                      }`}>
                      {t.queryBtn(c.company)}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Panel: Payment */}
      {activePanel === "payment" && (
        <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#2F3B1A]">{t.paymentTitle}</h3>
            <button className="text-xs text-[#556B2F] font-semibold hover:underline">{t.addCardBtn}</button>
          </div>
          <div className="bg-gradient-to-br from-[#2F3B1A] to-[#556B2F] rounded-2xl p-4 text-white mb-3">
            <p className="text-[10px] opacity-60 mb-3">MASTERCARD</p>
            <p className="text-sm font-mono tracking-widest">•••• •••• •••• 4242</p>
            <div className="flex justify-between items-end mt-3">
              <p className="text-xs opacity-70">{MOCK_USER.name}</p>
              <p className="text-xs opacity-70">12/27</p>
            </div>
          </div>
          <button className="text-[11px] text-red-500 hover:underline">{t.removeCardBtn}</button>
        </div>
      )}

      {/* Panel: Notifications */}
      {activePanel === "notifications" && (
        <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
          <h3 className="text-sm font-bold text-[#2F3B1A] mb-4">{t.notificationsTitle}</h3>
          {t.notificationItems.map((n, idx) => (
            <label key={n.label} className="flex items-start gap-3 py-3 border-b border-[#d8e4c8] last:border-0 cursor-pointer">
              <div className="pt-0.5">
                <input type="checkbox" defaultChecked={idx < 2} className="w-4 h-4 accent-[#556B2F]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2F3B1A]">{n.label}</p>
                <p className="text-[11px] text-[#5A5E52]">{n.sub}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Panel: Reviews */}
      {activePanel === "reviews" && (
        <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
          <h3 className="text-sm font-bold text-[#2F3B1A] mb-4">{t.reviewsTitle}</h3>
          {[
            { product: "Omega-3 Balık Yağı 1000mg", rating: 5, comment: "Gerçekten kaliteli, tavsiye ederim.", date: "15 Mar 2026" },
            { product: "Magnezyum B6",               rating: 4, comment: "Uyku düzenim çok iyileşti.",         date: "1 Mar 2026"  },
          ].map((r) => (
            <div key={r.product} className="py-3 border-b border-[#d8e4c8] last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-[#2F3B1A]">{r.product}</p>
                <span className="text-[10px] text-[#5A5E52]">{r.date}</span>
              </div>
              <div className="flex gap-0.5 mb-1.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-sm ${s <= r.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <p className="text-xs text-[#5A5E52]">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Panel: Health Quiz */}
      {activePanel === "quiz" && (
        <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
          <h3 className="text-sm font-bold text-[#2F3B1A] mb-1">{t.quizTitle}</h3>
          <p className="text-xs text-[#5A5E52] mb-4">{t.quizSubtitle}</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {t.quizLabels.map((label, i) => (
              <div key={label} className="bg-[#EAF0DC]/50 rounded-xl p-3">
                <p className="text-[10px] text-[#5A5E52]">{label}</p>
                <p className="text-xs font-bold text-[#2F3B1A]">{quizValues[i]}</p>
              </div>
            ))}
          </div>
          <Link href="/recommendations"
            className="block w-full text-center bg-[#556B2F] hover:bg-[#2F3B1A] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
            {t.newRecommendationBtn}
          </Link>
        </div>
      )}

      {/* ─── Adreslerim (her zaman görünür) ─── */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#2F3B1A]">📍 {t.addressesTitle}</h3>
          {!showAddrForm && (
            <button onClick={openNewAddr} className="text-xs text-[#556B2F] font-semibold hover:underline">{t.addAddressBtn}</button>
          )}
        </div>

        {/* Adres listesi */}
        {!showAddrForm && (
          <div className="flex flex-col gap-3">
            {savedAddresses.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-[#5A5E52] mb-3">Henüz kayıtlı adresiniz yok.</p>
                <button onClick={openNewAddr}
                  className="bg-[#556B2F] hover:bg-[#2F3B1A] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  + İlk Adresimi Ekle
                </button>
              </div>
            )}
            {savedAddresses.map((a) => {
              const isDefault = a.id === defaultAddressId || (!defaultAddressId && savedAddresses[0]?.id === a.id);
              return (
                <div key={a.id} className={`rounded-xl border p-3 ${isDefault ? "border-[#556B2F]/40 bg-[#EAF0DC]/30" : "border-[#d8e4c8]"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#2F3B1A]">{a.label || a.city}</span>
                    {isDefault && <span className="text-[10px] bg-[#556B2F] text-white px-2 py-0.5 rounded-full">{t.defaultBadge}</span>}
                  </div>
                  <p className="text-xs text-[#5A5E52]">{a.name} {a.surname} • {a.phone}</p>
                  <p className="text-xs text-[#5A5E52]">{a.address}, {a.district}/{a.city}</p>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => openEditAddr(a.id)} className="text-[11px] text-[#556B2F] hover:underline font-medium">{t.editBtn}</button>
                    {!isDefault && <button onClick={() => setDefaultAddress(a.id)} className="text-[11px] text-[#5A5E52] hover:underline">{t.makeDefaultBtn}</button>}
                    {savedAddresses.length > 1 && <button onClick={() => removeAddress(a.id)} className="text-[11px] text-red-500 hover:underline">{t.deleteBtn}</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Yeni adres / düzenleme formu */}
        {showAddrForm && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {([
                { k: "label",    label: "Adres Etiketi",  placeholder: "Ev, İş, Yazlık…", col: 2 },
                { k: "name",     label: "Ad",             placeholder: "Adınız",          col: 1 },
                { k: "surname",  label: "Soyad",          placeholder: "Soyadınız",        col: 1 },
                { k: "phone",    label: "Telefon",        placeholder: "05XX XXX XX XX",   col: 1 },
                { k: "email",    label: "E-posta",        placeholder: "ornek@mail.com",   col: 1 },
                { k: "city",     label: "İl",             placeholder: "İstanbul",         col: 1 },
                { k: "district", label: "İlçe",           placeholder: "Kadıköy",          col: 1 },
              ] as { k: string; label: string; placeholder: string; col: 1 | 2 }[]).map(({ k, label, placeholder, col }) => (
                <div key={k} className={col === 2 ? "col-span-2" : ""}>
                  <label className="text-xs font-semibold text-[#2F3B1A] block mb-1">{label}</label>
                  <input
                    value={(addrForm as Record<string, string>)[k]}
                    onChange={(e) => setAddrForm((f) => ({ ...f, [k]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs font-semibold text-[#2F3B1A] block mb-1">Adres</label>
                <textarea
                  value={addrForm.address}
                  onChange={(e) => setAddrForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Mahalle, sokak, bina no, daire no…"
                  rows={2}
                  className="w-full border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveAddr}
                disabled={!addrForm.name || !addrForm.city || !addrForm.address}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 ${addrSaved ? "bg-green-600 text-white" : "bg-[#556B2F] hover:bg-[#2F3B1A] text-white"}`}>
                {addrSaved ? "✓ Kaydedildi" : editingAddrId ? "Güncelle" : "Kaydet"}
              </button>
              {savedAddresses.length > 0 && (
                <button onClick={() => setShowAddrForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#d8e4c8] text-[#5A5E52] hover:bg-[#F4F6F3] transition-colors">
                  İptal
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Coupons */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5 mb-6">
        <h3 className="text-sm font-bold text-[#2F3B1A] mb-3">{t.couponsTitle}</h3>
        <div className="flex flex-col gap-2">
          {MOCK_COUPONS.map((c) => (
            <div key={c.code} className={`flex items-center justify-between rounded-xl border p-3 ${c.color}`}>
              <div>
                <p className="text-xs font-bold font-mono">{c.code}</p>
                <p className="text-[11px]">{c.desc}</p>
                <p className="text-[10px] opacity-70">{t.couponExpiry} {c.expires}</p>
              </div>
              <button onClick={() => copyCode(c.code)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white transition-colors shrink-0">
                {copied === c.code ? t.copiedBtn : t.copyBtn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account settings */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] p-5">
        <h3 className="text-sm font-bold text-[#2F3B1A] mb-3">{t.settingsTitle}</h3>
        <div className="flex flex-col divide-y divide-[#d8e4c8]">

          {/* Ad & E-posta */}
          <div>
            <button onClick={() => toggleSettings("profile")}
              className="w-full flex items-center gap-3 py-3 text-left hover:text-[#556B2F] transition-colors">
              <span className="text-base">✏️</span>
              <span className="text-sm text-[#2F3B1A]">{t.settingsItems[0].label}</span>
              <svg className={`w-4 h-4 text-[#5A5E52]/40 ml-auto transition-transform ${settingsPanel === "profile" ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            {settingsPanel === "profile" && (
              <div className="pb-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2F3B1A] block mb-1">Ad Soyad</label>
                  <input type="text" value={profileForm.name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2F3B1A] block mb-1">E-posta</label>
                  <input type="email" value={profileForm.email}
                    onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]" />
                </div>
                <button onClick={handleProfileSave}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${settingsSaved ? "bg-green-600 text-white" : "bg-[#556B2F] hover:bg-[#2F3B1A] text-white"}`}>
                  {settingsSaved ? "✓ Kaydedildi" : "Kaydet"}
                </button>
              </div>
            )}
          </div>

          {/* Şifre */}
          <div>
            <button onClick={() => toggleSettings("password")}
              className="w-full flex items-center gap-3 py-3 text-left hover:text-[#556B2F] transition-colors">
              <span className="text-base">🔒</span>
              <span className="text-sm text-[#2F3B1A]">{t.settingsItems[1].label}</span>
              <svg className={`w-4 h-4 text-[#5A5E52]/40 ml-auto transition-transform ${settingsPanel === "password" ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            {settingsPanel === "password" && (
              <div className="pb-4 flex flex-col gap-3">
                {(["current", "next", "confirm"] as const).map((key, i) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-[#2F3B1A] block mb-1">
                      {["Mevcut Şifre", "Yeni Şifre", "Yeni Şifre (tekrar)"][i]}
                    </label>
                    <input type="password" value={pwForm[key]}
                      onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]" />
                  </div>
                ))}
                {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                  <p className="text-xs text-red-500">Şifreler eşleşmiyor.</p>
                )}
                <button onClick={handlePwSave}
                  disabled={!pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 ${settingsSaved ? "bg-green-600 text-white" : "bg-[#556B2F] hover:bg-[#2F3B1A] text-white"}`}>
                  {settingsSaved ? "✓ Kaydedildi" : "Şifreyi Güncelle"}
                </button>
              </div>
            )}
          </div>

          {/* Telefon */}
          <div>
            <button onClick={() => toggleSettings("phone")}
              className="w-full flex items-center gap-3 py-3 text-left hover:text-[#556B2F] transition-colors">
              <span className="text-base">📱</span>
              <span className="text-sm text-[#2F3B1A]">{t.settingsItems[2].label}</span>
              {phone && <span className="text-xs text-[#5A5E52] ml-1">{phone}</span>}
              <svg className={`w-4 h-4 text-[#5A5E52]/40 ml-auto transition-transform ${settingsPanel === "phone" ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            {settingsPanel === "phone" && (
              <div className="pb-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2F3B1A] block mb-1">Telefon Numarası</label>
                  <input type="tel" placeholder="0532 000 00 00" value={phoneForm.phone}
                    onChange={(e) => setPhoneForm({ phone: e.target.value })}
                    className="w-full border border-[#d8e4c8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#556B2F]/50 bg-[#FAFAF5]" />
                </div>
                <button onClick={handlePhoneSave}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${settingsSaved ? "bg-green-600 text-white" : "bg-[#556B2F] hover:bg-[#2F3B1A] text-white"}`}>
                  {settingsSaved ? "✓ Kaydedildi" : "Kaydet"}
                </button>
              </div>
            )}
          </div>

        </div>
        <button onClick={onLogout}
          className="mt-4 w-full text-red-500 hover:text-red-700 text-sm font-semibold py-2.5 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
          {t.logoutBtn}
        </button>
      </div>
    </div>
  );
}

// ─── Ana bileşen ──────────────────────────────────────────────────────────────
export function AccountContent() {
  const { isLoggedIn, login, logout } = useUserProfileStore();
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = (accountTranslations[locale] ?? accountTranslations.tr) as T;

  async function handleLogout() {
    await signOut();
    logout();
  }

  return isLoggedIn
    ? <Dashboard onLogout={handleLogout} t={t} />
    : <LoginForm
        onLogin={(email: string, name: string) => {
          login(email, name);
        }}
        t={t}
      />;
}
