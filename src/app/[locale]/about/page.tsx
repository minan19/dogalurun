import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Hakkımızda | Hüda-i Şifa",
  description: "Hüda-i Şifa olarak uzman onaylı, bilimsel destekli doğal ürünleri güvenle sunuyoruz.",
  openGraph: { title: "Hakkımızda | Hüda-i Şifa", images: [{ url: "/logo.png" }] },
};
import { Footer } from "@/components/Footer";
import { AboutContent } from "@/components/AboutContent";

export default async function AboutPage({
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
        <AboutContent />
      </main>
      <Footer />
    </div>
  );
}
