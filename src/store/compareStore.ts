import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((s) => ({
          ids: s.ids.length < 3 && !s.ids.includes(id) ? [...s.ids, id] : s.ids,
        })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) });
        } else if (ids.length < 3) {
          set({ ids: [...ids, id] });
        }
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "hudai-compare" }
  )
);
