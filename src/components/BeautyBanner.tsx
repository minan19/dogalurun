"use client";

import { Link } from "@/i18n/navigation";

export function BeautyBanner() {
  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-800 via-pink-700 to-rose-500 px-8 py-12 sm:px-12 sm:py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 text-9xl select-none">💆</div>
            <div className="absolute bottom-4 left-8 text-7xl select-none">✨</div>
          </div>
          <div className="relative z-10 max-w-lg">
            <span className="inline-block bg-rose-500/20 text-rose-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              Cilt & Güzellik
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Doğal Güzellik Sırları Sende
            </h2>
            <p className="text-rose-100 mb-6 text-sm sm:text-base">
              Hyalüronik Asit, Kolajen, Kuşburnu Yağı ve daha fazlası. İçten dışa doğal bakım.
            </p>
            <Link
              href="/beauty"
              className="inline-block bg-white text-rose-700 font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors text-sm sm:text-base"
            >
              Güzellik Ürünlerini Keşfet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
