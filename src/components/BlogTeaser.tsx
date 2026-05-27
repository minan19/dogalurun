"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const postColors = [
  "bg-blue-50 text-blue-700",
  "bg-amber-50 text-amber-700",
  "bg-indigo-50 text-indigo-700",
];
const postEmojis = ["🐟", "☀️", "🌙"];

export function BlogTeaser() {
  const t = useTranslations("blog");

  const posts = [
    {
      category: t("post1Category"),
      title: t("post1Title"),
      excerpt: t("post1Excerpt"),
      author: t("post1Author"),
      date: t("post1Date"),
      readTime: t("post1ReadTime"),
      emoji: postEmojis[0],
      color: postColors[0],
    },
    {
      category: t("post2Category"),
      title: t("post2Title"),
      excerpt: t("post2Excerpt"),
      author: t("post2Author"),
      date: t("post2Date"),
      readTime: t("post2ReadTime"),
      emoji: postEmojis[1],
      color: postColors[1],
    },
    {
      category: t("post3Category"),
      title: t("post3Title"),
      excerpt: t("post3Excerpt"),
      author: t("post3Author"),
      date: t("post3Date"),
      readTime: t("post3ReadTime"),
      emoji: postEmojis[2],
      color: postColors[2],
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="flex items-end justify-between mb-10">
          <div className="animate-fade-in-up">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">{t("label")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800">{t("title")}</h2>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900 transition-colors">
            {t("viewAll")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Kart grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Link href="/blog"
                className="group flex flex-col h-full bg-cream-50 hover:bg-green-50 border border-olive-border/30 hover:border-green-700/20 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-green-700/10">
                {/* Emoji başlık alanı */}
                <div className="h-24 flex items-center justify-center text-4xl bg-white border-b border-olive-border/20">
                  {p.emoji}
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${p.color}`}>
                    {p.category}
                  </span>
                  <h3 className="text-sm font-bold text-green-800 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 flex-1">
                    {p.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-text-secondary/60 pt-1 border-t border-olive-border/20">
                    <span>{p.author}</span>
                    <span>{p.readTime} {t("readMinutes")}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobil "Tüm Yazılar" */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 border border-green-700/30 px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors">
            {t("viewAllMobile")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
