export const UNITS = ["kg", "g", "l", "ml", "pcs", "piece", "pieces", "pack", "packs"] as const;
export type Unit = typeof UNITS[number];

export function canonicalUnit(unit: string): Unit | null {
  const normalized = unit.toLowerCase();
  if (normalized === "piece" || normalized === "pieces") return "pcs";
  if (normalized === "packs") return "pack";
  if (normalized === "litre" || normalized === "liter" || normalized === "litres" || normalized === "liters") return "l";
  return (UNITS as readonly string[]).includes(normalized) ? normalized as Unit : null;
}
