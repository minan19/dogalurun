import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogShareButtons } from "@/components/BlogShareButtons";

// Article type matching the API
interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  image: string;
  read_time: number;
  published_at: string;
  is_published: boolean;
}

async function getAllArticles(): Promise<Article[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/blog?limit=20`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

async function getArticle(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Hüda-i Şifa Blog`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.image ? [{ url: article.image }] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const [t, allArticles] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getAllArticles(),
  ]);

  const article = allArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug && a.is_published)
    .filter((a) => a.category === article.category)
    .slice(0, 3);

  const otherArticles = relatedArticles.length < 3
    ? [
        ...relatedArticles,
        ...allArticles
          .filter((a) => a.slug !== slug && a.is_published && a.category !== article.category)
          .slice(0, 3 - relatedArticles.length),
      ]
    : relatedArticles;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://hudaisifa.com");
  const articleUrl = `${siteUrl}/${locale}/blog/${slug}`;

  const publishedDate = new Date(article.published_at).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relatedLabel: Record<string, string> = {
    tr: "İlgili Yazılar",
    en: "Related Posts",
    ar: "مقالات ذات صلة",
    ru: "Похожие статьи",
  };

  return (
    <div className="min-h-screen bg-[#F4F6F3]">
      <Header />
      <main>
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          {article.image && (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl mx-auto">
            <span className="inline-block bg-[#556B2F] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#5A5E52] mb-4 pb-6 border-b border-[#d8e4c8]">
            <span className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-full bg-[#556B2F] text-white flex items-center justify-center text-xs font-bold">
                {article.author.charAt(0)}
              </span>
              {article.author}
            </span>
            <span>📅 {publishedDate}</span>
            <span>⏱ {article.read_time} dk okuma</span>
          </div>

          {/* Share */}
          <BlogShareButtons title={article.title} url={articleUrl} locale={locale} />

          {/* Summary */}
          <p className="text-lg text-[#2D4A1E] font-medium leading-relaxed mb-8 p-4 bg-[#e8f0e0] rounded-xl border-l-4 border-[#556B2F]">
            {article.summary}
          </p>

          {/* Body */}
          <div className="prose prose-green max-w-none text-[#2D3A1F] leading-relaxed space-y-4">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-base text-[#3a4a2e] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom share */}
          <div className="mt-10">
            <BlogShareButtons title={article.title} url={articleUrl} locale={locale} />
          </div>

          {/* Back button */}
          <div className="mt-4 pt-8 border-t border-[#d8e4c8]">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-[#556B2F] font-semibold hover:underline"
            >
              {t("blogBackToAll")}
            </Link>
          </div>

          {/* Related posts */}
          {otherArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-[#2D4A1E] mb-5">{relatedLabel[locale] ?? relatedLabel.tr}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/${locale}/blog/${rel.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-[#d8e4c8] bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-36 overflow-hidden">
                      {rel.image ? (
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e8f0e0]" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#556B2F] bg-[#e8f0e0] px-2 py-0.5 rounded-full">
                        {rel.category}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-[#2D3A1F] leading-snug line-clamp-2 group-hover:text-[#556B2F] transition-colors">
                        {rel.title}
                      </p>
                      <p className="mt-1 text-xs text-[#5A5E52]">⏱ {rel.read_time} dk</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
