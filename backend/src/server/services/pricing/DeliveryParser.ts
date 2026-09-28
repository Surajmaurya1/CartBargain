import { parseMoney } from "../../utils/parseMoney";

export function parseDelivery(value: unknown): { text: string | null; fee: number | null } {
  if (typeof value !== "string" || !value.trim()) return { text: null, fee: null };
  const text = value.trim();
  if (/free delivery/i.test(text)) return { text, fee: 0 };
  const hasExplicitFee = /₹|rs\.?\s*\d|\$|€|£|delivery\s+(?:fee|charge|charges)\b|shipping\s+(?:fee|charge|charges)\b/i.test(text);
  const fee = hasExplicitFee ? parseMoney(text) : null;
  return { text, fee };
}
