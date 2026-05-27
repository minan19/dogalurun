"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useUserProfileStore } from "@/store/userProfileStore";
import { useCouponStore } from "@/store/couponStore";
import { useCampaignStore } from "@/store/campaignStore";
import { useGeoStore } from "@/store/geoStore";
import { getCustomsInfo } from "@/lib/geoData";
import { Link } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";

type PaymentState = "idle" | "loading" | "threeds" | "success" | "error";

type LocaleKey = "tr" | "en" | "ar" | "ru";
type Step = "cart" | "address" | "payment" | "confirm";
type PayMethod = "card" | "transfer" | "cod";

const checkoutTranslations = {
  tr: {
    dir: "ltr",
    emptyCart: "Sepetiniz boş.",
    startShopping: "Alışverişe Başla",
    steps: [
      { key: "cart",    label: "Sepet",   icon: "🛒" },
      { key: "address", label: "Adres",   icon: "📍" },
      { key: "payment", label: "Ödeme",   icon: "💳" },
      { key: "confirm", label: "Onay",    icon: "✅" },
    ],
    cartTitle: "Sepetiniz",
    unitPrice: (p: string) => `${p} ₺ / adet`,
    removeBtn: "Kaldır",
    nextAddress: "Adrese Geç →",
    addressTitle: "Teslimat Adresi",
    fields: [
      { key: "name",     label: "Ad",      type: "text",  placeholder: "Adınız" },
      { key: "surname",  label: "Soyad",   type: "text",  placeholder: "Soyadınız" },
      { key: "phone",    label: "Telefon", type: "tel",   placeholder: "05XX XXX XX XX" },
      { key: "email",    label: "E-posta", type: "email", placeholder: "ornek@mail.com" },
      { key: "city",     label: "İl",      type: "text",  placeholder: "İstanbul" },
      { key: "district", label: "İlçe",    type: "text",  placeholder: "Kadıköy" },
    ],
    addressLabel: "Adres",
    addressPlaceholder: "Mahalle, sokak, bina no, daire no...",
    invoiceType: "Fatura Tipi",
    invoiceIndividual: "Bireysel",
    invoiceCorporate: "Kurumsal / Şirket",
    companyName: "Şirket Adı",
    companyNamePlaceholder: "Şirket Adı",
    taxNo: "Vergi No",
    taxOffice: "Vergi Dairesi",
    taxOfficePlaceholder: "Kadıköy Vergi Dairesi",
    backBtn: "← Geri",
    nextPayment: "Ödemeye Geç →",
    paymentTitle: "Ödeme",
    secureNote: "256-bit SSL ile güvende. Kart bilgileriniz kayıt edilmez.",
    payMethods: [
      { key: "card",     icon: "💳", label: "Kredi / Banka Kartı" },
      { key: "transfer", icon: "🏦", label: "Havale / EFT" },
      { key: "cod",      icon: "📦", label: "Kapıda Ödeme" },
    ],
    cardPreviewLabel: "Kredi Kartı",
    cardHolder: "KART SAHİBİ",
    cardExpiry: "SON KULLANMA",
    cardNumberLabel: "Kart Numarası",
    cardNameLabel: "Kart Üzerindeki Ad",
    cardExpiryLabel: "Son Kullanma",
    installmentLabel: "Taksit Seçeneği",
    installmentOptions: [
      { value: "1", label: "Tek Çekim" },
      { value: "3", label: "3 Taksit" },
      { value: "6", label: "6 Taksit" },
      { value: "9", label: "9 Taksit (Seçili Bankalarda)" },
      { value: "12", label: "12 Taksit (Seçili Bankalarda)" },
    ],
    secureNote3d: "Ödeme tamamlandığında bankanızın 3D Secure doğrulaması istenir.",
    transferTitle: "Havale / EFT Bilgileri",
    accountHolder: "Hesap Sahibi",
    copyIban: "Kopyala",
    transferWarning: "Açıklama / dekont kısmına mutlaka sipariş numaranızı ve adınızı yazınız.",
    transferNote: (email: string) => `Ödemeniz teyit edildikten sonra siparişiniz 1–2 iş günü içinde işleme alınır. Dekontu ${email} adresine göndererek süreci hızlandırabilirsiniz.`,
    codTitle: "Kapıda Ödeme",
    codDetails: [
      "Nakit veya kart ile ödeme (kargo görevlisine)",
      "Ek ücret: +15 ₺ kapıda ödeme hizmet bedeli",
      "Tahmini teslimat: 2–4 iş günü",
    ],
    codNote: "Not: Kapıda ödeme seçeneği yalnızca Türkiye genelinde geçerlidir. Bazı bölgelerde servis sağlanamamaktadır.",
    consentsTitle: "Sözleşmeler ve Onaylar",
    consentPreInfo: (link: string) => `${link}'nu okudum ve onaylıyorum.`,
    consentPreInfoLink: "Ön Bilgilendirme Formu",
    consentDistanceSale: (link: string) => `${link}'ni okudum ve onaylıyorum.`,
    consentDistanceSaleLink: "Mesafeli Satış Sözleşmesi",
    consentKvkk: (link: string) => `${link} kapsamında kişisel verilerimin işlenmesini onaylıyorum.`,
    consentKvkkLink: "KVKK Aydınlatma Metni",
    requiredNote: "* İşaretli onaylar zorunludur.",
    completePayment: "Ödemeyi Tamamla",
    confirmOrder: "Siparişi Onayla",
    placeOrder: "Siparişi Ver",
    confirmTitle: "Siparişiniz Alındı!",
    orderNumber: "Sipariş numaranız:",
    confirmEmail: (email: string) => `${email} adresine onay maili gönderildi.`,
    estimatedDelivery: "Tahmini teslimat: 2–4 iş günü",
    orderPreparing: "Siparişiniz hazırlanıyor, kargo takibiniz SMS ile bildirilecektir.",
    continueShopping: "Alışverişe Devam Et",
    orderSummary: "Sipariş Özeti",
    couponApplied: (code: string) => `🎟 ${code} uygulandı`,
    removeCoupon: "Kaldır",
    couponPlaceholder: "Kupon kodu",
    applyBtn: "Uygula",
    couponError: "Geçersiz kupon kodu.",
    subtotal: "Ara Toplam",
    discount: (code: string) => `İndirim (${code})`,
    shipping: "Kargo",
    freeShipping: "Ücretsiz",
    codFeeLabel: "Kapıda Ödeme Ücreti",
    total: "Toplam",
  },
  en: {
    dir: "ltr",
    emptyCart: "Your cart is empty.",
    startShopping: "Start Shopping",
    steps: [
      { key: "cart",    label: "Cart",    icon: "🛒" },
      { key: "address", label: "Address", icon: "📍" },
      { key: "payment", label: "Payment", icon: "💳" },
      { key: "confirm", label: "Confirm", icon: "✅" },
    ],
    cartTitle: "Your Cart",
    unitPrice: (p: string) => `${p} ₺ / unit`,
    removeBtn: "Remove",
    nextAddress: "Proceed to Address →",
    addressTitle: "Delivery Address",
    fields: [
      { key: "name",     label: "First Name",   type: "text",  placeholder: "Your First Name" },
      { key: "surname",  label: "Last Name",    type: "text",  placeholder: "Your Last Name" },
      { key: "phone",    label: "Phone",        type: "tel",   placeholder: "0850 XXX XX XX" },
      { key: "email",    label: "Email",        type: "email", placeholder: "example@mail.com" },
      { key: "city",     label: "City",         type: "text",  placeholder: "Istanbul" },
      { key: "district", label: "District",     type: "text",  placeholder: "Kadıköy" },
    ],
    addressLabel: "Address",
    addressPlaceholder: "Neighbourhood, street, building no, flat no...",
    invoiceType: "Invoice Type",
    invoiceIndividual: "Individual",
    invoiceCorporate: "Corporate / Company",
    companyName: "Company Name",
    companyNamePlaceholder: "Company Name",
    taxNo: "Tax Number",
    taxOffice: "Tax Office",
    taxOfficePlaceholder: "Tax Office Name",
    backBtn: "← Back",
    nextPayment: "Proceed to Payment →",
    paymentTitle: "Payment",
    secureNote: "Secured with 256-bit SSL. Your card details are not stored.",
    payMethods: [
      { key: "card",     icon: "💳", label: "Credit / Debit Card" },
      { key: "transfer", icon: "🏦", label: "Bank Transfer" },
      { key: "cod",      icon: "📦", label: "Cash on Delivery" },
    ],
    cardPreviewLabel: "Credit Card",
    cardHolder: "CARD HOLDER",
    cardExpiry: "EXPIRY",
    cardNumberLabel: "Card Number",
    cardNameLabel: "Name on Card",
    cardExpiryLabel: "Expiry Date",
    installmentLabel: "Instalment Option",
    installmentOptions: [
      { value: "1", label: "Single Payment" },
      { value: "3", label: "3 Instalments" },
      { value: "6", label: "6 Instalments" },
      { value: "9", label: "9 Instalments (Selected Banks)" },
      { value: "12", label: "12 Instalments (Selected Banks)" },
    ],
    secureNote3d: "Your bank's 3D Secure verification will be requested upon payment.",
    transferTitle: "Bank Transfer Details",
    accountHolder: "Account Holder",
    copyIban: "Copy",
    transferWarning: "Please include your order number and name in the payment description / receipt.",
    transferNote: (email: string) => `Your order will be processed within 1–2 business days after payment is confirmed. You can speed up the process by sending the receipt to ${email}.`,
    codTitle: "Cash on Delivery",
    codDetails: [
      "Payment by cash or card (to the courier)",
      "Additional fee: +15 ₺ cash on delivery service charge",
      "Estimated delivery: 2–4 business days",
    ],
    codNote: "Note: Cash on delivery is only available within Turkey. Service may not be available in some regions.",
    consentsTitle: "Agreements & Consents",
    consentPreInfo: (link: string) => `I have read and accept the ${link}.`,
    consentPreInfoLink: "Pre-Information Form",
    consentDistanceSale: (link: string) => `I have read and accept the ${link}.`,
    consentDistanceSaleLink: "Distance Sales Agreement",
    consentKvkk: (link: string) => `I consent to the processing of my personal data under the ${link}.`,
    consentKvkkLink: "KVKK Disclosure Text",
    requiredNote: "* Marked consents are mandatory.",
    completePayment: "Complete Payment",
    confirmOrder: "Confirm Order",
    placeOrder: "Place Order",
    confirmTitle: "Order Received!",
    orderNumber: "Your order number:",
    confirmEmail: (email: string) => `A confirmation email has been sent to ${email}.`,
    estimatedDelivery: "Estimated delivery: 2–4 business days",
    orderPreparing: "Your order is being prepared; shipment tracking will be sent via SMS.",
    continueShopping: "Continue Shopping",
    orderSummary: "Order Summary",
    couponApplied: (code: string) => `🎟 ${code} applied`,
    removeCoupon: "Remove",
    couponPlaceholder: "Coupon code",
    applyBtn: "Apply",
    couponError: "Invalid coupon code.",
    subtotal: "Subtotal",
    discount: (code: string) => `Discount (${code})`,
    shipping: "Shipping",
    freeShipping: "Free",
    codFeeLabel: "Cash on Delivery Fee",
    total: "Total",
  },
  ar: {
    dir: "rtl",
    emptyCart: "سلّتك فارغة.",
    startShopping: "ابدأ التسوق",
    steps: [
      { key: "cart",    label: "السلّة",  icon: "🛒" },
      { key: "address", label: "العنوان", icon: "📍" },
      { key: "payment", label: "الدفع",   icon: "💳" },
      { key: "confirm", label: "تأكيد",   icon: "✅" },
    ],
    cartTitle: "سلّتك",
    unitPrice: (p: string) => `${p} ₺ / وحدة`,
    removeBtn: "إزالة",
    nextAddress: "← إلى العنوان",
    addressTitle: "عنوان التسليم",
    fields: [
      { key: "name",     label: "الاسم الأول",        type: "text",  placeholder: "اسمك الأول" },
      { key: "surname",  label: "اسم العائلة",         type: "text",  placeholder: "اسم عائلتك" },
      { key: "phone",    label: "الهاتف",              type: "tel",   placeholder: "905XXXXXXXXX" },
      { key: "email",    label: "البريد الإلكتروني",   type: "email", placeholder: "example@mail.com" },
      { key: "city",     label: "المدينة",             type: "text",  placeholder: "إسطنبول" },
      { key: "district", label: "المنطقة",             type: "text",  placeholder: "Kadıköy" },
    ],
    addressLabel: "العنوان",
    addressPlaceholder: "الحي، الشارع، رقم المبنى، رقم الشقة...",
    invoiceType: "نوع الفاتورة",
    invoiceIndividual: "فردي",
    invoiceCorporate: "شركة / مؤسسة",
    companyName: "اسم الشركة",
    companyNamePlaceholder: "اسم الشركة",
    taxNo: "الرقم الضريبي",
    taxOffice: "مكتب الضرائب",
    taxOfficePlaceholder: "اسم مكتب الضرائب",
    backBtn: "رجوع →",
    nextPayment: "← إلى الدفع",
    paymentTitle: "الدفع",
    secureNote: "محمي بـ SSL 256-bit. لا يتم حفظ بيانات بطاقتك.",
    payMethods: [
      { key: "card",     icon: "💳", label: "بطاقة ائتمان / دفع" },
      { key: "transfer", icon: "🏦", label: "تحويل بنكي" },
      { key: "cod",      icon: "📦", label: "الدفع عند الاستلام" },
    ],
    cardPreviewLabel: "بطاقة ائتمان",
    cardHolder: "اسم حامل البطاقة",
    cardExpiry: "تاريخ الانتهاء",
    cardNumberLabel: "رقم البطاقة",
    cardNameLabel: "الاسم على البطاقة",
    cardExpiryLabel: "تاريخ الانتهاء",
    installmentLabel: "خيار التقسيط",
    installmentOptions: [
      { value: "1", label: "دفعة واحدة" },
      { value: "3", label: "3 أقساط" },
      { value: "6", label: "6 أقساط" },
      { value: "9", label: "9 أقساط (بنوك مختارة)" },
      { value: "12", label: "12 قسطاً (بنوك مختارة)" },
    ],
    secureNote3d: "سيُطلب منك التحقق عبر 3D Secure الخاص ببنكك عند إتمام الدفع.",
    transferTitle: "بيانات التحويل البنكي",
    accountHolder: "صاحب الحساب",
    copyIban: "نسخ",
    transferWarning: "يرجى تضمين رقم طلبك واسمك في وصف الدفع / الإيصال.",
    transferNote: (email: string) => `سيتم معالجة طلبك خلال 1–2 يوم عمل بعد تأكيد الدفع. يمكنك تسريع العملية بإرسال الإيصال إلى ${email}.`,
    codTitle: "الدفع عند الاستلام",
    codDetails: [
      "الدفع نقداً أو ببطاقة (للمندوب)",
      "رسوم إضافية: +15 ₺ رسوم خدمة الدفع عند الاستلام",
      "التسليم المتوقع: 2–4 أيام عمل",
    ],
    codNote: "ملاحظة: خيار الدفع عند الاستلام متاح داخل تركيا فقط. قد لا تتوفر الخدمة في بعض المناطق.",
    consentsTitle: "الاتفاقيات والموافقات",
    consentPreInfo: (link: string) => `لقد قرأت ${link} وأوافق عليه.`,
    consentPreInfoLink: "نموذج المعلومات المسبقة",
    consentDistanceSale: (link: string) => `لقد قرأت ${link} وأوافق عليه.`,
    consentDistanceSaleLink: "عقد البيع عن بُعد",
    consentKvkk: (link: string) => `أوافق على معالجة بياناتي الشخصية وفق ${link}.`,
    consentKvkkLink: "نص الإفصاح KVKK",
    requiredNote: "* الموافقات المحددة بعلامة * إلزامية.",
    completePayment: "إتمام الدفع",
    confirmOrder: "تأكيد الطلب",
    placeOrder: "تقديم الطلب",
    confirmTitle: "تم استلام طلبك!",
    orderNumber: "رقم طلبك:",
    confirmEmail: (email: string) => `تم إرسال بريد التأكيد إلى ${email}.`,
    estimatedDelivery: "التسليم المتوقع: 2–4 أيام عمل",
    orderPreparing: "يجري تحضير طلبك، وسيصلك رقم تتبع الشحنة عبر رسالة نصية.",
    continueShopping: "مواصلة التسوق",
    orderSummary: "ملخص الطلب",
    couponApplied: (code: string) => `🎟 تم تطبيق ${code}`,
    removeCoupon: "إزالة",
    couponPlaceholder: "رمز الكوبون",
    applyBtn: "تطبيق",
    couponError: "رمز الكوبون غير صالح.",
    subtotal: "المجموع الفرعي",
    discount: (code: string) => `خصم (${code})`,
    shipping: "الشحن",
    freeShipping: "مجاني",
    codFeeLabel: "رسوم الدفع عند الاستلام",
    total: "الإجمالي",
  },
  ru: {
    dir: "ltr",
    emptyCart: "Ваша корзина пуста.",
    startShopping: "Начать покупки",
    steps: [
      { key: "cart",    label: "Корзина", icon: "🛒" },
      { key: "address", label: "Адрес",   icon: "📍" },
      { key: "payment", label: "Оплата",  icon: "💳" },
      { key: "confirm", label: "Готово",  icon: "✅" },
    ],
    cartTitle: "Ваша корзина",
    unitPrice: (p: string) => `${p} ₺ / шт.`,
    removeBtn: "Удалить",
    nextAddress: "К адресу →",
    addressTitle: "Адрес доставки",
    fields: [
      { key: "name",     label: "Имя",          type: "text",  placeholder: "Ваше имя" },
      { key: "surname",  label: "Фамилия",       type: "text",  placeholder: "Ваша фамилия" },
      { key: "phone",    label: "Телефон",       type: "tel",   placeholder: "0850 XXX XX XX" },
      { key: "email",    label: "Эл. почта",     type: "email", placeholder: "example@mail.com" },
      { key: "city",     label: "Город",         type: "text",  placeholder: "Стамбул" },
      { key: "district", label: "Район",         type: "text",  placeholder: "Kadıköy" },
    ],
    addressLabel: "Адрес",
    addressPlaceholder: "Микрорайон, улица, номер дома, номер квартиры...",
    invoiceType: "Тип счёта-фактуры",
    invoiceIndividual: "Физическое лицо",
    invoiceCorporate: "Юридическое лицо",
    companyName: "Название компании",
    companyNamePlaceholder: "Название компании",
    taxNo: "ИНН",
    taxOffice: "Налоговая инспекция",
    taxOfficePlaceholder: "Название налоговой инспекции",
    backBtn: "← Назад",
    nextPayment: "К оплате →",
    paymentTitle: "Оплата",
    secureNote: "Защищено 256-битным SSL. Данные карты не сохраняются.",
    payMethods: [
      { key: "card",     icon: "💳", label: "Кредитная / дебетовая карта" },
      { key: "transfer", icon: "🏦", label: "Банковский перевод" },
      { key: "cod",      icon: "📦", label: "Оплата при получении" },
    ],
    cardPreviewLabel: "Кредитная карта",
    cardHolder: "ДЕРЖАТЕЛЬ КАРТЫ",
    cardExpiry: "СРОК ДЕЙСТВИЯ",
    cardNumberLabel: "Номер карты",
    cardNameLabel: "Имя на карте",
    cardExpiryLabel: "Срок действия",
    installmentLabel: "Рассрочка",
    installmentOptions: [
      { value: "1", label: "Единовременно" },
      { value: "3", label: "3 платежа" },
      { value: "6", label: "6 платежей" },
      { value: "9", label: "9 платежей (отдельные банки)" },
      { value: "12", label: "12 платежей (отдельные банки)" },
    ],
    secureNote3d: "При оплате будет запрошена верификация 3D Secure вашего банка.",
    transferTitle: "Реквизиты банковского перевода",
    accountHolder: "Владелец счёта",
    copyIban: "Скопировать",
    transferWarning: "Обязательно укажите номер заказа и имя в описании платежа / квитанции.",
    transferNote: (email: string) => `Ваш заказ будет обработан в течение 1–2 рабочих дней после подтверждения оплаты. Вы можете ускорить процесс, отправив квитанцию на ${email}.`,
    codTitle: "Оплата при получении",
    codDetails: [
      "Оплата наличными или картой (курьеру)",
      "Дополнительная плата: +15 ₺ за услугу оплаты при получении",
      "Ожидаемая доставка: 2–4 рабочих дня",
    ],
    codNote: "Примечание: оплата при получении доступна только на территории Турции. В некоторых регионах услуга может быть недоступна.",
    consentsTitle: "Соглашения и согласия",
    consentPreInfo: (link: string) => `Я ознакомился(-ась) с ${link} и принимаю его.`,
    consentPreInfoLink: "Формой предварительного уведомления",
    consentDistanceSale: (link: string) => `Я ознакомился(-ась) с ${link} и принимаю его.`,
    consentDistanceSaleLink: "Договором дистанционной продажи",
    consentKvkk: (link: string) => `Я даю согласие на обработку моих персональных данных в соответствии с ${link}.`,
    consentKvkkLink: "Текстом раскрытия KVKK",
    requiredNote: "* Помеченные согласия обязательны.",
    completePayment: "Завершить оплату",
    confirmOrder: "Подтвердить заказ",
    placeOrder: "Оформить заказ",
    confirmTitle: "Заказ получен!",
    orderNumber: "Номер вашего заказа:",
    confirmEmail: (email: string) => `Письмо с подтверждением отправлено на ${email}.`,
    estimatedDelivery: "Ожидаемая доставка: 2–4 рабочих дня",
    orderPreparing: "Ваш заказ готовится; номер для отслеживания будет отправлен по SMS.",
    continueShopping: "Продолжить покупки",
    orderSummary: "Итог заказа",
    couponApplied: (code: string) => `🎟 ${code} применён`,
    removeCoupon: "Удалить",
    couponPlaceholder: "Код купона",
    applyBtn: "Применить",
    couponError: "Неверный код купона.",
    subtotal: "Промежуточный итог",
    discount: (code: string) => `Скидка (${code})`,
    shipping: "Доставка",
    freeShipping: "Бесплатно",
    codFeeLabel: "Плата за оплату при получении",
    total: "Итого",
  },
} as const;

