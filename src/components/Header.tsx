"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { SearchOverlay } from "@/components/SearchOverlay";
import { CurrencySelector } from "@/components/CurrencySelector";
import Image from "next/image";

function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const currentLocale = params.locale as Locale;
  const t = useTranslations("language");

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span className="text-text-secondary/40 mx-1">|</span>}
          <button
            onClick={() => router.replace(pathname, { locale })}
            className={`transition-colors ${
              currentLocale === locale
                ? "text-green-700 font-semibold"
                : "text-text-secondary hover:text-green-800"
            }`}
          >
            {locale.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, count } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const cartCount = mounted ? count() : 0;

  const navItems = [
    { key: "products", href: "/products" },
    { key: "recommendations", href: "/recommendations" },
    { key: "brands", href: "/brands" },
    { key: "experts", href: "/experts" },
    { key: "blog", href: "/blog" },
  ] as const;

  return (
    <header className="sticky top-0 z-50">
      {/* Üst altın şerit */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="bg-cream-50/95 backdrop-blur-sm border-b border-olive-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 overflow-hidden h-full">
              <Image
                src="/logo.png"
                alt="Hüda-i Şifa"
                width={112}
                height={112}
                className="w-28 h-28 object-contain mix-blend-multiply"
                priority
                loading="eager"
                unoptimized
              />
              <div className="hidden sm:block">
                <span
                  className="block leading-tight"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "1.15rem",
                    color: "#2F3B1A",
                    letterSpacing: "0.01em",
                  }}
                >
                  Hüda-i Şifa
                </span>
                {/* Altın gradient ince çizgi */}
                <span
                  className="block my-[3px]"
                  style={{
                    height: "1px",
                    background: "linear-gradient(to right, #C49A3C, transparent)",
                  }}
                />
                <span
                  className="block"
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "0.6rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.13em",
                    color: "#C49A3C",
                  }}
                >
                  Organik Ürünler
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-green-800 hover:bg-green-50 px-3 py-1.5 rounded-md transition-all font-medium whitespace-nowrap"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3">
              <LanguageSwitcher />
              <div className="hidden xl:block"><CurrencySelector /></div>

              {/* Search */}
              {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-text-secondary hover:text-green-700 transition-colors"
                aria-label={t("search")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Account + Admin Dropdown */}
              <div className="relative group">
                <Link
                  href="/account"
                  className="text-text-secondary hover:text-green-700 transition-colors"
                  aria-label={t("account")}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                  </svg>
                </Link>
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-olive-border/30 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-150 z-50">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-green-800 hover:bg-green-50 rounded-t-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                    </svg>
                    {t("account")}
                  </Link>
                  <a
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-green-800 hover:bg-green-50 rounded-b-xl border-t border-olive-border/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Admin Panel
                  </a>
                </div>
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative bg-green-700 text-white p-2 rounded-lg hover:bg-green-800 transition-colors"
                aria-label={t("cart")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden text-text-secondary"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <nav className="lg:hidden py-4 border-t border-olive-border/30">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-text-secondary hover:text-green-800 hover:bg-green-50 transition-all font-medium py-2 px-3 rounded-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
