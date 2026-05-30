"use client";

import { useCartStore } from "@/store/cartStore";
import { useCouponStore } from "@/store/couponStore";
import { useGeoStore } from "@/store/geoStore";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { products } from "@/data/products";

type LocaleKey = "tr" | "en" | "ar" | "ru";

const cartTranslations = {
  tr: {
    dir: "ltr",
    title: "Sepetim",
    emptyText: "Sepetiniz boş.",
    startShopping: "Alışverişe Başla",
    freeShipping: "Ücretsiz kargo!",
    addMore: (amount: string) => `${amount} ₺ daha ekle, kargo bedava!`,
    subtotal: "Ara Toplam",
    checkoutBtn: "Güvenli Ödemeye Geç",
    ssl: "SSL",
    secure: "3D Secure",
    fastShipping: "Hızlı Kargo",
    couponPlaceholder: "İndirim kodu",
    couponApply: "Uygula",
    couponApplied: (code: string, pct: number) => `${code} — %${pct} indirim uygulandı`,
    couponRemove: "Kaldır",
    couponInvalid: "Geçersiz kod",
    discount: "İndirim",
    total: "Toplam",
    upsell: "Bunları da beğenebilirsiniz",
    loyalty: (pts: number) => `Bu sepetten +${pts} puan kazanacaksınız`,
  },
  en: {
    dir: "ltr",
    title: "My Cart",
    emptyText: "Your cart is empty.",
    startShopping: "Start Shopping",
    freeShipping: "Free shipping!",
    addMore: (amount: string) => `Add ${amount} ₺ more for free shipping!`,
    subtotal: "Subtotal",
    checkoutBtn: "Proceed to Secure Checkout",
    ssl: "SSL",
    secure: "3D Secure",
    fastShipping: "Fast Delivery",
    couponPlaceholder: "Discount code",
    couponApply: "Apply",
    couponApplied: (code: string, pct: number) => `${code} — ${pct}% discount applied`,
    couponRemove: "Remove",
    couponInvalid: "Invalid code",
    discount: "Discount",
    total: "Total",
    upsell: "You might also like",
    loyalty: (pts: number) => `You'll earn +${pts} points from this cart`,
  },
  ar: {
    dir: "rtl",
    title: "سلّتي",
    emptyText: "سلّتك فارغة.",
    startShopping: "ابدأ التسوق",
    freeShipping: "شحن مجاني!",
    addMore: (amount: string) => `أضف ${amount} ₺ أخرى للحصول على شحن مجاني!`,
    subtotal: "المجموع الفرعي",
    checkoutBtn: "المتابعة إلى الدفع الآمن",
    ssl: "SSL",
    secure: "3D Secure",
    fastShipping: "توصيل سريع",
    couponPlaceholder: "كود الخصم",
    couponApply: "تطبيق",
    couponApplied: (code: string, pct: number) => `${code} — خصم ${pct}٪ مُطبَّق`,
    couponRemove: "إزالة",
    couponInvalid: "كود غير صالح",
    discount: "الخصم",
    total: "الإجمالي",
    upsell: "قد يعجبك أيضاً",
    loyalty: (pts: number) => `ستكسب +${pts} نقطة من هذه السلة`,
  },
  ru: {
    dir: "ltr",
    title: "Моя корзина",
    emptyText: "Ваша корзина пуста.",
    startShopping: "Начать покупки",
    freeShipping: "Бесплатная доставка!",
    addMore: (amount: string) => `Добавьте ещё ${amount} ₺ для бесплатной доставки!`,
    subtotal: "Промежуточный итог",
    checkoutBtn: "Перейти к безопасной оплате",
    ssl: "SSL",
    secure: "3D Secure",
    fastShipping: "Быстрая доставка",
    couponPlaceholder: "Промокод",
    couponApply: "Применить",
    couponApplied: (code: string, pct: number) => `${code} — скидка ${pct}% применена`,
    couponRemove: "Убрать",
    couponInvalid: "Неверный код",
    discount: "Скидка",
    total: "Итого",
    upsell: "Вам также может понравиться",
    loyalty: (pts: number) => `Вы заработаете +${pts} баллов из этой корзины`,
  },
} as const;

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count, addItem } = useCartStore();
  const { validateCoupon } = useCouponStore();
  const { isFreeShipping, freeShippingRemaining, formatPrice, getShippingCost } = useGeoStore();
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number; pct: number } | null>(null);
  const [couponError, setCouponError] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const params = useParams();
  const locale = ((params?.locale as string) ?? "tr") as LocaleKey;
  const t = cartTranslations[locale] ?? cartTranslations.tr;

  const discountAmount = couponApplied?.discount ?? 0;
  const finalTotal = total() - discountAmount;

  function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    const result = validateCoupon(couponInput.trim(), total());
    if (result.valid) {
      setCouponApplied({ code: couponInput.trim().toUpperCase(), discount: result.discount, pct: result.pct });
      setCouponInput("");
      setCouponError(false);
    } else {
      setCouponError(true);
    }
  }

  // ESC ile kapat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Scroll kilitle
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          t.dir === "rtl" ? "left-0" : "right-0"
        } ${isOpen ? "translate-x-0" : t.dir === "rtl" ? "-translate-x-full" : "translate-x-full"}`}
        dir={t.dir}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-olive-border/30">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <h2 className="text-base font-bold text-green-900">{t.title}</h2>
            {mounted && count() > 0 && (
              <span className="bg-green-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count()}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-cream-100 transition-colors">
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ürünler */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <span className="text-5xl opacity-30">🛒</span>
              <p className="text-text-secondary text-sm">{t.emptyText}</p>
              <button
                onClick={closeCart}
                className="mt-2 text-sm text-green-700 hover:underline"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;
                return (
                  <li key={product.id} className="flex gap-3 bg-cream-50 rounded-xl p-3 border border-olive-border/20">
                    {/* Görsel */}
                    <div className="shrink-0 w-14 h-14 bg-green-50 rounded-lg border border-olive-border/20 flex items-center justify-center">
                      <span className="text-2xl opacity-25">🌿</span>
                    </div>

                    {/* Bilgi */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs font-semibold text-green-900 leading-snug line-clamp-2">
                          {product.amount} — {product.brand}
                        </h3>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="shrink-0 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-text-secondary/50 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Fiyat */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-green-800">
                          {product.price.toLocaleString("tr-TR")} ₺
                        </span>
                        {discount > 0 && (
                          <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Miktar kontrolü */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-6 h-6 rounded-full border border-olive-border/40 flex items-center justify-center hover:bg-green-50 transition-colors text-green-800 font-bold text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold text-green-900 w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQty(product.id, quantity + 1)}
                          className="w-6 h-6 rounded-full border border-olive-border/40 flex items-center justify-center hover:bg-green-50 transition-colors text-green-800 font-bold text-sm"
                        >
                          +
                        </button>
                        <span className="ml-auto text-xs text-text-secondary/60">
                          = {(product.price * quantity).toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Upsell öneriler */}
          {mounted && items.length > 0 && (() => {
            const cartIds = new Set(items.map(i => i.product.id));
            const suggestions = products
              .filter(p => !cartIds.has(p.id) && p.inStock && p.stock > 0)
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            if (suggestions.length === 0) return null;
            return (
              <div className="mt-5 pt-4 border-t border-olive-border/20">
                <p className="text-xs font-semibold text-text-secondary/70 uppercase tracking-wide mb-3">
                  {t.upsell}
                </p>
                <div className="flex flex-col gap-2">
                  {suggestions.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-cream-50 rounded-xl p-2.5 border border-olive-border/15">
                      <div className="w-10 h-10 shrink-0 bg-green-50 rounded-lg flex items-center justify-center border border-olive-border/15">
                        <span className="text-lg opacity-25">🌿</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-green-900 leading-tight line-clamp-1">{p.amount} · {p.brand}</p>
                        <p className="text-xs font-bold text-green-700 mt-0.5">{p.price.toLocaleString("tr-TR")} ₺</p>
                      </div>
                      <button
                        onClick={() => addItem(p)}
                        className="shrink-0 w-7 h-7 rounded-full bg-green-700 hover:bg-green-800 text-white flex items-center justify-center transition-colors"
                        aria-label="Sepete ekle"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Alt: Toplam + Ödeme */}
        {items.length > 0 && (
          <div className="border-t border-olive-border/30 px-5 py-4 flex flex-col gap-3">
            {/* Kargo ilerleme çubuğu */}
            {(() => {
              const cartTotal = total();
              const remaining = freeShippingRemaining(cartTotal);
              const threshold = cartTotal + remaining;
              const pct = threshold > 0 ? Math.min(100, Math.round((cartTotal / threshold) * 100)) : 100;
              const free = isFreeShipping(cartTotal);
              return (
                <div className={`rounded-xl px-3 py-2.5 border ${free ? "bg-green-50 border-green-200" : "bg-cream-50 border-olive-border/30"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className={`w-3.5 h-3.5 shrink-0 ${free ? "text-green-600" : "text-text-secondary/60"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <span className={`text-xs font-medium ${free ? "text-green-700" : "text-text-secondary/70"}`}>
                      {free ? t.freeShipping : t.addMore(formatPrice(remaining))}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-olive-border/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${free ? "bg-green-500" : "bg-green-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Kupon kodu */}
            {couponApplied ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <span className="text-xs font-semibold text-green-700">
                  🎁 {t.couponApplied(couponApplied.code, couponApplied.pct)}
                </span>
                <button
                  onClick={() => setCouponApplied(null)}
                  className="text-[11px] text-red-500 hover:text-red-700 font-semibold ml-2 shrink-0"
                >
                  {t.couponRemove}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder={t.couponPlaceholder}
                  className={`flex-1 text-xs px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 bg-cream-50 ${
                    couponError ? "border-red-300 text-red-600" : "border-olive-border/40"
                  }`}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="text-xs font-semibold px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl transition-colors shrink-0"
                >
                  {t.couponApply}
                </button>
              </div>
            )}
            {couponError && (
              <p className="text-[11px] text-red-500 -mt-1">{t.couponInvalid}</p>
            )}

            {/* Toplam */}
            <div className="flex flex-col gap-1">
              {discountAmount > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{t.subtotal}</span>
                    <span className="text-text-secondary">{formatPrice(total())}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-green-700">
                    <span className="font-medium">{t.discount} ({couponApplied!.pct}%)</span>
                    <span className="font-medium">− {formatPrice(discountAmount)}</span>
                  </div>
                  <div className="border-t border-olive-border/20 pt-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-900">{t.total}</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-800">
                        {formatPrice(finalTotal)}
                      </span>
                      {getShippingCost(finalTotal) > 0 && (
                        <p className="text-[10px] text-text-secondary/60 mt-0.5">
                          + {formatPrice(getShippingCost(finalTotal))} kargo
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
              {discountAmount === 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{t.subtotal}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-800">
                      {formatPrice(total())}
                    </span>
                    {getShippingCost(total()) > 0 && (
                      <p className="text-[10px] text-text-secondary/60 mt-0.5">
                        + {formatPrice(getShippingCost(total()))} kargo
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sadakat puanları */}
            {mounted && items.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/50 rounded-xl px-3 py-2">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[11px] text-amber-700 font-medium">
                  {t.loyalty(Math.round(total()))}
                </span>
              </div>
            )}

            {/* Ödemeye Geç */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              {t.checkoutBtn}
            </Link>

            {/* Güven ikonları */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-text-secondary/60">
              <span>🔒 {t.ssl}</span>
              <span>·</span>
              <span>💳 {t.secure}</span>
              <span>·</span>
              <span>🚚 {t.fastShipping}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
