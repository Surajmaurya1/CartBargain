import { AppError } from "../../errors/AppError";
import type { ParsedSerpApiResponse, SerpApiLocalResult, SerpApiResponse, SerpApiShoppingResult } from "./serpApiTypes";

export function parseSerpApiResponse(value: unknown): ParsedSerpApiResponse {
  if (!value || typeof value !== "object") throw new AppError("SERPAPI_BAD_RESPONSE", "The price search returned an invalid response.", 502);
  const body = value as SerpApiResponse;
  if (typeof body.error === "string") throw new AppError("SERPAPI_UPSTREAM_ERROR", "The price search provider returned an error.", 502, false);
  if (body.search_metadata !== undefined && (typeof body.search_metadata !== "object" || body.search_metadata === null)) {
    throw new AppError("SERPAPI_BAD_RESPONSE", "The price search metadata was invalid.", 502);
  }
  if (body.search_parameters !== undefined && (typeof body.search_parameters !== "object" || body.search_parameters === null)) {
    throw new AppError("SERPAPI_BAD_RESPONSE", "The price search parameters were invalid.", 502);
  }
  const results = Array.isArray(body.shopping_results) ? body.shopping_results.filter(isShoppingResult) : [];
  const localResults = Array.isArray(body.local_results) ? body.local_results.filter(isLocalResult) : [];
  return {
    metadata: body.search_metadata && typeof body.search_metadata === "object" ? body.search_metadata : null,
    parameters: body.search_parameters && typeof body.search_parameters === "object" ? body.search_parameters : null,
    shoppingResults: results,
    localResults
  };
}

function isShoppingResult(value: unknown): value is SerpApiShoppingResult {
  return Boolean(value && typeof value === "object");
}

function isLocalResult(value: unknown): value is SerpApiLocalResult {
  return Boolean(value && typeof value === "object");
}
