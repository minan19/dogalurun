import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LoyaltyTier = "member" | "silver" | "gold" | "platinum";

interface LoyaltyStore {
  points: number;
  addPoints: (amount: number) => void;
  tier: () => LoyaltyTier;
  nextTierPoints: () => number;
  nextTierName: () => LoyaltyTier | null;
}

const TIERS: { tier: LoyaltyTier; min: number }[] = [
  { tier: "platinum", min: 2000 },
  { tier: "gold", min: 1000 },
  { tier: "silver", min: 500 },
  { tier: "member", min: 0 },
];

const NEXT: Record<LoyaltyTier, { next: LoyaltyTier; at: number } | null> = {
  member: { next: "silver", at: 500 },
  silver: { next: "gold", at: 1000 },
  gold: { next: "platinum", at: 2000 },
  platinum: null,
};

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      points: 0,
      addPoints: (amount) => set((s) => ({ points: s.points + amount })),
      tier: () => TIERS.find((t) => get().points >= t.min)!.tier,
      nextTierPoints: () => {
        const n = NEXT[TIERS.find((t) => get().points >= t.min)!.tier];
        return n ? n.at - get().points : 0;
      },
      nextTierName: () => {
        const n = NEXT[TIERS.find((t) => get().points >= t.min)!.tier];
        return n ? n.next : null;
      },
    }),
    { name: "hudai-loyalty" }
  )
);
