"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface SearchOverlayProps {
  onClose: () => void;
}

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  brand: string;
  category: string;
}

function categoryEmoji(cat?: string) {
  const map: Record<string, string> = {
    vitamin:"💊", mineral:"💎", herbal:"🌿", omega:"🐟",
    probiotic:"🦠", protein:"💪", antioxidant:"🍇", collagen:"✨",
  };
  return map[cat ?? ""] ?? "🌱";
}

const RECENT_KEY = "hudai_recent_searches";
function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(q: string) {
  const prev = getRecent().filter((r) => r !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 5)));
}
function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

const suggestionsByLocale: Record<string, string[]> = {
  tr: ["Omega-3", "Probiyotik", "Vitamin D", "Magnezyum", "Organik Bal", "Çörek Otu"],
  en: ["Omega-3", "Probiotic", "Vitamin D", "Magnesium", "Organic Honey", "Black Cumin"],
  ar: ["أوميغا-3", "بروبيوتيك", "فيتامين د", "المغنيسيوم", "عسل عضوي", "حبة البركة"],
  ru: ["Омега-3", "Пробиотик", "Витамин D", "Магний", "Органический мёд", "Чёрный тмин"],
};

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "tr";
  const t = useTranslations("nav");
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = suggestionsByLocale[locale] ?? suggestionsByLocale.tr;

  useEffect(() => {
    inputRef.current?.focus();
    setRecent(getRecent());
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  // Debounced API search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, locale]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, -1)); }
    if (e.key === "Enter" && highlighted >= 0 && results[highlighted]) {
      const p = results[highlighted];
      saveRecent(query.trim());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/products/${p.slug}` as any);
      onClose();
    }
  }, [highlighted, results, query, onClose, router]);

  const handleSelect = (q: string) => {
    saveRecent(q);
    setRecent(getRecent());
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-olive-border/30 overflow-hidden">

          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-olive-border/20">
            <svg className="w-5 h-5 text-text-secondary/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlighted(-1); }}
              onKeyDown={handleKeyDown}
              placeholder={t("searchPlaceholder")}
              className="flex-1 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => { setQuery(""); setHighlighted(-1); inputRef.current?.focus(); }} className="p-1 rounded hover:bg-cream-100 transition-colors">
                <svg className="w-4 h-4 text-text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="text-xs text-text-secondary/40 hover:text-green-700 transition-colors shrink-0 ml-1 border border-olive-border/30 rounded px-1.5 py-0.5">
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto">
            {query.trim().length >= 2 ? (
              isLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-sm text-text-secondary">{t("searchSearching")}</p>
                </div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((p, i) => {
                    const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={() => handleSelect(query.trim())}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors ${i === highlighted ? "bg-green-50" : "hover:bg-green-50/60"}`}
                        >
                          <div className="w-10 h-10 rounded-xl border border-olive-border/20 flex items-center justify-center shrink-0 bg-gradient-to-br from-green-50 to-teal-50 text-xl">
                            {categoryEmoji(p.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-text-secondary">{p.brand}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-green-800">{p.price.toLocaleString("tr-TR")} ₺</p>
                            {discount > 0 && <p className="text-[10px] text-red-500 font-semibold">-%{discount}</p>}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                  <li className="px-4 py-2.5 border-t border-olive-border/10">
                    <Link
                      href={`/products`}
                      onClick={() => handleSelect(query.trim())}
                      className="text-xs text-green-700 hover:underline font-medium"
                    >
                      {t("searchAllResults", { query })}
                    </Link>
                  </li>
                </ul>
              ) : (
                <div className="px-4 py-8 text-center">
                  <span className="text-2xl block mb-2">🔍</span>
                  <p className="text-sm text-text-secondary">{t("searchNoResults", { query })}</p>
                  <p className="text-xs text-text-secondary/60 mt-1">{t("searchNoResultsHint")}</p>
                </div>
              )
            ) : (
              <div className="px-4 py-4 space-y-4">
                {recent.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] text-text-secondary/60 font-medium uppercase tracking-wide">{t("searchRecent")}</p>
                      <button onClick={() => { clearRecent(); setRecent([]); }} className="text-[10px] text-text-secondary/40 hover:text-red-400 transition-colors">
                        {t("searchClear")}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button key={r} onClick={() => setQuery(r)}
                          className="text-xs flex items-center gap-1.5 bg-cream-100 hover:bg-green-50 text-text-secondary hover:text-green-800 px-3 py-1.5 rounded-full border border-olive-border/20 transition-colors">
                          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-[11px] text-text-secondary/60 font-medium uppercase tracking-wide mb-2">{t("searchPopular")}</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => setQuery(s)}
                        className="text-xs bg-cream-100 hover:bg-green-50 text-green-800 px-3 py-1.5 rounded-full border border-olive-border/30 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
