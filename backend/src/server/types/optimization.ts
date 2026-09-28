import type { GroceryItem, ProductOffer } from "./shopping";

export type OptimizeRequest = {
  strategy: "LOWEST_TOTAL" | "BEST_VALUE" | "BEST_DEALS";
  constraints: { maxProviders: number; allowSubstitutes: boolean; allowOverbuy: boolean };
  items: GroceryItem[];
  offers: ProductOffer[];
};

export type BasketLine = { itemId: string; offerId: string; providerId: string; title: string; packs: number; lineTotal: number; overbuy: boolean };
export type BasketCandidate = { lines: BasketLine[]; productTotal: number; knownFees: number; estimatedTotal: number; providerIds: string[]; exactMatches: number; unknownFees: number; discountTotal: number };
