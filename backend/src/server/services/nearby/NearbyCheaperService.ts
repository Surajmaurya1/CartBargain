import { AppError } from "../../errors/AppError";
import type { AppConfig } from "../../config/env";
import type { NearbyRequest, NearbyStore } from "../../types/nearby";
import { generateCandidates } from "../basket/BasketGenerator";
import { SerpApiClient } from "../serpapi/SerpApiClient";
import type { SerpApiLocalResult } from "../serpapi/serpApiTypes";

export function haversineDistanceKm(latitudeA: number, longitudeA: number, latitudeB: number, longitudeB: number): number {
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(latitudeB - latitudeA);
  const dLon = radians(longitudeB - longitudeA);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(latitudeA)) * Math.cos(radians(latitudeB)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function coordinate(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeStore(result: SerpApiLocalResult, request: NearbyRequest): NearbyStore {
  const latitude = coordinate(result.gps_coordinates?.latitude);
  const longitude = coordinate(result.gps_coordinates?.longitude);
  const distanceKm = latitude !== null && longitude !== null && request.location.latitude !== undefined && request.location.longitude !== undefined
    ? Math.round(haversineDistanceKm(request.location.latitude, request.location.longitude, latitude, longitude) * 10) / 10
    : null;
  return {
    name: typeof result.title === "string" ? result.title : "Nearby grocery store",
    address: typeof result.address === "string" ? result.address : null,
    placeId: typeof result.place_id === "string" ? result.place_id : null,
    latitude,
    longitude,
    distanceKm,
    rating: typeof result.rating === "number" && Number.isFinite(result.rating) ? result.rating : null,
    reviews: typeof result.reviews === "number" && Number.isFinite(result.reviews) ? result.reviews : null,
    hours: typeof result.hours === "string" ? result.hours : null,
    url: typeof result.link === "string" ? result.link : typeof result.website === "string" ? result.website : null,
    pricingStatus: "unavailable"
  };
}

export async function findNearbyCheaperOptions(request: NearbyRequest, config: AppConfig) {
  const client = new SerpApiClient({ apiKey: config.serpApiKey, timeoutMs: config.serpApiTimeoutMs, maxAttempts: config.serpApiMaxAttempts, cacheTtlMs: config.serpApiCacheTtlMs, circuitFailureThreshold: config.circuitFailureThreshold, circuitCooldownMs: config.circuitCooldownMs, retryBaseDelayMs: config.retryBaseDelayMs });
  let response;
  try {
    response = await client.searchLocal({ query: "grocery stores", location: request.location.text, googleDomain: config.googleDomain });
  } catch (error) {
    if (error instanceof AppError) throw new AppError("NEARBY_SEARCH_UNAVAILABLE", "Nearby store search is unavailable right now.", error.status, false);
    throw new AppError("NEARBY_SEARCH_UNAVAILABLE", "Nearby store search is unavailable right now.", 502, false);
  }
  const stores = response.localResults
    .map((result) => normalizeStore(result, request))
    .filter((store) => store.distanceKm === null || store.distanceKm <= request.radiusKm)
    .slice(0, 10);
  const candidates = generateCandidates(request.items, request.offers, false, false);
  const currentBestTotal = candidates.length ? Math.min(...candidates.map((candidate) => candidate.estimatedTotal)) : null;
  return {
    success: true,
    data: {
      type: "nearby_cheaper",
      radiusKm: request.radiusKm,
      currentBestTotal,
      stores,
      recommendation: null,
      pricingAvailable: false,
      minNearbySaving: config.minNearbySaving,
      message: stores.length ? "Nearby stores found, but product pricing was not available from the local search." : "No nearby grocery stores were found for this location.",
      warnings: request.location.latitude === undefined || request.location.longitude === undefined ? [{ code: "DISTANCE_UNAVAILABLE", message: "Nearby distance unavailable because location coordinates were not provided." }] : []
    }
  };
}
