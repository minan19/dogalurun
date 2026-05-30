import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getProductBySlug, products } from "@/data/products";
import { ProductDetailActions } from "@/components/ProductDetailActions";
import { ProductDetailImage } from "@/components/ProductDetailImage";
import { ShareButton } from "@/components/ShareButton";
import { SocialProofBadge } from "@/components/SocialProofBadge";
import { ProductReviews } from "@/components/ProductReviews";
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker";
import { StickyCartBar } from "@/components/StickyCartBar";
import { DealCountdown } from "@/components/DealCountdown";
import { ProductFAQ } from "@/components/ProductFAQ";
import { StockAlertButton } from "@/components/StockAlertButton";

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

const SITE = "https://hudaisifa.com";
const locales = ["tr", "en", "ar", "ru"] as const;

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const messages = (await import(`../../../../../messages/${locale}/common.json`)).default;
  const t = messages.products;
  const name = t?.[`name_${product.nameKey}`] ?? product.nameKey;
  const desc = t?.[`desc_${product.descriptionKey}`] ?? "";
  return {
    title: `${name} | Hüda-i Şifa`,
    description: desc,
    openGraph: {
      title: `${name} | Hüda-i Şifa`,
      description: desc,
      images: product.image ? [{ url: product.image, width: 600, height: 600, alt: name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Hüda-i Şifa`,
      description: desc,
      images: product.image ? [product.image] : [],
    },
    alternates: {
      canonical: `${SITE}/${locale}/products/${slug}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `${SITE}/${l}/products/${slug}`]),
        ["x-default", `${SITE}/tr/products/${slug}`],
      ]),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("products");
  const tNav = await getTranslations("nav");
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const badgeConfig = {
    expert: { label: t("badgeExpert"), cls: "bg-green-700 text-white" },
    bestseller: { label: t("badgeBestseller"), cls: "bg-gold-400 text-white" },
    new: { label: t("badgeNew"), cls: "bg-green-600 text-white" },
  };

  const productName = t(`name_${product.nameKey}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: t(`desc_${product.descriptionKey}`),
    image: product.image || undefined,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Hüda-i Şifa" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${SITE}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("pageTitle"), item: `${SITE}/${locale}/products` },
      { "@type": "ListItem", position: 3, name: productName, item: `${SITE}/${locale}/products/${product.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
            <Link href="/" className="hover:text-green-700 transition-colors">{tNav("home")}</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-700 transition-colors">{t("pageTitle")}</Link>
            <span>/</span>
            <span className="text-green-800 font-medium">{t(`name_${product.nameKey}`)}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Sol: Görsel */}
            <ProductDetailImage
              src={product.image}
              alt={t(`name_${product.nameKey}`)}
              badgeLabel={product.badge ? badgeConfig[product.badge].label : undefined}
              badgeCls={product.badge ? badgeConfig[product.badge].cls : undefined}
              discount={discount}
            />

            {/* Sağ: Bilgi */}
            <div className="flex flex-col gap-6">
              {/* Başlık */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{product.amount} · {product.brand}</span>
                  <ShareButton
                    title={t(`name_${product.nameKey}`)}
                    url={`${SITE}/${locale}/products/${product.slug}`}
                    label={t("shareProduct")}
                    copiedLabel={t("shareCopied")}
                  />
                </div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-green-900 leading-tight">
                  {t(`name_${product.nameKey}`)}
                </h1>
                <p className="mt-3 text-text-secondary leading-relaxed">
                  {t(`desc_${product.descriptionKey}`)}
                </p>
              </div>

              {/* Puan */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(product.rating) ? "text-gold-400" : "text-text-secondary/20"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-text-secondary">
                  {product.rating} · {product.reviewCount} {t("reviews")}
                </span>
              </div>

              {/* Sosyal kanıt */}
              <SocialProofBadge productId={product.id} />

              {/* İndirim geri sayımı */}
              {discount > 0 && (
                <DealCountdown productId={product.id} discount={discount} />
              )}

              {/* Uzman notu */}
              {product.expertNoteKey && (
                <div className="bg-green-50 border border-olive-border/40 rounded-xl px-4 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" />
                    </svg>
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">{t("expertNote")}</span>
                  </div>
                  <p className="text-sm text-green-800 italic leading-relaxed">
                    {t(`expert_${product.expertNoteKey}`)}
                  </p>
                </div>
              )}

              {/* Fiyat & Sepet */}
              <div id="product-actions">
                <ProductDetailActions
                  product={product}
                  addToCartLabel={t("addToCart")}
                />
              </div>

              {/* Stok tükendi bildirimi */}
              {(!product.inStock || product.stock === 0) && (
                <StockAlertButton productId={product.id} locale={locale} />
              )}

              {/* Teslimat tahmini */}
              {product.inStock && product.stock > 0 && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-blue-800">{t("deliveryToday")}</p>
                    <p className="text-[11px] text-blue-600/80">{t("deliveryEstimate")}</p>
                  </div>
                </div>
              )}

              {/* İçerik & Kullanım */}
              <div className="space-y-4">
                <div className="border border-olive-border/30 rounded-xl overflow-hidden">
                  <div className="bg-cream-100 px-4 py-3 border-b border-olive-border/20">
                    <h3 className="text-sm font-semibold text-green-800">{t("ingredients")}</h3>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {t(`ing_${product.ingredientsKey}`)}
                    </p>
                  </div>
                </div>

                <div className="border border-olive-border/30 rounded-xl overflow-hidden">
                  <div className="bg-cream-100 px-4 py-3 border-b border-olive-border/20">
                    <h3 className="text-sm font-semibold text-green-800">{t("usage")}</h3>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {t(`use_${product.usageKey}`)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Güven çubuğu */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🔬", label: t("detailTested") },
                  { icon: "🚚", label: t("detailShipping") },
                  { icon: "🔒", label: t("detailSecure") },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 bg-cream-100 rounded-xl p-3 text-center border border-olive-border/20">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] text-text-secondary font-medium leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ProductReviews
            productId={product.id}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />

          <ProductFAQ productId={product.id} />

          {/* Benzer Ürünler */}
          {(() => {
            const similar = products
              .filter(p =>
                p.id !== product.id &&
                (p.category === product.category ||
                  p.needs.some(n => product.needs.includes(n)))
              )
              .slice(0, 4);
            if (similar.length === 0) return null;
            return (
              <section className="mt-16">
                <h2 className="text-xl font-bold text-green-900 mb-6">{t("similarProducts")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similar.map(p => {
                    const nameKey = `name_${p.nameKey}` as Parameters<typeof t>[0];
                    const descKey = `desc_${p.descriptionKey}` as Parameters<typeof t>[0];
                    const pDiscount = p.originalPrice
                      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                      : 0;
                    return (
                      <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-2xl border border-olive-border/30 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="relative aspect-square bg-green-50 flex items-center justify-center overflow-hidden">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.brand}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <span className="text-4xl opacity-20">🌿</span>
                          )}
                          {pDiscount > 0 && (
                            <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">-{pDiscount}%</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-[11px] text-text-secondary/70 mb-0.5">{p.amount} · {p.brand}</p>
                          <p className="text-sm font-semibold text-green-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                            {t(nameKey)}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-green-800">{p.price.toLocaleString("tr-TR")} ₺</span>
                            {p.originalPrice && (
                              <span className="text-[11px] text-text-secondary/60 line-through">{p.originalPrice.toLocaleString("tr-TR")} ₺</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* Son Görüntülenenler — client component ile takip */}
          <RecentlyViewedTracker
            productId={product.id}
            locale={locale}
            productNames={Object.fromEntries(products.map(p => [p.id, t(`name_${p.nameKey}` as Parameters<typeof t>[0])]))}
          />
        </div>
      </main>
      <Footer />
      <StickyCartBar product={product} watchId="product-actions" />
    </div>
  );
}
