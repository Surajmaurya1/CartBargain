import { AppError } from "../errors/AppError";
import { PROVIDER_BY_ID } from "../config/providers";
import { canonicalUnit } from "../utils/units";

export type CompareRequest = {
  location: { text: string; pinCode?: string };
  items: Array<{ name: string; quantity?: number | null; unit?: string | null }>;
  providers: string[];
};

export function validateCompareRequest(input: unknown, limits = { maxItems: 8, maxProviders: 3, maxItemNameLength: 100, maxLocationLength: 150 }): CompareRequest {
  if (!input || typeof input !== "object") throw new AppError("VALIDATION_ERROR", "Request body must be an object.", 400);
  const body = input as Record<string, unknown>;
  const location = body.location as Record<string, unknown> | undefined;
  if (!location || typeof location.text !== "string" || !location.text.trim() || location.text.length > limits.maxLocationLength) throw new AppError("INVALID_LOCATION", "Please provide a valid location.", 400);
  if (location.pinCode !== undefined && (typeof location.pinCode !== "string" || location.pinCode.length > 20)) throw new AppError("INVALID_LOCATION", "Please provide a valid PIN code.", 400);
  if (!Array.isArray(body.items) || body.items.length === 0) throw new AppError("EMPTY_BASKET", "Please enter at least one grocery item.", 400);
  if (body.items.length > limits.maxItems) throw new AppError("TOO_MANY_ITEMS", `Please enter no more than ${limits.maxItems} grocery items.`, 400);
  if (!Array.isArray(body.providers) || body.providers.length === 0) throw new AppError("TOO_MANY_PROVIDERS", "Select at least one provider.", 400);
  if (body.providers.length > limits.maxProviders) throw new AppError("TOO_MANY_PROVIDERS", `Please select no more than ${limits.maxProviders} providers.`, 400);
  const providers = body.providers.map((id) => {
    if (typeof id !== "string" || !PROVIDER_BY_ID.has(id)) throw new AppError("VALIDATION_ERROR", "One or more providers are not supported.", 400);
    return id;
  });
  const items = body.items.map((raw) => {
    if (!raw || typeof raw !== "object") throw new AppError("VALIDATION_ERROR", "Each grocery item must be an object.", 400);
    const item = raw as Record<string, unknown>;
    if (typeof item.name !== "string" || !item.name.trim() || item.name.length > limits.maxItemNameLength) throw new AppError("VALIDATION_ERROR", "Each grocery item needs a valid name.", 400);
    if (item.quantity !== undefined && item.quantity !== null && (typeof item.quantity !== "number" || !Number.isFinite(item.quantity) || item.quantity <= 0)) throw new AppError("VALIDATION_ERROR", "Quantities must be positive finite numbers.", 400);
    if (item.unit !== undefined && item.unit !== null && (typeof item.unit !== "string" || !canonicalUnit(item.unit))) throw new AppError("VALIDATION_ERROR", "One or more units are unsupported.", 400);
    return { name: item.name.trim(), quantity: item.quantity as number | null | undefined, unit: item.unit as string | null | undefined };
  });
  return { location: { text: location.text.trim(), pinCode: location.pinCode as string | undefined }, items, providers };
}
