import { PROVIDER_BY_ID } from "../config/providers";
import { AppError } from "../errors/AppError";
import type { OptimizeRequest } from "../types/optimization";

const strategies = new Set(["LOWEST_TOTAL", "BEST_VALUE", "BEST_DEALS"]);

export function validateOptimizeRequest(input: unknown): OptimizeRequest {
  if (!input || typeof input !== "object") throw new AppError("VALIDATION_ERROR", "Request body must be an object.", 400);
  const body = input as Record<string, unknown>;
  if (typeof body.strategy !== "string" || !strategies.has(body.strategy)) throw new AppError("VALIDATION_ERROR", "Unsupported optimization strategy.", 400);
  const constraints = body.constraints as Record<string, unknown> | undefined;
  const maxProviders = constraints?.maxProviders ?? 3;
  if (typeof maxProviders !== "number" || !Number.isInteger(maxProviders) || maxProviders < 1 || maxProviders > 3) throw new AppError("VALIDATION_ERROR", "maxProviders must be an integer from 1 to 3.", 400);
  if (!Array.isArray(body.items) || body.items.length === 0) throw new AppError("EMPTY_BASKET", "Optimization needs at least one grocery item.", 400);
  if (!Array.isArray(body.offers)) throw new AppError("VALIDATION_ERROR", "Optimization needs normalized offers.", 400);
  const itemIds = new Set<string>();
  const items = body.items.map((raw) => {
    if (!raw || typeof raw !== "object") throw new AppError("VALIDATION_ERROR", "Invalid optimization item.", 400);
    const item = raw as Record<string, unknown>;
    if (typeof item.id !== "string" || itemIds.has(item.id) || typeof item.name !== "string") throw new AppError("VALIDATION_ERROR", "Optimization items must have unique IDs and names.", 400);
    itemIds.add(item.id);
    if (item.quantity !== null && item.quantity !== undefined && (typeof item.quantity !== "number" || !Number.isFinite(item.quantity) || item.quantity < 0)) throw new AppError("VALIDATION_ERROR", "Invalid item quantity.", 400);
    return item as unknown as OptimizeRequest["items"][number];
  });
  const offers = body.offers.map((raw) => {
    if (!raw || typeof raw !== "object") throw new AppError("VALIDATION_ERROR", "Invalid optimization offer.", 400);
    const offer = raw as Record<string, unknown>;
    if (typeof offer.id !== "string" || typeof offer.groceryItemId !== "string" || !itemIds.has(offer.groceryItemId) || typeof offer.providerId !== "string" || !PROVIDER_BY_ID.has(offer.providerId)) throw new AppError("VALIDATION_ERROR", "Optimization offer references an invalid item or provider.", 400);
    if (typeof offer.price !== "number" || !Number.isFinite(offer.price) || offer.price <= 0) throw new AppError("VALIDATION_ERROR", "Optimization offers must have positive finite prices.", 400);
    return offer as unknown as OptimizeRequest["offers"][number];
  });
  return { strategy: body.strategy as OptimizeRequest["strategy"], constraints: { maxProviders, allowSubstitutes: constraints?.allowSubstitutes === true, allowOverbuy: constraints?.allowOverbuy === true }, items, offers };
}
