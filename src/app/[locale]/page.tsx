import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { NeedsSection } from "@/components/NeedsSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { StatsStrip } from "@/components/StatsStrip";
import { BlogTeaser } from "@/components/BlogTeaser";
import { ExpertNote } from "@/components/ExpertNote";
import { Footer } from "@/components/Footer";
import { SportsBanner } from "@/components/SportsBanner";
import { BeautyBanner } from "@/components/BeautyBanner";
import { NewsletterSection } from "@/components/NewsletterSection";
import { RecentlyViewedSection } from "@/components/RecentlyViewedSection";
import { FlashSaleSection } from "@/components/FlashSaleSection";

const SITE = "https://hudaisifa.com";
const locales = ["tr", "en", "ar", "ru"] as const;

const OG_LOCALE: Record<string, string> = {
  tr: "tr_TR", en: "en_US", ar: "ar_SA", ru: "ru_RU",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}/common.json`)).default;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      type: "website",
      locale: OG_LOCALE[locale] ?? "tr_TR",
      siteName: "Hüda-i Şifa",
      url: `${SITE}/${locale}`,
    },
    alternates: {
      canonical: `${SITE}/${locale}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${SITE}/${l}`]),
        ["x-default", `${SITE}/tr`],
      ]),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <StatsStrip />
        <NeedsSection />
        <FeaturedProducts />
        <FlashSaleSection />
        <SportsBanner />
        <BeautyBanner />
        <BlogTeaser />
        <ExpertNote />
        <RecentlyViewedSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
