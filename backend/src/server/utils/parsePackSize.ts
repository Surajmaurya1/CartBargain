import { canonicalUnit, type Unit } from "./units";

export function parsePackSize(title: string): { quantity: number | null; unit: Unit | null } {
  const match = title.match(/(?:^|\s|\()([0-9]+(?:\.[0-9]+)?)\s*(kg|g|ml|l|litre|liter|litres|liters|pcs?|pieces?|packs?)(?=\s|$|\))/i);
  if (!match) return { quantity: null, unit: null };
  return { quantity: Number(match[1]), unit: canonicalUnit(match[2]) };
}
