import type { GroceryItem } from "../../types/shopping";

export type SearchTask = {
  id: string;
  groceryItemId: string;
  query: string;
  providerId?: string;
  priority: "primary" | "fallback";
};

export function buildSearchPlan(items: GroceryItem[]): SearchTask[] {
  return items.map((item, index) => ({
    id: `search_${index + 1}`,
    groceryItemId: item.id,
    query: [item.name, item.quantity, item.unit].filter(Boolean).join(" "),
    priority: "primary"
  }));
}
