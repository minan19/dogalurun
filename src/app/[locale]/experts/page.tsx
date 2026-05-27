import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExpertsContent } from "@/components/ExpertsContent";

export default async function ExpertsPage({
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
        <ExpertsContent />
      </main>
      <Footer />
    </div>
  );
}
