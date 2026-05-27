import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/blog?limit=20`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.articles?.find((a: Article) => a.slug === slug) ?? null;
  } catch {
    return null;
  }
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

  const article = await getArticle(slug);

  if (!article) notFound();

  const publishedDate = new Date(article.published_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#5A5E52] mb-8 pb-6 border-b border-[#d8e4c8]">
            <span className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-full bg-[#556B2F] text-white flex items-center justify-center text-xs font-bold">
                {article.author.charAt(0)}
              </span>
              {article.author}
            </span>
            <span>📅 {publishedDate}</span>
            <span>⏱ {article.read_time} dk okuma</span>
          </div>

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

          {/* Back button */}
          <div className="mt-12 pt-8 border-t border-[#d8e4c8]">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-[#556B2F] font-semibold hover:underline"
            >
              ← Tüm Yazılara Dön
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
