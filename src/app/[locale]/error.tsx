"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-7xl sm:text-8xl font-bold text-green-700/20 mb-4">
            500
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3">
            Bir Hata Oluştu
          </h1>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Beklenmeyen bir sorun oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={reset}
              className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 hover:-translate-y-0.5 transition-all"
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="inline-block px-6 py-3 border border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 hover:-translate-y-0.5 transition-all"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
