"use client";

import { useState, useCallback } from "react";
import { type Product, type Category, type NeedTag } from "@/data/products";
import { exportCsv } from "@/lib/exportCsv";
import { useAdminStore } from "@/store/adminStore";
import { useProductStore } from "@/store/productStore";

/* ─── Sabitler ─────────────────────────────────────────────────── */

const categoryLabels: Record<Category, string> = {
  supplements: "Takviye Edici",
  "organic-food": "Organik Gıda",
  "personal-care": "Kişisel Bakım",
  special: "Özel Seçim",
  brands: "Marka Ürünleri",
};

const needLabels: Record<NeedTag, string> = {
  immunity: "Bağışıklık",
  energy: "Enerji",
  digestion: "Sindirim",
  sleep: "Uyku",
  stress: "Stres",
  sport: "Spor",
  skin: "Cilt",
  joints: "Eklem",
};

const ALL_NEEDS: NeedTag[] = ["immunity", "energy", "digestion", "sleep", "stress", "sport", "skin", "joints"];
const ALL_CATEGORIES: Category[] = ["supplements", "organic-food", "personal-care", "special", "brands"];

const badgeLabel: Record<string, string> = { expert: "Uzman", bestseller: "Çok Satan", new: "Yeni" };
const badgeColor: Record<string, string> = {
  expert: "bg-[#EAF0DC] text-[#556B2F]",
  bestseller: "bg-amber-50 text-amber-700",
  new: "bg-blue-50 text-blue-600",
};

/* ─── Yardımcı ─────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function camelify(text: string): string {
  return text.replace(/[-\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toLowerCase());
}

function genId(): string {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

/* ─── Form State ───────────────────────────────────────────────── */

interface FormState {
  name: string;
  description: string;
  brand: string;
  amount: string;
  category: Category;
  needs: NeedTag[];
  price: string;
  originalPrice: string;
  badge: "" | "expert" | "new" | "bestseller";
  image: string;
  ingredients: string;
  usage: string;
  expertNote: string;
  inStock: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  brand: "Hüda-i Şifa",
  amount: "",
  category: "supplements",
  needs: [],
  price: "",
  originalPrice: "",
  badge: "",
  image: "",
  ingredients: "",
  usage: "",
  expertNote: "",
  inStock: true,
};

function productToForm(p: Product): FormState {
  return {
    name: p.nameKey,
    description: p.descriptionKey,
    brand: p.brand,
    amount: p.amount,
    category: p.category,
    needs: [...p.needs],
    price: String(p.price),
    originalPrice: p.originalPrice ? String(p.originalPrice) : "",
    badge: p.badge ?? "",
    image: p.image,
    ingredients: p.ingredientsKey,
    usage: p.usageKey,
    expertNote: p.expertNoteKey ?? "",
    inStock: p.inStock,
  };
}

function formToProduct(form: FormState, existing?: Product): Product {
  const key = camelify(slugify(form.name) || "urun");
  const id = existing?.id ?? genId();
  const slug = existing?.slug ?? (slugify(form.name) || id);
  return {
    id,
    slug,
    nameKey: key,
    descriptionKey: key + "Desc",
    category: form.category,
    needs: form.needs,
    price: parseFloat(form.price) || 0,
    originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
    currency: "TRY",
    image: form.image || "/products/placeholder.jpg",
    badge: form.badge || undefined,
    expertNoteKey: form.expertNote ? key + "Expert" : undefined,
    ingredientsKey: key + "Ingredients",
    usageKey: key + "Usage",
    amount: form.amount,
    brand: form.brand,
    inStock: form.inStock,
    stock: existing?.stock ?? 100,
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
  };
}

/* ─── Hata Kontrolü ────────────────────────────────────────────── */

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const e: Errors = {};
  if (!form.name.trim()) e.name = "Ürün adı zorunlu";
  if (!form.description.trim()) e.description = "Açıklama zorunlu";
  if (!form.amount.trim()) e.amount = "Miktar / hacim zorunlu";
  if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
    e.price = "Geçerli bir fiyat girin";
  if (form.originalPrice && isNaN(parseFloat(form.originalPrice)))
    e.originalPrice = "Geçersiz değer";
  if (!form.ingredients.trim()) e.ingredients = "İçerik bilgisi zorunlu";
  if (!form.usage.trim()) e.usage = "Kullanım talimatı zorunlu";
  return e;
}

/* ─── Ürün Form Modalı ─────────────────────────────────────────── */

