import type { GroceryItem } from "../types/shopping";
import { canonicalUnit, type Unit } from "./units";

const quantityPattern = /(?:^|\s)(\d+(?:\.\d+)?)\s*(kg|g|ml|l|litre|liter|litres|liters|pcs?|pieces?|packs?)(?=\s|$)/i;
const trailingNumberPattern = /(?:^|\s)(\d+(?:\.\d+)?)(?=\s|$)/i;

export function parseGroceryList(input: string | string[]): GroceryItem[] {
  const entries = Array.isArray(input) ? input : input.split(/[\n,;]+/);
  return entries.map((raw, index) => {
    const rawText = String(raw).trim().replace(/\s+/g, " ");
    const unitMatch = rawText.match(quantityPattern);
    const numberMatch = unitMatch ?? rawText.match(trailingNumberPattern);
    const quantity = numberMatch ? Number(numberMatch[1]) : null;
    const unit: Unit | null = unitMatch ? canonicalUnit(unitMatch[2]) : null;
    const name = rawText
      .replace(quantityPattern, " ")
      .replace(trailingNumberPattern, " ")
      .replace(/\s+-\s+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
    return { id: `item_${index + 1}`, rawText, name, quantity: Number.isFinite(quantity) ? quantity : null, unit };
  }).filter((item) => item.name.length > 0);
}
