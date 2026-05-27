"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdminStore, type AdminPeriod } from "@/store/adminStore";

const navItems = [
  {
    key: "dashboard", label: "Anasayfa", href: "/admin",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    key: "products", label: "Ürünler", href: "/admin/products",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    key: "orders", label: "Siparişler", href: "/admin/orders",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
  },
  {
    key: "users", label: "Kullanıcılar", href: "/admin/users",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    key: "reports", label: "Raporlar", href: "/admin/reports",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    key: "pricing", label: "Fiyat & Kampanya", href: "/admin/pricing",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  },
  {
    key: "regions", label: "Bölgeler", href: "/admin/regions",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    key: "blog", label: "Blog", href: "/admin/blog",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
  {
    key: "newsletter", label: "Bülten", href: "/admin/newsletter",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const periodOptions: { value: AdminPeriod; label: string }[] = [
  { value: "7",   label: "Son 7 Gün" },
  { value: "20",  label: "Son 20 Gün" },
  { value: "30",  label: "Bu Ay" },
  { value: "all", label: "Tüm Zamanlar" },
];

const categoryOptions = [
  { value: "all",           label: "Tümü" },
  { value: "supplements",   label: "Takviye" },
  { value: "organic-food",  label: "Organik" },
  { value: "personal-care", label: "Kişisel Bakım" },
  { value: "special",       label: "Özel" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { period, setPeriod, sidebarCategory, setSidebarCategory, sidebarStock, setSidebarStock } = useAdminStore();

  const toggleStock = (v: string) =>
    setSidebarStock(sidebarStock.includes(v) ? sidebarStock.filter((x) => x !== v) : [...sidebarStock, v]);

  const { mobileSidebarOpen, closeMobileSidebar } = useAdminStore();

  return (
    <>
      {/* Mobil overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
    <aside className={`
      fixed md:relative inset-y-0 left-0 z-50
      w-64 md:w-52 bg-white border-r border-[#d8e4c8] flex flex-col shrink-0 h-full
      transition-transform duration-300
      ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#d8e4c8]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Hüda-i Şifa" width={112} height={112} className="w-28 h-28 object-contain mix-blend-multiply shrink-0" unoptimized />
          <div>
            <span className="block leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 400, fontSize: "1rem", color: "#2F3B1A", letterSpacing: "0.01em" }}>
              Hüda-i Şifa
            </span>
            <span className="block my-[3px]" style={{ height: "1px", background: "linear-gradient(to right, #C49A3C, transparent)" }} />
            <span className="block" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontStyle: "normal", fontWeight: 400, fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.13em", color: "#C49A3C" }}>
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="px-3 py-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeMobileSidebar}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                active
                  ? "bg-[#EAF0DC] text-[#2F3B1A] font-semibold"
                  : "text-[#5A5E52] hover:bg-[#F4F6F3] hover:text-[#2F3B1A]"
              }`}
            >
              <span className={active ? "text-[#556B2F]" : "text-[#7a9a40]/70"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#d8e4c8] mx-3 my-2" />

      {/* Filtreler */}
      <div className="px-4 flex flex-col gap-4 flex-1 overflow-y-auto pb-4">
        {/* Tarih Aralığı */}
        <div>
          <p className="text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide mb-2">Tarih Aralığı</p>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as AdminPeriod)}
            className="w-full text-xs border border-[#d8e4c8] rounded-lg px-2.5 py-2 bg-[#FAFAF7] text-[#2F3B1A] focus:outline-none focus:border-[#556B2F]/50"
          >
            {periodOptions.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Kategori */}
        <div>
          <p className="text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide mb-2">Kategori</p>
          <select
            value={sidebarCategory}
            onChange={(e) => setSidebarCategory(e.target.value)}
            className="w-full text-xs border border-[#d8e4c8] rounded-lg px-2.5 py-2 bg-[#FAFAF7] text-[#2F3B1A] focus:outline-none focus:border-[#556B2F]/50"
          >
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Stok Durumu */}
        <div>
          <p className="text-[11px] font-semibold text-[#5A5E52] uppercase tracking-wide mb-2">Stok Durumu</p>
          <div className="flex flex-col gap-2">
            {[
              { value: "Yeterli",  label: "Stokta" },
              { value: "Tükenmiş", label: "Tükendi" },
            ].map((s) => (
              <label key={s.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sidebarStock.includes(s.value)}
                  onChange={() => toggleStock(s.value)}
                  className="w-3.5 h-3.5 accent-[#556B2F] rounded"
                />
                <span className="text-xs text-[#2F3B1A]">{s.label}</span>
              </label>
            ))}
          </div>
          {(sidebarCategory !== "all" || sidebarStock.length < 2) && (
            <button
              onClick={() => { setSidebarCategory("all"); setSidebarStock(["Yeterli", "Tükenmiş"]); }}
              className="mt-2 text-[10px] text-[#556B2F] underline"
            >
              Filtreyi Temizle
            </button>
          )}
        </div>
      </div>

      {/* AI Panel linki */}
      <div className="border-t border-[#d8e4c8] p-3">
        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
            pathname === "/admin"
              ? "bg-[#EAF0DC] text-[#2F3B1A] font-semibold"
              : "text-[#5A5E52] hover:bg-[#F4F6F3]"
          }`}
        >
          <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          AI Öneri Paneli
        </Link>
      </div>
    </aside>
    </>
  );
}