interface ProductModalProps {
  mode: "add" | "edit";
  initial: FormState;
  onSave: (form: FormState) => void;
  onClose: () => void;
}

function ProductModal({ mode, initial, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }, []);

  const toggleNeed = (need: NeedTag) => {
    set("needs", form.needs.includes(need) ? form.needs.filter((n) => n !== need) : [...form.needs, need]);
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 320)); // simulated async
    onSave(form);
    setSaving(false);
  };

  const inputCls = (key: keyof FormState) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-[#FAFAF7] transition-colors ${
      errors[key]
        ? "border-red-300 focus:border-red-400"
        : "border-[#d8e4c8] focus:border-[#556B2F]/60"
    }`;

  const label = (text: string, required = false) => (
    <label className="text-xs font-semibold text-[#2F3B1A] block mb-1.5">
      {text}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  const errMsg = (key: keyof FormState) =>
    errors[key] ? <p className="text-[10px] text-red-500 mt-1">{errors[key]}</p> : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#d8e4c8] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d8e4c8] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#EAF0DC] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#556B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {mode === "add"
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                }
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2F3B1A]">
                {mode === "add" ? "Yeni Ürün Ekle" : "Ürün Düzenle"}
              </h3>
              <p className="text-[10px] text-[#5A5E52]">
                {mode === "add" ? "Tüm zorunlu alanları doldurun" : "Değişiklikler kaydedilecek"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F4F6F3] transition-colors text-[#5A5E52]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Bölüm 1 — Temel Bilgiler */}
          <section>
            <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest mb-3">Temel Bilgiler</p>
            <div className="space-y-3">
              <div>
                {label("Ürün Adı", true)}
                <input
                  type="text"
                  placeholder="ör. Vitamin D3 + K2"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls("name")}
                />
                {errMsg("name")}
              </div>

              <div>
                {label("Kısa Açıklama", true)}
                <textarea
                  rows={2}
                  placeholder="Ürünü kısa ve net tanımlayan açıklama..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={inputCls("description") + " resize-none"}
                />
                {errMsg("description")}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  {label("Marka", true)}
                  <input
                    type="text"
                    placeholder="Marka adı"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    className={inputCls("brand")}
                  />
                </div>
                <div>
                  {label("Miktar / Hacim", true)}
                  <input
                    type="text"
                    placeholder="ör. 60 Kapsül, 500g, 50ml"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className={inputCls("amount")}
                  />
                  {errMsg("amount")}
                </div>
              </div>

              <div>
                {label("Kategori", true)}
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as Category)}
                  className={inputCls("category")}
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{categoryLabels[c]}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Bölüm 2 — Fiyatlandırma */}
          <section>
            <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest mb-3">Fiyatlandırma</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                {label("Satış Fiyatı (₺)", true)}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={inputCls("price")}
                />
                {errMsg("price")}
              </div>
              <div>
                {label("Önceki / Tavsiye Fiyat (₺)")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="İsteğe bağlı"
                  value={form.originalPrice}
                  onChange={(e) => set("originalPrice", e.target.value)}
                  className={inputCls("originalPrice")}
                />
                {errMsg("originalPrice")}
                <p className="text-[10px] text-[#5A5E52]/60 mt-1">Üzeri çizili fiyat olarak gösterilir</p>
              </div>
            </div>
          </section>

          {/* Bölüm 3 — Etiket & İhtiyaçlar */}
          <section>
            <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest mb-3">Sınıflandırma</p>
            <div className="space-y-3">
              <div>
                {label("Ürün Etiketi")}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "" as const, label: "Etiket Yok", cls: "border-[#d8e4c8] text-[#5A5E52] bg-white" },
                    { value: "expert" as const, label: "Uzman Seçimi", cls: "border-[#556B2F]/40 text-[#556B2F] bg-[#EAF0DC]" },
                    { value: "bestseller" as const, label: "Çok Satan", cls: "border-amber-300 text-amber-700 bg-amber-50" },
                    { value: "new" as const, label: "Yeni", cls: "border-blue-200 text-blue-600 bg-blue-50" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("badge", opt.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        form.badge === opt.value
                          ? opt.cls + " ring-2 ring-offset-1 ring-[#556B2F]/30"
                          : "border-[#d8e4c8] text-[#5A5E52] bg-white hover:bg-[#F4F6F3]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {label("İhtiyaç Etiketleri")}
                <div className="grid grid-cols-4 gap-2">
                  {ALL_NEEDS.map((need) => (
                    <button
                      key={need}
                      type="button"
                      onClick={() => toggleNeed(need)}
                      className={`text-xs px-2 py-1.5 rounded-lg border transition-all text-left font-medium ${
                        form.needs.includes(need)
                          ? "bg-[#556B2F] text-white border-[#556B2F]"
                          : "bg-white text-[#5A5E52] border-[#d8e4c8] hover:border-[#556B2F]/40 hover:bg-[#EAF0DC]/30"
                      }`}
                    >
                      {needLabels[need]}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#5A5E52]/60 mt-1">Birden fazla seçilebilir — öneri sisteminde kullanılır</p>
              </div>
            </div>
          </section>

          {/* Bölüm 4 — İçerik & Kullanım */}
          <section>
            <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest mb-3">İçerik & Kullanım</p>
            <div className="space-y-3">
              <div>
                {label("Ürün İçeriği / Bileşenler", true)}
                <textarea
                  rows={2}
                  placeholder="ör. Vitamin D3 2000 IU, Vitamin K2 (MK-7) 75mcg, Zeytinyağı..."
                  value={form.ingredients}
                  onChange={(e) => set("ingredients", e.target.value)}
                  className={inputCls("ingredients") + " resize-none"}
                />
                {errMsg("ingredients")}
              </div>
              <div>
                {label("Kullanım Talimatı", true)}
                <textarea
                  rows={2}
                  placeholder="ör. Günde 1 kapsül, yemekle birlikte bol su ile alınız."
                  value={form.usage}
                  onChange={(e) => set("usage", e.target.value)}
                  className={inputCls("usage") + " resize-none"}
                />
                {errMsg("usage")}
              </div>
              <div>
                {label("Uzman Notu")}
                <textarea
                  rows={2}
                  placeholder="Eczacı veya uzman görüşü — isteğe bağlı"
                  value={form.expertNote}
                  onChange={(e) => set("expertNote", e.target.value)}
                  className={inputCls("expertNote") + " resize-none"}
                />
                <p className="text-[10px] text-[#5A5E52]/60 mt-1">Uzman notu girilen ürünlerde mor rozet gösterilir</p>
              </div>
            </div>
          </section>

          {/* Bölüm 5 — Görsel & Durum */}
          <section>
            <p className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest mb-3">Görsel & Durum</p>
            <div className="space-y-3">
              <div>
                {label("Görsel URL / Yolu")}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/products/urun-adi.jpg"
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    className={inputCls("image") + " flex-1"}
                  />
                  {form.image && (
                    <div className="w-10 h-10 rounded-xl border border-[#d8e4c8] bg-[#EAF0DC] flex items-center justify-center shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-[#5A5E52]/60 mt-1">/public/products/ klasörüne yüklediğiniz görselin yolunu girin</p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#d8e4c8] bg-[#FAFAF7]">
                <button
                  type="button"
                  onClick={() => set("inStock", !form.inStock)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    form.inStock ? "bg-[#556B2F]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform ${
                      form.inStock ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <div>
                  <p className="text-sm font-semibold text-[#2F3B1A]">
                    {form.inStock ? "Stokta Mevcut" : "Tükendi"}
                  </p>
                  <p className="text-[10px] text-[#5A5E52]">
                    {form.inStock ? "Ürün satışa açık" : "Ürün sayfada görünür ancak satın alınamaz"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#d8e4c8] shrink-0 flex items-center justify-between bg-[#FAFAF7] rounded-b-2xl">
          <p className="text-[10px] text-[#5A5E52]/60">
            <span className="text-red-400">*</span> ile işaretli alanlar zorunludur
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm border border-[#d8e4c8] text-[#5A5E52] rounded-xl hover:bg-[#F4F6F3] transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold bg-[#556B2F] hover:bg-[#2F3B1A] text-white rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving && (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {saving ? "Kaydediliyor..." : mode === "add" ? "Ürün Ekle" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Silme Onay Modalı ────────────────────────────────────────── */

interface DeleteModalProps {
  product: Product;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteModal({ product, onConfirm, onClose }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 300));
    onConfirm();
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#d8e4c8] w-full max-w-sm shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2F3B1A]">Ürünü Sil</h3>
            <p className="text-xs text-[#5A5E52]">{product.amount} — {product.brand}</p>
          </div>
        </div>
        <p className="text-sm text-[#5A5E52] mb-5">
          Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 border border-[#d8e4c8] text-[#5A5E52] py-2.5 rounded-xl text-sm hover:bg-[#F4F6F3] transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting && (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {deleting ? "Siliniyor..." : "Evet, Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ────────────────────────────────────────────────────── */

interface ToastMsg { id: number; text: string; type: "success" | "error" }

function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = useCallback((text: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return { toasts, show };
}

/* ─── Ana Tablo Komponenti ─────────────────────────────────────── */

export function AdminProductsTable() {
  const { products: productList, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterStock, setFilterStock] = useState<"all" | "in" | "out">("all");
  const { search: globalSearch, sidebarCategory, sidebarStock } = useAdminStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; product?: Product } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { toasts, show: showToast } = useToast();

  // Birleşik arama: header global search + lokal search
  const combinedSearch = globalSearch || search;
  // Sidebar category override (sidebar "all" → lokal filtre geçerli)
  const effectiveCategory = sidebarCategory !== "all" ? sidebarCategory as Category : filterCategory;
  // Sidebar stock: her ikisi seçiliyse "all" gibi davran
  const sidebarShowIn  = sidebarStock.includes("Yeterli");
  const sidebarShowOut = sidebarStock.includes("Tükenmiş");

  const filtered = productList.filter((p) => {
    const matchSearch = !combinedSearch ||
      p.nameKey.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      p.amount.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      categoryLabels[p.category]?.toLowerCase().includes(combinedSearch.toLowerCase());
    const matchCat = effectiveCategory === "all" || p.category === effectiveCategory;
    // Sidebar stock filtresi (local filtre override değil, AND mantığı)
    const matchSidebarStock = (sidebarShowIn && p.inStock) || (sidebarShowOut && !p.inStock);
    // Local stock filtresi
    const matchLocalStock = filterStock === "all" || (filterStock === "in" ? p.inStock : !p.inStock);
    return matchSearch && matchCat && matchSidebarStock && matchLocalStock;
  });

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const handleSave = (form: FormState) => {
    if (modal?.mode === "add") {
      const newProduct = formToProduct(form);
      addProduct(newProduct);
      showToast("Ürün başarıyla eklendi");
    } else if (modal?.product) {
      const updated = formToProduct(form, modal.product);
      updateProduct(updated.id, updated);
      showToast("Değişiklikler kaydedildi");
    }
    setModal(null);
  };

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
    setSelected((s) => s.filter((id) => id !== product.id));
    setDeleteTarget(null);
    showToast("Ürün silindi", "error");
  };

  const handleBulkDelete = () => {
    selected.forEach((id) => deleteProduct(id));
    showToast(`${selected.length} ürün silindi`, "error");
    setSelected([]);
  };

  const inStock = productList.filter((p) => p.inStock).length;
  const outOfStock = productList.filter((p) => !p.inStock).length;
  const avgRating = productList.length
    ? (productList.reduce((a, p) => a + p.rating, 0) / productList.length).toFixed(1)
    : "—";

  return (
    <div className="flex flex-col gap-5">
      {/* Başlık + KPI */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#2F3B1A]">Ürün Yönetimi</h1>
          <p className="text-sm text-[#5A5E52]">{productList.length} ürün — {inStock} stokta, {outOfStock} tükendi</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini KPI'lar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-semibold text-green-700">Stokta</span>
              <span className="text-sm font-bold text-green-700">{inStock}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-semibold text-red-600">Tükendi</span>
              <span className="text-sm font-bold text-red-600">{outOfStock}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-sm font-bold text-amber-700">{avgRating}</span>
            </div>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 bg-[#556B2F] hover:bg-[#2F3B1A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Araç çubuğu */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Arama */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5E52]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-[#d8e4c8] rounded-xl w-full focus:outline-none focus:border-[#556B2F]/50 text-[#2F3B1A] placeholder:text-[#5A5E52]/40"
          />
        </div>

        {/* Kategori filtresi */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
          className="text-sm bg-white border border-[#d8e4c8] rounded-xl px-3 py-2 focus:outline-none focus:border-[#556B2F]/50 text-[#2F3B1A]"
        >
          <option value="all">Tüm Kategoriler</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{categoryLabels[c]}</option>
          ))}
        </select>

        {/* Stok filtresi */}
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value as "all" | "in" | "out")}
          className="text-sm bg-white border border-[#d8e4c8] rounded-xl px-3 py-2 focus:outline-none focus:border-[#556B2F]/50 text-[#2F3B1A]"
        >
          <option value="all">Tüm Stok</option>
          <option value="in">Stokta</option>
          <option value="out">Tükendi</option>
        </select>

        {/* Seçim aksiyonları */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-red-600">{selected.length} seçili</span>
            <button
              onClick={handleBulkDelete}
              className="text-xs text-red-600 underline hover:text-red-800"
            >
              Sil
            </button>
            <button
              onClick={() => setSelected([])}
              className="text-xs text-[#5A5E52] hover:text-[#2F3B1A]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Excel */}
        <button
          onClick={() => exportCsv("urunler", productList.map((p) => ({
            "ID": p.id,
            "Slug": p.slug,
            "İsim (Key)": p.nameKey,
            "Marka": p.brand,
            "Miktar": p.amount,
            "Kategori": categoryLabels[p.category] || p.category,
            "Fiyat (₺)": p.price,
            "İndirimli Fiyat (₺)": p.originalPrice || "",
            "Puan": p.rating,
            "Değerlendirme Sayısı": p.reviewCount,
            "Etiket": p.badge || "",
            "Stok": p.inStock ? "Var" : "Yok",
          })))}
          className="flex items-center gap-2 text-sm border border-[#d8e4c8] bg-white text-[#5A5E52] px-3 py-2 rounded-xl hover:bg-[#F4F6F3] transition-colors ml-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Excel
        </button>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-[#d8e4c8] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3 opacity-20">🌿</div>
            <p className="text-sm font-semibold text-[#2F3B1A]">Ürün bulunamadı</p>
            <p className="text-xs text-[#5A5E52] mt-1">Filtreleri değiştirmeyi veya yeni ürün eklemeyi deneyin</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d8e4c8] bg-[#FAFAF7]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-[#556B2F]"
                  />
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">Ürün</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">Kategori</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">Fiyat</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">Puan</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">Etiket</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide">Stok</th>
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-[#d8e4c8]/50 last:border-0 transition-colors ${
                    selected.includes(product.id)
                      ? "bg-[#EAF0DC]/40"
                      : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#FAFAF7]/50"
                  } hover:bg-[#EAF0DC]/20`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggle(product.id)}
                      className="accent-[#556B2F]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#EAF0DC] rounded-xl border border-[#d8e4c8] flex items-center justify-center shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#2F3B1A] text-xs leading-snug max-w-[180px] truncate">{product.nameKey}</p>
                        <p className="text-[10px] text-[#5A5E52]/60">{product.amount} · {product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#5A5E52]">{categoryLabels[product.category]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#2F3B1A]">{product.price} ₺</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-[#5A5E52]/50 line-through">{product.originalPrice} ₺</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs font-semibold text-[#2F3B1A]">{product.rating || "—"}</span>
                      {product.reviewCount > 0 && (
                        <span className="text-[10px] text-[#5A5E52]/50">({product.reviewCount})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.badge ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor[product.badge]}`}>
                        {badgeLabel[product.badge]}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#5A5E52]/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
                      const threshold = product.lowStockThreshold ?? 10;
                      const qty = product.stock ?? (product.inStock ? 99 : 0);
                      if (qty === 0) return (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                          Tükendi
                        </span>
                      );
                      if (qty <= threshold) return (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {qty} adet — Az
                        </span>
                      );
                      return (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                          {qty} adet
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setModal({ mode: "edit", product })}
                        className="p-1.5 rounded-lg hover:bg-[#EAF0DC] transition-colors text-[#556B2F]"
                        title="Düzenle"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400"
                        title="Sil"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Sonuç sayısı */}
      {filtered.length > 0 && filtered.length !== productList.length && (
        <p className="text-xs text-[#5A5E52] text-center">
          {filtered.length} / {productList.length} ürün gösteriliyor
          <button onClick={() => { setSearch(""); setFilterCategory("all"); setFilterStock("all"); }} className="ml-2 text-[#556B2F] underline">
            Filtreyi temizle
          </button>
        </p>
      )}

      {/* Ürün Ekle / Düzenle Modalı */}
      {modal && (
        <ProductModal
          mode={modal.mode}
          initial={modal.product ? productToForm(modal.product) : EMPTY_FORM}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Silme Onay Modalı */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast Bildirimleri */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border pointer-events-auto ${
              t.type === "success"
                ? "bg-[#EAF0DC] text-[#2F3B1A] border-[#556B2F]/20"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {t.type === "success" ? (
              <svg className="w-4 h-4 text-[#556B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            )}
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
