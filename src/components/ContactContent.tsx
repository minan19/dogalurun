"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToastStore } from "@/store/toastStore";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactContent() {
  const t = useTranslations("contact");
  const { show: addToast } = useToastStore();
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setFormError(data.error ?? "Mesaj gönderilemedi, lütfen tekrar deneyin.");
        return;
      }
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      addToast(t("successMessage"));
    } catch {
      setFormError("Bağlantı hatası, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-cream-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800 animate-fade-in-up"
          >
            {t("title")}
          </h1>
          <p
            className="mt-4 text-lg text-text-secondary animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div
              className="lg:col-span-3 animate-fade-in-up"
            >
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">{t("successTitle")}</h3>
                  <p className="text-text-secondary text-sm max-w-xs">{t("successBody")}</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-sm text-green-700 underline underline-offset-2"
                  >
                    {t("sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1.5">
                        {t("nameLabel")} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder={t("namePlaceholder")}
                        className="w-full px-4 py-3 rounded-xl border border-olive-border/50 bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-800 mb-1.5">
                        {t("emailLabel")} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder={t("emailPlaceholder")}
                        className="w-full px-4 py-3 rounded-xl border border-olive-border/50 bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      {t("subjectLabel")}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder={t("subjectPlaceholder")}
                      className="w-full px-4 py-3 rounded-xl border border-olive-border/50 bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1.5">
                      {t("messageLabel")} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={t("messagePlaceholder")}
                      className="w-full px-4 py-3 rounded-xl border border-olive-border/50 bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 hover:-translate-y-0.5 transition-all shadow-lg shadow-green-700/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t("sending")}
                      </>
                    ) : t("send")}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div
              className="lg:col-span-2 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-gold-300 rounded-2xl p-6 border border-gold-400/30 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-1">{t("address")}</h3>
                  <p className="text-sm text-text-secondary">{t("addressText")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-1">{t("phone")}</h3>
                  <p className="text-sm text-text-secondary">{t("phoneText")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-1">{t("email")}</h3>
                  <p className="text-sm text-text-secondary">{t("emailText")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-1">{t("workingHours")}</h3>
                  <p className="text-sm text-text-secondary">{t("workingHoursText")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
