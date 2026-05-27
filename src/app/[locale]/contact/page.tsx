import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "İletişim | Hüda-i Şifa",
  description: "Sorularınız için bize ulaşın. Hafta içi 09-18 saatleri arasında müşteri hizmetleri.",
  openGraph: { title: "İletişim | Hüda-i Şifa", images: [{ url: "/logo.png" }] },
};
import { Footer } from "@/components/Footer";
import { ContactContent } from "@/components/ContactContent";

export default async function ContactPage({
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
        <ContactContent />
      </main>
      <Footer />
    </div>
  );
}
