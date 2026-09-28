import type { OptimizeRequest } from "../../types/optimization";
import type { BasketCandidate } from "../../types/optimization";
import { generateCandidates } from "../basket/BasketGenerator";

function rank(candidate: BasketCandidate, strategy: OptimizeRequest["strategy"]): [number, number, number, string] {
  const effective = candidate.estimatedTotal + Math.max(0, candidate.providerIds.length - 1) * 20;
  if (strategy === "BEST_DEALS") return [-candidate.discountTotal, effective, candidate.providerIds.length, candidate.providerIds.join(",")];
  if (strategy === "BEST_VALUE") return [effective, candidate.providerIds.length, -candidate.exactMatches, candidate.providerIds.join(",")];
  return [candidate.estimatedTotal, candidate.providerIds.length, -candidate.exactMatches, candidate.providerIds.join(",")];
}

function compareRank(a: BasketCandidate, b: BasketCandidate, strategy: OptimizeRequest["strategy"]): number {
  const left = rank(a, strategy); const right = rank(b, strategy);
  for (let index = 0; index < left.length; index += 1) { if (left[index] < right[index]) return -1; if (left[index] > right[index]) return 1; }
  return 0;
}

export function optimize(request: OptimizeRequest) {
  const candidates = generateCandidates(request.items, request.offers, request.constraints.allowSubstitutes, request.constraints.allowOverbuy).filter((candidate) => candidate.providerIds.length <= request.constraints.maxProviders);
  if (candidates.length === 0) return { success: true, data: { strategy: request.strategy, recommendedBasket: null, orders: [], alternatives: [], reasoning: { facts: [], tradeoffs: [] }, warnings: [{ code: "NO_VALID_BASKET", message: "No basket could satisfy all requested items under the selected constraints." }] } };
  const ranked = [...candidates].sort((a, b) => compareRank(a, b, request.strategy));
  const recommended = ranked[0];
  const completeSingleProvider = candidates.filter((candidate) => candidate.providerIds.length === 1).sort((a, b) => compareRank(a, b, "LOWEST_TOTAL"))[0];
  const savings = completeSingleProvider ? Math.max(0, Math.round((completeSingleProvider.estimatedTotal - recommended.estimatedTotal) * 100) / 100) : null;
  const providerNames = recommended.providerIds.map((id) => request.offers.find((offer) => offer.providerId === id)?.providerName ?? id);
  return { success: true, data: { strategy: request.strategy, recommendedBasket: { productTotal: recommended.productTotal, knownFees: recommended.knownFees, estimatedTotal: recommended.estimatedTotal, providerCount: recommended.providerIds.length, savings, savingsBaseline: completeSingleProvider ? "cheapestSingleProviderBasket" : null }, orders: providerNames.map((providerName, index) => ({ providerId: recommended.providerIds[index], providerName, items: recommended.lines.filter((line) => line.providerId === recommended.providerIds[index]) })), alternatives: ranked.slice(1, 4).map((candidate) => ({ estimatedTotal: candidate.estimatedTotal, providerCount: candidate.providerIds.length, providerIds: candidate.providerIds })), reasoning: { facts: providerNames.map((providerName) => `${providerName} supplies ${recommended.lines.filter((line) => line.providerId === recommended.providerIds[providerNames.indexOf(providerName)]).length} requested item(s).`), tradeoffs: recommended.providerIds.length > 1 ? [`The basket uses ${recommended.providerIds.length} providers; the comparison model applies a ₹20 convenience penalty per additional provider.`] : [] }, warnings: recommended.unknownFees > 0 ? [{ code: "UNKNOWN_FEES", message: "Some delivery or provider fees were not available from search data." }] : [] } };
}
