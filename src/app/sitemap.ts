import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE = "https://hudaisifa.com";
const locales = ["tr", "en", "ar", "ru"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "",                    priority: 1.0,  freq: "daily"   },
    { path: "/products",           priority: 0.9,  freq: "daily"   },
    { path: "/recommendations",    priority: 0.8,  freq: "weekly"  },
    { path: "/brands",             priority: 0.8,  freq: "weekly"  },
    { path: "/experts",            priority: 0.8,  freq: "weekly"  },
    { path: "/blog",               priority: 0.7,  freq: "daily"   },
    { path: "/faq",                priority: 0.6,  freq: "monthly" },
    { path: "/shipping",           priority: 0.5,  freq: "monthly" },
    { path: "/privacy",            priority: 0.4,  freq: "monthly" },
    { path: "/terms",              priority: 0.4,  freq: "monthly" },
    { path: "/supplement-info",    priority: 0.6,  freq: "monthly" },
    { path: "/order-tracking",     priority: 0.5,  freq: "weekly"  },
    { path: "/account",            priority: 0.3,  freq: "monthly" },
    { path: "/wishlist",           priority: 0.3,  freq: "monthly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(({ path, priority, freq }) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: freq as MetadataRoute.Sitemap[0]["changeFrequency"],
      priority,
    }))
  );

  const productEntries: MetadataRoute.Sitemap = products.flatMap((p) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  return [...staticEntries, ...productEntries];
}
