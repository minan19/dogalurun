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

export const metadata: Metadata = {
  title: "Hüda-i Şifa | Doğal Takviye & Organik Ürünler",
  description: "Uzman diyetisyen ve eczacılar tarafından onaylı, sertifikalı laboratuvarlarda test edilmiş doğal takviye ve organik ürünler. Ücretsiz danışmanlık, güvenli ödeme.",
  keywords: ["doğal takviye", "organik ürün", "vitamin", "mineral", "takviye edici gıda", "uzman danışman"],
  openGraph: {
    title: "Hüda-i Şifa | Doğal Takviye & Organik Ürünler",
    description: "Uzman onaylı, test edilmiş doğal takviye ürünleri. Ücretsiz danışmanlık.",
    type: "website",
    locale: "tr_TR",
    siteName: "Hüda-i Şifa",
  },
};

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
        <SportsBanner />
        <BeautyBanner />
        <BlogTeaser />
        <ExpertNote />
      </main>
      <Footer />
    </div>
  );
}
