"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────────── */
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

const EMPTY_ARTICLE: Omit<Article, "id" | "slug" | "published_at"> = {
  title: "",
  summary: "",
  content: "",
  author: "",
  category: "Sağlık",
  image: "",
  read_time: 5,
  is_published: false,
};

const CATEGORIES = ["Sağlık", "Beslenme", "Bağışıklık", "Mineraller", "Bitkisel", "Cilt", "Spor", "Genel"];

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* ─── Component ──────────────────────────────────────────────── */
export function AdminBlogTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Tümü");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog?limit=100");
      const data = await res.json();
      setArticles(data.articles ?? []);
    } catch {
      showToast("Yazılar yüklenemedi", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_ARTICLE);
    setShowForm(true);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title,
      summary: a.summary,
      content: a.content,
      author: a.author,
      category: a.category,
      image: a.image,
      read_time: a.read_time,
      is_published: a.is_published,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) {
      showToast("Başlık, içerik ve yazar zorunludur", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: editing?.id ?? crypto.randomUUID(),
        slug: editing?.slug ?? slugify(form.title),
        published_at: editing?.published_at ?? new Date().toISOString(),
      };
      const res = await fetch("/api/blog", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editing ? "Yazı güncellendi" : "Yazı eklendi");
      setShowForm(false);
      load();
    } catch {
      showToast("Kaydedilemedi, lütfen tekrar deneyin", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      showToast("Yazı silindi");
      setDeleteId(null);
      load();
    } catch {
      showToast("Silinemedi", "error");
    }
  };

  const togglePublish = async (a: Article) => {
    try {
      await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, is_published: !a.is_published }),
      });
      load();
    } catch {
      showToast("Güncellenemedi", "error");
    }
  };

  const filtered = articles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Tümü" || a.category === filterCat;
    return matchSearch && matchCat;
  });

  const published = articles.filter((a) => a.is_published).length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-[#2D4A1E] text-white" : "bg-red-600 text-white"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D4A1E]">Blog Yönetimi</h2>
          <p className="text-sm text-[#5A5E52] mt-0.5">{articles.length} yazı · {published} yayında</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#2D4A1E] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a2f12] transition-colors"
        >
          + Yeni Yazı
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Toplam Yazı", value: articles.length, icon: "📝" },
          { label: "Yayında", value: published, icon: "✅" },
          { label: "Taslak", value: articles.length - published, icon: "📄" },
          { label: "Kategori", value: new Set(articles.map((a) => a.category)).size, icon: "🏷️" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#e8f0e0]">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-[#2D4A1E]">{s.value}</div>
            <div className="text-xs text-[#5A5E52]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Başlık veya yazar ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-white border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F]"
        >
          <option value="Tümü">Tüm Kategoriler</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8f0e0] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#556B2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#5A5E52]">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-medium">Henüz yazı yok</p>
            <button onClick={openNew} className="mt-3 text-[#556B2F] text-sm font-semibold hover:underline">+ İlk yazıyı ekle</button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8f0e0] bg-[#f9fbf7]">
                <th className="text-left text-xs font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3">Başlık</th>
                <th className="text-left text-xs font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3 hidden md:table-cell">Kategori</th>
                <th className="text-left text-xs font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Yazar</th>
                <th className="text-left text-xs font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Tarih</th>
                <th className="text-center text-xs font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3">Durum</th>
                <th className="text-right text-xs font-semibold text-[#5A5E52] uppercase tracking-wide px-5 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4ec]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#fafcf8] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#2D4A1E] text-sm line-clamp-1">{a.title}</div>
                    <div className="text-xs text-[#5A5E52] mt-0.5 line-clamp-1">{a.summary}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="inline-block bg-[#EAF0DC] text-[#556B2F] text-xs font-medium px-2.5 py-1 rounded-full">{a.category}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5A5E52] hidden lg:table-cell">{a.author}</td>
                  <td className="px-5 py-4 text-xs text-[#8A9080] hidden lg:table-cell">
                    {new Date(a.published_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => togglePublish(a)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${a.is_published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${a.is_published ? "bg-green-500" : "bg-gray-400"}`} />
                      {a.is_published ? "Yayında" : "Taslak"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="text-xs text-[#556B2F] hover:underline font-medium"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => setDeleteId(a.id)}
                        className="text-xs text-red-500 hover:underline font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-[#2D4A1E] text-lg mb-2">Yazıyı Sil</h3>
            <p className="text-sm text-[#5A5E52] mb-6">Bu yazı kalıcı olarak silinecek. Emin misiniz?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#d8e4c8] rounded-xl text-sm font-medium text-[#5A5E52] hover:bg-[#f4f6f3]">İptal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#e8f0e0]">
              <h3 className="font-bold text-[#2D4A1E] text-lg">{editing ? "Yazıyı Düzenle" : "Yeni Yazı"}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#5A5E52] hover:text-[#2D4A1E] text-xl font-light">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">Başlık *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Yazı başlığı..."
                  className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F] focus:ring-2 focus:ring-[#556B2F]/10"
                />
              </div>

              {/* Author + Category row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">Yazar *</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    placeholder="Dr. / Uzm. Dyt. ..."
                    className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F]"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">Özet</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  placeholder="Yazının kısa özeti..."
                  rows={2}
                  className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F] resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">İçerik *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Yazı içeriği... (paragrafları boş satırla ayırın)"
                  rows={8}
                  className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F] resize-none font-mono"
                />
              </div>

              {/* Image + Read time row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">Görsel URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D4A1E] mb-1.5">Okuma (dk)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={form.read_time}
                    onChange={(e) => setForm((f) => ({ ...f, read_time: Number(e.target.value) }))}
                    className="w-full border border-[#d8e4c8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#556B2F]"
                  />
                </div>
              </div>

              {/* Publish toggle */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_published: !f.is_published }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.is_published ? "bg-[#556B2F]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_published ? "translate-x-5" : ""}`} />
                </button>
                <span className="text-sm text-[#5A5E52]">
                  {form.is_published ? "Yayında — herkese görünür" : "Taslak — sadece sen görürsün"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-[#e8f0e0]">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#d8e4c8] rounded-xl text-sm font-medium text-[#5A5E52] hover:bg-[#f4f6f3]">İptal</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 bg-[#2D4A1E] text-white rounded-xl text-sm font-semibold hover:bg-[#1a2f12] disabled:opacity-60 transition-colors"
              >
                {saving ? "Kaydediliyor..." : editing ? "Güncelle" : "Yayınla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
