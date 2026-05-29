"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

const mockReviews: Review[] = [
  { id: 1, author: "Ayşe K.", rating: 5, date: "14 Mar 2026", title: "Harika ürün, kesinlikle tavsiye ederim", body: "3 aydır düzenli kullanıyorum, farkı hissettim. Kaliteli ambalaj, hızlı kargo.", verified: true },
  { id: 2, author: "Mehmet T.", rating: 4, date: "8 Mar 2026", title: "Çok iyi, fiyatı biraz yüksek ama değer", body: "İçeriği kaliteli, kullanımı kolay. Belki biraz daha büyük boy seçenek olabilir.", verified: true },
  { id: 3, author: "Fatma D.", rating: 5, date: "2 Mar 2026", title: "Uzman önerisiyle aldım, doğru karar", body: "Doktorum tavsiye etmişti. Ürün birebir tanımla uyuşuyor. Memnunum.", verified: true },
  { id: 4, author: "Emre Y.", rating: 5, date: "22 Şub 2026", title: "Çabuk geldi, sağlam paketleme", body: "Sipariş verdiğim gün kargoya verildi, ertesi gün elime geçti. Ürünün kalitesinden memnunum.", verified: false },
];

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

const StarPath = () => (
  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
);

export function ProductReviews({ rating, reviewCount }: ProductReviewsProps) {
  const t = useTranslations("products");
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ title: "", body: "", author: "" });
  const [submitted, setSubmitted] = useState(false);

  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: mockReviews.filter((rv) => rv.rating === r).length,
    pct: Math.round((mockReviews.filter((rv) => rv.rating === r).length / mockReviews.length) * 100),
  }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  }

  return (
    <div className="mt-10 border-t border-olive-border/20 pt-10">
      <h2 className="text-lg font-bold text-green-900 mb-6">{t("reviewsTitle")}</h2>

      {/* Özet */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="flex flex-col items-center justify-center bg-green-50 rounded-2xl p-6 min-w-32 border border-olive-border/20">
          <span className="text-4xl font-bold text-green-800">{rating}</span>
          <div className="flex gap-0.5 my-1">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-gold-400" : "text-text-secondary/20"}`} fill="currentColor" viewBox="0 0 20 20">
                <StarPath />
              </svg>
            ))}
          </div>
          <span className="text-xs text-text-secondary">{reviewCount} {t("reviews")}</span>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {ratingDist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-text-secondary text-right">{star}</span>
              <svg className="w-3 h-3 text-gold-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <StarPath />
              </svg>
              <div className="flex-1 bg-olive-border/20 rounded-full h-2">
                <div className="bg-gold-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-text-secondary/60 w-6">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yorum listesi */}
      <div className="flex flex-col gap-4 mb-6">
        {mockReviews.map((rv) => (
          <div key={rv.id} className="bg-white border border-olive-border/30 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= rv.rating ? "text-gold-400" : "text-text-secondary/20"}`} fill="currentColor" viewBox="0 0 20 20">
                        <StarPath />
                      </svg>
                    ))}
                  </div>
                  {rv.verified && (
                    <span className="text-[10px] text-green-700 bg-green-50 border border-green-700/20 px-1.5 py-0.5 rounded-full font-medium">
                      ✓ {t("reviewVerified")}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-green-900">{rv.title}</h4>
              </div>
              <span className="text-[11px] text-text-secondary/60 shrink-0">{rv.date}</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{rv.body}</p>
            <p className="mt-2 text-[11px] text-text-secondary/50">{rv.author}</p>
          </div>
        ))}
      </div>

      {/* Yorum yaz */}
      {submitted ? (
        <div className="bg-green-50 border border-green-700/20 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-green-700">✓ {t("reviewSubmitSuccess")}</p>
          <p className="text-xs text-text-secondary mt-1">{t("reviewSubmitHint")}</p>
        </div>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="bg-white border border-olive-border/30 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-green-900">{t("reviewWrite")}</h3>
          {/* Yıldız seçimi */}
          <div>
            <label className="text-xs font-semibold text-green-800 block mb-2">{t("reviewYourRating")}</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <svg className={`w-7 h-7 transition-colors ${s <= (hoverRating || newRating) ? "text-gold-400" : "text-text-secondary/20"}`} fill="currentColor" viewBox="0 0 20 20">
                    <StarPath />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-green-800 block mb-1.5">{t("reviewYourName")}</label>
            <input required value={formData.author} onChange={e => setFormData(p => ({ ...p, author: e.target.value }))}
              className="w-full border border-olive-border/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50"
              placeholder={t("reviewNamePlaceholder")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-green-800 block mb-1.5">{t("reviewTitleLabel")}</label>
            <input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full border border-olive-border/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50"
              placeholder={t("reviewTitlePlaceholder")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-green-800 block mb-1.5">{t("reviewBodyLabel")}</label>
            <textarea required value={formData.body} onChange={e => setFormData(p => ({ ...p, body: e.target.value }))}
              rows={4}
              className="w-full border border-olive-border/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-700/50 bg-cream-50 resize-none"
              placeholder={t("reviewBodyPlaceholder")} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
              {t("reviewSubmit")}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-olive-border/40 rounded-xl text-sm text-text-secondary hover:bg-cream-100 transition-colors">
              {t("reviewCancel")}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-olive-border/40 rounded-2xl py-4 text-sm font-medium text-text-secondary hover:border-green-700/30 hover:text-green-700 hover:bg-green-50 transition-all"
        >
          {t("reviewWriteButton")}
        </button>
      )}
    </div>
  );
}
