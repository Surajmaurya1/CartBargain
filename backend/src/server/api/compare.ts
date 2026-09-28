import type { AppConfig } from "../config/env";
import { validateCompareRequest } from "../validation/compareSchemas";
import { parseGroceryList } from "../utils/parseGroceryList";
import { buildSearchPlan } from "../services/search/SearchPlanner";
import { SearchExecutor } from "../services/search/SearchExecutor";
import { AppError } from "../errors/AppError";

export async function compare(input: unknown, config: AppConfig, requestId: string) {
  const validated = validateCompareRequest(input, { maxItems: config.maxGroceryItems, maxProviders: config.maxProviders, maxItemNameLength: 100, maxLocationLength: 150 });
  const items = parseGroceryList(validated.items.map((item) => [item.name, item.quantity, item.unit].filter(Boolean).join(" ")));
  if (items.length === 0) throw new AppError("EMPTY_BASKET", "Please enter at least one grocery item.", 400);
  const execution = await new SearchExecutor(config).execute(buildSearchPlan(items), items, validated.providers, validated.location.text);
  const allUpstreamFailed = execution.offers.length === 0 && execution.warnings.length > 0 && execution.warnings.every((warning) => warning.code.startsWith("SERPAPI_"));
  if (allUpstreamFailed) throw new AppError("SERPAPI_UPSTREAM_ERROR", "We couldn't retrieve grocery prices right now. Please try again.", 502);
  const itemData = items.map((item) => ({ ...item, status: execution.offers.some((offer) => offer.groceryItemId === item.id && offer.matchQuality !== "rejected") ? "found" : execution.failedItemIds.includes(item.id) ? "unavailable" : "not_found", offers: execution.offers.filter((offer) => offer.groceryItemId === item.id) }));
  const status = execution.warnings.length > 0 || itemData.some((item) => item.status !== "found") ? "partial" : "complete";
  return { success: true, requestId, status, data: { location: validated.location, items: itemData, providers: validated.providers, offers: execution.offers, comparison: {}, providerSummaries: [], warnings: execution.warnings } };
}
