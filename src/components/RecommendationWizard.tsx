"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { type NeedTag } from "@/data/products";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface Answers {
  age?: string;
  gender?: string;
  needs: NeedTag[];
  lifestyle?: string;
  diet?: string;
  goal?: string;
}

interface ApiProduct {
  id: string;
  slug: string;
  nameKey: string;
  price: number;
  originalPrice?: number;
  image?: string;
  brand: string;
  amount: string;
  needs: NeedTag[];
  badge?: string;
  rating: number;
  reviewCount: number;
}

const steps = [
  { step: 1, title: "Yaşınız kaç?", subtitle: "Doğru öneri için yaş grubunuzu seçin." },
  { step: 2, title: "Cinsiyetiniz?", subtitle: "" },
  { step: 3, title: "Hangi konularda destek arıyorsunuz?", subtitle: "Birden fazla seçebilirsiniz." },
  { step: 4, title: "Yaşam tarzınız nasıl?", subtitle: "" },
  { step: 5, title: "Beslenme düzeniniz?", subtitle: "" },
  { step: 6, title: "Öncelikli hedefiniz?", subtitle: "" },
];

const ageOptions = [
  { value: "18-25", label: "18–25", icon: "🌱" },
  { value: "26-35", label: "26–35", icon: "⚡" },
  { value: "36-50", label: "36–50", icon: "🌿" },
  { value: "51+",   label: "51+",   icon: "🌳" },
];

const genderOptions = [
  { value: "female", label: "Kadın", icon: "👩" },
  { value: "male",   label: "Erkek", icon: "👨" },
  { value: "other",  label: "Belirtmek istemiyorum", icon: "🤍" },
];

const needOptions: { value: NeedTag; label: string; icon: string; color: string }[] = [
  { value: "immunity",  label: "Bağışıklık",       icon: "🛡️", color: "bg-green-50 border-green-700/30" },
  { value: "energy",    label: "Enerji & Zindelik", icon: "⚡", color: "bg-yellow-50 border-yellow-400/40" },
  { value: "digestion", label: "Sindirim",          icon: "🌿", color: "bg-green-50 border-green-700/30" },
  { value: "sleep",     label: "Uyku",              icon: "🌙", color: "bg-indigo-50 border-indigo-300/40" },
  { value: "stress",    label: "Stres & Odak",      icon: "🧠", color: "bg-purple-50 border-purple-300/40" },
  { value: "sport",     label: "Spor & Kas",        icon: "💪", color: "bg-orange-50 border-orange-300/40" },
  { value: "skin",      label: "Cilt, Saç & Tırnak",icon: "✨", color: "bg-pink-50 border-pink-300/40" },
  { value: "joints",    label: "Eklem & Kemik",     icon: "🦴", color: "bg-cream-100 border-olive-border/40" },
];

const lifestyleOptions = [
  { value: "sedentary",  label: "Hareketsiz (masa başı)",    icon: "💻" },
  { value: "moderate",   label: "Orta aktif",                icon: "🚶" },
  { value: "active",     label: "Aktif (düzenli spor)",      icon: "🏃" },
  { value: "athlete",    label: "Sporcu / Yoğun antrenman",  icon: "🏋️" },
];

const dietOptions = [
  { value: "balanced",   label: "Dengeli besleniyorum",      icon: "🥗" },
  { value: "vegetarian", label: "Vejetaryen",                icon: "🥦" },
  { value: "vegan",      label: "Vegan",                     icon: "🌱" },
  { value: "irregular",  label: "Düzensiz besleniyorum",     icon: "🍔" },
];

const goalOptions = [
  { value: "prevention", label: "Sağlığımı korumak",         icon: "🛡️" },
  { value: "energy",     label: "Enerji & performans",       icon: "⚡" },
  { value: "recovery",   label: "İyileşme & toparlanma",     icon: "💚" },
  { value: "beauty",     label: "Güzellik & cilt sağlığı",   icon: "✨" },
];

async function fetchRecommendations(answers: Answers): Promise<ApiProduct[]> {
  try {
    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        needs: answers.needs,
        age: answers.age,
        gender: answers.gender,
        lifestyle: answers.lifestyle,
        diet: answers.diet,
        goal: answers.goal,
      }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.recommendations) ? json.recommendations : [];
  } catch {
    return [];
  }
}

