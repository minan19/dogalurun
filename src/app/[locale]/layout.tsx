import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { isRtl } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ToastContainer } from "@/components/ToastContainer";
import { NavigationProgress } from "@/components/NavigationProgress";
import { FloatingButtons } from "@/components/FloatingButtons";
import { CartFlyAnimation } from "@/components/CartFlyAnimation";
import { MobileNavBar } from "@/components/MobileNavBar";
import { GeoDetector } from "@/components/GeoDetector";
import { RegionalHealthBanner } from "@/components/RegionalHealthBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CookieBanner } from "@/components/CookieBanner";
import { CartAbandonGuard } from "@/components/CartAbandonGuard";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { BackToTop } from "@/components/BackToTop";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { CompareBar } from "@/components/CompareBar";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#556B2F",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const messages = (await import(`../../../messages/${locale}/common.json`))
    .default;

  return {
    metadataBase: new URL("https://hudaisifa.com"),
    title: messages.meta.title,
    description: messages.meta.description,
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.png", type: "image/png" },
        { url: "/logo.png", sizes: "192x192", type: "image/png" },
      ],
      apple: { url: "/logo.png", sizes: "180x180", type: "image/png" },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Hüda-i Şifa",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <GoogleAnalytics />
      <div lang={locale} dir={dir} className={`${inter.variable} font-sans antialiased`}>
        <AnnouncementBar />
        <GeoDetector />
        <NavigationProgress />
        <RegionalHealthBanner />
        <div className="animate-fade-in-up">{children}</div>
        <CartDrawer />
        <CartFlyAnimation />
        <MobileNavBar />
        <WhatsAppButton />
        <FloatingButtons />
        <CookieBanner />
        <CartAbandonGuard />
        <BackToTop />
        <ExitIntentPopup />
        <CompareBar />
        <ToastContainer />
      </div>
    </NextIntlClientProvider>
  );
}
