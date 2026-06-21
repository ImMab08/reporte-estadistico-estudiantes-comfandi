import type { PromotionSnapshot } from "./processPromotionData";

const KEY = "promotion_snapshot";

export function savePromotionSnapshot(data: PromotionSnapshot): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getPromotionSnapshot(): PromotionSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  return JSON.parse(
    localStorage.getItem(KEY) || "null",
  ) as PromotionSnapshot | null;
}

export function clearPromotionSnapshot(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(KEY);
}
