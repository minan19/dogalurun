"use client";

import { useAdminStore, type AdminPeriod } from "@/store/adminStore";
import { useRouter } from "next/navigation";
import { getCriticalCount } from "@/lib/stockUtils";

const periods: { value: AdminPeriod; label: string }[] = [
  { value: "7",   label: "Son 7 Gün" },
  { value: "20",  label: "Son 20 Gün" },
  { value: "30",  label: "Bu Ay" },
  { value: "all", label: "Tümü" },
];

export function AdminHeader() {
  const { period, setPeriod, search, setSearch, toggleMobileSidebar } = useAdminStore();
  const router = useRouter();
  const criticalStockCount = getCriticalCount();

  async function handleLogout() {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="bg-white border-b border-[#d8e4c8] px-3 md:px-6 py-3 flex items-center justify-between shrink-0 gap-2 md:gap-4">
      {/* Mobil hamburger */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden p-2 rounded-lg hover:bg-[#F4F6F3] text-[#5A5E52] shrink-0"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Arama */}
      <div className="relative flex-1 md:flex-none">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5E52]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          placeholder="Ürün, sipariş ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm bg-[#F4F6F3] border border-[#d8e4c8] rounded-xl w-full md:w-64 focus:outline-none focus:border-[#556B2F]/50 text-[#2F3B1A] placeholder:text-[#5A5E52]/40"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5E52]/50 hover:text-[#2F3B1A]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dönem butonları */}
      <div className="hidden md:flex items-center gap-1 bg-[#F4F6F3] rounded-xl p-1 border border-[#d8e4c8]">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              period === p.value
                ? "bg-[#556B2F] text-white shadow-sm"
                : "text-[#5A5E52] hover:text-[#2F3B1A]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Sağ ikonlar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin")}
          title={criticalStockCount > 0 ? `${criticalStockCount} kritik stok uyarısı` : "Bildirimler"}
          className="p-2 rounded-lg hover:bg-[#F4F6F3] transition-colors relative"
        >
          <svg className="w-4 h-4 text-[#5A5E52]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          {criticalStockCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {criticalStockCount > 9 ? "9+" : criticalStockCount}
            </span>
          )}
        </button>
        <div className="w-8 h-8 bg-[#556B2F] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
        <button
          onClick={handleLogout}
          title="Çıkış Yap"
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-[#5A5E52] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
