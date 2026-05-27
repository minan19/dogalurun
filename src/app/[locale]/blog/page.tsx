import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sağlık & Beslenme Blogu | Hüda-i Şifa",
  description: "Uzman yazarlardan doğal sağlık, beslenme ve takviye ürünleri hakkında bilgilendirici makaleler.",
  openGraph: { title: "Sağlık & Beslenme Blogu | Hüda-i Şifa", images: [{ url: "/logo.png" }] },
};

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  author?: string;
  category?: string;
  image?: string;
  read_time?: number;
  published_at?: string;
}

const categoryColors: Record<string, string> = {
  Beslenme: "bg-green-100 text-green-700",
  Bağışıklık: "bg-blue-100 text-blue-700",
  Uyku: "bg-purple-100 text-purple-700",
  Sindirim: "bg-orange-100 text-orange-700",
  Spor: "bg-red-100 text-red-700",
  Cilt: "bg-pink-100 text-pink-700",
  "Cilt Sağlığı": "bg-pink-100 text-pink-700",
  Sağlık: "bg-teal-100 text-teal-700",
  Mineraller: "bg-amber-100 text-amber-700",
};

async function getArticles(): Promise<Article[]> {
  try {
    // Use absolute URL for server-side fetch in Next.js
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/blog?limit=10`, {
      next: { revalidate: 300 }, // cache 5 minutes
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.articles) ? json.articles : [];
  } catch {
    return [];
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(dateStr)
    );
  } catch {
    return dateStr;
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = await getArticles();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Sağlık & Beslenme Blog</h1>
            <p className="mt-2 text-text-secondary text-sm">
              Uzmanlarımız tarafından hazırlanan, bilime dayalı içerikler.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 text-text-secondary">
              <p>İçerikler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
            </div>
          ) : (
            <>
              {/* Öne çıkan yazı */}
              {featured && (
                <div className="bg-white rounded-2xl border border-olive-border/30 overflow-hidden mb-8 hover:shadow-lg transition-all group cursor-pointer">
                  {featured.image ? (
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="bg-green-700 h-48 sm:h-56 flex items-center justify-center">
                      <span className="text-7xl opacity-30">🌿</span>
                    </div>
                  )}
                  <div className="p-6">
                    {featured.category && (
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          categoryColors[featured.category] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {featured.category}
                      </span>
                    )}
                    <h2 className="mt-3 text-xl font-bold text-green-900 group-hover:text-green-700 transition-colors">
                      {featured.title}
                    </h2>
                    {featured.summary && (
                      <p className="mt-2 text-text-secondary text-sm leading-relaxed line-clamp-2">
                        {featured.summary}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-3 text-xs text-text-secondary/60 flex-wrap">
                      {featured.author && <span>{featured.author}</span>}
                      {featured.author && featured.published_at && <span>·</span>}
                      {featured.published_at && <span>{formatDate(featured.published_at)}</span>}
                      {featured.read_time && (
                        <>
                          <span>·</span>
                          <span>{featured.read_time} dk okuma</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Diğer yazılar */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-2xl border border-olive-border/30 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer"
                    >
                      {article.image ? (
                        <div className="relative h-36 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="bg-green-50 h-32 flex items-center justify-center">
                          <span className="text-5xl opacity-20">🌿</span>
                        </div>
                      )}
                      <div className="p-4 flex flex-col gap-2">
                        {article.category && (
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full self-start ${
                              categoryColors[article.category] ?? "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {article.category}
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-green-900 group-hover:text-green-700 transition-colors leading-snug">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-text-secondary/60 flex-wrap">
                          {article.author && <span>{article.author}</span>}
                          {article.author && article.published_at && <span>·</span>}
                          {article.published_at && <span>{formatDate(article.published_at)}</span>}
                          {article.read_time && (
                            <>
                              <span>·</span>
                              <span>{article.read_time} dk</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
