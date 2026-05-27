import { create } from "zustand";

export type AdminPeriod = "7" | "20" | "30" | "all";

interface AdminStore {
  period: AdminPeriod;
  search: string;
  sidebarCategory: string;
  sidebarStock: string[];
  mobileSidebarOpen: boolean;
  setPeriod: (p: AdminPeriod) => void;
  setSearch: (s: string) => void;
  setSidebarCategory: (c: string) => void;
  setSidebarStock: (s: string[]) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  period: "7",
  search: "",
  sidebarCategory: "all",
  sidebarStock: ["Yeterli"],
  mobileSidebarOpen: false,
  setPeriod: (period) => set({ period }),
  setSearch: (search) => set({ search }),
  setSidebarCategory: (sidebarCategory) => set({ sidebarCategory }),
  setSidebarStock: (sidebarStock) => set({ sidebarStock }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
}));
