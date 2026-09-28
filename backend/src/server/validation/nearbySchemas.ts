import { AppError } from "../errors/AppError";
import { validateOptimizeRequest } from "./optimizeSchemas";
import type { NearbyRequest } from "../types/nearby";

export function validateNearbyRequest(input: unknown): NearbyRequest {
  if (!input || typeof input !== "object") throw new AppError("VALIDATION_ERROR", "Request body must be an object.", 400);
  const body = input as Record<string, unknown>;
  const location = body.location as Record<string, unknown> | undefined;
  if (!location || typeof location.text !== "string" || !location.text.trim() || location.text.length > 150) throw new AppError("INVALID_LOCATION", "Please provide a valid location.", 400);
  const radiusKm = body.radiusKm ?? 2;
  if (typeof radiusKm !== "number" || !Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > 5) throw new AppError("VALIDATION_ERROR", "radiusKm must be greater than 0 and no more than 5.", 400);
  for (const key of ["latitude", "longitude"] as const) {
    if (location[key] !== undefined && (typeof location[key] !== "number" || !Number.isFinite(location[key]))) throw new AppError("INVALID_LOCATION", "Location coordinates must be valid numbers.", 400);
  }
  const optimization = validateOptimizeRequest({ strategy: "LOWEST_TOTAL", constraints: { maxProviders: 3, allowSubstitutes: false, allowOverbuy: false }, items: body.items, offers: body.offers });
  return { location: { text: location.text.trim(), pinCode: typeof location.pinCode === "string" ? location.pinCode : undefined, latitude: location.latitude as number | undefined, longitude: location.longitude as number | undefined }, radiusKm, items: optimization.items, offers: optimization.offers };
}