export function RecommendationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Answers>({ needs: [] });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<ApiProduct[]>([]);

  const progress = (step / 6) * 100;

  async function finishWizard(finalAnswers: Answers) {
    setLoading(true);
    const results = await fetchRecommendations(finalAnswers);
    setRecommended(results);
    setLoading(false);
    setDone(true);
  }

  function handleSingle(key: keyof Omit<Answers, "needs">, value: string) {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (step < 6) setStep((s) => (s + 1) as Step);
    else finishWizard(updated);
  }

  function toggleNeed(need: NeedTag) {
    setAnswers((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  }

  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 text-center py-20">
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm">Sizin için en uygun ürünler seçiliyor...</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        {/* Başarı mesajı */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-50 border border-olive-border/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
            Sizin için seçtik
          </h2>
          <p className="text-text-secondary">
            Yanıtlarınıza göre en uygun ürünleri aşağıda bulabilirsiniz.
          </p>
        </div>

        {recommended.length === 0 ? (
          <div className="text-center py-10 text-text-secondary">
            <p>Seçimlerinize uygun ürün bulunamadı. <Link href="/products" className="text-green-700 underline">Tüm ürünlere göz atın.</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {recommended.map((product, i) => {
              const discountPct = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              const badgeLabel: Record<string, string> = {
                expert: "Uzman Seçimi",
                bestseller: "Çok Satan",
                new: "Yeni",
              };
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex gap-4 bg-white border border-olive-border/30 rounded-2xl p-4 hover:border-green-700/30 hover:shadow-md transition-all"
                >
                  {/* Sıra */}
                  <div className="shrink-0 w-7 h-7 bg-green-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </div>
                  {/* Görsel */}
                  <div className="shrink-0 w-16 h-16 bg-green-50 rounded-xl border border-olive-border/20 overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt={product.nameKey} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl opacity-25">🌿</span>
                    )}
                  </div>
                  {/* Bilgi */}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.badge && (
                        <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded-full font-medium">
                          {badgeLabel[product.badge]}
                        </span>
                      )}
                      {discountPct > 0 && (
                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-green-900 leading-snug group-hover:text-green-700 truncate">
                      {product.amount} — {product.brand}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-green-800">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-text-secondary/50 line-through">
                          {product.originalPrice.toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "text-gold-400" : "text-text-secondary/20"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-[10px] text-text-secondary/50 ml-1">({product.reviewCount})</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="text-center px-6 py-3 border border-olive-border/50 text-green-800 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Tüm Ürünleri İncele
          </Link>
          <button
            onClick={() => { setStep(1); setAnswers({ needs: [] }); setDone(false); setRecommended([]); }}
            className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* İlerleme */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary font-medium">{step} / 6</span>
          <span className="text-xs text-text-secondary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-cream-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-700 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Soru başlığı */}
      <div className="mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-green-900">{steps[step - 1].title}</h2>
        {steps[step - 1].subtitle && (
          <p className="mt-1 text-sm text-text-secondary">{steps[step - 1].subtitle}</p>
        )}
      </div>

      {/* Adım 1: Yaş */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          {ageOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSingle("age", opt.value)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:border-green-700/40 hover:bg-green-50 text-left ${
                answers.age === opt.value
                  ? "border-green-700 bg-green-50"
                  : "border-olive-border/30 bg-white"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm font-semibold text-green-900">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Adım 2: Cinsiyet */}
      {step === 2 && (
        <div className="grid grid-cols-1 gap-3">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSingle("gender", opt.value)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-green-700/40 hover:bg-green-50 text-left ${
                answers.gender === opt.value
                  ? "border-green-700 bg-green-50"
                  : "border-olive-border/30 bg-white"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm font-semibold text-green-900">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Adım 3: İhtiyaçlar (çoklu) */}
      {step === 3 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {needOptions.map((opt) => {
              const selected = answers.needs.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleNeed(opt.value)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                    selected
                      ? "border-green-700 bg-green-50 ring-1 ring-green-700/20"
                      : `${opt.color} hover:border-green-700/30`
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs font-semibold text-green-900 leading-snug">{opt.label}</span>
                  {selected && (
                    <span className="ml-auto shrink-0 w-5 h-5 bg-green-700 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            disabled={answers.needs.length === 0}
            onClick={() => setStep(4)}
            className="mt-5 w-full bg-green-700 hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Devam Et ({answers.needs.length} seçildi)
          </button>
        </>
      )}

      {/* Adım 4: Yaşam tarzı */}
      {step === 4 && (
        <div className="grid grid-cols-1 gap-3">
          {lifestyleOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSingle("lifestyle", opt.value)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-green-700/40 hover:bg-green-50 text-left ${
                answers.lifestyle === opt.value
                  ? "border-green-700 bg-green-50"
                  : "border-olive-border/30 bg-white"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm font-semibold text-green-900">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Adım 5: Beslenme */}
      {step === 5 && (
        <div className="grid grid-cols-1 gap-3">
          {dietOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSingle("diet", opt.value)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-green-700/40 hover:bg-green-50 text-left ${
                answers.diet === opt.value
                  ? "border-green-700 bg-green-50"
                  : "border-olive-border/30 bg-white"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-sm font-semibold text-green-900">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Adım 6: Hedef */}
      {step === 6 && (
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSingle("goal", opt.value)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:border-green-700/40 hover:bg-green-50 text-left ${
                answers.goal === opt.value
                  ? "border-green-700 bg-green-50"
                  : "border-olive-border/30 bg-white"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-semibold text-green-900 leading-snug">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Geri butonu */}
      {step > 1 && (
        <button
          onClick={goBack}
          className="mt-5 text-sm text-text-secondary hover:text-green-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Geri
        </button>
      )}
    </div>
  );
}
