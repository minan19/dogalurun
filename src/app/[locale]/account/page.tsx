import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountContent } from "@/components/AccountContent";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Header />
      <main>
        <AccountContent />
      </main>
      <Footer />
    </div>
  );
}
