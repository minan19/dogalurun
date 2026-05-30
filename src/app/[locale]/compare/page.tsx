import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompareContent } from "@/components/CompareContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CompareContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