export function CheckoutForm() {
  const { items, total, updateQty, removeItem, clearCart } = useCartStore();
  const { savedAddresses, defaultAddressId, savedCard, isLoggedIn, email: profileEmail, displayName, phone: profilePhone, saveAddress, saveCard, setDefaultAddress } = useUserProfileStore();
  const savedAddress = savedAddresses.find((a) => a.id === defaultAddressId) ?? savedAddresses[0] ?? null;
  const { validateCoupon, useCoupon } = useCouponStore();
  const { campaigns } = useCampaignStore();
  const { countryCode, zone, getShippingCost, isFreeShipping, formatPrice } = useGeoStore();
  const [step, setStep] = useState<Step>("cart");
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = checkoutTranslations[locale] ?? checkoutTranslations.tr;

  // İyzico 3D Secure state
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [threeDSHtml, setThreeDSHtml] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");

  // Handle redirect back from İyzico callback
  useEffect(() => {
    const payStatus = searchParams?.get("payment");
    const orderId = searchParams?.get("orderId");
    if (payStatus === "success" && orderId) {
      setConfirmedOrderId(orderId);
      setStep("confirm");
    } else if (payStatus === "failed" || payStatus === "error") {
      const errMsg = searchParams?.get("error");
      setPaymentError(errMsg ? decodeURIComponent(errMsg) : "Ödeme başarısız oldu. Lütfen tekrar deneyin.");
      setPaymentState("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [address, setAddress] = useState({
    name: savedAddress?.name ?? "",
    surname: savedAddress?.surname ?? "",
    phone: savedAddress?.phone ?? "",
    email: savedAddress?.email ?? profileEmail ?? "",
    city: savedAddress?.city ?? "",
    district: savedAddress?.district ?? "",
    address: savedAddress?.address ?? "",
    invoiceType: (savedAddress?.invoiceType ?? "individual") as "individual" | "corporate",
    companyName: savedAddress?.companyName ?? "",
    taxNo: savedAddress?.taxId ?? "",
    taxOffice: "",
  });

  const [card, setCard] = useState({
    number: savedCard ? savedCard.number : "",
    name: savedCard ? savedCard.name : "",
    expiry: savedCard ? savedCard.expiry : "",
    cvv: "",
    installment: "1",
  });

  // Zustand persist is async — wait for store to hydrate from localStorage
  const hasPrefilledAddress = useRef(false);
  useEffect(() => {
    if (hasPrefilledAddress.current) return;
    if (savedAddress) {
      hasPrefilledAddress.current = true;
      setAddress({
        name: savedAddress.name,
        surname: savedAddress.surname,
        phone: savedAddress.phone,
        email: savedAddress.email,
        city: savedAddress.city,
        district: savedAddress.district,
        address: savedAddress.address,
        invoiceType: savedAddress.invoiceType,
        companyName: savedAddress.companyName ?? "",
        taxNo: savedAddress.taxId ?? "",
        taxOffice: "",
      });
    } else if (profileEmail || displayName || profilePhone) {
      hasPrefilledAddress.current = true;
      const parts = displayName?.trim().split(/\s+/) ?? [];
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ");
      setAddress((prev) => ({
        ...prev,
        email: prev.email || profileEmail || "",
        name: prev.name || firstName,
        surname: prev.surname || lastName,
        phone: prev.phone || profilePhone || "",
      }));
    }
  }, [savedAddress, profileEmail, displayName, profilePhone]); // re-runs when Zustand hydrates from localStorage

  const hasPrefilledCard = useRef(false);
  useEffect(() => {
    if (hasPrefilledCard.current) return;
    if (savedCard) {
      hasPrefilledCard.current = true;
      setCard((prev) => ({
        ...prev,
        number: savedCard.number,
        name: savedCard.name,
        expiry: savedCard.expiry,
      }));
    }
  }, [savedCard]); // re-runs when Zustand hydrates from localStorage

  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [consents, setConsents] = useState({
    onBilgilendirme: false,
    mesafeliSatis: false,
    kvkk: false,
  });

  // ── Alan validasyon hataları ─────────────────────────────────────────────
  const [addrErrors, setAddrErrors] = useState<Partial<Record<string, string>>>({});

  // Sadece harf + Türkçe karakter + boşluk + tire
  const onlyLetters = (v: string) => v.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s\-]/g, "");
  // Sadece rakam
  const onlyDigits = (v: string, max: number) => v.replace(/\D/g, "").slice(0, max);
  // Uluslararası telefon: + ile başlayabilir, sonrası rakam/boşluk/tire, max 20 karakter
  const formatPhone = (v: string) => v.replace(/[^\d+\s\-()]/g, "").slice(0, 20);

  function handleAddrChange(key: string, raw: string) {
    let val = raw;
    if (key === "name" || key === "surname" || key === "city" || key === "district") {
      val = onlyLetters(raw);
    } else if (key === "phone") {
      val = formatPhone(raw);
    }
    setAddress((p) => ({ ...p, [key]: val }));
    setAddrErrors((e) => ({ ...e, [key]: "" }));
  }

  function validateAddress(): boolean {
    const errs: Record<string, string> = {};
    if (!address.name.trim()) errs.name = "Ad zorunludur.";
    else if (address.name.trim().length < 2) errs.name = "En az 2 karakter giriniz.";
    if (!address.surname.trim()) errs.surname = "Soyad zorunludur.";
    else if (address.surname.trim().length < 2) errs.surname = "En az 2 karakter giriniz.";
    if (!address.phone) errs.phone = "Telefon zorunludur.";
    else if (address.phone.replace(/\D/g, "").length < 7) errs.phone = "Geçerli bir telefon numarası girin.";
    if (!address.email) errs.email = "E-posta zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errs.email = "Geçerli bir e-posta girin.";
    if (!address.city.trim()) errs.city = "İl zorunludur.";
    if (!address.district.trim()) errs.district = "İlçe zorunludur.";
    if (!address.address.trim()) errs.address = "Adres zorunludur.";
    else if (address.address.trim().length < 10) errs.address = "Adres en az 10 karakter olmalıdır.";
    if (address.invoiceType === "corporate") {
      if (!address.companyName.trim()) errs.companyName = "Şirket adı zorunludur.";
      if (!address.taxNo || address.taxNo.length < 10) errs.taxNo = "Vergi numarası 10 haneli olmalıdır.";
    }
    setAddrErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number; type: "pct" | "flat" } | null>(null);
  const [couponError, setCouponError] = useState("");

  function applyCoupon() {
    const result = validateCoupon(couponInput, total(), isLoggedIn ? profileEmail : undefined);
    if (result.valid) {
      setCouponApplied({ code: couponInput.trim().toUpperCase(), discount: result.discount, type: result.type });
      setCouponError("");
      return;
    }

    // Also check admin campaigns that have a couponCode
    const trimmed = couponInput.trim().toUpperCase();
    const now = new Date();
    const campaign = campaigns.find(
      (c) => c.couponCode?.toUpperCase() === trimmed && c.active
    );
    if (campaign) {
      if (new Date(campaign.endDate) < now) {
        setCouponError("Bu kuponun süresi dolmuş.");
        setCouponApplied(null);
        return;
      }
      const cartTotal = total();
      if (campaign.threshold && cartTotal < campaign.threshold) {
        setCouponError(`Bu kupon için minimum sepet tutarı ${campaign.threshold} ₺'dir.`);
        setCouponApplied(null);
        return;
      }
      const type = campaign.type === "fixed" ? "flat" : "pct";
      const discountAmt = type === "pct"
        ? Math.round((cartTotal * campaign.value) / 100)
        : Math.min(campaign.value, cartTotal);
      setCouponApplied({ code: trimmed, discount: discountAmt, type });
      setCouponError("");
      return;
    }

    setCouponError(result.error);
    setCouponApplied(null);
  }

  // validateCoupon already returns the final discount amount — use it directly
  const discountAmount = couponApplied?.discount ?? 0;

  const discountedTotal = total() - discountAmount;
  const shippingCost = isFreeShipping(discountedTotal) ? 0 : getShippingCost(discountedTotal);
  const customsInfo = countryCode !== "TR" ? getCustomsInfo(countryCode) : null;
  const codFee = payMethod === "cod" ? 15 : 0;
  const grandTotal = discountedTotal + shippingCost + codFee;

  function handlePlaceOrder() {
    // Generate a stable order ID
    const orderId = `HS-2026-${Math.floor(Math.random() * 90000) + 10000}`;
    setConfirmedOrderId(orderId);

    // Save address to profile (with label)
    saveAddress({
      label: address.city || "Adresim",
      name: address.name,
      surname: address.surname,
      phone: address.phone,
      email: address.email,
      city: address.city,
      district: address.district,
      address: address.address,
      invoiceType: address.invoiceType,
      companyName: address.companyName,
      taxId: address.taxNo,
    });
    // Save card (without CVV for security)
    if (payMethod === "card" && card.number) {
      saveCard({ number: card.number, name: card.name, expiry: card.expiry });
    }
    // Mark coupon as used
    if (couponApplied) {
      useCoupon(couponApplied.code);
    }

    // Persist order to Supabase (non-blocking)
    const orderPayload = {
      id: orderId,
      customer_name: `${address.name} ${address.surname}`.trim(),
      customer_email: address.email || null,
      customer_phone: address.phone || null,
      items: items.map(({ product, quantity }) => ({ product, quantity })),
      subtotal: total(),
      shipping_cost: shippingCost,
      discount: discountAmount,
      total: grandTotal,
      coupon_code: couponApplied?.code ?? null,
      status: "preparing",
      shipping_address: address,
      zone: zone || "turkey",
      country: address.city ? "TR" : (countryCode || "TR"),
      city: address.city || null,
    };
    fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    }).catch((e) => {
      console.warn("Order save to DB failed:", e);
    });

    // Clear cart
    clearCart();
    setStep("confirm");
  }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    return v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
  }

  const stepLabels = t.steps;
  const stepIndex = stepLabels.findIndex((s) => s.key === step);

  if (items.length === 0 && step !== "confirm") {
    return (
      <div className="text-center py-20" dir={t.dir}>
        <span className="text-5xl">🛒</span>
        <p className="mt-4 text-text-secondary">{t.emptyCart}</p>
        <Link href="/products" className="mt-4 inline-block text-green-700 hover:underline text-sm">
          {t.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir={t.dir}>
      {/* Left: Form */}
      <div className="lg:col-span-2">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {stepLabels.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${i < stepLabels.length - 1 ? "flex-1" : ""}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i < stepIndex ? "bg-green-700 border-green-700 text-white"
                  : i === stepIndex ? "bg-white border-green-700 text-green-700"
                  : "bg-white border-olive-border/40 text-text-secondary/40"
                }`}>
                  {i < stepIndex ? "✓" : s.icon}
                </div>
                <span className={`text-[11px] mt-1 font-medium ${i === stepIndex ? "text-green-700" : "text-text-secondary/50"}`}>
                  {s.label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-5 ${i < stepIndex ? "bg-green-700" : "bg-olive-border/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step: Cart */}
        {step === "cart" && (
          <div className="bg-white rounded-2xl border border-olive-border/30 p-6">
            <h2 className="text-lg font-bold text-green-900 mb-5">{t.cartTitle}</h2>
            <ul className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 pb-4 border-b border-olive-border/20 last:border-0 last:pb-0">
                  <div className="shrink-0 w-16 h-16 bg-green-50 rounded-xl border border-olive-border/20 flex items-center justify-center">
                    <span className="text-2xl opacity-25">🌿</span>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-sm font-semibold text-green-900">{product.amount} — {product.brand}</h3>
                    <span className="text-xs text-text-secondary/60">{t.unitPrice(product.price.toLocaleString("tr-TR"))}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(product.id, quantity - 1)} className="w-7 h-7 rounded-full border border-olive-border/40 flex items-center justify-center text-green-800 font-bold hover:bg-green-50 transition-colors">−</button>
                      <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} className="w-7 h-7 rounded-full border border-olive-border/40 flex items-center justify-center text-green-800 font-bold hover:bg-green-50 transition-colors">+</button>
                      <button onClick={() => removeItem(product.id)} className="ml-2 text-xs text-red-400 hover:text-red-600 transition-colors">{t.removeBtn}</button>
                      <span className="ml-auto text-sm font-bold text-green-800">{(product.price * quantity).toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setStep("address")}
              className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              {t.nextAddress}
            </button>
          </div>
        )}

        {/* Step: Address */}
        {step === "address" && (
          <div className="bg-white rounded-2xl border border-olive-border/30 p-6">
            <h2 className="text-lg font-bold text-green-900 mb-5">{t.addressTitle}</h2>

            {/* Kayıtlı adres seçici */}
            {isLoggedIn && savedAddresses.length > 0 && (
              <div className="mb-5 p-3 bg-green-50 rounded-xl border border-olive-border/30">
                <p className="text-xs font-semibold text-green-800 mb-2">Kayıtlı Adreslerim</p>
                <div className="flex flex-col gap-2">
                  {savedAddresses.map((a) => (
                    <label key={a.id} className="flex items-start gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="savedAddr"
                        checked={(defaultAddressId ?? savedAddresses[0]?.id) === a.id}
                        onChange={() => {
                          setDefaultAddress(a.id);
                          setAddress({
                            name: a.name, surname: a.surname, phone: a.phone, email: a.email,
                            city: a.city, district: a.district, address: a.address,
                            invoiceType: a.invoiceType, companyName: a.companyName ?? "",
                            taxNo: a.taxId ?? "", taxOffice: "",
                          });
                        }}
                        className="mt-0.5 accent-green-700"
                      />
                      <div className="text-xs leading-relaxed">
                        <span className="font-semibold text-green-800">{a.label}</span>
                        <span className="text-text-secondary"> — {a.name} {a.surname}, {a.district}/{a.city}</span>
                        <p className="text-text-secondary/70 truncate max-w-xs">{a.address}</p>
                      </div>
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setDefaultAddress("");
                      setAddress({ name: displayName?.split(" ")[0] ?? "", surname: displayName?.split(" ").slice(1).join(" ") ?? "", phone: profilePhone || "", email: profileEmail ?? "", city: "", district: "", address: "", invoiceType: "individual", companyName: "", taxNo: "", taxOffice: "" });
                    }}
                    className="text-xs text-green-700 hover:underline text-left mt-1"
                  >
                    + Yeni adres gir
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.fields.map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-green-800 block mb-1">{label}</label>
                  <input
                    type={key === "phone" ? "tel" : type}
                    inputMode={key === "phone" ? "tel" : undefined}
                    placeholder={placeholder}
                    value={address[key as keyof typeof address]}
                    onChange={(e) => handleAddrChange(key, e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-cream-50 text-text-primary placeholder:text-text-secondary/40 ${
                      addrErrors[key] ? "border-red-400 focus:border-red-500" : "border-olive-border/40 focus:border-green-700/60"
                    }`}
                  />
                  {addrErrors[key] && <p className="text-[11px] text-red-500 mt-0.5">{addrErrors[key]}</p>}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-green-800 block mb-1">{t.addressLabel}</label>
                <textarea
                  placeholder={t.addressPlaceholder}
                  rows={3}
                  value={address.address}
                  onChange={(e) => { setAddress((p) => ({ ...p, address: e.target.value })); setAddrErrors(er => ({ ...er, address: "" })); }}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-cream-50 text-text-primary placeholder:text-text-secondary/40 resize-none ${
                    addrErrors.address ? "border-red-400 focus:border-red-500" : "border-olive-border/40 focus:border-green-700/60"
                  }`}
                />
                {addrErrors.address && <p className="text-[11px] text-red-500 mt-0.5">{addrErrors.address}</p>}
              </div>
              {/* Invoice type */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-green-800 block mb-2">{t.invoiceType}</label>
                <div className="flex gap-3">
                  {([
                    { key: "individual", label: t.invoiceIndividual },
                    { key: "corporate",  label: t.invoiceCorporate },
                  ] as const).map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="invoice" className="accent-green-700"
                        checked={address.invoiceType === item.key}
                        onChange={() => setAddress(p => ({ ...p, invoiceType: item.key }))} />
                      <span className="text-sm text-green-800">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {address.invoiceType === "corporate" && <>
                <div>
                  <label className="text-xs font-semibold text-green-800 block mb-1">{t.companyName}</label>
                  <input type="text" placeholder={t.companyNamePlaceholder} value={address.companyName}
                    onChange={(e) => { setAddress(p => ({ ...p, companyName: e.target.value })); setAddrErrors(er => ({ ...er, companyName: "" })); }}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-cream-50 ${addrErrors.companyName ? "border-red-400" : "border-olive-border/40 focus:border-green-700/60"}`} />
                  {addrErrors.companyName && <p className="text-[11px] text-red-500 mt-0.5">{addrErrors.companyName}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-green-800 block mb-1">{t.taxNo}</label>
                  <input type="text" inputMode="numeric" placeholder="1234567890" value={address.taxNo}
                    onChange={(e) => { setAddress(p => ({ ...p, taxNo: e.target.value.replace(/\D/g, "").slice(0, 10) })); setAddrErrors(er => ({ ...er, taxNo: "" })); }}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none bg-cream-50 ${addrErrors.taxNo ? "border-red-400" : "border-olive-border/40 focus:border-green-700/60"}`} />
                  {addrErrors.taxNo && <p className="text-[11px] text-red-500 mt-0.5">{addrErrors.taxNo}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-green-800 block mb-1">{t.taxOffice}</label>
                  <input type="text" placeholder={t.taxOfficePlaceholder} value={address.taxOffice}
                    onChange={(e) => setAddress(p => ({ ...p, taxOffice: onlyLetters(e.target.value) }))}
                    className="w-full border border-olive-border/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-700/60 bg-cream-50" />
                </div>
              </>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep("cart")} className="px-5 py-3 border border-olive-border/40 text-green-800 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors">{t.backBtn}</button>
              <button
                onClick={() => {
                  if (!validateAddress()) return;
                  saveAddress({
                    name: address.name,
                    surname: address.surname,
                    phone: address.phone,
                    email: address.email,
                    city: address.city,
                    district: address.district,
                    address: address.address,
                    invoiceType: address.invoiceType,
                    companyName: address.companyName,
                    taxId: address.taxNo,
                  });
                  setStep("payment");
                }}
                disabled={false}
                className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {t.nextPayment}
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div className="bg-white rounded-2xl border border-olive-border/30 p-6">
            <h2 className="text-lg font-bold text-green-900 mb-1">{t.paymentTitle}</h2>
            <p className="text-xs text-text-secondary mb-5 flex items-center gap-1">
              <span>🔒</span> {t.secureNote}
            </p>

            {/* Payment method */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(t.payMethods as unknown as { key: PayMethod; icon: string; label: string }[]).map((m) => (
                <button key={m.key} onClick={() => setPayMethod(m.key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                    payMethod === m.key
                      ? "border-green-700 bg-green-50"
                      : "border-olive-border/40 hover:border-green-700/30"
                  }`}>
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[10px] font-semibold text-green-800 leading-tight">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Card details */}
            {payMethod === "card" && (<>
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-6" />
              <div className="relative">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs text-white/60 uppercase tracking-wider">{t.cardPreviewLabel}</span>
                  <div className="flex gap-1">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">VISA</span>
                  </div>
                </div>
                <p className="font-mono text-lg tracking-widest mb-4">
                  {card.number || "•••• •••• •••• ••••"}
                </p>
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="text-white/50 text-[10px] mb-0.5">{t.cardHolder}</p>
                    <p className="font-medium">{card.name || "AD SOYAD"}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] mb-0.5">{t.cardExpiry}</p>
                    <p className="font-medium">{card.expiry || "AA/YY"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-green-800 block mb-1">{t.cardNumberLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={(e) => setCard((p) => ({ ...p, number: formatCardNumber(e.target.value) }))}
                  className="w-full border border-olive-border/40 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-green-700/60 bg-cream-50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-green-800 block mb-1">{t.cardNameLabel}</label>
                <input
                  type="text"
                  placeholder="AD SOYAD"
                  value={card.name}
                  onChange={(e) => setCard((p) => ({ ...p, name: e.target.value.toUpperCase() }))}
                  className="w-full border border-olive-border/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-700/60 bg-cream-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-green-800 block mb-1">{t.cardExpiryLabel}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="AA/YY"
                    value={card.expiry}
                    onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    className="w-full border border-olive-border/40 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-green-700/60 bg-cream-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-green-800 block mb-1">CVV</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    className="w-full border border-olive-border/40 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-green-700/60 bg-cream-50"
                  />
                </div>
              </div>
            </div>

            {/* Installment */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-green-800 block mb-2">{t.installmentLabel}</label>
              <select value={card.installment} onChange={(e) => setCard(p => ({ ...p, installment: e.target.value }))}
                className="w-full border border-olive-border/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-700/60 bg-cream-50">
                {t.installmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 3D Secure note */}
            <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary bg-cream-100 rounded-lg px-3 py-2 border border-olive-border/20">
              <span>🔐</span>
              <span>{t.secureNote3d}</span>
            </div>
            </>)}

            {/* Bank transfer */}
            {payMethod === "transfer" && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600">🏦</span>
                  <p className="text-sm font-bold text-blue-800">{t.transferTitle}</p>
                </div>

                <div className="bg-white rounded-xl p-3 border border-blue-100">
                  <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">{t.accountHolder}</p>
                  <p className="text-sm font-bold text-green-900">Hüda-i Şifa Doğal Ürünler Tic. Ltd. Şti.</p>
                </div>

                {[
                  { bank: "Garanti BBVA",        logo: "🟠", iban: "TR00 0006 2001 0000 0000 0000 00", branch: "Çankaya Şubesi",      swiftCode: "TGBATRISXXX" },
                  { bank: "Türkiye İş Bankası",  logo: "🔵", iban: "TR00 0006 4000 0000 0000 0000 00", branch: "Kızılay Şubesi",      swiftCode: "ISBKTRISXXX" },
                  { bank: "Ziraat Bankası",       logo: "🔴", iban: "TR00 0001 0001 0000 0000 0000 00", branch: "Ankara Merkez Şubesi",swiftCode: "TCZBTR2AXXX" },
                ].map((acc) => (
                  <div key={acc.bank} className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-blue-900">{acc.logo} {acc.bank}</span>
                      <span className="text-[10px] text-text-secondary/60">{acc.branch}</span>
                    </div>
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                      <span className="text-xs font-mono text-blue-900 tracking-wide">{acc.iban}</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(acc.iban.replace(/\s/g, ""))}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold ml-2 shrink-0 transition-colors"
                      >
                        {t.copyIban}
                      </button>
                    </div>
                    <p className="text-[10px] text-text-secondary/60 mt-1">SWIFT: {acc.swiftCode}</p>
                  </div>
                ))}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    ⚠️ <strong>{t.transferWarning}</strong>
                  </p>
                  <p className="text-[11px] text-amber-700 leading-relaxed mt-1">
                    {t.transferNote("destek@hudaisifa.com").split("destek@hudaisifa.com").map((part, i, arr) =>
                      i < arr.length - 1
                        ? <span key={i}>{part}<a href="mailto:destek@hudaisifa.com" className="underline">destek@hudaisifa.com</a></span>
                        : <span key={i}>{part}</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Cash on delivery */}
            {payMethod === "cod" && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm font-bold text-amber-800 mb-2">{t.codTitle}</p>
                <div className="flex flex-col gap-2 text-xs text-amber-700">
                  {t.codDetails.map((detail, i) => (
                    <p key={i}>✓ {detail}</p>
                  ))}
                  <p className="text-[11px] text-amber-600 mt-1">{t.codNote}</p>
                </div>
              </div>
            )}

            {/* Legal consents */}
            <div className="mt-5 flex flex-col gap-3 border-t border-olive-border/20 pt-4">
              <p className="text-xs font-semibold text-green-800">{t.consentsTitle}</p>
              {[
                {
                  key: "onBilgilendirme" as const,
                  href: "/terms",
                  linkText: t.consentPreInfoLink,
                  getText: t.consentPreInfo,
                  required: true,
                },
                {
                  key: "mesafeliSatis" as const,
                  href: "/terms",
                  linkText: t.consentDistanceSaleLink,
                  getText: t.consentDistanceSale,
                  required: true,
                },
                {
                  key: "kvkk" as const,
                  href: "/privacy",
                  linkText: t.consentKvkkLink,
                  getText: t.consentKvkk,
                  required: false,
                },
              ].map((c) => {
                const fullText = c.getText(c.linkText);
                const parts = fullText.split(c.linkText);
                return (
                  <label key={c.key} className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-green-700 w-4 h-4 shrink-0"
                      checked={consents[c.key]}
                      onChange={(e) => setConsents(p => ({ ...p, [c.key]: e.target.checked }))} />
                    <span className="text-xs text-text-secondary leading-relaxed">
                      {parts[0]}
                      <a href={c.href} target="_blank" className="text-green-700 font-semibold underline">{c.linkText}</a>
                      {parts[1]}
                      {c.required && <span className="text-red-400 ml-1">*</span>}
                    </span>
                  </label>
                );
              })}
              <p className="text-[11px] text-text-secondary/60">{t.requiredNote}</p>
            </div>

            {/* Payment error message */}
            {paymentState === "error" && paymentError && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">❌</span>
                <span>{paymentError}</span>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep("address")} className="px-5 py-3 border border-olive-border/40 text-green-800 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors">{t.backBtn}</button>
              <button
                onClick={async () => {
                  if (payMethod !== "card") {
                    handlePlaceOrder();
                    return;
                  }

                  // Card payment → call İyzico 3D Secure
                  setPaymentState("loading");
                  setPaymentError("");
                  const orderId = `HS-2026-${Math.floor(Math.random() * 90000) + 10000}`;
                  const [expireMonth, expireYearShort] = card.expiry.split("/");
                  const expireYear = expireYearShort
                    ? expireYearShort.length === 2
                      ? `20${expireYearShort}`
                      : expireYearShort
                    : "";

                  try {
                    const res = await fetch("/api/payment/initialize", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        order: {
                          id: orderId,
                          subtotal: total() - discountAmount,
                          total: grandTotal,
                          items: items.map(({ product, quantity }) => ({
                            id: product.id,
                            name: product.amount || product.brand,
                            category: "Takviye",
                            price: product.price,
                            quantity,
                          })),
                        },
                        address: {
                          name: address.name,
                          surname: address.surname,
                          email: address.email,
                          phone: address.phone,
                          city: address.city,
                          country: "Turkey",
                          address: address.address,
                        },
                        card: {
                          cardHolderName: card.name,
                          cardNumber: card.number,
                          expireMonth: expireMonth,
                          expireYear: expireYear,
                          cvc: card.cvv,
                        },
                      }),
                    });

                    const data = await res.json();

                    if (data.success && data.threeDSHtmlContent) {
                      setThreeDSHtml(data.threeDSHtmlContent);
                      setPaymentState("threeds");
                    } else {
                      setPaymentError(data.error || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
                      setPaymentState("error");
                    }
                  } catch {
                    setPaymentError("Bağlantı hatası. Lütfen tekrar deneyin.");
                    setPaymentState("error");
                  }
                }}
                disabled={
                  paymentState === "loading" ||
                  !consents.onBilgilendirme || !consents.mesafeliSatis ||
                  (payMethod === "card" && (card.number.length < 19 || !card.name || card.expiry.length < 5 || card.cvv.length < 3))
                }
                className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {paymentState === "loading" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    {payMethod === "card" ? t.completePayment : payMethod === "transfer" ? t.confirmOrder : t.placeOrder}
                  </>
                )}
              </button>
            </div>

            {/* 3D Secure iframe overlay */}
            {paymentState === "threeds" && threeDSHtml && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md h-[600px] relative">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-[#2D4A1E]">3D Güvenli Ödeme</span>
                    <button
                      onClick={() => { setPaymentState("idle"); setThreeDSHtml(""); }}
                      className="text-gray-500 hover:text-red-500 text-xl"
                    >✕</button>
                  </div>
                  <iframe
                    srcDoc={threeDSHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                    title="3D Güvenli Ödeme"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Confirm */}
        {step === "confirm" && (
          <div className="bg-white rounded-2xl border border-olive-border/30 p-8 text-center">
            <div className="w-16 h-16 bg-green-50 border border-olive-border/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">{t.confirmTitle}</h2>
            <p className="text-text-secondary text-sm mb-1">{t.orderNumber} <strong className="text-green-800">#{confirmedOrderId}</strong></p>
            <p className="text-text-secondary text-sm mb-6">
              {address.email && t.confirmEmail(address.email)}
            </p>
            <div className="bg-cream-50 border border-olive-border/20 rounded-xl p-4 text-sm text-text-secondary mb-6">
              <p>🚚 {t.estimatedDelivery}</p>
              <p className="mt-1">📦 {t.orderPreparing}</p>
            </div>
            <Link
              href="/products"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-xl text-sm transition-colors"
            >
              {t.continueShopping}
            </Link>
          </div>
        )}
      </div>

      {/* Right: Order summary */}
      {step !== "confirm" && (
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-olive-border/30 p-5 sticky top-24">
            <h3 className="text-base font-bold text-green-900 mb-4">{t.orderSummary}</h3>
            <ul className="flex flex-col gap-2 mb-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary truncate flex-1">{product.amount} <span className="text-text-secondary/50">x{quantity}</span></span>
                  <span className="font-medium text-green-800 ml-2 shrink-0">{(product.price * quantity).toLocaleString("tr-TR")} ₺</span>
                </li>
              ))}
            </ul>
            {/* Coupon */}
            <div className="border-t border-olive-border/20 pt-3 mb-1">
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-700/20 rounded-xl px-3 py-2">
                  <span className="text-xs text-green-700 font-semibold">
                    {t.couponApplied(couponApplied.code)}
                  </span>
                  <button
                    onClick={() => { setCouponApplied(null); setCouponInput(""); }}
                    className="text-xs text-text-secondary/60 hover:text-red-500 transition-colors"
                  >
                    {t.removeCoupon}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder={t.couponPlaceholder}
                    className="flex-1 border border-olive-border/40 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-green-700/50 bg-cream-50"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    {t.applyBtn}
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>{t.subtotal}</span>
                <span>{total().toLocaleString("tr-TR")} ₺</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>{t.discount(couponApplied!.code)}</span>
                  <span>−{discountAmount.toLocaleString("tr-TR")} ₺</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>{t.shipping}</span>
                <span className={shippingCost === 0 ? "text-green-700 font-medium" : ""}>
                  {shippingCost === 0 ? t.freeShipping : formatPrice(shippingCost)}
                </span>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>{t.codFeeLabel}</span>
                  <span>+{codFee.toLocaleString("tr-TR")} ₺</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-green-900 text-base pt-2 border-t border-olive-border/20">
                <span>{t.total}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              {/* Uluslararası gümrük uyarısı */}
              {customsInfo && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    Gümrük Bilgisi (DDU — Alıcı Ödemeli)
                  </p>
                  <p>{customsInfo.deMinimisNote}</p>
                  {customsInfo.dutyRate > 0 && (
                    <p>Tahmini gümrük vergisi: <strong>%{customsInfo.dutyRate}</strong> (HS 2106.90 — Takviye Gıda)</p>
                  )}
                  {customsInfo.vatRate > 0 && (
                    <p>Yerel KDV: <strong>%{customsInfo.vatRate}</strong> (ülkenize göre uygulanabilir)</p>
                  )}
                  <p className="text-amber-700 leading-snug pt-0.5">{customsInfo.legalNote}</p>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["VISA", "MC", "TROY"].map((c) => (
                <div key={c} className="bg-cream-50 border border-olive-border/20 rounded-lg py-1.5 text-xs font-bold text-text-secondary">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
