"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Supabase puts the token in the URL hash — we need to exchange it
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      // Supabase auth will auto-detect from URL
    }
  }, []);

  // Suppress unused variable warning for searchParams (kept for future token handling)
  void searchParams;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError(t("passwordTooShort"));
      return;
    }
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || t("passwordUpdateFailed"));
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/tr/account"), 2500);
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center p-8">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-[#2D4A1E] mb-2">
          {t("passwordUpdated")}
        </h2>
        <p className="text-[#5A5E52] text-sm">
          {t("redirectingToAccount")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#5A5E52] mb-1.5">
          {t("newPasswordLabel")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("newPasswordPlaceholder")}
          required
          minLength={8}
          className="w-full px-4 py-3 border border-[#d8e4c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] bg-[#fafaf8]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#5A5E52] mb-1.5">
          {t("confirmPasswordLabel")}
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={t("confirmPasswordPlaceholder")}
          required
          className="w-full px-4 py-3 border border-[#d8e4c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#556B2F]/30 focus:border-[#556B2F] bg-[#fafaf8]"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#556B2F] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#4a5f28] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z"
              />
            </svg>
            {t("updating")}
          </>
        ) : (
          t("updatePassword")
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return <ResetPasswordPageInner />;
}

function ResetPasswordPageInner() {
  const t = useTranslations("auth");
  return (
    <main className="min-h-screen bg-[#F4F6F3] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[#d8e4c8] p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#556B2F] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#2D4A1E]">{t("resetPasswordTitle")}</h1>
          <p className="text-sm text-[#5A5E52] mt-1">{t("resetPasswordSubtitle")}</p>
        </div>
        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#556B2F] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
