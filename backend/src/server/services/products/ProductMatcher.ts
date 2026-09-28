import { normalizeText } from "../../utils/normalizeText";
import type { GroceryItem } from "../../types/shopping";

export function matchProduct(item: GroceryItem, title: string): { quality: "exact" | "possible" | "rejected"; score: number } {
  const wanted = new Set(normalizeText(item.name).split(" ").filter(Boolean));
  const actual = new Set(normalizeText(title).split(" ").filter(Boolean));
  const overlap = [...wanted].filter((token) => actual.has(token)).length;
  const score = wanted.size === 0 ? 0 : Math.round((overlap / wanted.size) * 70) + (overlap === wanted.size ? 30 : 0);
  return { quality: score >= 90 ? "exact" : score >= 45 ? "possible" : "rejected", score: Math.min(100, score) };
}
