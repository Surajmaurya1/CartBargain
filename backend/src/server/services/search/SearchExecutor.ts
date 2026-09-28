declare const require: any;
declare const process: any;
import type { AppConfig } from "../../config/env";
import type { GroceryItem, ProductOffer } from "../../types/shopping";
import type { SearchTask } from "./SearchPlanner";
import { SerpApiClient } from "../serpapi/SerpApiClient";
import { normalizeOffers } from "../products/ProductNormalizer";
import { AppError } from "../../errors/AppError";
import { parseSerpApiResponse } from "../serpapi/serpApiParser";

const fs = require("node:fs");
const path = require("node:path");

export type SearchExecution = { offers: ProductOffer[]; failedItemIds: string[]; warnings: Array<{ code: string; message: string; itemId?: string }> };

export class SearchExecutor {
  private readonly client: SerpApiClient;
  constructor(private readonly config: AppConfig) {
    this.client = new SerpApiClient({ apiKey: config.serpApiKey, timeoutMs: config.serpApiTimeoutMs, maxAttempts: config.serpApiMaxAttempts, cacheTtlMs: config.serpApiCacheTtlMs, circuitFailureThreshold: config.circuitFailureThreshold, circuitCooldownMs: config.circuitCooldownMs, retryBaseDelayMs: config.retryBaseDelayMs });
  }

  async execute(tasks: SearchTask[], items: GroceryItem[], providers: string[], location: string): Promise<SearchExecution> {
    const offers: ProductOffer[] = [];
    const failedItemIds: string[] = [];
    const warnings: SearchExecution["warnings"] = [];
    let cursor = 0;
    const worker = async () => {
      while (cursor < Math.min(tasks.length, this.config.maxSerpApiRequests)) {
        const task = tasks[cursor++];
        const item = items.find((candidate) => candidate.id === task.groceryItemId)!;
        try {
          const response = this.config.demoMode && !this.config.serpApiKey ? this.loadDemo(task.query, item.name) : await this.client.search({ query: task.query, location, googleDomain: this.config.googleDomain });
          offers.push(...normalizeOffers(item, response.shoppingResults, providers, this.config.demoMode && !this.config.serpApiKey));
        } catch (error) {
          failedItemIds.push(item.id);
          const code = error instanceof AppError ? error.code : "SERPAPI_UPSTREAM_ERROR";
          warnings.push({ code, message: `${item.name} could not be checked.`, itemId: item.id });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(this.config.searchConcurrency, tasks.length) }, worker));
    if (tasks.length > this.config.maxSerpApiRequests) warnings.push({ code: "SEARCH_BUDGET_EXHAUSTED", message: "Some searches were skipped to stay within the search limit." });
    return { offers, failedItemIds: [...new Set(failedItemIds)], warnings };
  }

  private loadDemo(query: string, name: string) {
    const key = /atta/i.test(query) || /atta/i.test(name) ? "atta" : /rice/i.test(query) || /rice/i.test(name) ? "rice" : "unknown";
    const fixturePath = path.join(process.cwd(), "src", "server", "mock", "serpapi", `${key}.json`);
    if (!fs.existsSync(fixturePath)) throw new AppError("NO_RESULTS", "No demo result exists for this grocery item.", 200);
    return parseSerpApiResponse(require(fixturePath));
  }
}
